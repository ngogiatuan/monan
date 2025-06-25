import React, { useState } from 'react';
import { Text, TextInput, StyleSheet, Modal, View, Image } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation, useRoute } from '@react-navigation/native';
import AuthForm from '../../compoments/AuthForm';
import axios from 'axios';
import { nav } from '../../navigation/navigationName';
import { useTranslation } from 'react-i18next';

const API_URL = 'http://103.72.99.132:3000';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  // Lấy email và otp từ params truyền sang từ ValidateEmailScreen
  const email = route.params?.email || '';
  const otp = route.params?.otp || '';

  const handleReset = async () => {
    if (!otp || !password || !repassword) {
      setError('Vui lòng nhập đầy đủ thông tin');
      setSuccess('');
      return;
    }
    if (password !== repassword) {
      setError('Mật khẩu không khớp');
      setSuccess('');
      return;
    }
    setError('');
    try {
      // Gọi API đổi mật khẩu với endpoint /api/users/changePassword
      const res = await axios.post(`${API_URL}/api/users/changePassword`, {
        email,
        otp,
        newPassword: password,
      });
      if (res.data && res.data.message) {
        setSuccess('Đặt lại mật khẩu thành công!');
        setShowDialog(true);
      } else {
        setError('Đặt lại mật khẩu thất bại, vui lòng kiểm tra lại mã OTP hoặc thử lại.');
      }
    } catch (e: any) {
      setError(
        e?.response?.data?.message ||
          'Đặt lại mật khẩu thất bại, vui lòng kiểm tra lại mã OTP hoặc thử lại.'
      );
      setSuccess('');
    }
  };

  return (
    <>
      <AuthForm
        title={t('reset_password') || "Đặt lại mật khẩu"}
        desc={t('reset_password_desc') || "Tạo mật khẩu mới cho tài khoản của bạn."}
        showBack
        onBack={() => navigation.goBack()}
      >
        <Text style={styles.label}>{t('new_password') || "Mật khẩu mới"} <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={[styles.input, { color: '#222' }]}
          placeholder={t('enter_new_password') || "Nhập mật khẩu mới..."}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#888"
          selectionColor="#222"
        />
        <Text style={styles.label}>{t('re_new_password') || "Nhập lại mật khẩu"} <Text style={{ color: 'red' }}>*</Text></Text>
        <TextInput
          style={[styles.input, { color: '#222' }]}
          placeholder={t('enter_re_new_password') || "Nhập lại mật khẩu..."}
          value={repassword}
          onChangeText={setRepassword}
          secureTextEntry
          placeholderTextColor="#888"
          selectionColor="#222"
        />
        {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
        {success && !showDialog ? <Text style={{ color: 'green', marginBottom: 8 }}>{success}</Text> : null}
        <ButtonNavigation title={t('continue') || "Tiếp tục"} onPress={handleReset} />
      </AuthForm>
      {/* Dialog báo đổi mật khẩu thành công */}
      <Modal
        visible={showDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDialog(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.dialogContainer}>
            <Image
              source={require('../../assert/image/check.png')}
              style={styles.dialogIcon}
            />
            <Text style={styles.dialogTitle}>{t('reset_password_success') || "Đổi mật khẩu thành công!"}</Text>
            <Text style={styles.dialogDesc}>
              {t('reset_password_success_desc') || "Bạn đã đặt lại mật khẩu mới. Vui lòng đăng nhập lại để tiếp tục sử dụng ứng dụng."}
            </Text>
            <ButtonNavigation
              title={t('login') || "Đăng nhập"}
              backgroundColor="#FF9800"
              color="#222"
              onPress={() => {
                setShowDialog(false);
                navigation.navigate(nav.login as never);
              }}
              style={styles.dialogBtn}
              textStyle={{ fontWeight: 'bold', fontSize: 16 }}
            />
          </View>
        </View>
      </Modal>
    </>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogContainer: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    width: 320,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  dialogIcon: {
    width: 56,
    height: 56,
    marginBottom: 16,
    tintColor: '#2ecc40',
  },
  dialogTitle: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#222',
    marginBottom: 8,
    textAlign: 'center',
  },
  dialogDesc: {
    color: '#888',
    fontSize: 15,
    marginBottom: 24,
    textAlign: 'center',
  },
  dialogBtn: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 14,
    marginTop: 0,
  },
});

export default ResetPasswordScreen;

