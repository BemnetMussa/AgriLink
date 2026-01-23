import express, { Express } from 'express';
import { config } from './config/env';
import { setupSecurity } from './middleware/security';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import routes from './routes';
import logger from './utils/logger';
import prisma from './config/database';






// Create Express app
const app: Express = express();

// Security middleware
setupSecurity(app);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(apiLimiter);

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  });
  next();
});

// API routes
app.use(routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Test database connection
    await prisma.$connect();
    logger.info('Database connected successfully');

    // Start HTTP server with port conflict handling
    const server = app.listen(config.port, () => {
      logger.info(`🚀 AgriLink API server running on port ${config.port}`);
      logger.info(`📝 Environment: ${config.nodeEnv}`);
      logger.info(`🔗 API Base URL: http://localhost:${config.port}/api/${config.apiVersion}`);
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        logger.error('');
        logger.error('🔴 PORT CONFLICT ERROR');
        logger.error('');
        logger.error(`Port ${config.port} is already in use.`);
        logger.error('');
        logger.error('📋 FIX STEPS:');
        logger.error(`1. Kill the process using port ${config.port}:`);
        logger.error(`   Windows: netstat -ano | findstr :${config.port}`);
        logger.error(`   Then: taskkill /PID <PID> /F`);
        logger.error(`   Or run: .\\kill-port.ps1`);
        logger.error('');
        logger.error(`2. Or change the port in .env: PORT=5001`);
        logger.error('');
        process.exit(1);
      } else {
        throw error;
      }
    });
  } catch (error: any) {
    logger.error('Failed to start server:', error);
    
    // Provide helpful error messages for common issues
    if (error?.code === 'P1001' || error?.message?.includes('Can\'t reach database')) {
      logger.error('');
      logger.error('🔴 MONGODB CONNECTION ERROR');
      logger.error('');
      logger.error('Most likely cause: IP address not whitelisted in MongoDB Atlas');
      logger.error('');
      logger.error('📋 FIX STEPS:');
      logger.error('1. Go to: https://cloud.mongodb.com/');
      logger.error('2. Click "Network Access" (left sidebar)');
      logger.error('3. Click "Add IP Address"');
      logger.error('4. Click "Add Current IP Address" (or add 0.0.0.0/0 for testing)');
      logger.error('5. Wait 1-2 minutes, then try again');
      logger.error('');
      logger.error('💡 Quick test: Allow all IPs (0.0.0.0/0) for development');
      logger.error('   ⚠️  Remember to restrict this later for production!');
      logger.error('');
    } else if (error?.message?.includes('did not initialize')) {
      logger.error('');
      logger.error('🔴 PRISMA CLIENT ERROR');
      logger.error('');
      logger.error('Run: npm run prisma:generate');
      logger.error('');
    }
    
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start the server
startServer();

export default app;
