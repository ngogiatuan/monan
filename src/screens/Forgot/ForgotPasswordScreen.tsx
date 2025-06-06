import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');

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
          <Text style={styles.title}>Khôi phục mật khẩu</Text>
          <Text style={styles.desc}>
            Vui lòng điền email đăng ký để chúng tôi khôi phục lại mật khẩu cho bạn.
          </Text>
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
    marginBottom: 16,
    backgroundColor: '#fafafa',
  },
});

export default ForgotPasswordScreen;
