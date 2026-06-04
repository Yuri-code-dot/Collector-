import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database
  database: {
    url: process.env.DATABASE_URL || 'postgresql://localhost/collector',
    type: (process.env.DB_TYPE as 'postgres' | 'mongodb') || 'postgres',
  },

  // Heartbeat
  heartbeat: {
    enabled: process.env.HEARTBEAT_ENABLED !== 'false',
    interval: parseInt(process.env.HEARTBEAT_INTERVAL || '30000'), // 30 seconds
    webhookUrl: process.env.HEARTBEAT_WEBHOOK_URL || '',
  },

  // Collector defaults
  collector: {
    timeout: parseInt(process.env.COLLECTOR_TIMEOUT || '30000'), // 30 seconds
    maxRetries: parseInt(process.env.COLLECTOR_MAX_RETRIES || '3'),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
