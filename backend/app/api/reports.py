"""
Report Generation API Endpoints
PDF, HTML, and CSV report generation
"""

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from uuid import UUID
from loguru import logger

from app.core.database import get_db
from app.schemas import ReportGenerateRequest, ReportResponse
from app.models import Scan, Report
from app.services.report_generator import ReportGeneratorService

router = APIRouter()


@router.post("/reports", response_model=ReportResponse, status_code=201)
async def generate_report(
    request: ReportGenerateRequest,
    db: Session = Depends(get_db)
):
    """
    Generate a penetration testing report
    
    - Supports PDF, HTML, and CSV formats
    - Professional pentesting report structure
    - Includes findings, risk analysis, and remediation
    """
    logger.info(f"📄 Generating {request.report_type.value} report for scan: {request.scan_id}")
    
    # Check if scan exists
    scan = db.query(Scan).filter(Scan.id == request.scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    # Generate report (placeholder - will implement in Phase 5)
    report_service = ReportGeneratorService(db)
    report_path = await report_service.generate_report(
        scan_id=request.scan_id,
        report_type=request.report_type.value,
        include_low_risk=request.include_low_risk,
        include_info=request.include_info
    )
    
    # Create report record
    report = Report(
        scan_id=request.scan_id,
        report_type=request.report_type.value,
        file_path=report_path
    )
    
    db.add(report)
    db.commit()
    db.refresh(report)
    
    logger.info(f"✅ Report generated: {report.id}")
    
    return ReportResponse(
        id=report.id,
        scan_id=report.scan_id,
        report_type=report.report_type,
        file_path=report.file_path,
        file_size=report.file_size,
        generated_at=report.generated_at,
        download_url=f"/api/v1/reports/{report.id}/download"
    )


@router.get("/reports/{report_id}/download")
async def download_report(report_id: UUID, db: Session = Depends(get_db)):
    """
    Download a generated report
    """
    report = db.query(Report).filter(Report.id == report_id).first()
    
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Return file
    return FileResponse(
        path=report.file_path,
        filename=f"dorkx_report_{report.scan_id}.{report.report_type}",
        media_type="application/octet-stream"
    )


@router.get("/scans/{scan_id}/reports", response_model=list[ReportResponse])
async def list_scan_reports(scan_id: UUID, db: Session = Depends(get_db)):
    """
    List all reports for a scan
    """
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    reports = db.query(Report).filter(Report.scan_id == scan_id).all()
    
    return [
        ReportResponse(
            id=r.id,
            scan_id=r.scan_id,
            report_type=r.report_type,
            file_path=r.file_path,
            file_size=r.file_size,
            generated_at=r.generated_at,
            download_url=f"/api/v1/reports/{r.id}/download"
        )
        for r in reports
    ]
