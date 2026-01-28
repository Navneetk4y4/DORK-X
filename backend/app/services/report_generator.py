"""
Report Generator Service
Generates professional penetration testing reports
"""

from sqlalchemy.orm import Session
from uuid import UUID
from loguru import logger
import os
from app.core.config import settings


class ReportGeneratorService:
    """
    Service for generating reports in various formats
    
    This is a placeholder for Phase 5 implementation
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    async def generate_report(
        self,
        scan_id: UUID,
        report_type: str,
        include_low_risk: bool = True,
        include_info: bool = False
    ) -> str:
        """
        Generate penetration testing report (CSV implemented, others placeholder)
        """
        logger.info(f"Generating {report_type} report for scan {scan_id}")

        # Fetch findings and queries
        from app.models import Finding, DorkQuery
        findings = self.db.query(Finding).filter(Finding.scan_id == scan_id).all()
        query_ids = list({f.query_id for f in findings if f.query_id})
        query_map = {}
        if query_ids:
            queries = self.db.query(DorkQuery).filter(DorkQuery.id.in_(query_ids)).all()
            query_map = {q.id: q.query_text for q in queries}

        # Filter findings by risk level if needed
        def include_finding(f):
            if not include_low_risk and f.risk_level in ("low",):
                return False
            if not include_info and f.risk_level in ("info",):
                return False
            return True
        filtered_findings = [f for f in findings if include_finding(f)]

        # Prepare report path
        if not settings.REPORT_STORAGE_PATH:
            os.makedirs("/tmp/dorkx_reports", exist_ok=True)
            report_dir = "/tmp/dorkx_reports"
        else:
            os.makedirs(settings.REPORT_STORAGE_PATH, exist_ok=True)
            report_dir = settings.REPORT_STORAGE_PATH
        report_filename = f"report_{scan_id}.{report_type}"
        report_path = os.path.join(report_dir, report_filename)

        if report_type == "csv":
            import csv
            with open(report_path, mode="w", newline="", encoding="utf-8") as csvfile:
                writer = csv.writer(csvfile)
                writer.writerow([
                    "ID", "URL", "Title", "Snippet", "File Type", "Category", "Risk Level", "Risk Rationale", "OWASP Mapping", "Remediation", "Discovered At", "Is False Positive", "Query"
                ])
                for f in filtered_findings:
                    writer.writerow([
                        str(f.id),
                        f.url,
                        f.title or "",
                        f.snippet or "",
                        f.file_type or "",
                        f.category,
                        f.risk_level,
                        f.risk_rationale or "",
                        f.owasp_mapping or "",
                        f.remediation or "",
                        f.discovered_at.isoformat() if f.discovered_at else "",
                        str(f.is_false_positive),
                        query_map.get(f.query_id, "") if f.query_id else ""
                    ])
            logger.info(f"CSV report generated at {report_path}")
        else:
            # Placeholder for PDF/HTML
            with open(report_path, "w", encoding="utf-8") as f:
                f.write(f"Report type {report_type} not implemented yet.\n")
                f.write(f"Findings count: {len(filtered_findings)}\n")
        return report_path
