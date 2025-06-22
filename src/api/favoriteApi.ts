import axios from 'axios';

const API_URL = 'http://103.72.99.132:3000/api/favorites';

// Lấy danh sách món ăn yêu thích của user
export const getFavorites = async (userId: string) => {
  try {
    // GET /api/favorites/user/:userId
    if (!userId) return [];
    const res = await axios.get(`${API_URL}/user/${userId}`);
    // Một số API trả về {data: []}, một số trả về [] trực tiếp
    if (Array.isArray(res.data)) return res.data;
    if (res.data?.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  } catch (e) {
    console.error('Error fetching favorites:', e?.response?.data || e);
    return [];
  }
};

// Thêm món ăn vào danh sách yêu thích (POST /api/favorites)
export const addFavorite = async (userId: string, recipeId: string) => {
  try {
    if (!userId || !recipeId) throw new Error('Missing userId or recipeId');
    const res = await axios.post(`${API_URL}`, { userId, recipeId });
    return res.data;
  } catch (e) {
    console.error('Error adding favorite:', e?.response?.data || e);
    throw e;
  }
};

// Xóa món ăn khỏi danh sách yêu thích (DELETE /api/favorites/:favoriteId)
export const removeFavorite = async (favoriteId: string) => {
  try {
    if (!favoriteId) throw new Error('Missing favoriteId');
    const res = await axios.delete(`${API_URL}/${favoriteId}`);
    return res.data;
  } catch (e) {
    console.error('Error removing favorite:', e?.response?.data || e);
    throw e;
  }
};

// Tìm favoriteId theo userId và recipeId từ danh sách favorites
export const findFavoriteId = (favorites: any[], recipeId: string) => {
  const fav = favorites.find((f: any) => f.recipeId === recipeId);
  return fav ? fav._id : null;
};
