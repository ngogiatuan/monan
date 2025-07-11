import {NativeModules} from 'react-native';

const {PayZaloBridge} = NativeModules;

export async function payOrderZalo(zpTransToken) {
  if (PayZaloBridge && typeof PayZaloBridge.payOrder === 'function') {
    console.log('payOrder method is available', PayZaloBridge.payOrder);
    try {
      const result = await PayZaloBridge.payOrder(zpTransToken);
      console.log('Payment result:', result, zpTransToken);
      return result;
    } catch (error) {
      console.error('Error during payment:', error);
    }
  } else {
    console.log('PayZaloBridge or payOrder method is not available');
  }
  return 1;
}