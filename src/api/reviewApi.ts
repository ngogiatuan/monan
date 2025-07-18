import axios from 'axios';

const API_URL = 'http://103.72.99.132:3000/api'; 

interface Review {
  userId: string;
  recipeId: string;
  rating: number;
  comment: string;
  createdAt?: string; // Có thể có hoặc không tùy vào response khi tạo
  updatedAt?: string; // Có thể có hoặc không tùy vào response khi tạo
  id?: string;        // Có thể có hoặc không tùy vào response khi tạo
}

/**
 * Lấy tất cả các review hiện có.
 * Endpoint: GET /api/reviews/
 * @returns Mảng các đối tượng review.
 */
export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const res = await axios.get(`${API_URL}/reviews/`); 
    // Dựa trên response bạn cho, dữ liệu trả về trực tiếp là mảng review.
    return res.data || []; 
  } catch (error) {
    console.error('Lỗi khi lấy tất cả review:', error);
    return [];
  }
};

/**
 * Lấy tất cả các review cho một công thức cụ thể.
 * Endpoint: GET /api/reviews/recipe/:recipeId
 * @param recipeId ID của công thức cần lấy review.
 * @returns Mảng các đối tượng review của công thức đó.
 */
export const getReviewsByRecipeId = async (recipeId: string): Promise<Review[]> => {
  try {
    if (!recipeId) {
      console.warn('Không có ID công thức được cung cấp để lấy review.');
      return [];
    }
    const res = await axios.get(`${API_URL}/reviews/recipe/${recipeId}`);
    // Dựa trên response bạn cho, dữ liệu trả về trực tiếp là mảng review.
    return res.data || [];
  } catch (error) {
    console.error(`Lỗi khi lấy review cho công thức ${recipeId}:`, error);
    return [];
  }
};

/**
 * Lấy điểm đánh giá trung bình của một công thức.
 * Endpoint: GET /api/reviews/caculate-rate/:recipeId
 * @param recipeId ID của công thức cần tính điểm trung bình.
 * @returns Điểm đánh giá trung bình (số) hoặc null nếu có lỗi/không có dữ liệu.
 */
export const getAverageRatingByRecipeId = async (recipeId: string): Promise<number | null> => {
  try {
    if (!recipeId) {
      console.warn('Không có ID công thức được cung cấp để tính điểm trung bình.');
      return null;
    }
    const res = await axios.get(`${API_URL}/reviews/caculate-rate/${recipeId}`);

    return res.data?.avgRate ?? null; 
  } catch (error) {
    console.error(`Lỗi khi lấy điểm trung bình cho công thức ${recipeId}:`, error);
    return null;
  }
};

/**
 * Tạo một review mới.
 * Endpoint: POST /api/reviews/
 * @param reviewData Dữ liệu của review cần tạo (userId, recipeId, rating, comment).
 * @returns Đối tượng review đã được tạo từ server, hoặc null nếu có lỗi.
 */
export const createNewReview = async (reviewData: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review | null> => {
  try {
    const res = await axios.post(`${API_URL}/reviews/`, reviewData); // Endpoint giống với getAllReviews nhưng là POST
    // Dựa trên response bạn cho, dữ liệu trả về trực tiếp là đối tượng review.
    return res.data || null;
  } catch (error: any) {
    console.error('Lỗi khi tạo review mới:', error.response?.data || error.message);
    throw error; // Ném lỗi để phía gọi hàm có thể bắt và xử lý.
  }
};