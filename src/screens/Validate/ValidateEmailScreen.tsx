import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation, useRoute } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import AuthForm from '../../compoments/AuthForm';
import axios from 'axios';

const API_URL = 'http://103.72.99.132:3000';

const ValidateEmailScreen = () => {
  const route = useRoute<any>();
  const email = route.params?.email || '';
  const navigation = useNavigation();
  const [code, setCode] = useState(['', '', '', '', '', '']); // 6 ô nhập mã
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const inputs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

  const handleChange = (text: string, idx: number) => {
    if (/^\d*$/.test(text)) {
      const newCode = [...code];
      newCode[idx] = text;
      setCode(newCode);
      if (text && idx < 5) {
        // @ts-ignore
        inputs[idx + 1].current.focus();
      }
    }
  };

  const handleVerify = async () => {
    setError('');
    setSuccess('');
    const otp = code.join('');
    if (otp.length !== 6) {
      setError('Vui lòng nhập đủ 6 số OTP');
      return;
    }
    setLoading(true);
    try {
      // Gọi API xác thực OTP
    //  const res = await axios.post(`${API_URL}/api/users/changePassword`, { email, otp, newPassword: '' });
    
       
        setTimeout(() => {
          // Chuyển sang màn hình reset password, truyền email và otp đúng kiểu
          // Sử dụng navigation.navigate với generic <any> để tránh lỗi TS2345
          (navigation as any).navigate(nav.resetPassword, { email, otp });
        }, 600);
      
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
        'Mã OTP không đúng hoặc đã hết hạn.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthForm
      title="Xác thực email"
      desc={`Bạn vui lòng nhập mã xác thực đã được gửi qua ${email}.`}
      showBack
      onBack={() => navigation.goBack()}
    >
      <View style={styles.codeRow}>
        {code.map((v, idx) => (
          <TextInput
            key={idx}
            ref={inputs[idx]}
            style={[styles.codeInput, { color: '#222' }]} // Đảm bảo text nhập là màu đen
            value={v}
            onChangeText={text => handleChange(text, idx)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            autoFocus={idx === 0}
            blurOnSubmit={false}
            importantForAutofill="no"
            selectionColor="#222"
            placeholderTextColor="#888"
          />
        ))}
      </View>
      {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
      {success ? <Text style={{ color: 'green', marginBottom: 8 }}>{success}</Text> : null}
      <ButtonNavigation
        title={loading ? "Đang xác thực..." : "Tiếp tục"}
        onPress={handleVerify}
        disabled={loading}
      />
    </AuthForm>
  );
};

const styles = StyleSheet.create({
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 6, // nhỏ hơn nữa cho vừa 6 ô
  },
  codeInput: {
    width: 35, // nhỏ gọn hơn
    height: 38, // nhỏ gọn hơn
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginHorizontal: 2,
  },
});

export default ValidateEmailScreen;
