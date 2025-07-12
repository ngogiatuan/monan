import axios from 'axios';

const API_URL = 'http://103.72.99.132:3000/api'; // Đảm bảo đây là URL API chính xác của bạn

export const requestPaymentZP = async (price: number, token: string) => {
  try {
    const res = await axios.post(`${API_URL}/orders/create`, {
      price
    }, {
      headers: {
        Authorization: `Bearer ${token}`, // Sử dụng token để xác thực
      },
    });
    console.log('resssss', res)
    return res.data || null;
  } catch (e) {
    console.log('Error request Payment ZP:', e);
    return [];
  }
};

export const getStatusPaymentZP = async (apptransid: string, token: string) => {
  try {
    const res = await axios.get(`${API_URL}/orders/status/${apptransid}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Sử dụng token để xác thực
      },
    });
    console.log('ress status', res)
    return res.data || null;
  } catch (e) {
    console.log('Error get Status Payment ZP:', e);
    return null;
  }
};
