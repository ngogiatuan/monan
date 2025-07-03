import axios from 'axios';

const API_URL = 'http://103.72.99.132:3000/api';

export const getRecipes = async (page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/recipes?page=${page}&limit=${limit}`);
    // Assuming the API returns an array of recipes with 'id' instead of '_id'
    return res.data?.data || [];
  } catch (e) {
    console.log('Error fetching recipes:', e);
    return [];
  }
};

export const getRecipeById = async (id) => {
  try {
    if (!id) {
      console.log('No recipe ID provided');
      return null;
    }
    const res = await axios.get(`${API_URL}/recipes/${id}`);
    // Assuming the API returns a single recipe object with 'id' instead of '_id'
    return res.data?.data || null;
  } catch (e) {
    console.log('Error fetching recipe by ID:', e);
    return null;
  }
};

export const countRecipe = async (id: string) => {
  try {
    const res = await  axios.get(`${API_URL}/recipes/cook/${id}`);
    return res.data?.data || null
  } catch (error) {
     console.log('Error fetching recipe count by ID:', error);
    return null;
  }
};