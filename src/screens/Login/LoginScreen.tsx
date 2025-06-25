import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import { UserContext } from '../../context/UserContext';
import AuthForm from '../../compoments/AuthForm';
import { getUserByEmailAndPassword } from '../../api/userApi';
import { useTranslation } from 'react-i18next';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setEmailError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    // Kiểm tra định dạng email hợp lệ
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ');
      return;
    }
    setEmailError('');
    const userData = await getUserByEmailAndPassword(email, password);
    if (userData) {
      console.log('User data:', userData);
      setUser(userData);
      navigation.navigate(nav.home as never);
    } else {
      setEmailError('Email hoặc mật khẩu không đúng');
    }
  };

  return (
    <AuthForm title={t('login') || "Đăng nhập"}>
      <Text style={styles.label}>{t('email') || "Email"}</Text>
      <TextInput
        style={styles.input}
        placeholder={t('enter_email') || "Nhập email..."}
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
      <Text style={styles.label}>{t('password') || "Mật khẩu"}</Text>
      <TextInput
        style={[styles.input, { color: '#222' }]}
        placeholder={t('enter_password') || "Nhập mật khẩu"}
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
        <Text style={styles.forgot}>{t('forgot_password') || "Quên mật khẩu?"}</Text>
      </TouchableOpacity>
      <ButtonNavigation title={t('login') || "Đăng nhập"} onPress={handleLogin} />
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>{t('or') || "Hoặc"}</Text>
        <View style={styles.line} />
      </View>
      <ButtonNavigation
        title={t('login_with_google') || "Đăng nhập bằng Google"}
        backgroundColor="#fff"
        color="#222"
        style={styles.button}
        textStyle={styles.buttonText}
      >
        <Image source={require('../../assert/image/Google.png')} style={styles.icon} />
      </ButtonNavigation>
      <ButtonNavigation
        title={t('login_with_facebook') || "Đăng nhập bằng Facebook"}
        backgroundColor="#fff"
        color="#222"
        style={styles.button}
        textStyle={styles.buttonText}
      >
        <Image source={require('../../assert/image/facebook.png')} style={styles.icon} />
      </ButtonNavigation>
      <View style={styles.bottomRow}>
        <Text style={styles.bottomTextBold}>{t('no_account') || "Chưa có tài khoản?"}</Text>
        <TouchableOpacity onPress={() => navigation.navigate(nav.register as never)}>
          <Text style={styles.linkUnderline}> {t('register') || "Đăng ký"}</Text>
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

