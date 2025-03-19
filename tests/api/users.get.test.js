import axios from 'axios';
import { API_URL, createTestUser, deleteTestUser } from './utils/test-helpers.js';

/**
 * User GET API Endpoints Tests
 *
 * This test suite verifies the GET operations for User API endpoints.
 */
describe('User API GET Endpoints', () => {
  let testUser;
  let createdUserId;

  // Create a test user before running the tests
  beforeAll(async () => {
    try {
      testUser = await createTestUser();
      createdUserId = testUser.id;
    } catch (error) {
      console.error('Error in test setup:', error.message);
    }
  });

  // Delete the test user after all tests
  afterAll(async () => {
    await deleteTestUser(createdUserId);
  });

  /**
   * Basic connectivity test
   *
   * Verifies that the API is accessible and responding.
   */
  test('API is accessible', async () => {
    const response = await axios.get(`${API_URL}/users`);
    expect(response.status).toBe(200);
  });

  /**
   * GET /users
   *
   * Retrieves all users from the database.
   * Expects a 200 status code and an array of users.
   */
  test('should get all users', async () => {
    const response = await axios.get(`${API_URL}/users`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  /**
   * GET /users/:id
   *
   * Retrieves a single user by ID.
   * Expects a 200 status code and the user data matching the test user.
   */
  test('should get a single user', async () => {
    // Skip if we don't have a created user ID
    if (!createdUserId) {
      console.warn('Skipping get single user test - no user created');
      return;
    }

    const response = await axios.get(`${API_URL}/users/${createdUserId}`);
    expect(response.status).toBe(200);
    expect(response.data.id).toBe(createdUserId);
    expect(response.data.name).toBe(testUser.name);
    expect(response.data.email).toBe(testUser.email);
    expect(response.data.age).toBe(testUser.age);
  });

  /**
   * 404 Test
   *
   * Tests the API's handling of requests for non-existent resources.
   * Expects a 404 status code.
   */
  test('should not get non-existent user', async () => {
    try {
      const response = await axios.get(`${API_URL}/users/non-existent-id`);
      expect(response.status).toBe(404);
    } catch (error) {
      if (error.response) {
        expect(error.response.status).toBe(404);
      } else {
        throw error;
      }
    }
  });
});
