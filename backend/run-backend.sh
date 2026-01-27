#!/bin/zsh
# Run this script to always start the backend server correctly
cd "$(dirname "$0")"
/opt/homebrew/bin/python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
