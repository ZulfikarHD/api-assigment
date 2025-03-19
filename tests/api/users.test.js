import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

describe('User API Endpoints', () => {
  // Test data - generate unique email to avoid conflicts
  const uniqueId = Date.now();
  const testUser = {
    name: 'Test User',
    email: `test-${uniqueId}@example.com`,
    age: 25,
    password: 'password123'
  };

  let createdUserId;

  // Basic connectivity test
  test('API is accessible', async () => {
    const response = await axios.get(`${API_URL}/users`);
    expect(response.status).toBe(200);
  });

  // GET /users - Get all users
  test('should get all users', async () => {
    const response = await axios.get(`${API_URL}/users`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
  });

  // POST /users - Create new user
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

  // GET /users/:id - Get single user
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

  // PUT /users/:id - Update user
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
  });

  // DELETE /users/:id - Delete user
  test('should delete a user', async () => {
    // Skip if we don't have a created user ID
    if (!createdUserId) {
      console.warn('Skipping delete user test - no user created');
      return;
    }

    const response = await axios.delete(`${API_URL}/users/${createdUserId}`);
    expect(response.status).toBe(200);
    expect(response.data.message).toBe('User deleted successfully');
  });

  // Validation Tests
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

  // 404 Test
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
