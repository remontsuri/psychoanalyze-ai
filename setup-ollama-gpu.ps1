# PowerShell script to set up Ollama GPU support
Write-Host "Setting up Ollama GPU environment variables..." -ForegroundColor Green

# Set environment variables for current session
$env:OLLAMA_VULKAN = "1"
$env:GPU_DEVICE_ORDINAL = "0"
$env:HIP_VISIBLE_DEVICES = "0"
$env:ROCR_VISIBLE_DEVICES = "0"
$env:OLLAMA_CONTEXT_LENGTH = "8192"

# Set permanent environment variables (requires admin rights)
try {
    [Environment]::SetEnvironmentVariable("OLLAMA_VULKAN", "1", "User")
    [Environment]::SetEnvironmentVariable("GPU_DEVICE_ORDINAL", "0", "User")
    [Environment]::SetEnvironmentVariable("HIP_VISIBLE_DEVICES", "0", "User")
    [Environment]::SetEnvironmentVariable("ROCR_VISIBLE_DEVICES", "0", "User")
    [Environment]::SetEnvironmentVariable("OLLAMA_CONTEXT_LENGTH", "8192", "User")
    Write-Host "Environment variables set permanently!" -ForegroundColor Green
} catch {
    Write-Host "Could not set permanent variables. Run as administrator if needed." -ForegroundColor Yellow
}

Write-Host "Current Ollama GPU settings:" -ForegroundColor Cyan
Write-Host "OLLAMA_VULKAN: $env:OLLAMA_VULKAN"
Write-Host "GPU_DEVICE_ORDINAL: $env:GPU_DEVICE_ORDINAL"
Write-Host "HIP_VISIBLE_DEVICES: $env:HIP_VISIBLE_DEVICES"

Write-Host "`nNow restart Ollama with: ollama serve" -ForegroundColor Yellow