# Multi-stage build
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage with Ollama
FROM ollama/ollama:latest

# Install Node.js
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    nginx \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install serve
RUN npm install -g serve

# Pull Ollama model
RUN ollama pull llama3.2:latest

# Expose ports
EXPOSE 3000 11434

# Start script
COPY start.sh ./
RUN chmod +x start.sh

CMD ["./start.sh"]