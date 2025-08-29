// Test setup file
import { afterAll, afterEach, beforeAll } from 'vitest';

// Mock environment variables
process.env.JWT_SECRET = 'test-jwt-secret-for-testing-only';
process.env.NODE_ENV = 'test';

// Clean up after tests
afterEach(() => {
  // Clear any test data
});

afterAll(() => {
  // Final cleanup
});