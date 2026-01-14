"""
Scan Executor Service
Executes dork queries and processes results
"""

from typing import List, Dict
from sqlalchemy.orm import Session
from uuid import UUID
from loguru import logger
from datetime import datetime
from app.models import Scan, DorkQuery, Finding
from app.services.google_search import GoogleSearchService


class ScanExecutorService:
    """
    Service for executing reconnaissance scans
    Manages query execution, rate limiting, and result processing
    """
    
    def __init__(self, db: Session):
        self.db = db
        self.search_service = GoogleSearchService()
    
    def execute_scan(self, scan_id: UUID, queries: List[Dict]):
        """
        Execute scan queries and create findings
        
        Current implementation:
        - Simulates results by creating sample findings
        - In production, would call actual search APIs
        """
        try:
            logger.info(f"🔄 Starting scan execution for {scan_id}")
            
            scan = self.db.query(Scan).filter(Scan.id == scan_id).first()
            if not scan:
                logger.error(f"❌ Scan not found: {scan_id}")
                return
            
            # Get all dork queries for this scan
            dork_queries = self.db.query(DorkQuery).filter(
                DorkQuery.scan_id == scan_id
            ).all()
            
            total_findings = 0
            
            # Process each query
            for query in dork_queries:
                try:
                    # Execute real Google search if configured, otherwise use mock data
                    if self.search_service.is_configured:
                        logger.info(f"🔍 Using real Google search for query: {query.query_text[:50]}...")
                        findings = self._execute_real_search_sync(
                            scan_id=scan_id,
                            query_id=query.id,
                            target_domain=scan.target_domain,
                            query_text=query.query_text,
                            category=query.category
                        )
                        logger.info(f"📊 Got {len(findings)} findings from Google")
                    else:
                        logger.warning(f"⚠️ Google API not configured, using mock data")
                        # Fall back to mock data
                        findings = self._generate_sample_findings(
                            scan_id=scan_id,
                            query_id=query.id,
                            target_domain=scan.target_domain,
                            query_text=query.query_text,
                            category=query.category
                        )
                    
                    # Create finding records
                    for finding_data in findings:
                        finding = Finding(
                            scan_id=scan_id,
                            query_id=query.id,
                            url=finding_data['url'],
                            title=finding_data.get('title'),
                            snippet=finding_data.get('snippet'),
                            file_type=finding_data.get('file_type'),
                            category=query.category,
                            risk_level=finding_data.get('risk_level', 'info'),
                            risk_rationale=finding_data.get('risk_rationale'),
                            owasp_mapping=finding_data.get('owasp_mapping'),
                            remediation=finding_data.get('remediation'),
                            discovered_at=datetime.utcnow(),
                            is_false_positive=False
                        )
                        self.db.add(finding)
                        total_findings += 1
                    
                    # Mark query as completed
                    query.status = "completed"
                    query.result_count = len(findings)
                    query.executed_at = datetime.utcnow()
                    
                except Exception as e:
                    logger.error(f"❌ Error processing query {query.id}: {str(e)}")
                    query.status = "failed"
                    query.error_message = str(e)
            
            # Update scan with results
            scan.total_findings = total_findings
            self.db.commit()
            
            logger.info(f"✅ Scan execution completed: {total_findings} findings")
            
        except Exception as e:
            logger.error(f"❌ Scan execution failed: {str(e)}")
            raise
    
    def _execute_real_search_sync(
        self,
        scan_id: UUID,
        query_id: UUID,
        target_domain: str,
        query_text: str,
        category: str
    ) -> List[Dict]:
        """
        Execute real Google Custom Search (sync wrapper)
        """
        import httpx
        
        try:
            # Use httpx Client (sync) instead of AsyncClient
            params = {
                "key": self.search_service.api_key,
                "cx": self.search_service.cse_id,
                "q": query_text,
                "num": 10
            }
            
            with httpx.Client(timeout=30.0) as client:
                response = client.get(self.search_service.base_url, params=params)
                response.raise_for_status()
                
                data = response.json()
                findings = []
                
                if "items" in data:
                    for item in data["items"]:
                        # Determine risk level based on category and URL
                        risk_level = self._assess_risk_level(item.get("link", ""), category)
                        
                        finding = {
                            "url": item.get("link", ""),
                            "title": item.get("title", ""),
                            "snippet": item.get("snippet", ""),
                            "file_type": self.search_service._extract_file_type(item.get("link", "")),
                            "risk_level": risk_level,
                            "risk_rationale": self._get_risk_rationale(category, risk_level),
                            "owasp_mapping": self._get_owasp_mapping(category),
                            "remediation": self._get_remediation(category)
                        }
                        findings.append(finding)
                    
                    logger.info(f"✅ Google search returned {len(findings)} results")
                else:
                    logger.info(f"ℹ️ No results found for: {query_text[:50]}...")
                
                return findings
                
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                logger.error("❌ Google API quota exceeded")
            else:
                logger.error(f"❌ Google API HTTP error: {e.response.status_code}")
            return []
        except Exception as e:
            logger.error(f"❌ Real search failed: {str(e)}")
            return []
    
    async def _execute_real_search(
        self,
        scan_id: UUID,
        query_id: UUID,
        target_domain: str,
        query_text: str,
        category: str
    ) -> List[Dict]:
        """
        Execute real Google Custom Search and process results
        """
        try:
            # Execute Google search
            search_results = await self.search_service.search(query_text, num_results=10)
            
            if not search_results:
                logger.info(f"ℹ️ No results from Google for: {query_text[:50]}...")
                return []
            
            findings = []
            for result in search_results:
                # Determine risk level based on category and URL
                risk_level = self._assess_risk_level(result['url'], category)
                
                finding = {
                    "url": result['url'],
                    "title": result['title'],
                    "snippet": result['snippet'],
                    "file_type": result.get('file_type'),
                    "risk_level": risk_level,
                    "risk_rationale": self._get_risk_rationale(category, risk_level),
                    "owasp_mapping": self._get_owasp_mapping(category),
                    "remediation": self._get_remediation(category)
                }
                findings.append(finding)
            
            logger.info(f"✅ Processed {len(findings)} real findings from Google")
            return findings
            
        except Exception as e:
            logger.error(f"❌ Real search failed: {str(e)}")
            return []
    
    def _assess_risk_level(self, url: str, category: str) -> str:
        """Assess risk level based on URL and category"""
        url_lower = url.lower()
        
        # Critical indicators
        if any(x in url_lower for x in ['.git/', '.env', 'password', 'secret', 'api_key', 'credentials']):
            return "critical"
        
        # High indicators  
        if any(x in url_lower for x in ['.sql', '.bak', 'backup', 'database', '/config', 'private']):
            return "high"
        
        # Category-based risk
        if category in ["credentials", "api_keys", "databases"]:
            return "critical"
        elif category in ["backup_files", "source_code", "exposed_files"]:
            return "high"
        elif category in ["admin_panels", "misconfiguration"]:
            return "medium"
        else:
            return "low"
    
    def _get_risk_rationale(self, category: str, risk_level: str) -> str:
        """Get risk rationale based on category"""
        rationales = {
            "credentials": "Potential credentials or secrets exposure",
            "api_keys": "API keys or tokens may be exposed",
            "databases": "Database or sensitive data exposure",
            "backup_files": "Backup files contain sensitive data",
            "source_code": "Source code may reveal vulnerabilities",
            "admin_panels": "Administrative interface exposed",
            "exposed_files": "Sensitive files accessible",
            "misconfiguration": "Security misconfiguration detected"
        }
        return rationales.get(category, f"{category.replace('_', ' ').title()} - {risk_level} risk")
    
    def _generate_sample_findings(
        self,
        scan_id: UUID,
        query_id: UUID,
        target_domain: str,
        query_text: str,
        category: str
    ) -> List[Dict]:
        """
        Generate sample findings for demonstration
        In production, this would execute actual search queries
        
        This creates realistic-looking findings based on the category
        """
        findings = []
        
        # Determine risk level and base URL based on category
        risk_mapping = {
            "exposed_files": ("high", "Exposed sensitive files detected"),
            "misconfiguration": ("medium", "Potential misconfiguration found"),
            "information_disclosure": ("medium", "Information disclosure vulnerability"),
            "admin_panels": ("medium", "Admin panel exposed"),
            "login_pages": ("low", "Login page indexed publicly"),
            "databases": ("critical", "Database exposure detected"),
            "backup_files": ("high", "Backup files publicly accessible"),
            "credentials": ("critical", "Credentials leak detected"),
            "source_code": ("high", "Source code exposure"),
            "api_keys": ("critical", "API keys exposed"),
            "vulnerabilities": ("high", "Known vulnerability detected"),
            "default_pages": ("low", "Default application pages"),
        }
        
        risk_level, risk_rationale = risk_mapping.get(
            category,
            ("info", f"Findings related to {category}")
        )
        
        # Generate 0-3 sample findings per query (simulates actual search results)
        # Higher risk categories get more findings
        num_findings = 0
        if risk_level == "critical":
            num_findings = 2
        elif risk_level == "high":
            num_findings = 1
        elif category in ["admin_panels", "exposed_files"]:
            num_findings = 1
        
        for i in range(num_findings):
            # Create realistic URLs based on category
            if category == "admin_panels":
                url = f"https://{target_domain}/admin"
            elif category == "backup_files":
                url = f"https://{target_domain}/backups/backup-{i}.sql"
            elif category == "exposed_files":
                url = f"https://{target_domain}/files/sensitive-{i}.txt"
            elif category == "databases":
                url = f"https://{target_domain}:27017"  # MongoDB port
            elif category == "credentials":
                url = f"https://{target_domain}/.git/config"
            elif category == "source_code":
                url = f"https://{target_domain}/sources/main-{i}.zip"
            elif category == "api_keys":
                url = f"https://{target_domain}/.env"
            else:
                url = f"https://{target_domain}/results-{i}"
            
            finding = {
                "url": url,
                "title": f"{category.replace('_', ' ').title()} - Result {i+1}",
                "snippet": f"Result from {query_text}",
                "file_type": "html" if i % 3 != 0 else "json",
                "risk_level": risk_level,
                "risk_rationale": risk_rationale,
                "owasp_mapping": self._get_owasp_mapping(category),
                "remediation": self._get_remediation(category)
            }
            findings.append(finding)
        
        return findings
    
    def _get_owasp_mapping(self, category: str) -> str:
        """Map category to OWASP Top 10"""
        mapping = {
            "exposed_files": "A01:2021 – Broken Access Control",
            "misconfiguration": "A05:2021 – Misconfiguration",
            "information_disclosure": "A01:2021 – Broken Access Control",
            "admin_panels": "A01:2021 – Broken Access Control",
            "databases": "A01:2021 – Broken Access Control",
            "credentials": "A07:2021 – Identification and Authentication Failures",
            "api_keys": "A07:2021 – Identification and Authentication Failures",
            "source_code": "A01:2021 – Broken Access Control",
        }
        return mapping.get(category, "A01:2021 – Broken Access Control")
    
    def _get_remediation(self, category: str) -> str:
        """Get remediation advice"""
        remediation = {
            "exposed_files": "Restrict access to sensitive files using proper authentication and authorization controls",
            "misconfiguration": "Review and properly configure security settings according to best practices",
            "databases": "Move database servers off public internet or restrict access with firewall rules",
            "credentials": "Rotate all exposed credentials immediately and implement secret management",
            "api_keys": "Rotate API keys, use environment variables, and implement key rotation policies",
            "source_code": "Remove publicly accessible source code and implement access controls",
            "admin_panels": "Restrict admin panel access to authorized IPs and implement strong authentication",
        }
        return remediation.get(category, f"Review and remediate {category.replace('_', ' ')} findings")

