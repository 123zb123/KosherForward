import { AppError } from '../../utils/errors';

describe('AppError', () => {
  it('should create an error with default values', () => {
    const error = new AppError('Test error');
    expect(error.message).toBe('Test error');
    expect(error.statusCode).toBe(500);
    expect(error.isOperational).toBe(true);
  });

  it('should create an error with custom values', () => {
    const error = new AppError('Custom error', 400, false);
    expect(error.message).toBe('Custom error');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(false);
  });

  it('should have stack trace', () => {
    const error = new AppError('Test error');
    expect(error.stack).toBeDefined();
  });
}); 