"""
Google Custom Search Service
Executes real Google Dork queries using Custom Search API
"""

import httpx
from typing import List, Dict, Optional
from loguru import logger
from app.core.config import settings


class GoogleSearchService:
    """
    Service for executing Google Custom Search queries
    """
    
    def __init__(self):
        self.api_key = settings.GOOGLE_API_KEY
        self.cse_id = settings.GOOGLE_CSE_ID
        self.base_url = "https://www.googleapis.com/customsearch/v1"
        self.is_configured = self._check_configuration()
    
    def _check_configuration(self) -> bool:
        """Check if API credentials are properly configured"""
        if not self.api_key or self.api_key == "dev-placeholder":
            logger.warning("⚠️ Google API key not configured - using mock data")
            return False
        if not self.cse_id or self.cse_id == "dev-placeholder":
            logger.warning("⚠️ Google CSE ID not configured - using mock data")
            return False
        return True
    
    async def search(self, query: str, num_results: int = 10) -> List[Dict]:
        """
        Execute a Google Custom Search query
        
        Args:
            query: The search query (dork)
            num_results: Number of results to return (max 10 per request)
        
        Returns:
            List of search results with url, title, snippet
        """
        if not self.is_configured:
            logger.warning(f"🔍 Mock search for: {query}")
            return []
        
        try:
            params = {
                "key": self.api_key,
                "cx": self.cse_id,
                "q": query,
                "num": min(num_results, 10)  # Google allows max 10 per request
            }
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(self.base_url, params=params)
                response.raise_for_status()
                
                data = response.json()
                results = []
                
                if "items" in data:
                    for item in data["items"]:
                        result = {
                            "url": item.get("link", ""),
                            "title": item.get("title", ""),
                            "snippet": item.get("snippet", ""),
                            "file_type": self._extract_file_type(item.get("link", "")),
                            "display_link": item.get("displayLink", "")
                        }
                        results.append(result)
                    
                    logger.info(f"✅ Google search returned {len(results)} results for: {query[:50]}...")
                else:
                    logger.info(f"ℹ️ No results found for: {query[:50]}...")
                
                return results
                
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 429:
                logger.error("❌ Google API quota exceeded")
            else:
                logger.error(f"❌ Google API HTTP error: {e.response.status_code} - {e.response.text}")
            return []
        except Exception as e:
            logger.error(f"❌ Google search failed: {str(e)}")
            return []
    
    def _extract_file_type(self, url: str) -> Optional[str]:
        """Extract file type from URL"""
        if not url:
            return None
        
        # Common file extensions
        file_extensions = [
            '.pdf', '.doc', '.docx', '.xls', '.xlsx', 
            '.txt', '.csv', '.sql', '.xml', '.json',
            '.env', '.config', '.bak', '.zip', '.tar'
        ]
        
        url_lower = url.lower()
        for ext in file_extensions:
            if ext in url_lower:
                return ext.replace('.', '')
        
        return None
    
    def get_quota_info(self) -> Dict:
        """Get API quota information"""
        return {
            "is_configured": self.is_configured,
            "api_key_set": bool(self.api_key and self.api_key != "dev-placeholder"),
            "cse_id_set": bool(self.cse_id and self.cse_id != "dev-placeholder"),
            "daily_limit": 100,  # Google free tier limit
            "note": "Google Custom Search API has 100 queries/day on free tier"
        }
