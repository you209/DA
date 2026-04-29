@echo off
cd /d %~dp0
set NEXT_PUBLIC_DEV_MODE=true
echo Starting ADMIN mode preview at http://localhost:3000
npm run dev
pause
