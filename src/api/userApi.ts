import axios from 'axios';
import { IUser } from '../context/UserContext';

const API_URL = 'http://103.72.99.132:3000';

export const getUserByEmailAndPassword = async (email: string, password: string): Promise<IUser | null> => {
  try {
    const res = await axios.post(`${API_URL}/api/users/login`, { email, password });
    console.log('Response from API:', res.data);
    if (res.data && res.data.token && res.data.email && res.data.full_name) {
      // Lấy thời gian đăng nhập hiện tại (dd/mm/yyyy)
      const now = new Date();
      const joined = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()}`;
      return {
        name: res.data.full_name,
        email: res.data.email,
        avatar: require('../assert/image/avatar.png'),
        joined,
        point: 0,
      };
    }
    return null;
  } catch (e) {
    console.log('Error fetching user:', e);
    return null;
  }
};

export const registerUser = async (fullname: string, email: string, password: string): Promise<IUser | null> => {
  try {
    // Đăng ký với API mới, trả về { message, email, full_name } nếu thành công
    const res = await axios.post(`${API_URL}/api/users/register`, {
      full_name: fullname,
      email,
      password,
    });
    console.log('Register response:', res.data);
    if (res.data && res.data.email && res.data.full_name) {
      // Lấy thời gian đăng ký hiện tại (dd/mm/yyyy)
      const now = new Date();
      const joined = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()}`;
      return {
        name: res.data.full_name,
        email: res.data.email,
        avatar: require('../assert/image/avatar.png'),
        joined,
        point: 0,
      };
    }
    return null;
  } catch (e) {
    console.log('Register error:', e?.response?.data || e);
    return null;
  }
};

export const deleteUserByEmail = async (email: string) => {
  try {
    await axios.post(`${API_URL}/user/delete`, { email });
    return true;
  } catch (e) {
    return false;
  }
};

// ...các hàm khác nếu cần, ví dụ: đổi mật khẩu, lấy thông tin user, v.v.
