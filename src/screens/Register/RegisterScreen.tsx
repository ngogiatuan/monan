import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import AuthForm from '../../compoments/AuthForm';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');

  return (
    <AuthForm title="Đăng ký">
      <Text style={styles.label}>Email <Text style={{ color: 'red' }}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập email..."
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Họ và tên</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập họ và tên..."
        value={fullname}
        onChangeText={setFullname}
      />
      <Text style={styles.label}>Mật khẩu <Text style={{ color: 'red' }}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập mật khẩu..."
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
      <ButtonNavigation title="Đăng ký" />
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Hoặc</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.bottomTextBold}>Đã có tài khoản?</Text>
        <TouchableOpacity onPress={() => navigation.navigate(nav.login as never)}>
          <Text style={styles.linkUnderline}> Đăng nhập</Text>
        </TouchableOpacity>
      </View>
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
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  orText: {
    marginHorizontal: 8,
    color: '#888',
    fontSize: 13,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  bottomTextBold: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
  },
  linkUnderline: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
