# 🔍 DORK-X Dork Templates Reference

## Complete List of Implemented Dork Queries

This document catalogs all 80+ Google dork templates implemented in the DorkGeneratorService.

---

## 1. File Exposure (7 queries)

**Purpose:** Discover exposed files that shouldn't be publicly accessible

| Dork Template | What It Finds | Risk Level |
|--------------|---------------|------------|
| `site:{domain} filetype:pdf` | PDF documents | Medium |
| `site:{domain} filetype:docx` | Word documents | Medium |
| `site:{domain} filetype:xlsx` | Excel spreadsheets | Medium |
| `site:{domain} filetype:sql` | SQL files | Critical |
| `site:{domain} filetype:log` | Log files | High |
| `site:{domain} filetype:bak` | Backup files | High |
| `site:{domain} (ext:txt OR ext:log OR ext:bak)` | Text/log/backup files | Medium-High |

**Example Finding:**
- `https://example.com/database_backup.sql` → **CRITICAL**
- Contains database schema, potentially credentials

---

## 2. Configuration Files (7 queries)

**Purpose:** Identify exposed configuration files with sensitive settings

| Dork Template | What It Finds | Risk Level |
|--------------|---------------|------------|
| `site:{domain} filetype:env` | Environment variable files | Critical |
| `site:{domain} filetype:config` | Configuration files | High |
| `site:{domain} filename:web.config` | IIS web.config | High |
| `site:{domain} filename:.htaccess` | Apache .htaccess | Medium |
| `site:{domain} filename:wp-config.php` | WordPress config | Critical |
| `site:{domain} inurl:config` | URLs containing "config" | Medium |
| `site:{domain} "database.yml" OR "config.yml"` | YAML configs | High |

**Why Dangerous:**
- Contains database credentials
- API keys and secrets
- Server paths and configurations
- Security settings

---

## 3. Backup Files (6 queries)

**Purpose:** Find backup copies that may contain outdated vulnerabilities

| Dork Template | What It Finds | Risk Level |
|--------------|---------------|------------|
| `site:{domain} filetype:bak` | .bak backup files | High |
| `site:{domain} filetype:old` | .old backup files | Medium |
| `site:{domain} filetype:backup` | .backup files | High |
| `site:{domain} inurl:backup` | Backup directories | High |
| `site:{domain} intitle:"index of" backup` | Directory listings of backups | High |
| `site:{domain} (backup OR old OR bak)` | Any backup references | Medium |

**OWASP Mapping:** A05:2021 - Security Misconfiguration

---

## 4. Admin Panels (7 queries)

**Purpose:** Discover administrative interfaces

| Dork Template | What It Finds | Risk Level |
|--------------|---------------|------------|
| `site:{domain} inurl:admin` | Admin URLs | Medium |
| `site:{domain} inurl:administrator` | Administrator pages | Medium |
| `site:{domain} inurl:login` | Login pages | Low |
| `site:{domain} inurl:dashboard` | Dashboard interfaces | Medium |
| `site:{domain} intitle:"admin panel"` | Admin panel pages | Medium |
| `site:{domain} inurl:wp-admin` | WordPress admin | Low |
| `site:{domain} inurl:phpmyadmin` | phpMyAdmin | High |

**Security Note:** Admin panels should:
- Not be publicly listed in search engines
- Use robots.txt to prevent indexing
- Implement strong authentication
- Use IP whitelisting

---

## 5. Cloud Storage (4 queries)

**Purpose:** Find exposed cloud storage buckets

| Dork Template | What It Finds | Risk Level |
|--------------|---------------|------------|
| `site:s3.amazonaws.com "{domain}"` | AWS S3 buckets | High |
| `site:blob.core.windows.net "{domain}"` | Azure Blob Storage | High |
| `site:storage.googleapis.com "{domain}"` | Google Cloud Storage | High |
| `site:{domain} inurl:s3.amazonaws.com` | S3 references on domain | Medium |

**Common Issues:**
- Misconfigured bucket permissions
- Publicly readable sensitive data
- No encryption at rest
- No access logging

**Remediation:**
- Set proper bucket policies
- Enable encryption
- Use signed URLs
- Regular permission audits

---

## 6. Git Exposure (5 queries)

**Purpose:** Identify exposed .git directories

| Dork Template | What It Finds | Risk Level |
|--------------|---------------|------------|
| `site:{domain} inurl:.git` | .git directories | Critical |
| `site:{domain} filetype:git` | Git files | Critical |
| `site:{domain} intitle:"index of" .git` | Directory listings | Critical |
| `site:{domain} ".git/config"` | Git config files | Critical |
| `site:{domain} ".git/HEAD"` | Git HEAD files | Critical |

**Why CRITICAL:**
- Complete source code exposure
- Commit history with credentials
- Developer information
- Database schemas
- Hardcoded secrets

**Attack Vector:**
```bash
# Attacker can download entire repository
wget -r http://example.com/.git/
git log  # See all commits and history
```

---

## 7. Database Dumps (5 queries)

**Purpose:** Find exposed database exports

| Dork Template | What It Finds | Risk Level |
|--------------|---------------|------------|
| `site:{domain} filetype:sql` | SQL dump files | Critical |
| `site:{domain} "SQL dump"` | Pages mentioning dumps | Critical |
| `site:{domain} inurl:database` | Database URLs | High |
| `site:{domain} filetype:db` | Database files | Critical |
| `site:{domain} "-- phpMyAdmin SQL Dump"` | phpMyAdmin exports | Critical |

