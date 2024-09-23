import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
    Authorization:
      'Basic ' +
      btoa(
        process.env['REACT_APP_USERNAME'] +
          ':' +
          process.env['REACT_APP_PASSWORD']
      ),
  },
});
export default apiClient;
