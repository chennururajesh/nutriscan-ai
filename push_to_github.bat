@echo off
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"
echo ========================================================
echo        NutriScan AI - Push Changes to GitHub
echo ========================================================
echo.
git status
echo.
set /p commit_msg="Enter commit message (or press Enter for 'Update NutriScan project'): "
if "%commit_msg%"=="" set commit_msg=Update NutriScan project
git add .
git commit -m "%commit_msg%"
echo.
echo Pushing to GitHub (main branch)...
git push -u origin main
echo.
echo ========================================================
echo Push complete! Render and Vercel will auto-deploy now.
echo ========================================================
pause
