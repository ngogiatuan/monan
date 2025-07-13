import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../navigation/navigationName'; // Đảm bảo đường dẫn này đúng

const LABELS = {
  vi: {
    login: 'Đăng nhập',
    no_account: 'Chưa có tài khoản?',
    create_account: 'Tạo tài khoản',
    profile: 'Trang cá nhân',
    edit_profile: 'Chỉnh sửa',
    member_of_app: 'Thành viên appname',
  },
  en: {
    login: 'Login',
    no_account: 'No account yet?',
    create_account: 'Create account',
    profile: 'Profile',
    edit_profile: 'Edit',
    member_of_app: 'Member',
  },
};

const ProfileInfo = ({ onCreateAccount }: { onCreateAccount?: () => void }) => {
  const { user } = useContext(UserContext);
  const { i18n } = useTranslation();
  const navigation = useNavigation<any>();
  const [labels, setLabels] = useState(LABELS.vi);

  useEffect(() => {
    console.log('Language changed:', i18n.language);
    if (i18n.language === 'en') setLabels(LABELS.en);
    else setLabels(LABELS.vi);
  }, [i18n.language]);

  // Hàm này giờ chỉ render nội dung, không bao gồm separator
  const renderInfoContentOnly = () => {
    if (user) {
      return (
        <>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.memberText}>
            {user.email}
          </Text>
          <View style={styles.btnRow}>
            <TouchableOpacity
              style={styles.profileBtn}
              onPress={() => navigation.navigate(nav.detailprofile)} // *** ĐIỀU HƯỚNG ĐẾN nav.detailProfile ***
            >
              <Text style={styles.profileBtnText}>{labels.profile}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate(nav.editProfile)}
            >
              <Text style={styles.editBtnText}>{labels.edit_profile}</Text>
            </TouchableOpacity>
          </View>
          {/* Dòng này cần marginTop để tạo khoảng cách với separator (separator là absolute) */}
          <Text style={styles.memberTextAfterSeparator}>
            {labels.member_of_app}
          </Text>
          <Text style={styles.memberText}>
            {user.joined}
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.name}>{labels.login}</Text>
          <Text style={styles.memberText}>
            {labels.no_account}{' '}
            <Text
              style={styles.createAccountText}
              onPress={onCreateAccount}
            >
              {labels.create_account}
            </Text>
          </Text>
        </>
      );
    }
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
          {/* Wrapper cho nội dung chính để căn chỉnh marginLeft */}
          <View style={styles.innerContentWrapper}>
            {renderInfoContentOnly()}
          </View>

          {/* Dải phân cách chỉ hiển thị khi có user đăng nhập */}
          {user && (
            <View style={styles.buttonSeparatorAbsolute} />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    marginBottom: 0,
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
    paddingTop: 49,
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
    marginTop: 8,
  },
  createAccountText: {
    color: '#007aff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 2,
    gap: 10,
  },
  profileBtn: {
    backgroundColor: '#AAB9C5',
    borderRadius: 8,
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  profileBtnText: {
    color: '#FCFCFC',
    fontWeight: 'bold',
    fontSize: 15,
  },
  editBtn: {
    backgroundColor: '#AAB9C5',
    borderRadius: 8,
    flex: 1,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  editBtnText: {
    color: '#FCFCFC',
    fontWeight: 'bold',
    fontSize: 15,
  },
  buttonSeparatorAbsolute: {
    position: 'absolute',
    left: 32,
    right: 20,
    height: 1.5,
    backgroundColor: '#ededed',
    top: 96,
    zIndex: 1,
  },
});

export default ProfileInfo;