#!/bin/bash

# Start Ollama in background
ollama serve &

# Wait for Ollama to start
sleep 10

# Pull model if not exists
ollama pull llama3.2:latest

# Start the web app
serve -s dist -l 3000