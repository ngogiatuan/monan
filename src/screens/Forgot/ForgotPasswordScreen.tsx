import React, { useState } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import AuthForm from '../../compoments/AuthForm';

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
      <TextInput
        style={styles.input}
        placeholder="Nhập email..."
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
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
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
});

export default ForgotPasswordScreen;
