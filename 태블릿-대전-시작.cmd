@echo off
chcp 65001 >nul
setlocal
cd /d "%~dp0"
set "ARENA_NODE="
for /f "delims=" %%N in ('where node.exe 2^>nul') do if not defined ARENA_NODE set "ARENA_NODE=%%N"
if not defined ARENA_NODE if exist "%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" set "ARENA_NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
if not defined ARENA_NODE (
 echo Node.js를 찾을 수 없어요. Node.js 22 이상을 설치하고 다시 실행해주세요.
 pause
 exit /b 1
)
"%ARENA_NODE%" "%~dp0arena-server.cjs"
pause
