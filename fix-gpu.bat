@echo off
echo Stopping Ollama...
taskkill /f /im ollama.exe 2>nul

echo Setting GPU environment...
set OLLAMA_VULKAN=1
set OLLAMA_GPU_OVERHEAD=0
set OLLAMA_MAX_LOADED_MODELS=1

echo Starting Ollama with GPU...
start /b ollama serve

timeout /t 3 /nobreak >nul

echo Testing GPU usage...
ollama run qwen2.5-coder:1.5b "test gpu"