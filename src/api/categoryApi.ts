// categoryApi.js

import axios from 'axios';



const API_BASE_URL = 'http://103.72.99.132:3000'; // Thay thế bằng URL API Backend của bạn



export const getAllCategories = async () => {

  try {

    const response = await axios.get(`${API_BASE_URL}/categories`); // Ví dụ: endpoint /categories

    if (response.data && response.data.success) { // Tùy thuộc vào cấu trúc response của BE

      return response.data.categories; // Hoặc response.data.data, response.data.items, v.v.

    }

    return []; // Trả về mảng rỗng nếu không có dữ liệu

  } catch (error) {

    console.error('Error in getAllCategories API:', error);

    throw error; // Ném lỗi để FE có thể bắt và xử lý

  }

};