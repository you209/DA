@echo off
cd /d %~dp0
set NEXT_PUBLIC_DEV_MODE=false
echo Starting PUBLIC mode preview at http://localhost:3000
npm run dev
pause
