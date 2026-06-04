# Collector

A lightweight, autonomous dataset collection agent for Railway.

## Features

✅ **Simple REST API** - Trigger collections via HTTP
✅ **Multiple Sources** - HTTP APIs, local files, databases
✅ **Heartbeat System** - Keep-alive monitoring with webhook support
✅ **Job Tracking** - Track collection status and results
✅ **Railway Ready** - Deploy in minutes

## Quick Start

### Installation

```bash
npm install
```

### Configuration

Create `.env` file:

```env
PORT=3000
NODE_ENV=development

# Heartbeat (optional)
HEARTBEAT_ENABLED=true
HEARTBEAT_INTERVAL=30000
HEARTBEAT_WEBHOOK_URL=https://your-webhook.com/heartbeat

# Collector
COLLECTOR_TIMEOUT=30000
COLLECTOR_MAX_RETRIES=3

# Logging
LOG_LEVEL=info
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```bash
GET /health
```
Response:
```json
{
  "status": "healthy",
  "timestamp": "2026-06-04T...",
  "uptime": 1234.5
}
```

### Trigger Collection
```bash
POST /api/collect
Content-Type: application/json

{
  "source": "http",
  "url": "https://api.example.com/data",
  "method": "GET",
  "headers": {}
}
```
Response:
```json
{
  "jobId": "uuid",
  "status": "collecting"
}
```

### List Jobs
```bash
GET /api/jobs
```
Response:
```json
{
  "total": 1,
  "jobs": [
    {
      "id": "uuid",
      "source": "http",
      "status": "completed",
      "recordsCollected": 150,
      "createdAt": "2026-06-04T...",
      "updatedAt": "2026-06-04T..."
    }
  ]
}
```

### Get Job Details
```bash
GET /api/jobs/:jobId
```

### Retrieve Data
```bash
GET /api/data?jobId=uuid&limit=100&offset=0
```
Response:
```json
{
  "jobId": "uuid",
  "total": 150,
  "limit": 100,
  "offset": 0,
  "data": [...]
}
```

## Heartbeat System

The heartbeat system periodically checks application health and can send data to a webhook.

**Features:**
- Memory usage monitoring
- Job count tracking
- Configurable intervals
- Optional webhook notifications

**Configure:**
```env
HEARTBEAT_ENABLED=true
HEARTBEAT_INTERVAL=30000
HEARTBEAT_WEBHOOK_URL=https://your-webhook.com/heartbeat
```

**Heartbeat Payload:**
```json
{
  "timestamp": "2026-06-04T...",
  "status": "healthy|degraded|unhealthy",
  "uptime": 12345,
  "jobsProcessed": 5,
  "activeConnections": 0,
  "memoryUsage": {
    "heapUsed": 1234567,
    "heapTotal": 2345678
  }
}
```

## Deployment on Railway

1. **Push to GitHub**
```bash
git push origin main
```

2. **Connect to Railway**
```bash
railway link
railway up
```

3. **Set Environment Variables**
- Go to Railway dashboard
- Add variables from `.env`

4. **Deploy**
```bash
railway deploy
```

## Supported Data Sources

### HTTP API
```json
{
  "source": "http",
  "url": "https://api.example.com/data",
  "method": "GET",
  "headers": { "Authorization": "Bearer token" }
}
```

### Local File (JSON/CSV)
```json
{
  "source": "file",
  "url": "/path/to/file.json"
}
```

### Database Query
```json
{
  "source": "database",
  "query": "SELECT * FROM table"
}
```

## License

MIT
