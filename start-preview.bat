@echo off
cd /d %~dp0\demo
echo Open http://localhost:4173 in your browser
py -m http.server 4173
IF %ERRORLEVEL% NEQ 0 python -m http.server 4173
pause
