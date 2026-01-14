"""
Target Validation API Endpoints
Domain validation and normalization
"""

from fastapi import APIRouter, HTTPException
from loguru import logger
import re
from app.schemas import TargetValidateRequest, TargetValidateResponse
from app.core.config import settings

router = APIRouter()


def is_valid_domain(domain: str) -> bool:
    """
    Validate domain format using regex
    """
    pattern = r'^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$'
    return bool(re.match(pattern, domain))


def is_blocked_domain(domain: str) -> tuple[bool, str]:
    """
    Check if domain is blocked
    Returns (is_blocked, reason)
    """
    # Check TLDs
    for tld in settings.BLOCKED_TLDS:
        if domain.endswith(tld):
            return True, f"Scanning {tld} domains is not allowed for safety reasons"
    
    # Check specific domains
    for blocked in settings.BLOCKED_DOMAINS:
        if blocked in domain.lower():
            return True, f"Scanning internal/local domains is not allowed"
    
    return False, ""


@router.post("/targets/validate", response_model=TargetValidateResponse)
async def validate_target(request: TargetValidateRequest):
    """
    Validate and normalize a target domain
    
    - Checks domain format
    - Validates against blocked lists
    - Normalizes domain string
    - Returns validation result with warnings
    """
    logger.info(f"🎯 Validating target: {request.target}")
    
    target = request.target
    warnings = []
    
    # Basic format validation
    if not is_valid_domain(target):
        logger.warning(f"❌ Invalid domain format: {target}")
        return TargetValidateResponse(
            valid=False,
            reason="Invalid domain format. Please provide a valid domain (e.g., example.com)"
        )
    
    # Check if blocked
    is_blocked, block_reason = is_blocked_domain(target)
    if is_blocked:
        logger.warning(f"🚫 Blocked domain: {target} - {block_reason}")
        return TargetValidateResponse(
            valid=False,
            reason=block_reason
        )
    
    # Additional warnings
    if len(target.split('.')) == 2 and not target.startswith('www.'):
        warnings.append("Scanning apex domain will include all subdomains")
    
    logger.info(f"✅ Target validated successfully: {target}")
    
    return TargetValidateResponse(
        valid=True,
        normalized_target=target,
        warnings=warnings
    )
