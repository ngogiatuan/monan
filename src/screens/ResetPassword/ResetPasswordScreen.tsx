import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');

  return (
    <ImageBackground
      source={require('../../assert/image/authen.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'flex-end' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.bottomSheet}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'< Quay lại'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Đặt lại mật khẩu</Text>
          <Text style={styles.desc}>
            Tạo mật khẩu mới cho tài khoản của bạn.
          </Text>
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
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  backText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    color: '#222',
  },
  desc: {
    color: '#888',
    fontSize: 13,
    marginBottom: 16,
  },
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
