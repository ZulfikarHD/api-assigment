import axios from 'axios';

/**
 * API testing utilities
 *
 * Contains shared functions and constants used across test files.
 */

// Base URL for the API
export const API_URL = 'http://localhost:8000/api';

/**
 * Creates a test user and returns the created user object
 *
 * @param {Object} userData - The user data to create (will generate unique email if not provided)
 * @returns {Promise<Object>} The created user
 */
export const createTestUser = async (userData = {}) => {
  const uniqueId = Date.now();
  const defaultData = {
    name: `Test User ${uniqueId}`,
    email: `test-${uniqueId}@example.com`,
    age: 25
  };

  const testUserData = { ...defaultData, ...userData };

  try {
    const response = await axios.post(`${API_URL}/users`, testUserData);
    console.log(`Test user created with ID: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error('Error creating test user:', error.message);
    throw error;
  }
};

/**
 * Deletes a test user by ID
 *
 * @param {string} userId - The ID of the user to delete
 * @returns {Promise<void>}
 */
export const deleteTestUser = async (userId) => {
  if (!userId) return;

  try {
    await axios.delete(`${API_URL}/users/${userId}`);
    console.log(`Test user deleted with ID: ${userId}`);
  } catch (error) {
    console.error('Error deleting test user:', error.message);
  }
};

/**
 * Creates a unique email address
 *
 * @param {string} prefix - Optional prefix for the email
 * @returns {string} A unique email address
 */
export const createUniqueEmail = (prefix = 'test') => {
  const uniqueId = Date.now();
  return `${prefix}-${uniqueId}@example.com`;
};
