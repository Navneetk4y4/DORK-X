"""
Database Models
SQLAlchemy ORM models for DORK-X
"""

from sqlalchemy import Column, String, Integer, Text, Boolean, DateTime, ForeignKey, Enum, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid
import enum

from app.core.database import Base


class ScanStatus(str, enum.Enum):
    """Scan status enumeration"""
    PENDING = "pending"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"
    ABORTED = "aborted"


class RiskLevel(str, enum.Enum):
    """Risk level enumeration"""
    INFO = "info"
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class QueryStatus(str, enum.Enum):
    """Query execution status"""
    PENDING = "pending"
    EXECUTING = "executing"
    COMPLETED = "completed"
    FAILED = "failed"


class Scan(Base):
    """
    Scan model - represents a reconnaissance scan session
    """
    __tablename__ = "scans"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    target_domain = Column(String(255), nullable=False, index=True)
    scan_profile = Column(String(50), default="standard")
    status = Column(Enum(ScanStatus), default=ScanStatus.PENDING, index=True)
    user_id = Column(String(255), index=True)
    consent_accepted_at = Column(DateTime(timezone=True), nullable=False)
    started_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True))
    total_queries = Column(Integer, default=0)
    total_findings = Column(Integer, default=0)
    error_message = Column(Text)
    
    # Relationships
    queries = relationship("DorkQuery", back_populates="scan", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="scan", cascade="all, delete-orphan")
    reports = relationship("Report", back_populates="scan", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="scan", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Scan {self.id} - {self.target_domain}>"


class DorkQuery(Base):
    """
    DorkQuery model - represents individual dork queries
    """
    __tablename__ = "dork_queries"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(UUID(as_uuid=True), ForeignKey("scans.id"), nullable=False, index=True)
    query_text = Column(Text, nullable=False)
    category = Column(String(100), index=True)
    priority = Column(Integer, default=0)
    status = Column(Enum(QueryStatus), default=QueryStatus.PENDING)
    executed_at = Column(DateTime(timezone=True))
    result_count = Column(Integer, default=0)
    error_message = Column(Text)
    
    # Relationships
    scan = relationship("Scan", back_populates="queries")
    findings = relationship("Finding", back_populates="query")
    
    def __repr__(self):
        return f"<DorkQuery {self.id} - {self.category}>"


class Finding(Base):
    """
    Finding model - represents discovered items from reconnaissance
    """
    __tablename__ = "findings"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(UUID(as_uuid=True), ForeignKey("scans.id"), nullable=False, index=True)
    query_id = Column(UUID(as_uuid=True), ForeignKey("dork_queries.id"))
    url = Column(Text, nullable=False)
    title = Column(Text)
    snippet = Column(Text)
    file_type = Column(String(50))
    category = Column(String(100), index=True)
    risk_level = Column(Enum(RiskLevel), default=RiskLevel.INFO, index=True)
    risk_rationale = Column(Text)
    owasp_mapping = Column(String(100))
    remediation = Column(Text)
    discovered_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    is_false_positive = Column(Boolean, default=False)
    additional_metadata = Column(JSON)  # Additional metadata as JSON
    
    # Relationships
    scan = relationship("Scan", back_populates="findings")
    query = relationship("DorkQuery", back_populates="findings")
    
    def __repr__(self):
        return f"<Finding {self.id} - {self.risk_level.value}>"


class AuditLog(Base):
    """
    AuditLog model - comprehensive activity logging
    """
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(UUID(as_uuid=True), ForeignKey("scans.id"), index=True)
    user_id = Column(String(255), index=True)
    action = Column(String(100), nullable=False)
    details = Column(JSON)
    ip_address = Column(String(45))
    user_agent = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)
    
    # Relationships
    scan = relationship("Scan", back_populates="audit_logs")
    
    def __repr__(self):
        return f"<AuditLog {self.action} at {self.created_at}>"


class Report(Base):
    """
    Report model - generated penetration testing reports
    """
    __tablename__ = "reports"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    scan_id = Column(UUID(as_uuid=True), ForeignKey("scans.id"), nullable=False, index=True)
    report_type = Column(String(50), nullable=False)  # pdf, html, csv
    file_path = Column(Text, nullable=False)
    file_size = Column(Integer)
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    scan = relationship("Scan", back_populates="reports")
    
    def __repr__(self):
        return f"<Report {self.id} - {self.report_type}>"
