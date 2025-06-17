import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { UserContext } from '../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import InputNavigation from '../../compoments/InputNavigation';

const EditProfileScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation<any>();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Khi bấm lưu hồ sơ, cập nhật user context nếu có thay đổi
  const handleSave = () => {
    setUser({
      ...user,
      name,
      email,
      avatar: user?.avatar, // luôn giữ avatar cũ nếu không đổi
      joined: user?.joined,
      point: user?.point,
    });
    navigation.goBack();
  };

  // Kiểm tra có thay đổi gì không để disable nút lưu nếu không đổi gì
  const isChanged =
    name !== user?.name ||
    email !== user?.email;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image source={require('../../assert/image/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sửa hồ sơ</Text>
        <View style={{ width: 40 }} />
      </View>
      {/* Cover image */}
      <View style={styles.bannerWrap}>
        <Image
          source={require('../../assert/image/cover.png')}
          style={styles.bannerImg}
        />
        <TouchableOpacity style={styles.cameraBtn}>
          <Image
            source={require('../../assert/image/camera.png')}
            style={styles.cameraIcon}
          />
        </TouchableOpacity>
      </View>
      {/* Avatar + Thay ảnh: Đặt dưới cover, không dính vào cover */}
      <View style={styles.avatarRow}>
        <Image
          source={user?.avatar || require('../../assert/image/avatar.png')}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.changeAvatarBtn}>
          <Text style={styles.changeAvatarText}>Thay ảnh</Text>
        </TouchableOpacity>
      </View>
      {/* Form */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <View style={styles.form}>
          <Text style={styles.label}>Tên</Text>
          <View style={styles.inputWrap}>
            <InputNavigation
              value={name}
              onChangeText={setName}
              placeholder="Tên"
              style={styles.input}
            />
            <TouchableOpacity style={styles.clearBtn} onPress={() => setName('')}>
              <Image source={require('../../assert/image/cancel.png')} style={styles.clearIcon} />
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Địa chỉ email</Text>
          <View style={styles.inputWrap}>
            <InputNavigation
              value={email}
              onChangeText={setEmail}
              placeholder="Example@gmail.com"
              style={styles.input}
            />
            <TouchableOpacity style={styles.clearBtn} onPress={() => setEmail('')}>
              <Image source={require('../../assert/image/cancel.png')} style={styles.clearIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      {/* Nút lưu hồ sơ luôn ở dưới cùng */}
      <View style={styles.saveBtnWrapper}>
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={!isChanged}
        >
          <Text style={styles.saveBtnText}>Lưu hồ sơ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FF6600',
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 0,
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 8,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bannerWrap: {
    width: '100%',
    height: 160,
    backgroundColor: '#eee',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImg: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  cameraBtn: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: [{ translateX: -24 }, { translateY: -21 }],
    zIndex: 2,
  },
  cameraIcon: {
    width: 48,
    height: 42,
    resizeMode: 'contain',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginLeft: 24,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#eee',
  },
  changeAvatarBtn: {
    marginLeft: 16,
    backgroundColor: '#E9EEF2',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 8,
  },
  changeAvatarText: {
    color: '#6B7683',
    fontWeight: 'bold',
    fontSize: 15,
  },
  form: {
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    marginTop: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    fontSize: 15,
    marginTop: 12,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  clearBtn: {
    padding: 8,
  },
  clearIcon: {
    width: 18,
    height: 18,
    tintColor: '#bbb',
  },
  saveBtnWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingBottom: 16,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  saveBtn: {
    backgroundColor: '#FF6600',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
});

export default EditProfileScreen;

