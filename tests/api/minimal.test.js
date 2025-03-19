import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

// Test that API is accessible
test('API is accessible', async () => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    expect(response.status).toBe(200);
  } catch (error) {
    console.error('Error accessing API:', error.message);
    throw error;
  }
});
