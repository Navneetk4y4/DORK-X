# DORK-X - 20 Detailed Reconnaissance Categories

## Overview

DORK-X now includes **20 comprehensive Google Dork categories** with detailed reconnaissance coverage, replacing the previous 12-category system. Each category contains 10-12 specialized dork templates covering critical security reconnaissance areas.

## The 20 Categories

### CRITICAL Risk Level (4 categories)
These pose immediate security threats if exposed:

1. **Credentials & Secrets** - API keys, passwords, OAuth secrets, SMTP credentials
2. **Database & Data Exposure** - SQL dumps, open panels, CSV/JSON exports, database files
3. **PII & Personal Information** - Email lists, phone numbers, employee records, resumes
4. **Cloud Storage & Buckets** - AWS S3, Azure Blob, GCP storage (logs, backups, media)

### HIGH Risk Level (10 categories)
These provide significant attack surface:

5. **Sensitive Files & Documents** - PDFs, DOCX, XLSX, backup files (.bak, .zip, .tar.gz)
6. **Login Pages & Admin Panels** - Admin dashboards, CMS login, test portals, legacy panels
7. **Source Code & Dev Artifacts** - .git directories, .svn, source maps, test scripts
8. **Subdomains & Infrastructure** - Dev/test/staging subdomains, cloud endpoints
9. **APIs & Web Services** - REST endpoints, GraphQL, Swagger/OpenAPI docs, debug panels
10. **Logs, Reports & Monitoring** - Access logs, debug logs, security reports, crash dumps
11. **Vulnerability Indicators** - Directory listings, upload folders, unauthenticated panels
12. **IoT, Devices & Panels** - CCTV dashboards, routers, printers, NAS devices
13. **Security Misconfigurations** - Disabled auth, open indexes, public APIs, exposed tools
14. **Logs, Reports & Monitoring** - Operational leaks via exposed logs

### MEDIUM Risk Level (6 categories)
These provide intelligence and partial compromise paths:

15. **Error Messages & Debug Info** - Stack traces, file paths, database errors, versions
16. **CMS & Framework ID** - WordPress, Joomla, Drupal, plugin paths, theme files
17. **Network & Internal Systems** - Internal IPs, hostnames, VPN portals, device info
18. **Emails, Contacts & Communication** - Email lists, support addresses, mailing lists
19. **Historical & Cached Data** - Old versions, archived docs, cached responses
20. **OSINT & Organization Intelligence** - Employee names, partners, internal tools
21. **Academic / Research / Internal Docs** - Training docs, architecture diagrams, SOPs

## Scan Profile Distribution

### Quick Profile
- **Categories:** 5 (Critical & High risk only)
- **Queries:** ~54 per scan
- **Time:** ~1-2 minutes
- **Use case:** Fast validation, testing, demo scans

### Standard Profile
- **Categories:** 12 (Critical + Most High)
- **Queries:** ~350 per scan  
- **Time:** ~5-10 minutes
- **Use case:** Comprehensive security assessment (RECOMMENDED)

### Deep Profile
- **Categories:** 20 (All categories)
- **Queries:** ~200+ per scan
- **Time:** ~10-20 minutes
- **Use case:** Thorough reconnaissance, research-grade assessment

## API Endpoints

### List All Categories
```bash
GET /api/v1/dork-categories
```

Returns all 20 categories with metadata:
```json
{
  "total_categories": 20,
  "categories": [
    {
      "key": "credentials",
      "name": "3. Credentials & Secrets (CRITICAL)",
      "description": "Direct or indirect exposure of secrets",
      "risk_level": "CRITICAL",
      "what_can_be_found": [...],
      "why_it_matters": "Direct compromise of accounts and services",
      "query_count": 12
    }
  ],
  "summary": {
    "critical_count": 4,
    "high_count": 10,
    "medium_count": 6
  }
}
```

### Get Specific Category
```bash
GET /api/v1/dork-categories/{category_key}
```

Example: `/api/v1/dork-categories/credentials`

## Frontend Category Browser

Visit **http://localhost:3000/categories** to browse all categories with:
- ✓ Risk level badges (CRITICAL, HIGH, MEDIUM)
- ✓ Detailed descriptions
- ✓ "What can be found" breakdowns
- ✓ "Why it matters" impact analysis
- ✓ Query count statistics
- ✓ Expandable detailed views

## Technical Implementation

### Backend (dork_generator.py)
- `_initialize_templates()` - Stores all 200+ dork query templates (10-12 per category)
- `_initialize_metadata()` - Rich metadata for each category (name, description, risk level, etc.)
- `generate_dorks()` - Returns queries with full metadata including risk levels
- `list_all_categories()` - Returns all 20 categories with statistics
- `get_category_info()` - Detailed info for specific category

### Frontend (categories/page.tsx)
- Fetches categories from `/api/v1/dork-categories`
- Displays all 20 categories in sortable grid
- Expandable cards show detailed "what can be found" and "why it matters"
- Risk level color coding (Red=CRITICAL, Orange=HIGH, Yellow=MEDIUM)
- Summary stats showing distribution by risk level

## Example Dork Queries

### Credentials Category
```
site:example.com filetype:env "DB_PASSWORD"
site:example.com ("API_KEY" OR "api_key")
site:example.com filetype:json "password"
site:example.com "begin rsa private key"
```

### Database Exposure Category
```
site:example.com filetype:sql
site:example.com filetype:db
site:example.com "SQL dump"
site:example.com inurl:phpmyadmin
```

### Cloud Storage Category
```
site:s3.amazonaws.com "example.com"
site:blob.core.windows.net "example.com"
site:storage.googleapis.com "example.com"
```

## Ethical Use Guidelines

- ✓ **Passive Reconnaissance** - Google Dorking does not exploit or intrude
- ✓ **Authorization Required** - Only scan your own assets, authorized labs, or with written permission
- ✓ **Legal Compliance** - Ensure all activities align with applicable laws
- ✓ **Rate Limiting** - Respects Google's 100 queries/day free tier
- ✓ **Consent Tracking** - Legal disclaimer acceptance is logged
- ✓ **Educational Purpose** - Designed for security training and authorized testing

## Next Steps

1. **Dashboard** - Scan history page with statistics and trends
2. **Comparison** - Compare scans of the same domain over time
3. **Risk Trends** - Visualize finding trends across all scans
4. **Export** - Export scan history as CSV/PDF reports
5. **Filtering** - Advanced filtering by risk level, category, date range

---

**Created:** January 14, 2026  
**Version:** 2.0 (20 Categories)  
**Status:** Production Ready  
**Next Update:** Dashboard & Analytics
