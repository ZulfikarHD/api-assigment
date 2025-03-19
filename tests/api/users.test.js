const axios = require('axios');

const api = axios.create({
  baseURL: process.env.API_URL,
  validateStatus: () => true // Don't throw on error status codes
});

describe('User API Endpoints', () => {
  let createdUserId;

  // Test data
  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    age: 25,
    password: 'password123'
  };

  // GET /users - Get all users
  test('should get all users', async () => {
    const response = await api.get('/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.data)).toBe(true);
    expect(response.data[0]).toHaveProperty('id');
    expect(response.data[0]).toHaveProperty('name');
    expect(response.data[0]).toHaveProperty('email');
    expect(response.data[0]).toHaveProperty('age');
  });

  // POST /users - Create new user
  test('should create a new user', async () => {
    const response = await api.post('/users', testUser);

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
    expect(response.data.name).toBe(testUser.name);
    expect(response.data.email).toBe(testUser.email);
    expect(response.data.age).toBe(testUser.age);

    // Save the ID for later tests
    createdUserId = response.data.id;
  });

  // GET /users/:id - Get single user
  test('should get a single user', async () => {
    const response = await api.get(`/users/${createdUserId}`);

    expect(response.status).toBe(200);
    expect(response.data.id).toBe(createdUserId);
    expect(response.data.name).toBe(testUser.name);
    expect(response.data.email).toBe(testUser.email);
    expect(response.data.age).toBe(testUser.age);
  });

  // PUT /users/:id - Update user
  test('should update a user', async () => {
    const updateData = {
      name: 'Updated Name',
      age: 30
    };

    const response = await api.put(`/users/${createdUserId}`, updateData);

    expect(response.status).toBe(200);
    expect(response.data.name).toBe(updateData.name);
    expect(response.data.age).toBe(updateData.age);
  });

  // DELETE /users/:id - Delete user
  test('should delete a user', async () => {
    const response = await api.delete(`/users/${createdUserId}`);

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

    const response = await api.post('/users', invalidUser);

    expect(response.status).toBe(422);
    expect(response.data).toHaveProperty('errors');
  });

  test('should not get non-existent user', async () => {
    const response = await api.get('/users/non-existent-id');

    expect(response.status).toBe(404);
  });
});