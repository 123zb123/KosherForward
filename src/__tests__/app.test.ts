import request from 'supertest';
import { jest } from '@jest/globals';
import { app, server } from '../app';
import { logger } from '../utils/logger';

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    server.close();
  });

  describe('GET /api/health', () => {
    it('should return 200 OK', async () => {
      const loggerSpy = jest.spyOn(logger, 'info');
      
      const response = await request(app)
        .get('/api/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        status: 'OK',
        message: 'Server is running'
      });

      expect(loggerSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors', async () => {
      const response = await request(app)
        .get('/non-existent-route')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual({
        status: 'error',
        message: 'Route /non-existent-route not found'
      });
    });

    it('should handle server errors', async () => {
      const response = await request(app)
        .get('/api/error-test')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('status', 'error');
    });
  });
}); 