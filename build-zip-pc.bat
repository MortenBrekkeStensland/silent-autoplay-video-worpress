@echo off
REM Double-click this file on Windows to create a WordPress-ready plugin zip.

cd /d "%~dp0"

set ZIP_NAME=silent-autoplay-video.zip

if exist "%ZIP_NAME%" del "%ZIP_NAME%"

powershell -NoProfile -Command ^
  "Get-ChildItem -Path . -Recurse | Where-Object { $_.FullName -notmatch '\\\.git\\' -and $_.Name -ne '.git' -and $_.Name -ne '.gitignore' -and $_.Name -ne '.DS_Store' -and $_.Name -ne 'build-zip-mac.command' -and $_.Name -ne 'build-zip-pc.bat' -and $_.Name -ne 'README.md' -and $_.Name -ne 'CLAUDE.md' -and $_.Extension -ne '.zip' } | Compress-Archive -DestinationPath '%ZIP_NAME%' -Force"

echo.
echo Created: %ZIP_NAME%
echo.
pause
