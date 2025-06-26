import React, { useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import AuthForm from '../../compoments/AuthForm';
import { UserContext } from '../../context/UserContext';
import { registerUser, getUserByEmailAndPassword } from '../../api/userApi';
import { useTranslation } from 'react-i18next';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    console.log('handleRegister called with:', )
    if (!email || !fullname || !password || !repassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    if (password !== repassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    setError('');
    const userData = await registerUser(fullname, email, password);
    if (userData?.token) {
      setSuccess(true);
      // Sau khi đăng ký thành công, chuyển sang LoginScreen để người dùng tự đăng nhập
      setTimeout(() => {
        setSuccess(false);
        navigation.navigate(nav.login as never);
      }, 1200);
    } else {
      setError('Đăng ký thất bại, vui lòng thử lại'+( userData?.message ||  ''));
      console.log('[Register] Đăng ký thất bại với:', { fullname, email, password });
    }
  };

  return (
    <AuthForm title={t('register') }>
      <Text style={styles.label}>{t('Email') } <Text style={{ color: 'red' }}>*</Text></Text>
      <TextInput
        style={styles.input}
        placeholder={t('enteremail') }
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
         placeholderTextColor="#888"
      />
      <Text style={styles.label}>{t('fullname') }</Text>
      <TextInput
        style={styles.input}
        placeholder={t('enterfullname') }
        value={fullname}
        onChangeText={setFullname}
         placeholderTextColor="#888"
      />
      <Text style={styles.label}>{t('password') } <Text style={{ color: 'red' }}>*</Text></Text>
      <TextInput
        style={[styles.input, { color: '#222' }]}
        placeholder={t('enterpassword') }
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#888"
        selectionColor="#222"
      />
      <Text style={styles.label}>{t('enterrepassword') } <Text style={{ color: 'red' }}>*</Text></Text>
      <TextInput
        style={[styles.input, { color: '#222' }]}
        placeholder={t('enterrepassword')}
        value={repassword}
        onChangeText={setRepassword}
        secureTextEntry
        placeholderTextColor="#888"
        selectionColor="#222"
      />
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      {success ? <Text style={{ color: 'green', marginBottom: 8 }}>{t('registersuccess')}</Text> : null}
      <ButtonNavigation title={t('register') } onPress={handleRegister} />
      <View style={styles.orContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>{t('or') }</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.bottomTextBold}>{t('haveaccount') }</Text>
        <TouchableOpacity onPress={() => navigation.navigate(nav.login as never)}>
          <Text style={styles.linkUnderline}> {t('login') }</Text>
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
