import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

/**
 * User API Validation Tests
 *
 * This test suite focuses on validating the input data requirements
 * for the User API endpoints.
 */
describe('User API Validation', () => {
  // Test data - generate unique email to avoid conflicts
  const uniqueId = Date.now();
  const validUser = {
    name: 'Test Validation User',
    email: `test-validation-${uniqueId}@example.com`,
    age: 25
  };

  let createdUserId;

  // Create a valid user to test uniqueness constraints
  beforeAll(async () => {
    try {
      const response = await axios.post(`${API_URL}/users`, validUser);
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
   * POST Validation - Missing Required Fields
   */
  test('should validate required fields', async () => {
    const missingFields = {
      // Name missing
      email: `test-missing-${uniqueId}@example.com`,
      // Age missing
    };

    try {
      const response = await axios.post(`${API_URL}/users`, missingFields);
      expect(response.status).toBe(422);
    } catch (error) {
      if (error.response) {
        expect(error.response.status).toBe(422);
        expect(error.response.data).toHaveProperty('errors');
        expect(error.response.data.errors).toHaveProperty('name');
        expect(error.response.data.errors).toHaveProperty('age');
      } else {
        throw error;
      }
    }
  });

  /**
   * POST Validation - Invalid Email Format
   */
  test('should validate email format', async () => {
    const invalidEmailUser = {
      name: 'Test Invalid Email',
      email: 'not-an-email-format',
      age: 25
    };

    try {
      const response = await axios.post(`${API_URL}/users`, invalidEmailUser);
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

  /**
   * POST Validation - Invalid Age Type
   */
  test('should validate age is a number', async () => {
    const invalidAgeUser = {
      name: 'Test Invalid Age',
      email: `test-invalid-age-${uniqueId}@example.com`,
      age: 'twenty-five'
    };

    try {
      const response = await axios.post(`${API_URL}/users`, invalidAgeUser);
      expect(response.status).toBe(422);
    } catch (error) {
      if (error.response) {
        expect(error.response.status).toBe(422);
        expect(error.response.data).toHaveProperty('errors');
        expect(error.response.data.errors).toHaveProperty('age');
      } else {
        throw error;
      }
    }
  });

  /**
   * POST Validation - Unique Email
   */
  test('should validate email uniqueness', async () => {
    // Skip if we don't have a created user ID
    if (!createdUserId) {
      console.warn('Skipping email uniqueness test - no user created');
      return;
    }

    // Try to create a user with the same email
    const duplicateEmailUser = {
      name: 'Another User',
      email: validUser.email, // Same email as the one created in beforeAll
      age: 30
    };

    try {
      const response = await axios.post(`${API_URL}/users`, duplicateEmailUser);
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

  /**
   * PUT Validation - Empty Name
   */
  test('should validate name is not empty on update', async () => {
    // Skip if we don't have a created user ID
    if (!createdUserId) {
      console.warn('Skipping empty name validation test - no user created');
      return;
    }

    const emptyNameUpdate = {
      name: '',
      age: 30
    };

    try {
      const response = await axios.put(`${API_URL}/users/${createdUserId}`, emptyNameUpdate);
      expect(response.status).toBe(422);
    } catch (error) {
      if (error.response) {
        expect(error.response.status).toBe(422);
        expect(error.response.data).toHaveProperty('errors');
        expect(error.response.data.errors).toHaveProperty('name');
      } else {
        throw error;
      }
    }
  });
});
