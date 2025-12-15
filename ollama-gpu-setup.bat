@echo off
echo Setting up Ollama GPU support...

REM Set Vulkan support
set OLLAMA_VULKAN=1

REM Set GPU device (your AMD GPU)
set GPU_DEVICE_ORDINAL=0
set HIP_VISIBLE_DEVICES=0
set ROCR_VISIBLE_DEVICES=0

REM Optional: Set context length for better performance
set OLLAMA_CONTEXT_LENGTH=8192

REM Start Ollama with GPU support
echo Starting Ollama with GPU support...
ollama serve

pause