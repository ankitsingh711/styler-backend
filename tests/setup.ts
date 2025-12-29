// Test setup file
import { config } from '../src/config/environment';

// Set test environment
process.env.NODE_ENV = 'test';

// Global test setup
beforeAll(async () => {
    // Setup code before all tests
});

// Global test teardown
afterAll(async () => {
    // Cleanup code after all tests
});

// Global test hooks
beforeEach(() => {
    // Setup before each test
});

afterEach(() => {
    // Cleanup after each test
});
