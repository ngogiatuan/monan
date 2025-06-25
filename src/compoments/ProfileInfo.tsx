import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../navigation/navigationName';

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

  if (!user) {
    // Guest
    return (
      <View style={styles.container}>
        <View style={styles.coverWrap}>
          <Image
            source={require('../assert/image/cover.png')}
            style={styles.coverImg}
            resizeMode="cover"
          />
          <View style={styles.avatarWrap}>
            <Image
              source={require('../assert/image/avatar.png')}
              style={styles.avatar}
            />
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={{ flex: 1, marginLeft: 12 }}>
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
          </View>
        </View>
      </View>
    );
  }

  // User đã đăng nhập
  return (
    <View style={styles.container}>
      <View style={styles.coverWrap}>
        <Image
          source={require('../assert/image/cover.png')}
          style={styles.coverImg}
          resizeMode="cover"
        />
        <View style={styles.avatarWrap}>
          <Image
            source={typeof user.avatar === 'string' ? { uri: user.avatar } : require('../assert/image/avatar.png')}
            style={styles.avatar}
          />
        </View>
      </View>
      <View style={styles.infoRow}>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.memberText}>
            {user.email}
          </Text>
          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.profileBtn}>
              <Text style={styles.profileBtnText}>{labels.profile}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => navigation.navigate(nav.editProfile)}
            >
              <Text style={styles.editBtnText}>{labels.edit_profile}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.memberText}>
            {labels.member_of_app}
          </Text>
          <Text style={styles.memberText}>
            {user.joined}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 0,
  },
  coverWrap: {
    width: 393,
    height: 200,
    position: 'relative',
    backgroundColor: '#fff',
  },
  coverImg: {
    width: 393,
    height: 200,
    top: -1,
    resizeMode: 'cover',
  },
  avatarWrap: {
    position: 'absolute',
    left: 32,
    bottom: -32,
    zIndex: 2,
    backgroundColor: 'transparent',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#eee',
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    minHeight: 64,
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
    width: 158.5,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 0,
    borderWidth: 0,
  },
  profileBtnText: {
    color: '#FCFCFC',
    fontWeight: 'bold',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  editBtn: {
    backgroundColor: '#AAB9C5',
    borderRadius: 8,
    width: 158.5,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
    marginLeft: 0,
  },
  editBtnText: {
    color: '#FCFCFC',
    fontWeight: 'bold',
    fontSize: 15,
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
});

export default ProfileInfo;



