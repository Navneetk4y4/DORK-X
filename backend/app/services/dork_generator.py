"""
Dork Generator Service
Generates 20 detailed categories of Google dork queries for target reconnaissance
"""

from typing import List, Dict
from loguru import logger


class DorkGeneratorService:
    """
    Service for generating Google dork queries
    Implements 20 detailed reconnaissance categories
    """
    
    def __init__(self):
        self.dork_templates = self._initialize_templates()
        self.category_metadata = self._initialize_metadata()
    
    def _initialize_metadata(self) -> Dict[str, Dict]:
        """
        Initialize detailed metadata for each dork category
        Includes risk level, description, and what can be found
        """
        return {
            "sensitive_files": {
                "name": "1. Sensitive Files & Documents",
                "description": "PDFs, DOCX, XLSX, PPT files unintentionally exposed via search engines",
                "risk_level": "HIGH",
                "what_can_be_found": [
                    "PDFs, DOCX, XLSX, PPT files",
                    "Backup files: .bak, .old, .zip, .tar.gz",
                    "Database dumps: .sql, .db"
                ],
                "why_it_matters": "May contain credentials, internal paths, API keys, emails, IPs"
            },
            "login_pages": {
                "name": "2. Login Pages & Admin Panels",
                "description": "Hidden or unlinked authentication interfaces",
                "risk_level": "HIGH",
                "what_can_be_found": [
                    "Admin dashboards",
                    "CMS login pages",
                    "Test or staging login portals",
                    "Legacy admin panels"
                ],
                "why_it_matters": "Entry point for brute force, default creds, auth testing"
            },
            "credentials": {
                "name": "3. Credentials & Secrets (CRITICAL)",
                "description": "Direct or indirect exposure of secrets",
                "risk_level": "CRITICAL",
                "what_can_be_found": [
                    "Hardcoded usernames/passwords",
                    "API keys, tokens",
                    "OAuth secrets",
                    "SMTP credentials"
                ],
                "why_it_matters": "Direct compromise of accounts and services"
            },
            "error_messages": {
                "name": "4. Error Messages & Debug Information",
                "description": "Verbose system responses indexed by search engines",
                "risk_level": "MEDIUM",
                "what_can_be_found": [
                    "Stack traces",
                    "Absolute file paths",
                    "Database errors",
                    "Framework versions"
                ],
                "why_it_matters": "Helps fingerprint technology and vulnerabilities"
            },
            "source_code": {
                "name": "5. Source Code & Development Artifacts",
                "description": "Unintended exposure of internal code",
                "risk_level": "HIGH",
                "what_can_be_found": [
                    ".git directories",
                    ".svn folders",
                    "JavaScript source maps",
                    "Test scripts"
                ],
                "why_it_matters": "Business logic disclosure, hidden endpoints, API structure"
            },
            "database_exposure": {
                "name": "6. Database & Data Exposure",
                "description": "Publicly indexed structured data",
                "risk_level": "CRITICAL",
                "what_can_be_found": [
                    "SQL error dumps",
                    "Open database panels",
                    "CSV exports",
                    "JSON API responses"
                ],
                "why_it_matters": "PII leakage, business data exposure"
            },
            "pii": {
                "name": "7. Personally Identifiable Information (PII)",
                "description": "User or employee data leaks",
                "risk_level": "CRITICAL",
                "what_can_be_found": [
                    "Email addresses",
                    "Phone numbers",
                    "Employee records",
                    "Resumes & CVs"
                ],
                "why_it_matters": "Privacy violations, social engineering, regulatory fines"
            },
            "subdomains": {
                "name": "8. Subdomains & Infrastructure Mapping",
                "description": "Expanding attack surface via subdomain discovery",
                "risk_level": "HIGH",
                "what_can_be_found": [
                    "Dev, test, staging subdomains",
                    "Old or deprecated services",
                    "Cloud storage endpoints",
                    "Backup/disaster recovery domains"
                ],
                "why_it_matters": "Often less secured than main domain"
            },
            "cloud_storage": {
                "name": "9. Cloud Storage & Buckets",
                "description": "Publicly exposed storage (S3, Azure, GCP)",
                "risk_level": "CRITICAL",
                "what_can_be_found": [
                    "AWS S3 buckets",
                    "Azure Blob containers",
                    "GCP storage links",
                    "Logs, backups, media, internal documents"
                ],
                "why_it_matters": "Direct data access without authentication"
            },
            "apis_services": {
                "name": "10. APIs & Web Services",
                "description": "Backend services indexed accidentally",
                "risk_level": "HIGH",
                "what_can_be_found": [
                    "REST endpoints",
                    "GraphQL consoles",
                    "Swagger / OpenAPI docs",
                    "Debug panels"
                ],
                "why_it_matters": "Parameter tampering, auth bypass testing, direct API calls"
            },
            "cms_frameworks": {
                "name": "11. CMS & Framework Identification",
                "description": "Technology fingerprinting for vulnerability mapping",
                "risk_level": "MEDIUM",
                "what_can_be_found": [
                    "WordPress, Joomla, Drupal panels",
                    "Plugin paths and versions",
                    "Theme files and configurations",
                    "CMS admin areas"
                ],
                "why_it_matters": "CVE correlation, version-specific exploit research"
            },
            "network_info": {
                "name": "12. Network & Internal System Information",
                "description": "Clues about internal architecture",
                "risk_level": "MEDIUM",
                "what_can_be_found": [
                    "Internal IP addresses",
                    "Hostnames and FQDN",
                    "VPN portals",
                    "Routers, printers, cameras"
                ],
                "why_it_matters": "Network mapping for targeted attacks"
            },
            "logs_reports": {
                "name": "13. Logs, Reports & Monitoring Data",
                "description": "Operational leaks via exposed logs",
                "risk_level": "HIGH",
                "what_can_be_found": [
                    "Access logs",
                    "Debug and application logs",
                    "Security reports",
                    "Crash dumps and traces"
                ],
                "why_it_matters": "Activity tracking, user behavior, system internals"
            },
            "communications": {
                "name": "14. Emails, Contacts & Communication",
                "description": "Human attack surface discovery",
                "risk_level": "MEDIUM",
                "what_can_be_found": [
                    "Employee email lists",
                    "Support email addresses",
                    "Internal mailing lists",
                    "Contact information"
                ],
                "why_it_matters": "Phishing simulations, social engineering, staff targeting"
            },
            "cached_data": {
                "name": "15. Historical & Cached Data",
                "description": "Data thought to be deleted but still indexed",
                "risk_level": "MEDIUM",
                "what_can_be_found": [
                    "Old versions of pages (Wayback Machine)",
                    "Archived documents",
                    "Cached sensitive responses",
                    "Old API endpoints"
                ],
                "why_it_matters": "Historical information reveals development patterns"
            },
            "iot_devices": {
                "name": "16. IoT, Devices & Panels",
                "description": "Exposed device interfaces on internet",
                "risk_level": "HIGH",
                "what_can_be_found": [
                    "CCTV dashboards (Shodan-indexed)",
                    "Routers & firewalls admin pages",
                    "NAS devices and management interfaces",
                    "Printers and network devices"
                ],
                "why_it_matters": "Direct physical infrastructure access"
            },
            "vulnerability_indicators": {
                "name": "17. Vulnerability Indicators",
                "description": "Direct evidence of weak security practices",
                "risk_level": "HIGH",
                "what_can_be_found": [
                    "Open directory listings (index of)",
                    "Upload folders without protection",
                    "Unauthenticated admin panels",
                    "Test and debug endpoints"
                ],
                "why_it_matters": "Immediate exploitation opportunities"
            },
            "osint": {
                "name": "18. Organization Intelligence (OSINT)",
                "description": "Business-level information disclosure",
                "risk_level": "MEDIUM",
                "what_can_be_found": [
                    "Employee names & roles",
                    "Partners & vendors",
                    "Internal tools mentioned publicly",
                    "Business structure information"
                ],
                "why_it_matters": "Enables targeted social engineering"
            },
            "misconfigurations": {
                "name": "19. Security Misconfigurations",
                "description": "Policy and deployment mistakes",
                "risk_level": "HIGH",
                "what_can_be_found": [
                    "Disabled authentication mechanisms",
                    "Open indexes and directory listings",
                    "Public admin APIs",
                    "Exposed monitoring tools"
                ],
                "why_it_matters": "Configuration errors = immediate vulnerabilities"
            },
            "internal_docs": {
                "name": "20. Academic / Research / Internal Docs",
                "description": "Non-production but sensitive content",
                "risk_level": "MEDIUM",
                "what_can_be_found": [
                    "Internal training documents",
                    "Architecture diagrams",
                    "Standard Operating Procedures (SOPs)",
                    "Security policies and procedures"
                ],
                "why_it_matters": "Architecture and policy disclosure"
            }
        }
    
    def _initialize_templates(self) -> Dict[str, List[str]]:
        """
        Initialize comprehensive dork templates for all 20 categories
        """
        return {
            "sensitive_files": [
                'site:{domain} filetype:pdf',
                'site:{domain} filetype:docx',
                'site:{domain} filetype:xlsx',
                'site:{domain} filetype:ppt',
                'site:{domain} filetype:pptx',
                'site:{domain} filetype:bak',
                'site:{domain} filetype:old',
                'site:{domain} (inurl:.bak OR inurl:.backup OR inurl:.old)',
                'site:{domain} filetype:zip "backup"',
                'site:{domain} filetype:tar',
            ],
            "login_pages": [
                'site:{domain} inurl:admin',
                'site:{domain} inurl:administrator',
                'site:{domain} inurl:login',
                'site:{domain} inurl:signin',
                'site:{domain} inurl:dashboard',
                'site:{domain} intitle:"admin panel"',
                'site:{domain} inurl:wp-admin',
                'site:{domain} inurl:phpmyadmin',
                'site:{domain} inurl:"admin panel"',
                'site:{domain} intitle:"login" OR intitle:"sign in"',
                'site:{domain} inurl:cp',
                'site:{domain} inurl:cpanel',
            ],
            "credentials": [
                'site:{domain} filetype:env',
                'site:{domain} filetype:env "DB_PASSWORD"',
                'site:{domain} filetype:env "API_KEY"',
                'site:{domain} ("API_KEY" OR "api_key" OR "apikey")',
                'site:{domain} ("PASSWORD" OR "password")',
                'site:{domain} filetype:json "password"',
                'site:{domain} inurl:credentials',
                'site:{domain} filetype:txt "password"',
                'site:{domain} filetype:config "password"',
                'site:{domain} "begin rsa private key"',
                'site:{domain} "ssh-rsa" OR "PRIVATE KEY"',
                'site:{domain} filetype:pem',
            ],
            "error_messages": [
                'site:{domain} ("SQL syntax error" OR "MySQL error")',
                'site:{domain} "fatal error"',
                'site:{domain} "warning:" intitle:"error"',
                'site:{domain} "stack trace"',
                'site:{domain} "at line" "of file"',
                'site:{domain} ("Exception" OR "exception")',
                'site:{domain} "JDBC"',
                'site:{domain} "java.lang"',
                'site:{domain} "Notice:"',
                'site:{domain} filetype:log "error"',
            ],
            "source_code": [
                'site:{domain} inurl:.git',
                'site:{domain} inurl:.svn',
                'site:{domain} inurl:.gitconfig',
                'site:{domain} filetype:js.map',
                'site:{domain} intitle:"index of" ".git"',
                'site:{domain} ".git/config"',
                'site:{domain} ".git/HEAD"',
                'site:{domain} "sourcemap"',
                'site:{domain} filetype:gradle',
                'site:{domain} filetype:pom.xml',
            ],
            "database_exposure": [
                'site:{domain} filetype:sql',
                'site:{domain} filetype:db',
                'site:{domain} "SQL dump"',
                'site:{domain} "phpMyAdmin" OR "phpMyAdmin SQL"',
                'site:{domain} inurl:phpmyadmin',
                'site:{domain} inurl:adminer',
                'site:{domain} filetype:bak "database"',
                'site:{domain} filetype:backup "sql"',
                'site:{domain} "CREATE TABLE"',
                'site:{domain} "INSERT INTO"',
            ],
            "pii": [
                'site:{domain} "@{domain}" filetype:xls',
                'site:{domain} "@{domain}" filetype:xlsx',
                'site:{domain} "@{domain}" filetype:csv',
                'site:{domain} filetype:xls email',
                'site:{domain} filetype:xlsx email',
                'site:{domain} filetype:pdf email',
                'site:{domain} "employee" filetype:pdf',
                'site:{domain} "phone" filetype:xls',
                'site:{domain} filetype:docx email OR phone',
                'site:{domain} filetype:pdf "@{domain}"',
            ],
            "subdomains": [
                'site:*.{domain}',
                'site:{domain} inurl:staging',
                'site:{domain} inurl:dev',
                'site:{domain} inurl:test',
                'site:{domain} inurl:lab',
                'site:{domain} inurl:demo',
                'site:{domain} inurl:pre',
                'site:{domain} inurl:uat',
                'site:{domain} inurl:api.',
                'site:{domain} "staging" OR "development"',
            ],
            "cloud_storage": [
                'site:s3.amazonaws.com "{domain}"',
                'site:blob.core.windows.net "{domain}"',
                'site:storage.googleapis.com "{domain}"',
                'site:dfs.core.windows.net "{domain}"',
                '"{domain}" s3.amazonaws.com',
                '"{domain}" blob.core.windows.net',
                'inurl:s3 site:{domain}',
                'inurl:s3.amazonaws.com {domain}',
                '"s3" inurl:amazonaws.com {domain}',
                'site:digitaloceanspaces.com "{domain}"',
            ],
            "apis_services": [
                'site:{domain} inurl:/api',
                'site:{domain} inurl:/api/v1',
                'site:{domain} inurl:swagger',
                'site:{domain} inurl:graphql',
                'site:{domain} intitle:"swagger ui"',
                'site:{domain} inurl:/docs',
                'site:{domain} inurl:debug',
                'site:{domain} filetype:json "api"',
                'site:{domain} intitle:"api" "documentation"',
                'site:{domain} inurl:service',
            ],
            "cms_frameworks": [
                'site:{domain} inurl:wp-content',
                'site:{domain} inurl:wp-admin',
                'site:{domain} inurl:/wordpress',
                'site:{domain} inurl:/joomla',
                'site:{domain} inurl:/drupal',
                'site:{domain} intitle:"WordPress"',
                'site:{domain} intitle:"Joomla"',
                'site:{domain} "Powered by WordPress"',
                'site:{domain} "/plugins/"',
                'site:{domain} inurl:/administrator',
            ],
            "network_info": [
                'site:{domain} "192.168" OR "10.0" OR "172.16"',
                'site:{domain} "internal ip"',
                'site:{domain} "gateway"',
                'site:{domain} "hostname"',
                'site:{domain} filetype:config "hostname"',
                'site:{domain} filetype:conf "ip"',
                'site:{domain} "ifconfig" OR "ipconfig"',
                'site:{domain} filetype:log "ip address"',
                'site:{domain} "dns" OR "nameserver"',
                'site:{domain} filetype:txt "internal"',
            ],
            "logs_reports": [
                'site:{domain} filetype:log',
                'site:{domain} inurl:logs',
                'site:{domain} inurl:debug.log',
                'site:{domain} filetype:txt "error log"',
                'site:{domain} "apache log"',
                'site:{domain} "nginx access log"',
                'site:{domain} filetype:log "GET" "POST"',
                'site:{domain} filetype:csv "report"',
                'site:{domain} inurl:report filetype:pdf',
                'site:{domain} filetype:xls "report"',
            ],
            "communications": [
                'site:{domain} "@{domain}" "email"',
                'site:{domain} filetype:xls "@{domain}"',
                'site:{domain} filetype:xlsx "email list"',
                'site:{domain} "support@" filetype:pdf',
                'site:{domain} filetype:csv "email"',
                'site:{domain} "contact us" email',
                'site:{domain} filetype:vcf',
                'site:{domain} filetype:eml',
                'site:{domain} "distribution list"',
                'site:{domain} filetype:txt email',
            ],
            "cached_data": [
                'site:{domain} "cached" OR "archive"',
                'cache:site:{domain}',
                'site:{domain} filetype:html "last modified"',
                'site:{domain} "version" "cached"',
                'site:{domain} filetype:pdf "version 1.0"',
                'site:{domain} "old version"',
                'site:{domain} "deprecated"',
                'site:{domain} "legacy"',
                'site:{domain} filetype:html "2020 OR 2021 OR 2022"',
                'site:{domain} filetype:pdf "archive"',
            ],
            "iot_devices": [
                'site:{domain} inurl:camera',
                'site:{domain} inurl:cctv',
                'site:{domain} inurl:router',
                'site:{domain} inurl:printer',
                'site:{domain} inurl:nas',
                'site:{domain} inurl:webcam',
                'site:{domain} intitle:"ip camera"',
                'site:{domain} intitle:"router admin"',
                'site:{domain} intitle:"device management"',
                'site:{domain} inurl:control OR inurl:manage "device"',
            ],
            "vulnerability_indicators": [
                'site:{domain} intitle:"index of"',
                'site:{domain} intitle:"index of /" "parent directory"',
                'site:{domain} inurl:upload',
                'site:{domain} inurl:file',
                'site:{domain} inurl:download',
                'site:{domain} intitle:"upload"',
                'site:{domain} "test" OR "debug"',
                'site:{domain} inurl:test',
                'site:{domain} filetype:html "test"',
                'site:{domain} intitle:"test page"',
            ],
            "osint": [
                'site:{domain} filetype:pdf "employee"',
                'site:{domain} filetype:pdf "staff"',
                'site:{domain} filetype:ppt "company"',
                'site:{domain} filetype:docx "organization"',
                'site:{domain} "our team"',
                'site:{domain} "company culture"',
                'site:{domain} "partners" OR "clients"',
                'site:{domain} filetype:pdf "technology"',
                'site:{domain} filetype:pdf "architecture"',
                'site:{domain} "vendor" OR "supplier"',
            ],
            "misconfigurations": [
                'site:{domain} intitle:"index of"',
                'site:{domain} inurl:admin "no authentication"',
                'site:{domain} "403 forbidden"',
                'site:{domain} intitle:"monitoring"',
                'site:{domain} intitle:"management console"',
                'site:{domain} inurl:console',
                'site:{domain} "allow all"',
                'site:{domain} filetype:conf "allow"',
                'site:{domain} inurl:service "auth disabled"',
                'site:{domain} filetype:config "disable"',
            ],
            "internal_docs": [
                'site:{domain} filetype:pdf "SOP" OR "procedure"',
                'site:{domain} filetype:docx "policy"',
                'site:{domain} filetype:ppt "architecture"',
                'site:{domain} filetype:pdf "training"',
                'site:{domain} filetype:pdf "internal use only"',
                'site:{domain} filetype:docx "confidential"',
                'site:{domain} filetype:pdf "security policy"',
                'site:{domain} filetype:pdf "infrastructure"',
                'site:{domain} filetype:pdf "security assessment"',
                'site:{domain} filetype:pdf "disaster recovery"',
            ]
        }
    
    def generate_dorks(self, target_domain: str, scan_profile: str = "standard") -> List[Dict]:
        """
        Generate dork queries based on target and scan profile
        
        Args:
            target_domain: Target domain to scan
            scan_profile: quick, standard, or deep
        
        Returns:
            List of dork query dictionaries with metadata including risk level and description
        """
        logger.info(f"🔧 Generating dorks for {target_domain} with profile: {scan_profile}")
        
        queries = []
        categories_to_use = self._get_categories_for_profile(scan_profile)
        
        for category in categories_to_use:
            if category in self.dork_templates:
                templates = self.dork_templates[category]
                metadata = self.category_metadata.get(category, {})
                priority = self._get_category_priority(category)
                risk_level = metadata.get("risk_level", "UNKNOWN")
                
                for idx, template in enumerate(templates):
                    # Replace {domain} placeholder
                    query_text = template.replace("{domain}", target_domain)
                    
                    queries.append({
                        "query_text": query_text,
                        "category": category,
                        "category_name": metadata.get("name", category),
                        "category_description": metadata.get("description", ""),
                        "what_can_be_found": metadata.get("what_can_be_found", []),
                        "why_it_matters": metadata.get("why_it_matters", ""),
                        "risk_level": risk_level,
                        "priority": priority,
                        "target": target_domain,
                        "query_index": idx + 1
                    })
        
        logger.info(f"✅ Generated {len(queries)} dork queries across {len(categories_to_use)} categories")
        return queries
    
    def _get_categories_for_profile(self, profile: str) -> List[str]:
        """
        Return categories based on scan profile
        """
        all_categories = [
            "credentials",           # 3
            "database_exposure",     # 6
            "pii",                   # 7
            "cloud_storage",         # 9
            "vulnerability_indicators",  # 17
            "login_pages",           # 2
            "sensitive_files",       # 1
            "source_code",           # 5
            "apis_services",         # 10
            "logs_reports",          # 13
            "misconfigurations",     # 19
            "subdomains",            # 8
            "cms_frameworks",        # 11
            "error_messages",        # 4
            "network_info",          # 12
            "communications",        # 14
            "cached_data",           # 15
            "iot_devices",           # 16
            "osint",                 # 18
            "internal_docs"          # 20
        ]
        
        if profile == "quick":
            # CRITICAL & HIGH risk categories only
            return [
                "credentials",
                "database_exposure",
                "pii",
                "cloud_storage",
                "login_pages",
            ]
        elif profile == "deep":
            # All 20 categories
            return all_categories
        else:  # standard (default)
            # Most critical and important categories
            return [
                "credentials",
                "database_exposure",
                "pii",
                "cloud_storage",
                "login_pages",
                "sensitive_files",
                "source_code",
                "apis_services",
                "logs_reports",
                "misconfigurations",
                "vulnerability_indicators",
                "subdomains",
            ]
    
    def _get_category_priority(self, category: str) -> int:
        """
        Assign priority score based on risk level
        Critical=10, High=8, Medium=5, Low=2
        """
        risk_map = {
            # CRITICAL
            "credentials": 10,
            "database_exposure": 10,
            "pii": 10,
            "cloud_storage": 10,
            
            # HIGH
            "login_pages": 8,
            "sensitive_files": 8,
            "source_code": 8,
            "apis_services": 8,
            "logs_reports": 8,
            "misconfigurations": 8,
            "vulnerability_indicators": 8,
            "subdomains": 8,
            "iot_devices": 8,
            
            # MEDIUM
            "error_messages": 5,
            "network_info": 5,
            "cms_frameworks": 5,
            "communications": 5,
            "cached_data": 5,
            "osint": 5,
            "internal_docs": 5,
        }
        return risk_map.get(category, 1)
    
    def get_dork_count(self, profile: str) -> int:
        """
        Get total number of dorks for a profile
        """
        categories = self._get_categories_for_profile(profile)
        count = sum(len(self.dork_templates.get(cat, [])) for cat in categories)
        return count
    
    def get_category_info(self, category: str) -> Dict:
        """
        Get detailed information about a category
        """
        return self.category_metadata.get(category, {})
    
    def list_all_categories(self) -> List[Dict]:
        """
        Return all 20 categories with metadata
        """
        return [
            {
                "key": key,
                **value,
                "query_count": len(self.dork_templates.get(key, []))
            }
            for key, value in self.category_metadata.items()
        ]
