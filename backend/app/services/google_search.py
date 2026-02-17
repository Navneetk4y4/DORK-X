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
        self.api_keys = [
            (settings.GOOGLE_API_KEY, settings.GOOGLE_CSE_ID),
            (getattr(settings, 'GOOGLE_API_KEY2', None), getattr(settings, 'GOOGLE_CSE_ID2', None))
        ]
        self.base_url = "https://www.googleapis.com/customsearch/v1"
        self.is_configured = self._check_configuration()
    
    def _check_configuration(self) -> bool:
        """Check if at least one set of API credentials is properly configured"""
        for api_key, cse_id in self.api_keys:
            if api_key and api_key != "dev-placeholder" and cse_id and cse_id != "dev-placeholder":
                return True
        logger.warning("⚠️ No valid Google API key/CSE ID configured - using mock data")
        return False
    
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

        last_exception = None
        for idx, (api_key, cse_id) in enumerate(self.api_keys):
            if not api_key or not cse_id or api_key == "dev-placeholder" or cse_id == "dev-placeholder":
                continue
            try:
                params = {
                    "key": api_key,
                    "cx": cse_id,
                    "q": query,
                    "num": min(num_results, 10)
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
                        logger.info(f"✅ Google search returned {len(results)} results for: {query[:50]}... (API key {idx+1})")
                    else:
                        logger.info(f"ℹ️ No results found for: {query[:50]}... (API key {idx+1})")
                    return results
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 429:
                    logger.warning(f"❌ Google API quota exceeded for key {idx+1}, trying next key if available...")
                    last_exception = e
                    continue
                else:
                    logger.error(f"❌ Google API HTTP error: {e.response.status_code} - {e.response.text}")
                    return []
            except Exception as e:
                logger.error(f"❌ Google search failed (key {idx+1}): {str(e)}")
                last_exception = e
                continue
        # If all keys fail
        if last_exception:
            logger.error(f"❌ All Google API keys failed or quota exceeded. Last error: {str(last_exception)}")
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
            "api_keys_configured": [bool(api_key and api_key != "dev-placeholder") for api_key, _ in self.api_keys],
            "cse_ids_configured": [bool(cse_id and cse_id != "dev-placeholder") for _, cse_id in self.api_keys],
            "daily_limit_per_key": 100,  # Google free tier limit
            "note": "Google Custom Search API has 100 queries/day per key on free tier. Will auto-failover to second key if first is exhausted."
        }
