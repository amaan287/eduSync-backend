import { Context, Env, Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { DatabaseConfig } from '@/config/database';
import { CloudinaryConfig } from '@/config/cloudinary';
import { errorHandler } from '@/middlewares/errorHandler';

// Import routes
import authRoutes from '@/routes/auth.routes';
import courseRoutes from '@/routes/course.routes';
import enrollmentRoutes from '@/routes/enrollment.routes';
import progressRoutes from '@/routes/progress.routes';
import studentRoutes from '@/routes/student.routes';

// Initialize configurations
const db = DatabaseConfig.getInstance();
const cloudinary = CloudinaryConfig.getInstance();

// Create Hono app
const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', cors());

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', message: 'EduSync API is running' });
});

// API Routes
app.route('/api/auth', authRoutes);
app.route('/api/courses', courseRoutes);
app.route('/api/enrollments', enrollmentRoutes);
app.route('/api/progress', progressRoutes);
app.route('/api/student', studentRoutes);

// Error handling
app.onError(errorHandler);

// Start server
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect to database
    await db.connect();
    
    // Initialize Cloudinary
    cloudinary.initialize();

    console.log(`\n🚀 Server is running on port ${PORT}`);
    console.log(`📚 EduSync Backend - Offline-First E-Learning Platform\n`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

export default {
  port: PORT,
  fetch: app.fetch,
};

