import axios from 'axios';

const API_URL = 'http://103.72.99.132:3000/api';

export const getRecipes = async (page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/recipes?page=${page}&limit=${limit}`);
    return res.data?.data || [];
  } catch (e) {
    console.log('Error fetching recipes:', e);
    return [];
  }
};

