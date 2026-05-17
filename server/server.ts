import express, { Request, Response } from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import { handleClerkWebhook } from './webhooks/clerkWebhook.js';

const app = express();
const port = process.env.PORT || 3000;

// JSON request body support
app.use(express.json());
app.use(cors());

// Clerk webhook endpoint
app.post(
  '/api/webhooks/clerk',
  express.raw({ type: 'application/json' }),
  handleClerkWebhook,
);

// Simple route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript!');
});

// Test POST route
app.post('/api/data', (req: Request, res: Response) => {
  const payload = req.body;
  res.json({
    message: 'Received data successfully',
    data: payload,
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
