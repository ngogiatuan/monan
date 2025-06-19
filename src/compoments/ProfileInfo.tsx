import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { UserContext } from '../context/UserContext';
import { nav } from '../navigation/navigationName';
import { useNavigation } from '@react-navigation/native';

const ProfileInfo = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation<any>();

  return (
    <View>
      <View style={styles.coverContainer}>
        <Image source={require('../assert/image/cover.png')} style={styles.coverImg} />
        <TouchableOpacity style={styles.avatarWrapper} activeOpacity={0.8}>
          <Image
            source={user?.avatar || require('../assert/image/avatar.png')}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        {/* Guest view */}
        {!user && (
          <>
            <Text style={styles.loginText}>Đăng nhập</Text>
            <View style={styles.rowInline}>
              <Text style={styles.subText}>Chưa có tài khoản?</Text>
              <TouchableOpacity onPress={() => navigation.navigate(nav.authen)}>
                <Text style={styles.linkText}> Tạo tài khoản</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
        {/* User view */}
        {user && (
          <>
            <Text style={styles.loginText}>{user.name}</Text>
            <Text style={styles.subText}>{user.email}</Text>
            <View style={styles.actionRow}>
              <View style={styles.actionBtn}>
                <Text style={styles.actionBtnText}>Trang cá nhân</Text>
              </View>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => navigation.navigate(nav.editProfile)}
              >
                <Text style={styles.actionBtnText}>Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>
            <Text style={{ color: '#888', fontSize: 13, marginTop: 8 }}>
              Thành viên appname
            </Text>
            {user.joined && (
              <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
                {user.joined}
              </Text>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  infoContainer: {
    marginTop: 56,
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  loginText: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  subText: { color: '#888', fontSize: 14 },
  linkText: { color: '#007aff', fontWeight: 'bold' },
  rowInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  actionBtn: {
    backgroundColor: '#AAB9C5',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 10,
    marginHorizontal: 6,
    minWidth: 120,
    alignItems: 'center',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default ProfileInfo;


