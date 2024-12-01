import { Request, Response, NextFunction } from 'express';
import { jest } from '@jest/globals';
import { errorHandler } from '../../middlewares/errorHandler';
import { AppError } from '../../utils/errors';

describe('Error Handler Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      url: '/test',
      method: 'GET',
      body: {},
      query: {},
      params: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    } as unknown as Partial<Response>;

    jest.clearAllMocks();
  });

  it('should handle operational errors', () => {
    const error = new AppError('Test operational error', 400);
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Test operational error'
    });
  });

  it('should handle non-operational errors', () => {
    const error = new Error('Test system error');
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Internal Server Error'
    });
  });

  it('should include stack trace in development mode', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Test error');
    
    errorHandler(error, mockRequest as Request, mockResponse as Response, nextFunction);

    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        stack: expect.any(String)
      })
    );
  });
}); 