import NetInfo from '@react-native-community/netinfo';
import { Alert, Platform, ToastAndroid } from 'react-native';

export const checkNetworkAndAlert = async (
  message = 'Không có kết nối mạng. Vui lòng bật wifi hoặc dữ liệu di động để sử dụng chức năng này.'
): Promise<boolean> => {
  try {
    const state = await NetInfo.fetch();
    // Nếu đang offline hoặc không có internet
    if (!state.isConnected || !state.isInternetReachable) {
      if (Platform.OS === 'android') {
        ToastAndroid.show(message, ToastAndroid.LONG);
      } else {
        Alert.alert('Mất kết nối', message);
      }
      return false;
    }
    return true;
  } catch (e) {
    // Nếu NetInfo lỗi, luôn alert để tránh cho phép thao tác
    Alert.alert('Mất kết nối', message);
    return false;
  }
};
