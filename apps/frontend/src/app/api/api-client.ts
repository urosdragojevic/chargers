import axios from 'axios';

const username = 'uros';
const password = 'uros';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + btoa(username + ':' + password),
  },
});
export default apiClient;
