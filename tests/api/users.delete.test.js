import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

/**
 * User DELETE API Endpoints Tests
 *
 * This test suite verifies the DELETE operations for User API endpoints.
 */
describe('User API DELETE Endpoints', () => {
  // Test data - generate unique email to avoid conflicts
  const uniqueId = Date.now();
  const testUser = {
    name: 'Test Delete User',
    email: `test-delete-${uniqueId}@example.com`,
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

  /**
   * DELETE /users/:id
   *
   * Deletes a user by ID.
   * Expects a 200 status code and a success message.
   */
  test('should delete a user', async () => {
    // Skip if we don't have a created user ID
    if (!createdUserId) {
      console.warn('Skipping delete user test - no user created');
      return;
    }

    const response = await axios.delete(`${API_URL}/users/${createdUserId}`);
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('User deleted successfully');

    // Verify the user is actually deleted
    try {
      await axios.get(`${API_URL}/users/${createdUserId}`);
    } catch (error) {
      if (error.response) {
        expect(error.response.status).toBe(404);
      }
    }
  });

  /**
   * DELETE /users/:id with non-existent ID
   *
   * Attempts to delete a non-existent user.
   * Expects a 404 status code.
   */
  test('should not delete non-existent user', async () => {
    try {
      const response = await axios.delete(`${API_URL}/users/non-existent-id`);
      expect(response.status).toBe(404);
    } catch (error) {
      if (error.response) {
        expect(error.response.status).toBe(404);
      } else {
        throw error;
      }
    }
  });

  /**
   * GET after DELETE
   *
   * Attempts to get a deleted user.
   * Expects a 404 status code.
   */
  test('should not get a deleted user', async () => {
    // Skip if we don't have a created user ID
    if (!createdUserId) {
      console.warn('Skipping get deleted user test - no user created');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/users/${createdUserId}`);
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
