"""
Scan Management API Endpoints
Create, monitor, and manage reconnaissance scans
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from uuid import UUID
from datetime import datetime
from loguru import logger

from app.core.database import get_db
from app.schemas import (
    ScanCreateRequest,
    ScanResponse,
    ScanListResponse,
    FindingsListResponse,
    ScanStatistics
)
from app.models import Scan, ScanStatus, Finding, RiskLevel, DorkQuery
from app.services.dork_generator import DorkGeneratorService
from app.services.scan_executor import ScanExecutorService

router = APIRouter()


@router.post("/scans", response_model=ScanResponse, status_code=201)
async def create_scan(
    request: ScanCreateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Create a new reconnaissance scan
    
    - Validates target
    - Records consent
    - Generates dork queries
    - Initiates scan in background
    """
    logger.info(f"🚀 Creating new scan for target: {request.target_domain}")
    
    # Create scan record
    scan = Scan(
        target_domain=request.target_domain,
        scan_profile=request.scan_profile.value,
        status="pending",
        user_id=request.user_id,
        consent_accepted_at=datetime.utcnow()
    )
    
    db.add(scan)
    db.commit()
    db.refresh(scan)
    
    logger.info(f"✅ Scan created with ID: {scan.id}")
    
    # Schedule scan execution in background
    background_tasks.add_task(execute_scan_background, scan.id, db)
    
    return scan


async def execute_scan_background(scan_id: UUID, db: Session):
    """
    Execute scan in background
    This is a placeholder - full implementation will be in scan_executor service
    """
    try:
        logger.info(f"🔍 Starting background scan execution: {scan_id}")
        
        # Update status to running
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if not scan:
            logger.error(f"❌ Scan not found: {scan_id}")
            return
        
        scan.status = "running"
        db.commit()
        
        # Generate dork queries
        dork_service = DorkGeneratorService()
        queries = dork_service.generate_dorks(scan.target_domain, scan.scan_profile)
        scan.total_queries = len(queries)
        
        # Create DorkQuery objects in the database
        for query_data in queries:
            dork_query = DorkQuery(
                scan_id=scan_id,
                query_text=query_data.get('query_text', str(query_data)) if isinstance(query_data, dict) else query_data,
                category=query_data.get('category', 'general') if isinstance(query_data, dict) else 'general',
                status="pending"
            )
            db.add(dork_query)
        db.commit()
        
        logger.info(f"📋 Generated {len(queries)} dork queries for scan {scan_id}")
        
        # Execute scan to generate findings
        executor = ScanExecutorService(db)
        executor.execute_scan(scan_id, queries)
        
        # Mark as completed
        scan.status = "completed"
        scan.completed_at = datetime.utcnow()
        db.commit()
        
        logger.info(f"✅ Scan completed: {scan_id}")
        
    except Exception as e:
        logger.error(f"❌ Scan execution failed: {str(e)}")
        scan.status = "failed"
        scan.error_message = str(e)
        db.commit()


@router.get("/scans/{scan_id}", response_model=ScanResponse)
async def get_scan(scan_id: UUID, db: Session = Depends(get_db)):
    """
    Get scan details by ID
    """
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    return scan


@router.get("/scans", response_model=ScanListResponse)
async def list_scans(
    page: int = 1,
    page_size: int = 10,
    db: Session = Depends(get_db)
):
    """
    List all scans with pagination
    """
    offset = (page - 1) * page_size
    
    scans = db.query(Scan).order_by(Scan.started_at.desc()).offset(offset).limit(page_size).all()
    total = db.query(Scan).count()
    
    return ScanListResponse(
        scans=scans,
        total=total,
        page=page,
        page_size=page_size
    )


