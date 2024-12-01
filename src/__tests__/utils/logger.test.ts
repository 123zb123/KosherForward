import { logger, stream, reinitializeLogger } from '../../utils/logger';
import { jest } from '@jest/globals';

describe('Logger', () => {
  // Store original NODE_ENV and DEBUG values
  const originalNodeEnv = process.env.NODE_ENV;
  const originalDebug = process.env.DEBUG;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore original environment values
    process.env.NODE_ENV = originalNodeEnv;
    process.env.DEBUG = originalDebug;
    reinitializeLogger(); // Reinitialize logger with original settings
  });

  describe('Logger Methods', () => {
    it('should have all required logging methods', () => {
      expect(logger.error).toBeDefined();
      expect(logger.warn).toBeDefined();
      expect(logger.info).toBeDefined();
      expect(logger.http).toBeDefined();
      expect(logger.debug).toBeDefined();
    });

    it('should log messages without throwing errors', () => {
      expect(() => {
        logger.info('Test message');
        logger.error('Test error');
        logger.warn('Test warning');
        logger.debug('Test debug');
        logger.http('Test http');
      }).not.toThrow();
    });
  });

  describe('Morgan Stream', () => {
    beforeEach(() => {
      // Enable logging for these tests
      process.env.DEBUG = 'true';
      reinitializeLogger(); // Reinitialize logger with new settings
    });

    it('should have a stream with write method', () => {
      expect(stream.write).toBeDefined();
      expect(typeof stream.write).toBe('function');
    });

    it('should handle HTTP logs through stream', () => {
      const spy = jest.spyOn(logger, 'http');
      stream.write('Test HTTP log\n');
      expect(spy).toHaveBeenCalledWith('Test HTTP log');
    });
  });
}); 