import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Modal, Alert } from 'react-native';
import { nav } from '../../navigation/navigationName';
import { useNavigation } from '@react-navigation/native';
import BottomNavigation from '../../compoments/Bottomnavigation';
import ButtonNavigation from '../../compoments/ButtonNavigation';

const supportList = [
  { label: 'Cách thức hoạt động', icon: require('../../assert/image/activity.png') },
  { label: 'Chính sách bảo mật', icon: require('../../assert/image/policy.png') },
  { label: 'Điều khoản & Điều kiện', icon: require('../../assert/image/Conditions.png') },
];

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [showLogout, setShowLogout] = useState(false);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.coverContainer}>
          <Image source={require('../../assert/image/cover.png')} style={styles.coverImg} />
          <TouchableOpacity
            style={styles.avatarWrapper}
            activeOpacity={0.8}
          >
            <Image
              source={require('../../assert/image/avatar.png')}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.loginText}>Đăng nhập</Text>
          <View style={styles.rowInline}>
            <Text style={styles.subText}>Chưa có tài khoản?</Text>
            <TouchableOpacity onPress={() => navigation.navigate(nav.authen)}>
              <Text style={styles.linkText}> Tạo tài khoản</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate(nav.language)}
          >
            <Image
              source={require('../../assert/image/language.png')}
              style={styles.settingIcon}
              resizeMode="contain"
            />
            <Text style={styles.rowText}>Ngôn ngữ</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hỗ trợ</Text>
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
            <Text style={styles.rowText}>Về chúng tôi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row}>
            <Image
              source={require('../../assert/image/star.png')}
              style={styles.starIcon}
              resizeMode="contain"
            />
            <Text style={styles.rowText}>Đánh giá ứng dụng</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bảo mật</Text>
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate(nav.deleteAccount)}
          >
            <Image
              source={require('../../assert/image/deleteaccount.png')}
              style={styles.settingIcon}
              resizeMode="contain"
            />
            <Text style={styles.rowText}>Xóa tài khoản</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={() => setShowLogout(true)}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
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
});

export default ProfileScreen;
