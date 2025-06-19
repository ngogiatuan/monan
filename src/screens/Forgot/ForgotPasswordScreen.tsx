import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import AuthForm from '../../compoments/AuthForm';
import InputNavigation from '../../compoments/InputNavigation';
import axios from 'axios';

const API_URL = 'http://103.72.99.132:3000';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSendOtp = async () => {
    setError('');
    setSuccess('');
    if (!email) {
      setError('Vui lòng nhập email');
      return;
    }
    setLoading(true);
    try {
      // Gọi API generate-otp (không phải send-otp)
      const res = await axios.post(`${API_URL}/api/users/generate-otp`, { email });
      console.log('Response from generate-otp:', res?.data);
      if (res?.data.message === "Send OTP to Email complete!") {
        setSuccess('Đã gửi mã OTP về email của bạn.');
        (navigation as any).navigate(nav.validate, { email });
      } else {
        setError(res.data?.message || 'Không gửi được mã OTP, vui lòng thử lại.');
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
        'Không gửi được mã OTP, vui lòng thử lại.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Khôi phục mật khẩu"
      desc="Vui lòng điền email đăng ký để chúng tôi khôi phục lại mật khẩu cho bạn."
      showBack
      onBack={() => navigation.goBack()}
    >
      <Text style={styles.label}>Email <Text style={{ color: 'red' }}>*</Text></Text>
      <InputNavigation
        style={styles.input}
        placeholder="Nhập email..."
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        placeholderTextColor="#bdbdbd"
      />
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      {success ? <Text style={{ color: 'green', marginBottom: 8 }}>{success}</Text> : null}
      <ButtonNavigation
        title={loading ? "Đang gửi..." : "Tiếp tục"}
        onPress={handleSendOtp}
        disabled={loading}
      />
    </AuthForm>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    marginBottom: 16,
    fontSize: 14,
    height: 36,
    minHeight: 36,
    maxHeight: 36,
  },
});

export default ForgotPasswordScreen;

