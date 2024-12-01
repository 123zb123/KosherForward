import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that we want to link the colors
winston.addColors(colors);

const createLogger = () => {
  // Determine if we should silence logs
  const isTesting = process.env.NODE_ENV === 'test';
  const silentMode = isTesting && !process.env.DEBUG;

  // Custom log format
  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info: winston.Logform.TransformableInfo) => {
        const { timestamp, level, message, ...rest } = info;
        const meta = Object.keys(rest).length ? JSON.stringify(rest, null, 2) : '';
        return `${timestamp} ${level}: ${message}${meta ? `\n${meta}` : ''}`;
      }
    ),
  );

  // Define which transports the logger must use
  const transports = [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
      silent: silentMode,
    }),
    
    // Error log file transport
    new DailyRotateFile({
      filename: path.join('logs', 'error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'error',
      silent: silentMode,
    }),
    
    // All logs file transport
    new DailyRotateFile({
      filename: path.join('logs', 'combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      silent: silentMode,
    }),
  ];

  return winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    levels,
    format: logFormat,
    transports,
    silent: silentMode,
  });
};

let logger = createLogger();

// Create a stream object with a 'write' function that will be used by morgan
const stream = {
  write: (message: string) => {
    const isTesting = process.env.NODE_ENV === 'test';
    const silentMode = isTesting && !process.env.DEBUG;
    if (!silentMode) {
      logger.http(message.trim());
    }
  },
};

// Export a function to reinitialize the logger
export const reinitializeLogger = () => {
  logger = createLogger();
};

export { logger, stream }; 