import axios from 'axios';

const API_URL = 'http://103.72.99.132:3000/api/favorites';

// Lấy danh sách món ăn yêu thích của user
export const getFavorites = async (token: string) => {
  try {
    // GET /api/favorites/user/:userId
    if (!token) return [];
    const res = await axios.get(`${API_URL}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Sử dụng token để xác thực
      },
    });
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
export const addFavorite = async (token: string, recipeId: string) => {
  try {
    if (!token || !recipeId) throw new Error('Missing token or recipeId');

    const res = await axios.post(`${API_URL}`, { recipeId }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (e) {
    console.error('Error adding favorite:', e?.response?.data || e);
    throw e;
  }
};

// Xóa món ăn khỏi danh sách yêu thích (DELETE /api/favorites/:favoriteId)
export const removeFavorite = async (token: string, favoriteId: string) => {
  try {
    if (!favoriteId || !token) throw new Error('Missing favoriteId or token');
    const res = await axios.delete(`${API_URL}/${favoriteId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (e) {
    console.error('Error removing favorite:', e?.response?.data || e);
    throw e;
  }
};

// Tìm favoriteId theo userId và recipeId từ danh sách favorites
export const findFavoriteId = (favorites: any[], recipeId: string) => {
  const fav = favorites.find((f: any) => {
    // We are now expecting f.recipeId to be an object with an 'id' property,
    // or directly the recipe ID if it's not populated.
    return f.recipeId?.id === recipeId || f.recipeId === recipeId;
  });
  // Assuming the favorite object itself will have an 'id' property for its own ID
  return fav?.id ? fav.id : null;
};