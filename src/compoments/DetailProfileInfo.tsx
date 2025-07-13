// components/DetailProfileInfo.tsx
import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';

const LABELS = {
  vi: {
    member_of_app: 'Thành viên appname',
  },
  en: {
    member_of_app: 'Member',
  },
};

const DetailProfileInfo = () => {
  const { user } = useContext(UserContext);
  const { i18n } = useTranslation();
  const navigation = useNavigation<any>();
  const [labels, setLabels] = useState(LABELS.vi);

  useEffect(() => {
    console.log('Language changed:', i18n.language);
    if (i18n.language === 'en') setLabels(LABELS.en);
    else setLabels(LABELS.vi);
  }, [i18n.language]);

  const renderInfoContentOnly = () => {
    if (!user) {
      return null;
    }

    return (
      <>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.memberText}>
          {user.email}
        </Text>
        {/* Dải phân cách nằm giữa email và thông tin thành viên app */}
        <View style={styles.buttonSeparatorAbsolute} />
        {/* Dòng này cần marginTop để tạo khoảng cách với separator */}
        <Text style={styles.memberTextAfterSeparator}>
          {labels.member_of_app}
        </Text>
        <Text style={styles.memberText}>
          {user.joined}
        </Text>
      </>
    );
  };

  return (
    <View style={styles.container}>
      {/* Vùng ảnh bìa */}
      <View style={styles.coverWrap}>
        <Image
          source={require('../assert/image/cover.png')}
          style={styles.coverImg}
          resizeMode="cover"
        />

        {/* Nút Back - Sử dụng ký tự '<' */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>{'<'}</Text>
        </TouchableOpacity>

        {/* Avatar đặt ở vị trí chồng lấn */}
        <View style={styles.avatarWrap}>
          <Image
            source={typeof user?.avatar === 'string' ? { uri: user.avatar } : require('../assert/image/avatar.png')}
            style={styles.avatar}
          />
        </View>
      </View>

      {/* Vùng chứa thông tin - background XÁM, nội dung chi tiết TRẮNG */}
      <View style={styles.infoContentWrap}>
        <View style={styles.whiteDetailsBlock}>
          <View style={styles.innerContentWrapper}>
            {renderInfoContentOnly()}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginBottom: 2,
  },
  coverWrap: {
    width: '100%',
    height: 200,
    position: 'relative',
  },
  coverImg: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 19,
    zIndex: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  backText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  avatarWrap: {
    position: 'absolute',
    left: 32,
    bottom: -21,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eee',
  },
  infoContentWrap: {
    backgroundColor: '#f5f5f5', // Nền XÁM
    marginTop: -8,
    paddingTop: 40,
    paddingHorizontal: 0,
    paddingBottom: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  whiteDetailsBlock: {
    backgroundColor: '#fff', // Nền TRẮNG
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 12,
    position: 'relative',
  },
  innerContentWrapper: {
    marginLeft: 12,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#222',
    marginBottom: 2,
  },
  memberText: {
    color: '#888',
    fontSize: 14,
  },
  memberTextAfterSeparator: {
    color: '#888',
    fontSize: 14,
    marginTop: 12, // *** ĐÃ THAY ĐỔI: Khoảng cách 12px từ separator xuống ***
  },
  createAccountText: {
    color: '#007aff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  // Style cho dải phân cách được định vị tuyệt đối
  buttonSeparatorAbsolute: {
    position: 'absolute',
    left: 1,
    right: 20,
    height: 1.5,
    backgroundColor: '#ededed',
    top: 56, // *** ĐÃ THAY ĐỔI: Để cách email 12px từ dưới lên ***
    zIndex: 1,
  },
});

export default DetailProfileInfo;