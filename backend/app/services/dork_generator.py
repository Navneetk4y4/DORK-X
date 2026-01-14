"""
Dork Generator Service
Generates categorized dork queries for target reconnaissance
"""

from typing import List, Dict
from loguru import logger


class DorkGeneratorService:
    """
    Service for generating Google dork queries
    Implements the dork generation logic from architecture design
    """
    
    def __init__(self):
        self.dork_templates = self._initialize_templates()
    
    def _initialize_templates(self) -> Dict[str, List[str]]:
        """
        Initialize comprehensive dork templates by category
        """
        return {
            "file_exposure": [
                'site:{domain} filetype:pdf',
                'site:{domain} filetype:docx',
                'site:{domain} filetype:xlsx',
                'site:{domain} filetype:sql',
                'site:{domain} filetype:log',
                'site:{domain} filetype:bak',
                'site:{domain} (ext:txt OR ext:log OR ext:bak)',
            ],
            "config_files": [
                'site:{domain} filetype:env',
                'site:{domain} filetype:config',
                'site:{domain} filename:web.config',
                'site:{domain} filename:.htaccess',
                'site:{domain} filename:wp-config.php',
                'site:{domain} inurl:config',
                'site:{domain} "database.yml" OR "config.yml"',
            ],
            "backup_files": [
                'site:{domain} filetype:bak',
                'site:{domain} filetype:old',
                'site:{domain} filetype:backup',
                'site:{domain} inurl:backup',
                'site:{domain} intitle:"index of" backup',
                'site:{domain} (backup OR old OR bak)',
            ],
            "admin_panels": [
                'site:{domain} inurl:admin',
                'site:{domain} inurl:administrator',
                'site:{domain} inurl:login',
                'site:{domain} inurl:dashboard',
                'site:{domain} intitle:"admin panel"',
                'site:{domain} inurl:wp-admin',
                'site:{domain} inurl:phpmyadmin',
            ],
            "cloud_storage": [
                'site:s3.amazonaws.com "{domain}"',
                'site:blob.core.windows.net "{domain}"',
                'site:storage.googleapis.com "{domain}"',
                'site:{domain} inurl:s3.amazonaws.com',
            ],
            "git_exposure": [
                'site:{domain} inurl:.git',
                'site:{domain} filetype:git',
                'site:{domain} intitle:"index of" .git',
                'site:{domain} ".git/config"',
                'site:{domain} ".git/HEAD"',
            ],
            "database_dumps": [
                'site:{domain} filetype:sql',
                'site:{domain} "SQL dump"',
                'site:{domain} inurl:database',
                'site:{domain} filetype:db',
                'site:{domain} "-- phpMyAdmin SQL Dump"',
            ],
            "credentials": [
                'site:{domain} filetype:env "DB_PASSWORD"',
                'site:{domain} ("API_KEY" OR "api_key")',
                'site:{domain} filetype:json "password"',
                'site:{domain} inurl:credentials',
                'site:{domain} "password" filetype:txt',
            ],
            "error_messages": [
                'site:{domain} ("error" OR "warning" OR "exception")',
                'site:{domain} "SQL syntax"',
                'site:{domain} "stack trace"',
                'site:{domain} "JDBC"',
                'site:{domain} "fatal error"',
            ],
            "email_addresses": [
                'site:{domain} "@{domain}"',
                'site:{domain} ("email" OR "contact")',
                'site:{domain} filetype:xls email',
            ],
            "directory_listings": [
                'site:{domain} intitle:"index of"',
                'site:{domain} intitle:"index of /" "parent directory"',
                'site:{domain} intitle:"index of" "last modified"',
            ],
            "sensitive_documents": [
                'site:{domain} (confidential OR internal OR private)',
                'site:{domain} filetype:pdf (salary OR budget)',
                'site:{domain} "not for distribution"',
            ]
        }
    
    def generate_dorks(self, target_domain: str, scan_profile: str = "standard") -> List[Dict]:
        """
        Generate dork queries based on target and scan profile
        
        Args:
            target_domain: Target domain to scan
            scan_profile: quick, standard, or deep
        
        Returns:
            List of dork query dictionaries with metadata
        """
        logger.info(f"🔧 Generating dorks for {target_domain} with profile: {scan_profile}")
        
        queries = []
        categories_to_use = self._get_categories_for_profile(scan_profile)
        
        for category in categories_to_use:
            if category in self.dork_templates:
                templates = self.dork_templates[category]
                priority = self._get_category_priority(category)
                
                for template in templates:
                    # Replace {domain} placeholder
                    query_text = template.replace("{domain}", target_domain)
                    
                    queries.append({
                        "query_text": query_text,
                        "category": category,
                        "priority": priority,
                        "target": target_domain
                    })
        
        logger.info(f"✅ Generated {len(queries)} dork queries")
        return queries
    
    def _get_categories_for_profile(self, profile: str) -> List[str]:
        """
        Return categories based on scan profile
        """
        if profile == "quick":
            # Only high-priority categories
            return [
                "credentials",
                "database_dumps",
                "config_files",
                "admin_panels"
            ]
        elif profile == "deep":
            # All categories
            return list(self.dork_templates.keys())
        else:  # standard
            # Most important categories
            return [
                "credentials",
                "database_dumps",
                "config_files",
                "backup_files",
                "admin_panels",
                "git_exposure",
                "cloud_storage",
                "error_messages"
            ]
    
    def _get_category_priority(self, category: str) -> int:
        """
        Assign priority score to categories (higher = more important)
        """
        priority_map = {
            "credentials": 10,
            "database_dumps": 10,
            "config_files": 9,
            "git_exposure": 8,
            "backup_files": 7,
            "admin_panels": 6,
            "cloud_storage": 6,
            "error_messages": 5,
            "directory_listings": 4,
            "sensitive_documents": 4,
            "email_addresses": 3,
            "file_exposure": 2
        }
        return priority_map.get(category, 1)
    
    def get_dork_count(self, profile: str) -> int:
        """
        Get total number of dorks for a profile
        """
        categories = self._get_categories_for_profile(profile)
        count = sum(len(self.dork_templates.get(cat, [])) for cat in categories)
        return count
