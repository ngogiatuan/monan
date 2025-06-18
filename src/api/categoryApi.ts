import axios from 'axios';

const API_URL = 'http://103.72.99.132:3000';

export const getAllCategories = async () => {
  try {
    const res = await axios.get(`${API_URL}/api/products`);
    // Trả về đúng mảng data từ API, không hardcode data vào code nữa
    return Array.isArray(res.data?.data) ? res.data.data : [];
  } catch (e) {
    console.log('Error fetching categories:', e);
    return [];
  }
};
