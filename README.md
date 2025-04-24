# BullMQ Task Scheduler

A robust task scheduler system built with TypeScript, BullMQ, and Redis that allows for long-running tasks with configurable durations. Tasks are added via HTTP API calls and remain active in Redis until explicitly removed or their TTL expires.

## Features

- 🚀 Add tasks to a queue via REST API
- ⏱️ Configure how long tasks stay in Redis via HTTP payload
- 🔒 API authentication with token-based security
- 📊 Visual dashboard for monitoring tasks
- 🔄 Horizontal scaling with multiple workers
- 🧩 Modular architecture inspired by Laravel
- 🔐 Type safety with TypeScript

## Tech Stack

- TypeScript
- Node.js
- Express.js
- BullMQ
- Redis
- Bull Board (for the dashboard)

## Prerequisites

- Node.js (v14 or higher)
- Redis server (local or remote)
- TypeScript (v4.0 or higher)

## Installation

1. Clone the repository
```bash
git clone <repository-url>
cd bullmq-task-scheduler
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit the `.env` file to configure your Redis connection and other settings.

## Configuration

The application can be configured using environment variables:

### Redis Configuration
```
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=yourpassword
```

### Server Configuration
```
PORT=3000
```

### Security
```
API_TOKEN=your-secure-api-token
```

### Worker Configuration
```
WORKER_CONCURRENCY=5
WORKER_RATE_LIMIT_MAX=5
WORKER_RATE_LIMIT_DURATION=1000
```

## Running the Application

### Build the TypeScript Code
```bash
npm run build
```

### Start the Server and Worker Together
```bash
npm start
```

### Start in Development Mode (with auto-restart)
```bash
npm run dev
```

### Run a Standalone Worker
```bash
npm run worker
```

### Run a Worker in Development Mode
```bash
npm run worker:dev
```

## Scaling

For better performance and reliability, you can run multiple worker processes:

```bash
# Terminal 1: Start the server
npm start

# Terminal 2: Start a dedicated worker
npm run worker

# Terminal 3: Start another worker
npm run worker
```

## API Endpoints

All API requests require the `x-api-token` header with your API token.

### Add a Task
```
POST /api/v1/tasks

Body:
{
  "data": {
    "key": "value"
  },
  "duration": 3600  // Time in seconds the task should remain in Redis
}

Response:
{
  "status": "success",
  "message": "Task added to queue successfully",
  "data": {
    "jobId": "task-1650823471256",
    "taskData": { "key": "value" },
    "duration": "3600 seconds"
  }
}
```

### Get All Tasks
```
GET /api/v1/tasks

Response:
{
  "status": "success",
  "results": 2,
  "data": {
    "tasks": [
      // task objects
    ]
  }
}
```

### Delete a Task
```
DELETE /api/v1/tasks/:id

Response:
{
  "status": "success",
  "message": "Job task-1650823471256 removed successfully"
}
```

## Dashboard

The BullMQ dashboard is available at:
```
http://localhost:3000/admin/queues
```

This provides a visual interface to monitor queues, jobs, and their statuses.

## Project Structure

```
├── index.ts                  # Application entry point
├── worker.ts                 # Standalone worker entry point
├── src/
│   ├── config/               # Configuration files
│   │   └── index.ts          # Centralized configuration
│   ├── controllers/          # Request handlers
│   │   └── TaskController.ts # Task operations controller
│   ├── middleware/           # Express middleware
│   │   ├── auth.ts           # Authentication middleware
│   │   └── errorHandler.ts   # Global error handling
│   ├── routes/               # API routes
│   │   ├── index.ts          # Route aggregator with versioning
│   │   └── taskRoutes.ts     # Task-specific routes
│   ├── services/             # Business logic
│   │   └── TaskService.ts    # Task operations service
│   ├── types.ts              # TypeScript type definitions
│   ├── queue.ts              # BullMQ queue configuration
│   ├── server.ts             # Express server setup
│   └── worker.ts             # Worker process configuration
```

## TypeScript Features

This project leverages TypeScript for enhanced code quality and developer experience:

- **Type Safety**: Prevents common runtime errors with compile-time checking
- **Enhanced IDE Support**: Better autocomplete and inline documentation
- **Interfaces**: Clear contracts for data structures like API responses and configurations
- **Generics**: Type-safe queue and job operations

## Customizing the Worker

To customize worker behavior, edit `src/worker.ts` and implement your specific business logic in the job processing function.

## Error Handling

The application uses centralized error handling with custom error classes. All errors are properly logged and formatted for API responses.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.