import React, { useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import AuthForm from '../../compoments/AuthForm';
import InputNavigation from '../../compoments/InputNavigation';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

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
      <ButtonNavigation
        title="Tiếp tục"
        onPress={() => navigation.navigate(nav.validate as never)}
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
