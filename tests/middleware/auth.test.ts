import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authMiddleware, generateToken, getCookie, setCookie } from '../../src/middleware/auth';
import { Context } from 'hono';
import jwt from 'jsonwebtoken';

describe('Auth Middleware', () => {
  let mockContext: any;
  let mockNext: any;

  beforeEach(() => {
    mockNext = vi.fn();
    mockContext = {
      req: {
        header: vi.fn(),
      },
      json: vi.fn(),
      set: vi.fn(),
      header: vi.fn(),
      env: {
        JWT_SECRET: 'test-secret',
      },
    };
  });

  describe('authMiddleware', () => {
    it('should reject requests without a token', async () => {
      mockContext.req.header.mockReturnValue(undefined);

      await authMiddleware(mockContext, mockNext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Unauthorized' }, 401);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept valid tokens and set user context', async () => {
      const userPayload = {
        id: 1,
        email: 'test@example.com',
        isAdmin: false,
        isApproved: true,
      };
      
      const token = jwt.sign(userPayload, 'test-secret');
      mockContext.req.header.mockImplementation((name: string) => {
        if (name === 'Cookie') return `auth-token=${token}`;
        return undefined;
      });

      await authMiddleware(mockContext, mockNext);

      expect(mockContext.set).toHaveBeenCalledWith('user', expect.objectContaining({
        id: userPayload.id,
        email: userPayload.email,
        isAdmin: userPayload.isAdmin,
        isApproved: userPayload.isApproved,
      }));
      expect(mockNext).toHaveBeenCalled();
    });

    it('should reject invalid tokens', async () => {
      mockContext.req.header.mockImplementation((name: string) => {
        if (name === 'Cookie') return 'auth-token=invalid-token';
        return undefined;
      });

      await authMiddleware(mockContext, mockNext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Invalid token' }, 401);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userPayload = {
        id: 1,
        email: 'test@example.com',
        isAdmin: false,
        isApproved: true,
      };

      const token = generateToken(userPayload, mockContext);
      
      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      
      // Verify the token can be decoded
      const decoded = jwt.verify(token, 'test-secret') as any;
      expect(decoded.id).toBe(userPayload.id);
      expect(decoded.email).toBe(userPayload.email);
    });
  });

  describe('getCookie', () => {
    it('should extract cookie value from header', () => {
      mockContext.req.header.mockReturnValue('auth-token=abc123; other=value');
      
      const value = getCookie(mockContext, 'auth-token');
      
      expect(value).toBe('abc123');
    });

    it('should return undefined if cookie not found', () => {
      mockContext.req.header.mockReturnValue('other=value');
      
      const value = getCookie(mockContext, 'auth-token');
      
      expect(value).toBeUndefined();
    });
  });

  describe('setCookie', () => {
    it('should set a secure cookie with proper flags', () => {
      setCookie(mockContext, 'test-cookie', 'test-value');
      
      expect(mockContext.header).toHaveBeenCalledWith(
        'Set-Cookie',
        expect.stringContaining('test-cookie=test-value')
      );
      expect(mockContext.header).toHaveBeenCalledWith(
        'Set-Cookie',
        expect.stringContaining('HttpOnly')
      );
      expect(mockContext.header).toHaveBeenCalledWith(
        'Set-Cookie',
        expect.stringContaining('Secure')
      );
      expect(mockContext.header).toHaveBeenCalledWith(
        'Set-Cookie',
        expect.stringContaining('SameSite=Lax')
      );
    });
  });
});