// API Configuration
// Change this URL when you deploy your backend
export const API_URL = import.meta.env.PROD 
  ? 'https://your-backend-url.onrender.com'  // Replace with your deployed backend URL
  : 'http://localhost:3001';  // Local development URL

export const API_ENDPOINTS = {
  saveName: `${API_URL}/api/save-name`,
  getNames: `${API_URL}/api/get-names`,
  clearNames: `${API_URL}/api/clear-names`,
  getCount: `${API_URL}/api/count`,
};