@router.get("/scans/{scan_id}/findings", response_model=FindingsListResponse)
async def get_scan_findings(scan_id: UUID, db: Session = Depends(get_db)):
    """
    Get all findings for a scan
    """
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    findings = db.query(Finding).filter(Finding.scan_id == scan_id).all()
    
    # Calculate risk distribution
    risk_distribution = {
        "critical": db.query(Finding).filter(
            Finding.scan_id == scan_id,
            Finding.risk_level == "critical"
        ).count(),
        "high": db.query(Finding).filter(
            Finding.scan_id == scan_id,
            Finding.risk_level == "high"
        ).count(),
        "medium": db.query(Finding).filter(
            Finding.scan_id == scan_id,
            Finding.risk_level == "medium"
        ).count(),
        "low": db.query(Finding).filter(
            Finding.scan_id == scan_id,
            Finding.risk_level == "low"
        ).count(),
        "info": db.query(Finding).filter(
            Finding.scan_id == scan_id,
            Finding.risk_level == "info"
        ).count(),
    }
    
    return FindingsListResponse(
        findings=findings,
        total=len(findings),
        risk_distribution=risk_distribution
    )


@router.get("/scans/{scan_id}/statistics", response_model=ScanStatistics)
async def get_scan_statistics(scan_id: UUID, db: Session = Depends(get_db)):
    """
    Get detailed statistics for a scan
    """
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    # Count findings by risk level
    critical_count = db.query(Finding).filter(
        Finding.scan_id == scan_id,
        Finding.risk_level == "critical"
    ).count()
    
    high_count = db.query(Finding).filter(
        Finding.scan_id == scan_id,
        Finding.risk_level == "high"
    ).count()
    
    medium_count = db.query(Finding).filter(
        Finding.scan_id == scan_id,
        Finding.risk_level == "medium"
    ).count()
    
    low_count = db.query(Finding).filter(
        Finding.scan_id == scan_id,
        Finding.risk_level == "low"
    ).count()
    
    info_count = db.query(Finding).filter(
        Finding.scan_id == scan_id,
        Finding.risk_level == "info"
    ).count()
    
    # Get category distribution
    findings = db.query(Finding).filter(Finding.scan_id == scan_id).all()
    categories = {}
    for finding in findings:
        categories[finding.category] = categories.get(finding.category, 0) + 1
    
    # Get top risks
    top_risks = db.query(Finding).filter(
        Finding.scan_id == scan_id,
        Finding.risk_level.in_(["critical", "high"])
    ).limit(5).all()
    
    top_risks_list = [
        {
            "url": f.url,
            "risk_level": f.risk_level,
            "category": f.category,
            "title": f.title
        }
        for f in top_risks
    ]
    
    return ScanStatistics(
        total_findings=scan.total_findings,
        critical_findings=critical_count,
        high_findings=high_count,
        medium_findings=medium_count,
        low_findings=low_count,
        info_findings=info_count,
        categories=categories,
        top_risks=top_risks_list
    )


@router.get("/dork-categories")
async def get_dork_categories():
    """
    Get all 20 dork categories with detailed metadata
    Includes risk levels, what can be found, why it matters
    """
    dork_service = DorkGeneratorService()
    categories = dork_service.list_all_categories()
    
    return {
        "total_categories": len(categories),
        "categories": sorted(categories, key=lambda x: x["name"]),
        "summary": {
            "critical_count": sum(1 for c in categories if c.get("risk_level") == "CRITICAL"),
            "high_count": sum(1 for c in categories if c.get("risk_level") == "HIGH"),
            "medium_count": sum(1 for c in categories if c.get("risk_level") == "MEDIUM"),
        }
    }


@router.get("/dork-categories/{category_key}")
async def get_dork_category_detail(category_key: str):
    """
    Get detailed information about a specific dork category
    """
    dork_service = DorkGeneratorService()
    category_info = dork_service.get_category_info(category_key)
    
    if not category_info:
        raise HTTPException(status_code=404, detail=f"Category '{category_key}' not found")
    
    # Add query count and templates
    templates = dork_service.dork_templates.get(category_key, [])
    
    return {
        **category_info,
        "key": category_key,
        "query_count": len(templates),
        "sample_templates": templates[:3]  # Show first 3 templates as examples
    }


    return None
