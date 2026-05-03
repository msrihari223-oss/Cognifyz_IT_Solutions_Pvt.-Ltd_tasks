# Express Middleware + Redis Background Jobs + Caching

This project implements the requested steps:

1. middleware for request processing (`express.json`, `morgan`, custom request logging)
2. background tasks using Redis and BullMQ
3. server-side caching using Redis for optimized performance

## Step-by-step setup

1. Install dependencies:

```powershell
npm install
```

2. Copy environment variables:

```powershell
copy .env.example .env
```

3. Start Redis:

- With Docker (recommended):

```powershell
docker run --name redis -p 6379:6379 redis:alpine
```

- If Docker is not installed, start Redis locally. On Windows with WSL:

```powershell
wsl sudo apt update
wsl sudo apt install redis-server
wsl sudo service redis-server start
```

- Or use a Redis host and set `REDIS_URL` in `.env`:

```env
REDIS_URL=redis://<host>:<port>
```

4. Start the web server:

```powershell
npm run start
```

5. Start the background worker in another terminal:

```powershell
npm run worker
```

6. Use the API endpoints:

- `GET http://localhost:4000/` - health check
- `GET http://localhost:4000/data?key=...` - cached data response
- `POST http://localhost:4000/task` - enqueue a background task
- `GET http://localhost:4000/task/:id` - check task status

## Example requests

```powershell
curl http://localhost:4000/data?key=hello
curl -X POST http://localhost:4000/task -H "Content-Type: application/json" -d '{"taskType":"sendEmail","payload":{"email":"me@example.com"}}'
```

## Important

If you see `ECONNREFUSED 127.0.0.1:6379`, Redis is not running or not reachable on the configured port. Start Redis first, then restart `npm run start` and `npm run worker`.

## Project files

- `app.js` - Express app, middleware, caching, task enqueue endpoints
- `worker.js` - BullMQ worker processing background jobs
- `lib/redisClient.js` - Redis connection helper
- `lib/taskQueue.js` - BullMQ queue initialization
