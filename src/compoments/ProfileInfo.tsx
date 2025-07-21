import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../navigation/navigationName'; // Đảm bảo đường dẫn này đúng
import { isPre } from '../api/userApi'; // Thêm import

const ProfileInfo = ({ onCreateAccount }: { onCreateAccount?: () => void }) => {
  const { user } = useContext(UserContext);
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<any>();

  // Không cache label, luôn lấy trực tiếp từ t() để đảm bảo re-render đúng ngôn ngữ và không bị lỗi cache
  const labels = {
    login: t('login'),
    no_account: t('noaccount'),
    create_account: t('register'),
    profile: t('profile'),
    edit_profile: t('edit_profile'),
    member_normal: t('member_normal'),
    member_premium: t('member_premium'),
  };

  // Hàm này giờ chỉ render nội dung, không bao gồm separator
  const renderInfoContentOnly = () => {
    if (user) {
      console.log('DEBUG user object:', user); // Thêm log toàn bộ user object
      const isPremium = isPre(user);
      console.log('DEBUG user.premium:', user.premium); // Thêm log để kiểm tra giá trị premium
      let premiumDate = '';
      if (isPremium) {
        try {
          const d = new Date(user.premium);
          premiumDate = `HSD: ${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
        } catch {
          premiumDate = '';
        }
      }
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
          <Text style={styles.memberTextAfterSeparator}>
            {isPremium ? t('member_premium') : t('member_normal')}
          </Text>
          {isPremium && (
            <Text style={styles.memberText}>
              {premiumDate}
            </Text>
          )}
        </>
      );
    } else {
      return (
        <>
          <Text style={styles.name}>{labels.login}</Text>
          <Text style={styles.memberText}>
            {labels.no_account}{' '}
            <Text
              style={styles.createAccountTextNoHighlight}
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
  createAccountTextNoHighlight: {
    color: '#007aff',
    fontWeight: 'bold',
    // Không underline, không highlight
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