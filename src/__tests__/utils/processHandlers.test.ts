import { jest } from '@jest/globals';
import { setupProcessHandlers } from '../../utils/processHandlers';
import { logger } from '../../utils/logger';

describe('Process Handlers', () => {
  let mockExit: ReturnType<typeof jest.spyOn>;
  let mockLogger: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    mockLogger = jest.spyOn(logger, 'error');
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should handle uncaught exceptions', () => {
    setupProcessHandlers();
    
    const error = new Error('Test uncaught exception');
    const emit = process.emit.bind(process);
    emit('uncaughtException', error);

    expect(mockLogger).toHaveBeenCalledWith('Uncaught Exception:', expect.any(Object));
    expect(mockExit).toHaveBeenCalledWith(1);
  });

  it('should handle unhandled rejections', () => {
    setupProcessHandlers();
    
    const reason = new Error('Test unhandled rejection');
    const emit = process.emit.bind(process);
    emit('unhandledRejection' as any, reason);

    expect(mockLogger).toHaveBeenCalledWith('Unhandled Rejection:', expect.any(Object));
    expect(mockExit).toHaveBeenCalledWith(1);
  });
}); 