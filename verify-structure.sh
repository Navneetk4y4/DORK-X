#!/bin/bash

# DORK-X Project Structure Verification Script
# Run this to verify your project structure is correct

echo "🔍 DORK-X Project Structure Verification"
echo "========================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Check function
check() {
    if [ $2 -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((PASSED++))
    else
        echo -e "${RED}❌ $1${NC}"
        ((FAILED++))
    fi
}

echo "1. Git Repository Structure"
echo "----------------------------"

# Check for single .git directory
GIT_COUNT=$(find . -name ".git" -type d | wc -l | tr -d ' ')
if [ "$GIT_COUNT" -eq 1 ]; then
    GIT_LOCATION=$(find . -name ".git" -type d)
    if [ "$GIT_LOCATION" = "./.git" ]; then
        check "Single .git repository at project root" 0
    else
        echo -e "${RED}❌ .git found at wrong location: $GIT_LOCATION${NC}"
        ((FAILED++))
    fi
else
    echo -e "${RED}❌ Found $GIT_COUNT .git directories (expected 1)${NC}"
    ((FAILED++))
fi

echo ""
echo "2. .gitignore Files"
echo "-------------------"

# Check for .gitignore files
GITIGNORE_COUNT=$(find . -maxdepth 2 -name ".gitignore" -type f | wc -l | tr -d ' ')
if [ "$GITIGNORE_COUNT" -eq 2 ]; then
    check "Two .gitignore files found (root + frontend)" 0
    
    # Verify root .gitignore exists
    [ -f ".gitignore" ]
    check "Root .gitignore exists" $?
    
    # Verify frontend .gitignore exists
    [ -f "frontend/.gitignore" ]
    check "Frontend .gitignore exists" $?
else
    echo -e "${RED}❌ Found $GITIGNORE_COUNT .gitignore files (expected 2)${NC}"
    ((FAILED++))
fi

echo ""
echo "3. Dockerfile Locations"
echo "-----------------------"

# Check backend Dockerfile
[ -f "backend/Dockerfile" ]
check "Backend Dockerfile in backend/" $?

# Check frontend Dockerfile
[ -f "frontend/Dockerfile" ]
check "Frontend Dockerfile in frontend/" $?

# Check docker-compose at root
[ -f "docker-compose.yml" ]
check "docker-compose.yml at root" $?

echo ""
echo "4. Environment Files"
echo "--------------------"

# Check .env.example exists
[ -f ".env.example" ]
check ".env.example exists (template)" $?

# Check .env exists
[ -f ".env" ]
check ".env exists (actual config)" $?

# Check frontend env example
[ -f "frontend/.env.local.example" ]
check "Frontend .env.local.example exists" $?

# Verify .env is NOT in git
if git ls-files --error-unmatch .env 2>/dev/null; then
    echo -e "${RED}❌ .env is tracked by git (SECURITY RISK!)${NC}"
    ((FAILED++))
else
    check ".env is properly ignored by git (SECURE)" 0
fi

echo ""
echo "5. Directory Structure"
echo "----------------------"

# Check essential directories
[ -d "backend/app" ]
check "backend/app/ exists" $?

[ -d "backend/app/api" ]
check "backend/app/api/ exists" $?

[ -d "backend/app/services" ]
check "backend/app/services/ exists" $?

[ -d "frontend/app" ]
check "frontend/app/ exists" $?

[ -d "frontend/lib" ]
check "frontend/lib/ exists" $?

[ -d "database" ]
check "database/ exists" $?

[ -d "docs" ]
check "docs/ exists" $?

echo ""
echo "6. Essential Files"
echo "------------------"

# Backend files
[ -f "backend/requirements.txt" ]
check "backend/requirements.txt exists" $?

[ -f "backend/app/main.py" ]
check "backend/app/main.py exists" $?

# Frontend files
[ -f "frontend/package.json" ]
check "frontend/package.json exists" $?

[ -f "frontend/app/page.tsx" ]
check "frontend/app/page.tsx exists" $?

# Database files
[ -f "database/init.sql" ]
check "database/init.sql exists" $?

# Documentation files
[ -f "README.md" ]
check "README.md exists" $?

[ -f "SETUP.md" ]
check "SETUP.md exists" $?

[ -f "PROJECT_STRUCTURE.md" ]
check "PROJECT_STRUCTURE.md exists" $?

echo ""
echo "7. Unwanted Files/Directories"
echo "------------------------------"

# Check for node_modules at root (should NOT exist)
if [ -d "node_modules" ]; then
    echo -e "${RED}❌ node_modules/ found at root (should be in frontend/ only)${NC}"
    ((FAILED++))
else
    check "No node_modules/ at root" 0
fi

# Check for venv at root (should NOT exist)
if [ -d "venv" ] || [ -d "env" ]; then
    echo -e "${RED}❌ Python venv found at root (should be in backend/ only)${NC}"
    ((FAILED++))
else
    check "No venv/ at root" 0
fi

# Check for __pycache__
if find . -name "__pycache__" -type d | grep -q .; then
    echo -e "${YELLOW}⚠️  __pycache__ directories found (should be gitignored)${NC}"
else
    check "No __pycache__ directories" 0
fi

echo ""
echo "8. Git Status"
echo "-------------"

# Check if there are uncommitted changes
if [ -z "$(git status --porcelain)" ]; then
    check "Working tree clean (all changes committed)" 0
else
    echo -e "${YELLOW}⚠️  Uncommitted changes found${NC}"
    git status --short
fi

# Check for commits
COMMIT_COUNT=$(git rev-list --all --count 2>/dev/null || echo "0")
if [ "$COMMIT_COUNT" -gt 0 ]; then
    check "Git repository has commits ($COMMIT_COUNT)" 0
else
    echo -e "${YELLOW}⚠️  No commits yet${NC}"
fi

echo ""
echo "========================================"
echo "📊 Verification Summary"
echo "========================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your project structure is correct!${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some checks failed. Please review the issues above.${NC}"
    exit 1
fi
