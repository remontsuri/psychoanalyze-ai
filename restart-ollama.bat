@echo off
taskkill /f /im ollama.exe 2>nul
timeout /t 2 /nobreak >nul
ollama serve