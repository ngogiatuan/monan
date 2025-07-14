import axios from 'axios';

const API_URL = 'http://103.72.99.132:3000/api'; // Đảm bảo đây là URL API chính xác của bạn

export const getRecipes = async (page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/recipes?page=${page}&limit=${limit}`);
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
    return res.data?.data || null;
  } catch (e) {
    console.log('Error fetching recipe by ID:', e);
    return null;
  }
};

export const countRecipe = async (id: string) => {
  try {
    const res = await axios.get(`${API_URL}/recipes/cook/${id}`);
    return res.data?.data || null;
  } catch (error) {
    console.log('Error fetching recipe count by ID:', error);
    return null;
  }
};

export const searchRecipesByIngredientsPost = async (ingredientsString: string) => {
  try {
    const payload = {
      ingredients: ingredientsString,
    };
    const res = await axios.post(`${API_URL}/recipes/ingredients`, payload);
    return res.data?.data || [];
  } catch (e: any) {
    console.log('Error searching recipes by ingredients via POST:', e.response?.data || e.message);
    throw e;
  }
};

export const searchRecipesByIngredientsGet = async (ingredients: string) => {
  try {
    const response = await axios.get(`${API_URL}/recipes/ingredients`, {
      params: {
        ingredients: ingredients,
      },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error searching recipes by ingredients via GET:', error);
    throw error;
  }
};

export const searchRecipesByIngredientsPremium = async (ingredientsString: string) => {
  try {
    const payload = {
      ingredients: ingredientsString,
    };
    const res = await axios.post(`${API_URL}/recipes/ingredients`, payload);
    return res.data?.data || [];
  } catch (e: any) {
    console.log('Error searching recipes by ingredients via POST:', e.response?.data || e.message);
    return [];
  }
};

// Thêm API lấy thống kê tổng thời gian và tổng số món đã nấu theo userId
export const getRecipeStatsByUser = async (userId: string) => {
  try {
    if (!userId) return { totalTime: 0, totalRecipes: 0 };
    // Giả sử backend có endpoint /recipes/stats/:userId trả về { totalTime, totalRecipes }
    const res = await axios.get(`${API_URL}/recipes/stats/${userId}`);
    // totalTime: tổng số giây, totalRecipes: số lượng món đã nấu
    return res.data?.data || { totalTime: 0, totalRecipes: 0 };
  } catch (e) {
    console.log('Error fetching recipe stats by user:', e);
    return { totalTime: 0, totalRecipes: 0 };
  }
};