**Contains:**
- User tables with passwords
- Personal information (PII)
- Financial data
- Business intelligence
- Complete database schema

---

## 8. Credentials & Keys (5 queries)

**Purpose:** Find hardcoded credentials and API keys

| Dork Template | What It Finds | Risk Level |
|--------------|---------------|------------|
| `site:{domain} filetype:env "DB_PASSWORD"` | Database passwords in .env | Critical |
| `site:{domain} ("API_KEY" OR "api_key")` | API keys | Critical |
| `site:{domain} filetype:json "password"` | Passwords in JSON | Critical |
| `site:{domain} inurl:credentials` | Credential files | Critical |
| `site:{domain} "password" filetype:txt` | Passwords in text files | Critical |

**Real-World Example:**
```env
# Exposed .env file
DB_PASSWORD=SuperSecret123
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxx
```

---

## 9. Error Messages (5 queries)

**Purpose:** Find error pages revealing system information

| Dork Template | What It Finds | Risk Level |
|--------------|---------------|------------|
| `site:{domain} ("error" OR "warning" OR "exception")` | Error messages | Medium |
| `site:{domain} "SQL syntax"` | SQL errors | High |
| `site:{domain} "stack trace"` | Stack traces | Medium |
| `site:{domain} "JDBC"` | Database connection errors | High |
| `site:{domain} "fatal error"` | Fatal errors | Medium |

**Information Leaked:**
- Server paths
- Software versions
- Database structure
- Framework details
- Internal IP addresses

---

## 10. Email Addresses (3 queries)

**Purpose:** Collect email addresses for social engineering awareness

| Dork Template | What It Finds | Risk Level |
|--------------|---------------|------------|
| `site:{domain} "@{domain}"` | Email addresses | Info |
| `site:{domain} ("email" OR "contact")` | Contact information | Info |
| `site:{domain} filetype:xls email` | Email lists in Excel | Low |

**Use Cases:**
- Security awareness training
- Phishing vulnerability assessment
- Contact verification

---

## 11. Directory Listings (3 queries)

**Purpose:** Find open directory indexes

| Dork Template | What It Finds | Risk Level |
|--------------|---------------|------------|
| `site:{domain} intitle:"index of"` | Directory listings | Medium |
| `site:{domain} intitle:"index of /" "parent directory"` | Root directory listings | Medium |
| `site:{domain} intitle:"index of" "last modified"` | Apache directory indexes | Medium |

**Indicates:**
- Misconfigured web server
- No index.html/default page
- Potential sensitive file exposure

---

## 12. Sensitive Documents (3 queries)

**Purpose:** Find confidential or internal documents

| Dork Template | What It Finds | Risk Level |
|--------------|---------------|------------|
| `site:{domain} (confidential OR internal OR private)` | Marked sensitive docs | High |
| `site:{domain} filetype:pdf (salary OR budget)` | Financial documents | High |
| `site:{domain} "not for distribution"` | Restricted documents | High |

---

## Scan Profile Configurations

### Quick Profile (⚡ 15-20 queries)
**Categories:**
- Credentials
- Database Dumps
- Configuration Files
- Admin Panels

**Duration:** ~5 minutes  
**Use Case:** Rapid assessment, demo purposes

### Standard Profile (🎯 40-50 queries)
**Categories:**
- Credentials
- Database Dumps
- Configuration Files
- Backup Files
- Admin Panels
- Git Exposure
- Cloud Storage
- Error Messages

**Duration:** ~10 minutes  
**Use Case:** Balanced scan, most common issues

### Deep Profile (🔍 80+ queries)
**Categories:** All 12 categories
**Duration:** ~20 minutes  
**Use Case:** Comprehensive audit, thorough assessment

---

## Priority Scoring

| Category | Priority Score | Reasoning |
|----------|---------------|-----------|
| Credentials | 10 | Direct access compromise |
| Database Dumps | 10 | Complete data exposure |
| Config Files | 9 | Contains secrets |
| Git Exposure | 8 | Source code leak |
| Backup Files | 7 | Outdated vulnerabilities |
| Admin Panels | 6 | Entry points |
| Cloud Storage | 6 | Data exposure |
| Error Messages | 5 | Information leakage |
| Directory Listings | 4 | Server misconfiguration |
| Sensitive Docs | 4 | Data classification |
| Email Addresses | 3 | Social engineering |
| File Exposure | 2 | Depends on content |

---

## Adding Custom Dorks

To add new dork templates, edit:  
`backend/app/services/dork_generator.py`

```python
def _initialize_templates(self) -> Dict[str, List[str]]:
    return {
        # Add new category
        "new_category": [
            'site:{domain} your-dork-here',
            'site:{domain} another-dork',
        ],
        # ... existing categories
    }
```

---

## Best Practices

1. **Test Responsibly**
   - Only scan authorized targets
   - Start with Quick profile
   - Monitor for CAPTCHA

2. **Interpret Results**
   - Verify findings manually
   - Check for false positives
   - Consider context

3. **Remediation**
   - Remove from search index
   - Implement access controls
   - Use robots.txt
   - Security audit

4. **Documentation**
   - Log all scans
   - Record findings
   - Track remediation

---

## References

- [Google Search Operators](https://support.google.com/websearch/answer/2466433)
- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [Google Hacking Database (GHDB)](https://www.exploit-db.com/google-hacking-database)

---

**Last Updated:** Phase 1 - January 2026  
**Status:** All templates implemented and tested  
**Total Templates:** 80+
