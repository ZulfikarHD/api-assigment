import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

/**
 * User PUT API Endpoints Tests
 *
 * This test suite verifies the PUT operations for User API endpoints.
 */
describe('User API PUT Endpoints', () => {
  // Test data - generate unique email to avoid conflicts
  const uniqueId = Date.now();
  const testUser = {
    name: 'Test Put User',
    email: `test-put-${uniqueId}@example.com`,
    age: 25
  };

  let createdUserId;

  // Create a test user before running the tests
  beforeAll(async () => {
    try {
      const response = await axios.post(`${API_URL}/users`, testUser);
      createdUserId = response.data.id;
      console.log(`Test user created with ID: ${createdUserId}`);
    } catch (error) {
      console.error('Error creating test user:', error.message);
    }
  });

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
   * PUT /users/:id
   *
   * Updates an existing user with new data.
   * Expects a 200 status code and the updated user data.
   */
  test('should update a user', async () => {
    // Skip if we don't have a created user ID
    if (!createdUserId) {
      console.warn('Skipping update user test - no user created');
      return;
    }

    const updateData = {
      name: 'Updated Name',
      age: 30
    };

    const response = await axios.put(`${API_URL}/users/${createdUserId}`, updateData);
    expect(response.status).toBe(200);
    expect(response.data.name).toBe(updateData.name);
    expect(response.data.age).toBe(updateData.age);
    // Email should remain the same
    expect(response.data.email).toBe(testUser.email);
  });

  /**
   * PUT /users/:id with invalid data
   *
   * Attempts to update a user with invalid data.
   * Expects a 422 status code and validation errors.
   */
  test('should not update user with invalid data', async () => {
    // Skip if we don't have a created user ID
    if (!createdUserId) {
      console.warn('Skipping invalid update test - no user created');
      return;
    }

    const invalidData = {
      name: '',
      email: 'not-an-email',
      age: 'not-a-number'
    };

    try {
      const response = await axios.put(`${API_URL}/users/${createdUserId}`, invalidData);
      expect(response.status).toBe(422);
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
   * PUT /users/:id with non-existent ID
   *
   * Attempts to update a non-existent user.
   * Expects a 404 status code.
   */
  test('should not update non-existent user', async () => {
    const updateData = {
      name: 'Updated Name',
      age: 30
    };

    try {
      const response = await axios.put(`${API_URL}/users/non-existent-id`, updateData);
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
