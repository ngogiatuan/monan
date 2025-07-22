import axios from 'axios';
import { IUser } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';


const API_URL = 'http://103.72.99.132:3000/api';

const NOTIFICATION_STORAGE_KEY = '@app_notifications';
const HAS_UNREAD_NOTIFICATIONS_KEY = '@has_unread_notifications';

export type NotificationType = 'app_open' | 'user_login' | 'premium_upgrade' | 'save_recipe' | 'upload_recipe' | 'logout';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  timestamp: number;
  message?: string;
}

export const addNotification = async (type: NotificationType, message?: string) => {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    let notifications: NotificationItem[] = stored ? JSON.parse(stored) : [];
    notifications.unshift({
      id: type + '_' + Date.now(),
      type,
      timestamp: Date.now(),
      message,
    });
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
    await AsyncStorage.setItem(HAS_UNREAD_NOTIFICATIONS_KEY, 'true');
  } catch (e) {
    console.log('addNotification error:', e);
  }
};

export const isPre = (user: any): boolean => {
  // Premium nếu là một chuỗi ngày hợp lệ (không null, không undefined, không rỗng, không phải 'null')
  return !!(user && typeof user.premium === 'string' && user.premium !== '' && user.premium !== 'null');
};

export const getUserByEmailAndPassword = async (email: string, password: string): Promise<IUser | null> => {
  try {
    const res = await axios.post(`${API_URL}/users/login`, { email, password });
    console.log('Response from API:', res.data);
    if (res.data && res.data.token && res.data.email && res.data.full_name) {
      // Lấy thời gian đăng nhập hiện tại (dd/mm/yyyy)
      const now = new Date();
      const joined = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
      return {
        name: res.data.full_name,
        email: res.data.email,
        avatar: res.data?.avatar || require('../assert/image/avatar.png'),
        joined,
        point: 0,
        token: res.data.token, // Lưu token vào user object
        _id: res.data._id || res?.data?.id,     // Nếu API trả về _id thì lấy luôn
        premium: res.data.premium ?? null, // Thêm trường premium
      };
    }
    return null;
  } catch (e) {
    console.log('Error fetching user:', e);
    return null;
  }
};

export const loginGG = async (accessToken: string): Promise<IUser | null> => {
  try {
    const res = await axios.post(`${API_URL}/users/login-google`, { accessToken });
    console.log('Response from API loginGG:', res.data);
    // Lấy tên: ưu tiên full_name/fullName, nếu không có thì lấy name, nếu không có thì lấy phần trước @ của email
    if (res.data && res.data.token && res.data.email) {
      let name = res.data.full_name || res.data.fullName || res.data.name;
      if (!name && res.data.email) {
        name = res.data.email.split('@')[0];
      }
      const now = new Date();
      const joined = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
      return {
        name,
        email: res.data.email,
        avatar: res.data?.avatar || require('../assert/image/avatar.png'),
        joined,
        point: 0,
        token: res.data.token,
        _id: res.data._id || res.data.id,
        premium: res.data.premium ?? null,
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
    const res = await axios.post(`${API_URL}/users/register`, {
      fullName: fullname,
      email,
      password,
    });
    console.log('Register response:', res.data);
    if (res.data && res.data.email && res.data.fullName && res.data.token) {
      // Lấy thời gian đăng ký hiện tại (dd/mm/yyyy)
      const now = new Date();
      const joined = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
      return {
        name: res.data.fullName,
        email: res.data.email,
        avatar: res.data?.avatar || require('../assert/image/avatar.png'),
        joined,
        point: 0,
        token: res.data.token,
        _id: res.data._id || res.data?.id, // Nếu API trả về _id thì lấy luôn
        premium: res.data.premium ?? null, // Thêm trường premium
      };
    }
    return null;
  } catch (e) {
    console.log('Register error:', e?.response?.data || e);
    return e?.response?.data || null;
  }
};

/**
 * Đăng ký premium cho user
 * @param userId string
 * @param token string (nếu cần xác thực)
 * @returns object thông tin premium
 */
export const registerPremium = async (userId: string, token?: string) => {
  try {
    const res = await axios.post(
      `${API_URL}/premium/register-premium`,
      { user_id: userId },
      token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : undefined
    );
    return res.data;
  } catch (e) {
    console.log('registerPremium error:', e?.response?.data || e);
    throw e;
  }
};

/**
 * Lấy thông tin premium của user
 * @param userId string
 * @returns object thông tin premium
 */
export const getPremiumInfo = async (userId: string) => {
  try {
    const res = await axios.get(
      `${API_URL}/premium/get-premium-info`,
      { params: { user_id: userId } }
    );
    return res.data;
  } catch (e) {
    console.log('getPremiumInfo error:', e?.response?.data || e);
    throw e;
  }
};

export const getPremiumHistory = async (token: string, page = 1, limit = 10) => {
  try {
    const res = await axios.get(`${API_URL}/premium/history`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit }
    });
    return res.data; // { data: [...], pagination: {...} }
  } catch (e) {
    console.log('getPremiumHistory error:', e?.response?.data || e);
    throw e;
  }
};