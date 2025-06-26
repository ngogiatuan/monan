import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Modal } from 'react-native';
import InputNavigation from '../../compoments/InputNavigation';
import { UserContext } from '../../context/UserContext';
import { deleteUserByEmail } from '../../api/userApi';
import { nav } from '../../navigation/navigationName';
import { useTranslation } from 'react-i18next';

const DeleteAccountScreen = ({ navigation }: any) => {
  const [input, setInput] = useState('');
  const { user, setUser } = useContext(UserContext);
  const [showGuestDialog, setShowGuestDialog] = useState(false);
  const { t } = useTranslation();

  // So sánh chính xác, loại bỏ khoảng trắng thừa, không phân biệt kiểu unicode tổ hợp, không phân biệt kiểu gõ dấu, không phân biệt hoa thường
  const normalize = (str: string) =>
    str
      .normalize('NFC')
      .replace(/\s+/g, ' ')
      .trim();

  // Chấp nhận các biến thể "xoa tai khoan", "xoá tài khoản", "XÓA TÀI KHOẢN", v.v.
  const validPhrases = [
    'Xóa tài khoản',
    'Xoá tài khoản',
    'Xoa tai khoan'
  ];

  const isValid = validPhrases.some(phrase => normalize(input) === phrase);

  // Thêm chức năng xóa tài khoản
  const handleDelete = async () => {
    if (!isValid) return;
    if (!user) {
      setShowGuestDialog(true);
      return;
    }
    if (user?.email) {
      await deleteUserByEmail(user.email);
    }
    setUser(null); // về trạng thái guest
    navigation.reset({
      index: 0,
      routes: [{ name: nav.profile }],
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('deleteaccount') }</Text>
      </View>
      <View style={styles.body}>
        <Text style={styles.warning}>
          {t('deletewarning') }
        </Text>
        <Text style={styles.label}>{t('enterdeletephrase') }</Text>
        <InputNavigation
          placeholder={t('deleteaccount') }
          value={input}
          onChangeText={setInput}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[styles.deleteBtn, { backgroundColor: isValid ? '#e53935' : '#eee' }]}
          disabled={!isValid}
          onPress={handleDelete}
        >
          <Text style={[styles.deleteBtnText, { color: isValid ? '#fff' : '#bbb' }]}>
            {t('confirmdelete') }
          </Text>
        </TouchableOpacity>
        {/* Dialog cho guest */}
        <Modal
          visible={showGuestDialog}
          transparent
          animationType="fade"
          onRequestClose={() => setShowGuestDialog(false)}
        >
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.18)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              width: '80%',
              alignItems: 'center',
            }}>
              <Text style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 8, color: '#222', textAlign: 'center' }}>
                {t('noaccounttodelete') }
              </Text>
              <Text style={{ color: '#888', fontSize: 14, marginBottom: 18, textAlign: 'center' }}>
                {t('registerbeforedelete') }
              </Text>
              <TouchableOpacity
                style={{
                  backgroundColor: '#FF6600',
                  borderRadius: 8,
                  paddingVertical: 12,
                  paddingHorizontal: 32,
                  marginTop: 8,
                }}
                onPress={() => {
                  setShowGuestDialog(false);
                  navigation.goBack();
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>{t('ok') || 'OK'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff6f2c',
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 8,
  },
  backBtn: {
    padding: 8,
    marginRight: 8,
  },
  backText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 32, // Để căn giữa tiêu đề khi có nút back
  },
  body: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  warning: {
    color: '#e53935',
    marginBottom: 18,
    fontSize: 15,
  },
  label: {
    fontSize: 15,
    marginBottom: 6,
    color: '#222',
  },
  deleteBtn: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtnText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default DeleteAccountScreen;

