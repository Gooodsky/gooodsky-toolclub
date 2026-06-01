@echo off
echo === Installing Playwright ===
cd /d C:\Users\Administrator\ToolClub
call npm install --save-dev playwright
call npx playwright install chromium

echo === Taking screenshots ===
node "C:\Users\Administrator\ToolClub\projects\fiverr\gigs\screenshot-covers.cjs"

echo === Done ===
pause
