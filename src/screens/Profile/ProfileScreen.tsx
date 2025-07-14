import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { nav } from '../../navigation/navigationName';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../../compoments/Bottomnavigation';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { UserContext } from '../../context/UserContext';
import ProfileInfo from '../../compoments/ProfileInfo';
import NetInfo from '@react-native-community/netinfo';
import { checkNetworkAndAlert } from '../../compoments/NetworkAlert';
import { useTranslation } from 'react-i18next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [showLogout, setShowLogout] = useState(false);
  const { user } = React.useContext(UserContext);
  const [isConnected, setIsConnected] = useState(true);
  const { t, i18n } = useTranslation();

  // Đặt DEFAULT_LABELS vào trong component để dùng được biến t
  const DEFAULT_LABELS = {
    overview: t('overview'),
    settings: t('settings'),
    support: t('support'),
    about_us: t('about_us'),
    rate_app: t('rate_app'),
    security: t('security'),
    delete_account: t('delete_account'),
    logout: t('logout'),
    promo_code: t('promo_code'),
    invite_friends: t('invite_friends'),
    support_how: t('support_how'),
    support_policy: t('support_policy'),
    support_terms: t('support_terms'),
  };

  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const [supportList, setSupportList] = useState([
    { label: DEFAULT_LABELS.support_how, icon: require('../../assert/image/activity.png') },
    { label: DEFAULT_LABELS.support_policy, icon: require('../../assert/image/policy.png') },
    { label: DEFAULT_LABELS.support_terms, icon: require('../../assert/image/Conditions.png') },
  ]);

  useEffect(() => {
    if (i18n.language === 'vi') {
      setLabels(DEFAULT_LABELS);
      setSupportList([
        { label: DEFAULT_LABELS.support_how, icon: require('../../assert/image/activity.png') },
        { label: DEFAULT_LABELS.support_policy, icon: require('../../assert/image/policy.png') },
        { label: DEFAULT_LABELS.support_terms, icon: require('../../assert/image/Conditions.png') },
      ]);
    } else {
      setLabels({
        overview: t('overview'),
        settings: t('settings'),
        support: t('support'),
        about_us: t('about_us'),
        rate_app: t('rate_app'),
        security: t('security'),
        delete_account: t('delete_account'),
        logout: t('logout'),
        promo_code: t('promo_code'),
        invite_friends: t('invite_friends'),
        support_how: t('support_how'),
        support_policy: t('support_policy'),
        support_terms: t('support_terms'),
      });
      setSupportList([
        { label: t('support_how'), icon: require('../../assert/image/activity.png') },
        { label: t('support_policy'), icon: require('../../assert/image/policy.png') },
        { label: t('support_terms'), icon: require('../../assert/image/Conditions.png') },
      ]);
    }
  }, [i18n.language, t]);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.fixedHeaderWrap}>
        <ProfileInfo
          onCreateAccount={async () => {
            const ok = await checkNetworkAndAlert(
              t('network_create_account') ||
              'Không có kết nối mạng. Vui lòng bật wifi hoặc dữ liệu di động để tạo tài khoản.'
            );
            if (!ok) return;
            navigation.navigate(nav.authen);
          }}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.overview}</Text>
            {/* Mã ưu đãi - có dải phân cách xám */}
            <TouchableOpacity style={styles.row} onPress={() => {
              if (!isConnected) {
                Alert.alert(
                  t('networkfeature'),
                  t('networkfeaturedetail')
                );
                return;
              }
            }}>
              <Image
                source={require('../../assert/image/code.png')}
                style={styles.generalIcon}
                resizeMode="contain"
              />
              <Text style={styles.rowText}>{labels.promo_code}</Text>
              {/* Dải phân cách */}
              <View style={styles.internalSeparator} />
            </TouchableOpacity>
            {/* Giới thiệu bạn bè - không có dải phân cách (mục cuối của nhóm này) */}
            <TouchableOpacity style={styles.row} onPress={() => {
              if (!isConnected) {
                Alert.alert(
                  t('networkfeature'),
                  t('networkfeaturedetail')
                );
                return;
              }
            }}>
              <Image
                source={require('../../assert/image/invite.png')}
                style={styles.generalIcon}
                resizeMode="contain"
              />
              <Text style={styles.rowText}>{labels.invite_friends}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.settings}</Text>
          {/* Ngôn ngữ - không có dải phân cách (mục duy nhất) */}
          <TouchableOpacity
            style={styles.row}
            onPress={async () => {
              const ok = await checkNetworkAndAlert(
                t('networklanguage')
              );
              if (!ok) return;
              navigation.navigate(nav.language as string);
            }}
          >
            <Image
              source={require('../../assert/image/language.png')}
              style={styles.settingIcon}
              resizeMode="contain"
            />
            <Text style={styles.rowText}>{t('language')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.support}</Text>
          {/* Các mục từ supportList - có dải phân cách xám */}
          {supportList.map((item, index) => (
            <TouchableOpacity
              style={styles.row}
              key={item.label}
            >
              <Image
                source={item.icon}
                style={styles.supportIcon}
                resizeMode="contain"
              />
              <Text style={styles.rowText}>{item.label}</Text>
              <View style={styles.internalSeparator} />
            </TouchableOpacity>
          ))}
          {/* Về chúng tôi - có dải phân cách xám */}
          <TouchableOpacity style={styles.row}>
            <Image
              source={require('../../assert/image/aboutus.png')}
              style={styles.groupIcon}
              resizeMode="contain"
            />
            <Text style={styles.rowText}>{labels.about_us}</Text>
            <View style={styles.internalSeparator} />
          </TouchableOpacity>
          {/* Đánh giá ứng dụng - không có dải phân cách (mục cuối cùng của phần Hỗ trợ) */}
          <TouchableOpacity style={styles.row}>
            <Image
              source={require('../../assert/image/star.png')}
              style={styles.starIcon}
              resizeMode="contain"
            />
            <Text style={styles.rowText}>{labels.rate_app}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{labels.security}</Text>
          {/* Xóa tài khoản - không có dải phân cách (mục duy nhất) */}
          <TouchableOpacity
            style={styles.row}
            onPress={async () => {
              const ok = await checkNetworkAndAlert(
                t('networkdeleteaccount')
              );
              if (!ok) return;
              navigation.navigate(nav.deleteAccount as string);
            }}
          >
            <Image
              source={require('../../assert/image/deleteaccount.png')}
              style={styles.settingIcon}
              resizeMode="contain"
            />
            <Text style={styles.rowText}>{labels.delete_account}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowLogout(true)}>
          <Text style={styles.logoutText}>{labels.logout}</Text>
        </TouchableOpacity>
      </ScrollView>
      <BottomNavigation current="profile" />
      <Modal
        visible={showLogout}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogout(false)}
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
              Đăng xuất khỏi tài khoản?
            </Text>
            <Text style={{ color: '#888', fontSize: 14, marginBottom: 18, textAlign: 'center' }}>
              Bạn có chắc chắn muốn đăng xuất không?
            </Text>
            <ButtonNavigation
              title="Đăng xuất"
              backgroundColor="#FF6600"
              onPress={() => {
                const userGG = GoogleSignin.getCurrentUser();
                if (userGG?.idToken) {
                  GoogleSignin.signOut()
                }
                setShowLogout(false);
                // If you have `setUser` from UserContext, you'd call it here:
                // setUser(null);
                navigation.reset({
                  index: 0,
                  routes: [{ name: nav.authen }],
                });
              }}
              style={{ width: '100%', marginBottom: 8 }}
            />
            <ButtonNavigation
              title="Hủy"
              backgroundColor="#E0E0E0"
              color="#222"
              onPress={() => setShowLogout(false)}
              style={{ width: '100%' }}
              textStyle={{ color: '#222' }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContentContainer: {
    paddingBottom: 20,
  },
  fixedHeaderWrap: {
    backgroundColor: '#f5f5f5',
    zIndex: 2,
    elevation: 2,
  },
  section: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16, // Padding để căn icon và text vào trong
    paddingTop: 12,
    paddingBottom: 8,
  },
  sectionTitle: {
    color: '#474747',
    fontSize: 14,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#fff', // Đảm bảo nền của hàng là màu trắng
    position: 'relative', // Cần cho internalSeparator sử dụng absolute
  },
  // Style cho dải phân cách xám nhỏ, không full width
  internalSeparator: {
    position: 'absolute',
    bottom: 0,
    left: 34, // <--- ĐÃ ĐIỀU CHỈNH: Bắt đầu sớm hơn để bao phủ hết text
    right: 0, // Kéo dài hết mép phải của ô trắng
    height: 1.5, // Độ dày của dải phân cách
    backgroundColor: '#ededed', // Màu xám nhạt
  },
  rowText: { fontSize: 16, color: '#222', marginLeft: 12 },
  settingIcon: { width: 22, height: 22 },
  supportIcon: { width: 22, height: 22 },
  starIcon: { width: 22, height: 22 },
  groupIcon: { width: 22, height: 22 },
  generalIcon: { width: 20, height: 20, tintColor: '#00AEEF' },
  logoutBtn: {
    marginTop: 10,
    backgroundColor: '#fff',
    borderWidth: 0,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#C03744',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Unused or old styles
  coverContainer: { width: '100%', height: 180, backgroundColor: '#eee' },
  coverImg: { width: '100%', height: 180, resizeMode: 'cover' },
  avatarWrapper: {
    position: 'absolute',
    left: 20,
    bottom: -40,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#fff',
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  infoContainer: { marginTop: 56, alignItems: 'flex-start', paddingHorizontal: 20, marginBottom: 8 },
  loginText: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  subText: { color: '#888', fontSize: 14 },
  linkText: { color: '#007aff', fontWeight: 'bold' },
});

export default ProfileScreen;