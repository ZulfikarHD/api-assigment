import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

/**
 * User POST API Endpoints Tests
 *
 * This test suite verifies the POST operations for User API endpoints.
 */
describe('User API POST Endpoints', () => {
  // Test data - generate unique email to avoid conflicts
  const uniqueId = Date.now();
  const testUser = {
    name: 'Test Post User',
    email: `test-post-${uniqueId}@example.com`,
    age: 25
  };

  let createdUserId;

  // Clean up after tests
  afterAll(async () => {
    if (createdUserId) {
      try {
        await axios.delete(`${API_URL}/users/${createdUserId}`);
        console.log(`Test user deleted with ID: ${createdUserId}`);
      } catch (error) {
        console.error('Error deleting test user:', error.message);
      }
    }
  });

  /**
   * POST /users
   *
   * Creates a new user with the provided test data.
   * Expects a 201 status code and the created user data.
   */
  test('should create a new user', async () => {
    const response = await axios.post(`${API_URL}/users`, testUser);
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.name).toBe(testUser.name);
    expect(response.data.email).toBe(testUser.email);
    expect(response.data.age).toBe(testUser.age);

    // Save ID for later tests
    createdUserId = response.data.id;
  });

  /**
   * Validation Tests
   *
   * Tests the API's validation by attempting to create a user with invalid data.
   * Expects a 422 status code and validation errors.
   */
  test('should not create user with invalid data', async () => {
    const invalidUser = {
      name: '',
      email: 'not-an-email',
      age: 'not-a-number'
    };

    try {
      const response = await axios.post(`${API_URL}/users`, invalidUser);
      expect(response.status).toBe(422);
      expect(response.data).toHaveProperty('errors');
    } catch (error) {
      if (error.response) {
        expect(error.response.status).toBe(422);
        expect(error.response.data).toHaveProperty('errors');
      } else {
        throw error;
      }
    }
  });

  /**
   * Unique Email Test
   *
   * Tests the API's validation of unique email addresses.
   * Expects a 422 status code when trying to create a user with an existing email.
   */
  test('should not create user with duplicate email', async () => {
    // Skip if the test user wasn't created
    if (!createdUserId) {
      console.warn('Skipping duplicate email test - no user created');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users`, testUser);
      expect(response.status).toBe(422);
    } catch (error) {
      if (error.response) {
        expect(error.response.status).toBe(422);
        expect(error.response.data).toHaveProperty('errors');
        expect(error.response.data.errors).toHaveProperty('email');
      } else {
        throw error;
      }
    }
  });
});
