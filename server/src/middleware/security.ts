import helmet from 'helmet';
import { Express } from 'express';
import { config } from '../config/env';

export const setupSecurity = (app: Express): void => {
  // Helmet for security headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // CORS configuration
  app.use((req, res, next) => {
    // Allow all origins in development, specific origin in production
    const origin = config.nodeEnv === 'development' 
      ? req.headers.origin || config.cors.origin
      : config.cors.origin;
    
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Expose-Headers', 'Content-Length, X-Total-Count');

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });
};
