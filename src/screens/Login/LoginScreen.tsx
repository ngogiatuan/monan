import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform, Image } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import { UserContext } from '../../context/UserContext'; // tạo context nếu chưa có

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext); // context lưu thông tin user
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleLogin = () => {
    if (!email.endsWith('@gmail.com')) {
      setEmailError('Tên đăng nhập không tồn tại (phải là email @gmail.com)');
      return;
    }
    setEmailError('');
    // Giả lập user, avatar, điểm
    setUser({
      name: 'Bessie Cooper',
      avatar: require('../../assert/image/avatar.png'), // đổi đúng tên file avatar png bạn có
      point: 0,
      email,
    });
    navigation.navigate(nav.home as never);
  };

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
          <Text style={styles.title}>Đăng nhập</Text>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập email..."
            value={email}
            onChangeText={text => {
              setEmail(text);
              setEmailError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <Text style={styles.label}>Mật khẩu</Text>
          <TextInput
            style={[styles.input, { color: '#222' }]}
            placeholder="Nhập mật khẩu"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholderTextColor="#888"
            selectionColor="#222"
          />
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', marginBottom: 12 }}
            onPress={() => navigation.navigate(nav.forgot as never)}
          >
            <Text style={styles.forgot}>Quên mật khẩu?</Text>
          </TouchableOpacity>
          <ButtonNavigation title="Đăng nhập" onPress={handleLogin} />
          <View style={styles.orContainer}>
            <View style={styles.line} />
            <Text style={styles.orText}>Hoặc</Text>
            <View style={styles.line} />
          </View>
          <ButtonNavigation
            title="Đăng nhập bằng Google"
            backgroundColor="#fff"
            color="#222"
            style={styles.button}
            textStyle={styles.buttonText}
            children={
              <Image
                source={require('../../assert/image/Google.png')}
                style={styles.icon}
              />
            }
          />
          <ButtonNavigation
            title="Đăng nhập bằng Facebook"
            backgroundColor="#fff"
            color="#222"
            style={styles.button}
            textStyle={styles.buttonText}
            children={
              <Image
                source={require('../../assert/image/facebook.png')}
                style={styles.icon}
              />
            }
          />
          <View style={styles.bottomRow}>
            <Text style={styles.bottomTextBold}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate(nav.register as never)}>
              <Text style={styles.linkUnderline}> Đăng ký</Text>
            </TouchableOpacity>
          </View>
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
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 16,
    color: '#222',
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
  forgot: {
    color: '#222',
    fontSize: 13,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
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
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  buttonText: {
    flex: 1,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  bottomText: {
    color: '#888',
    fontSize: 13,
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
  icon: {
    width: 20,
    height: 20,
    marginLeft: 12,
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 4,
    marginLeft: 2,
  },
});

export default LoginScreen;
