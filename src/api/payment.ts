import axios from 'axios';

const API_URL = 'http://103.72.99.132:3000/api'; // Đảm bảo đây là URL API chính xác của bạn

export const requestPaymentZP = async (price: number) => {
  try {
    const res = await axios.post(`${API_URL}/orders/create`,{
        price
    });
    return res.data?.data || [];
  } catch (e) {
    console.log('Error request Payment ZP:', e);
    return [];
  }
};

export const getStatusPaymentZP = async (apptransid: string) => {
  try {
    const res = await axios.get(`${API_URL}/status/${apptransid}`);
    return res.data?.data || [];
  } catch (e) {
    console.log('Error get Status Payment ZP:', e);
    return [];
  }
};
