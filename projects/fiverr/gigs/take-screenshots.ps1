# Install Playwright and take screenshots of all 3 Fiverr gig covers
$ErrorActionPreference = "Stop"
Set-Location "C:\Users\Administrator\ToolClub"

Write-Host "=== Installing Playwright ===" -ForegroundColor Cyan
npm install --save-dev playwright
npx playwright install chromium

Write-Host "=== Taking screenshots ===" -ForegroundColor Cyan
node "C:\Users\Administrator\ToolClub\projects\fiverr\gigs\screenshot-covers.cjs"

Write-Host "=== Done ===" -ForegroundColor Green
