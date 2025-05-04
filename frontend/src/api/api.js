import axios from 'axios';

const API_URL = 'http://localhost:4000';

export const getSubjects = async () => {
  const response = await axios.get(`${API_URL}/subjects`);
  return response.data;
};

export const getFaculty = async () => {
  const response = await axios.get(`${API_URL}/faculty`);
  return response.data;
};
