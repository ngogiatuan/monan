import React, { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation, useRoute } from '@react-navigation/native';
import AuthForm from '../../compoments/AuthForm';
import axios from 'axios';
import { nav } from '../../navigation/navigationName';

const API_URL = 'http://103.72.99.132:3000';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Lấy email và otp từ params truyền sang từ ValidateEmailScreen
  const email = route.params?.email || '';
  const otp = route.params?.otp || '';

  const handleReset = async () => {
    if (!otp || !password || !repassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      setSuccess('');
      return;
    }
    if (password !== repassword) {
      setError('Mật khẩu không khớp');
      setSuccess('');
      return;
    }
    setError('');
    try {
      const res = await axios.post(`${API_URL}/api/users/reset-password`, {
        email,
        otp,
        newPassword: password,
      });
      if (res.data && res.data.message) {
        setSuccess('Đặt lại mật khẩu thành công! Vui lòng đăng nhập.');
        setTimeout(() => {
          navigation.navigate(nav.login as never);
        }, 1200);
      } else {
        setError('Đặt lại mật khẩu thất bại, vui lòng kiểm tra lại mã OTP hoặc thử lại.');
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          'Đặt lại mật khẩu thất bại, vui lòng kiểm tra lại mã OTP hoặc thử lại.'
      );
      setSuccess('');
    }
  };

  return (
    <AuthForm
      title="Đặt lại mật khẩu"
      desc="Tạo mật khẩu mới cho tài khoản của bạn."
      showBack
      onBack={() => navigation.goBack()}
    >
      <Text style={styles.label}>Mật khẩu mới <Text style={{ color: 'red' }}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu mới..."
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={styles.label}>Nhập lại mật khẩu <Text style={{ color: 'red' }}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập lại mật khẩu..."
        value={repassword}
        onChangeText={setRepassword}
        secureTextEntry
      />
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      {success ? <Text style={{ color: 'green', marginBottom: 8 }}>{success}</Text> : null}
      <ButtonNavigation title="Tiếp tục" onPress={handleReset} />
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
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    backgroundColor: '#fafafa',
  },
});

export default ResetPasswordScreen;

