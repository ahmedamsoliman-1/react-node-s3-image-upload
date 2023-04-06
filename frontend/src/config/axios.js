import axios from 'axios';

// const baseURL = process.env.REACT_APP_API_URL_LOCAL;
const baseURL = process.env.REACT_APP_API_URL_EC2;
const USER_ID = 123;

const axiosClient = axios.create({
  baseURL,
  headers: {
    'x-user-id': USER_ID,
  },
});

export default axiosClient;
