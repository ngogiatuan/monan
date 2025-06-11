import React, { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import AuthForm from '../../compoments/AuthForm';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');

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
      <ButtonNavigation title="Tiếp tục" />
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
