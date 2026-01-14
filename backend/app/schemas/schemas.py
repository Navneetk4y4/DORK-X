"""
Pydantic Schemas for Request/Response Validation
"""

from pydantic import BaseModel, Field, validator, HttpUrl
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from enum import Enum


# Enums
class ScanProfileEnum(str, Enum):
    QUICK = "quick"
    STANDARD = "standard"
    DEEP = "deep"


class ScanStatusEnum(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    ABORTED = "aborted"


class RiskLevelEnum(str, Enum):
    INFO = "info"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class ReportTypeEnum(str, Enum):
    PDF = "pdf"
    HTML = "html"
    CSV = "csv"


# Target Validation Schemas
class TargetValidateRequest(BaseModel):
    """Request schema for target validation"""
    target: str = Field(..., description="Target domain to validate", min_length=3, max_length=255)
    
    @validator('target')
    def validate_target_format(cls, v):
        """Validate target format"""
        # Remove protocols
        v = v.replace('http://', '').replace('https://', '').replace('www.', '')
        # Remove trailing slashes
        v = v.rstrip('/')
        # Convert to lowercase
        v = v.lower()
        return v


class TargetValidateResponse(BaseModel):
    """Response schema for target validation"""
    valid: bool
    normalized_target: Optional[str] = None
    reason: Optional[str] = None
    warnings: List[str] = []


# Scan Schemas
class ScanCreateRequest(BaseModel):
    """Request schema for creating a new scan"""
    target_domain: str = Field(..., description="Target domain to scan")
    scan_profile: ScanProfileEnum = Field(default=ScanProfileEnum.STANDARD)
    consent_accepted: bool = Field(..., description="Legal disclaimer acceptance")
    user_id: Optional[str] = Field(default="anonymous")
    
    @validator('consent_accepted')
    def consent_must_be_true(cls, v):
        if not v:
            raise ValueError('Legal disclaimer must be accepted')
        return v


class ScanResponse(BaseModel):
    """Response schema for scan information"""
    id: UUID
    target_domain: str
    scan_profile: str
    status: str
    user_id: Optional[str]
    consent_accepted_at: datetime
    started_at: datetime
    completed_at: Optional[datetime]
    total_queries: int
    total_findings: int
    error_message: Optional[str]
    
    class Config:
        from_attributes = True


class ScanListResponse(BaseModel):
    """Response schema for list of scans"""
    scans: List[ScanResponse]
    total: int
    page: int
    page_size: int


# Finding Schemas
class FindingResponse(BaseModel):
    """Response schema for a finding"""
    id: UUID
    scan_id: UUID
    url: str
    title: Optional[str]
    snippet: Optional[str]
    file_type: Optional[str]
    category: str
    risk_level: str
    risk_rationale: Optional[str]
    owasp_mapping: Optional[str]
    remediation: Optional[str]
    discovered_at: datetime
    is_false_positive: bool
    
    class Config:
        from_attributes = True


class FindingsListResponse(BaseModel):
    """Response schema for list of findings"""
    findings: List[FindingResponse]
    total: int
    risk_distribution: dict


# Report Schemas
class ReportGenerateRequest(BaseModel):
    """Request schema for report generation"""
    scan_id: UUID
    report_type: ReportTypeEnum = Field(default=ReportTypeEnum.PDF)
    include_low_risk: bool = Field(default=True)
    include_info: bool = Field(default=False)


class ReportResponse(BaseModel):
    """Response schema for report information"""
    id: UUID
    scan_id: UUID
    report_type: str
    file_path: str
    file_size: Optional[int]
    generated_at: datetime
    download_url: str
    
    class Config:
        from_attributes = True


# Health Check Schema
class HealthResponse(BaseModel):
    """Response schema for health check"""
    status: str
    timestamp: datetime
    version: str
    database: str
    redis: str
    api_keys_configured: dict


# Statistics Schema
class ScanStatistics(BaseModel):
    """Statistics for a scan"""
    total_findings: int
    critical_findings: int
    high_findings: int
    medium_findings: int
    low_findings: int
    info_findings: int
    categories: dict
    top_risks: List[dict]


# Error Response Schema
class ErrorResponse(BaseModel):
    """Standard error response"""
    error: str
    message: str
    detail: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
