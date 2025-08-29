import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRateLimiter } from '../../src/middleware/rate-limit';

describe('Rate Limiter', () => {
  let mockContext: any;
  let mockNext: any;
  let rateLimiter: any;

  beforeEach(() => {
    mockNext = vi.fn();
    mockContext = {
      req: {
        header: vi.fn(),
      },
      json: vi.fn(),
      header: vi.fn(),
    };
  });

  describe('createRateLimiter', () => {
    it('should allow requests within limit', async () => {
      rateLimiter = createRateLimiter({
        windowMs: 60000,
        max: 5,
      });

      mockContext.req.header.mockReturnValue('192.168.1.1');

      // Make 5 requests (within limit)
      for (let i = 0; i < 5; i++) {
        await rateLimiter(mockContext, mockNext);
        expect(mockNext).toHaveBeenCalled();
        mockNext.mockClear();
      }
    });

    it('should block requests exceeding limit', async () => {
      rateLimiter = createRateLimiter({
        windowMs: 60000,
        max: 2,
        message: 'Too many requests',
      });

      mockContext.req.header.mockReturnValue('192.168.1.2');

      // First two requests should pass
      await rateLimiter(mockContext, mockNext);
      expect(mockNext).toHaveBeenCalled();
      mockNext.mockClear();

      await rateLimiter(mockContext, mockNext);
      expect(mockNext).toHaveBeenCalled();
      mockNext.mockClear();

      // Third request should be blocked
      await rateLimiter(mockContext, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Too many requests' },
        429
      );
    });

    it('should set rate limit headers', async () => {
      rateLimiter = createRateLimiter({
        windowMs: 60000,
        max: 10,
      });

      mockContext.req.header.mockReturnValue('192.168.1.3');

      await rateLimiter(mockContext, mockNext);

      expect(mockContext.header).toHaveBeenCalledWith('X-RateLimit-Limit', '10');
      expect(mockContext.header).toHaveBeenCalledWith('X-RateLimit-Remaining', '9');
      expect(mockContext.header).toHaveBeenCalledWith(
        'X-RateLimit-Reset',
        expect.any(String)
      );
    });

    it('should use custom key generator', async () => {
      const keyGenerator = vi.fn().mockReturnValue('custom-key');
      
      rateLimiter = createRateLimiter({
        windowMs: 60000,
        max: 1,
        keyGenerator,
      });

      await rateLimiter(mockContext, mockNext);

      expect(keyGenerator).toHaveBeenCalledWith(mockContext);
    });

    it('should reset limits after window expires', async () => {
      vi.useFakeTimers();
      
      rateLimiter = createRateLimiter({
        windowMs: 1000, // 1 second window
        max: 1,
      });

      mockContext.req.header.mockReturnValue('192.168.1.4');

      // First request should pass
      await rateLimiter(mockContext, mockNext);
      expect(mockNext).toHaveBeenCalled();
      mockNext.mockClear();

      // Second request should be blocked
      await rateLimiter(mockContext, mockNext);
      expect(mockNext).not.toHaveBeenCalled();
      mockNext.mockClear();
      mockContext.json.mockClear();

      // Advance time past the window
      vi.advanceTimersByTime(1100);

      // Third request should pass (new window)
      await rateLimiter(mockContext, mockNext);
      expect(mockNext).toHaveBeenCalled();

      vi.useRealTimers();
    });
  });
});