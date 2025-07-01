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

const DEFAULT_LABELS = {
  overview: 'Tổng quát',
  settings: 'Cài đặt',
  support: 'Hỗ trợ',
  about_us: 'Về chúng tôi',
  rate_app: 'Đánh giá ứng dụng',
  security: 'Bảo mật',
  delete_account: 'Xóa tài khoản',
  logout: 'Đăng xuất',
  promo_code: 'Mã ưu đãi',
  invite_friends: 'Giới thiệu bạn bè',
  support_how: 'Cách thức hoạt động',
  support_policy: 'Chính sách bảo mật',
  support_terms: 'Điều khoản & Điều kiện',
};

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [showLogout, setShowLogout] = useState(false);
  const { user } = React.useContext(UserContext);
  const [isConnected, setIsConnected] = useState(true);
  const { t, i18n } = useTranslation();
  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const [supportList, setSupportList] = useState([
    { label: DEFAULT_LABELS.support_how, icon: require('../../assert/image/activity.png') },
    { label: DEFAULT_LABELS.support_policy, icon: require('../../assert/image/policy.png') },
    { label: DEFAULT_LABELS.support_terms, icon: require('../../assert/image/Conditions.png') },
  ]);

  useEffect(() => {
    // Nếu là tiếng Việt mặc định (chưa đổi), dùng base label
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
    // eslint-disable-next-line
  }, [i18n.language]);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // --- Header cố định, tổng quát scroll theo ---
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* Header cố định */}
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
      {/* ScrollView cho phần còn lại, gồm tổng quát và các section khác */}
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
        {user && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{labels.overview}</Text>
            <TouchableOpacity style={styles.row} onPress={() => {
              if (!isConnected) {
                Alert.alert(
                  t('networkfeature') ,
                  t('networkfeaturedetail') 
                );
                return;
              }
              // ...existing code nếu có...
            }}>
              <Image
                source={require('../../assert/image/code.png')}
                style={styles.generalIcon}
                resizeMode="contain"
              />
              <Text style={styles.rowText}>{labels.promo_code}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.row} onPress={() => {
              if (!isConnected) {
                Alert.alert(
                  t('networkfeature') ,
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
          {supportList.map((item) => (
            <TouchableOpacity style={styles.row} key={item.label}>
              <Image
                source={item.icon}
                style={styles.supportIcon}
                resizeMode="contain"
              />
              <Text style={styles.rowText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.row}>
            <Image
              source={require('../../assert/image/aboutus.png')}
              style={styles.groupIcon}
              resizeMode="contain"
            />
            <Text style={styles.rowText}>{labels.about_us}</Text>
          </TouchableOpacity>
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
      {/* Dialog xác nhận đăng xuất */}
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
                if(userGG?.idToken){
                  GoogleSignin.signOut()
                }
                setShowLogout(false);
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
  container: { flex: 1, backgroundColor: '#fff' },
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
  section: { marginTop: 18, backgroundColor: '#fff', paddingHorizontal: 20 },
  sectionTitle: { color: '#888', fontSize: 14, marginBottom: 8, marginTop: 12 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  rowText: { fontSize: 16, color: '#222', marginLeft: 12 },
  settingIcon: { width: 22, height: 22 },
  supportIcon: { width: 22, height: 22 },
  starIcon: { width: 22, height: 22 },
  groupIcon: { width: 22, height: 22 },
  logoutBtn: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeaea',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutText: {
    color: '#e53935',
    fontWeight: 'bold',
    fontSize: 16,
  },
  generalIcon: { width: 20, height: 20, tintColor: '#00AEEF' },
  fixedHeaderWrap: {
    backgroundColor: '#fff',
    // Đảm bảo header và tổng quát không bị kéo theo khi scroll
    // Có thể thêm shadow nếu muốn nổi bật
    zIndex: 2,
    elevation: 2,
  },
});

export default ProfileScreen;

