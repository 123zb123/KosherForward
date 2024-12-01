import dotenv from 'dotenv';
import { jest } from '@jest/globals';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Ensure we're in test mode
process.env.NODE_ENV = 'test';

// Silence console in test mode unless DEBUG is set
if (!process.env.DEBUG) {
  global.console = {
    ...console,
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
  };
}

// Global test setup
beforeAll(async () => {
  // Add any global setup here
});

// Global test teardown
afterAll(async () => {
  // Add any global cleanup here
});

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
}); 