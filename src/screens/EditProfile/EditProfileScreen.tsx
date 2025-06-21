import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { UserContext } from '../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import InputNavigation from '../../compoments/InputNavigation';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const EditProfileScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation<any>();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [cover, setCover] = useState<string | null>(null);
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [showCoverPickerModal, setShowCoverPickerModal] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showAvatarPickerModal, setShowAvatarPickerModal] = useState(false);

  const pickImageFromLibrary = () => {
    setShowPickerModal(false);
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.7 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setAvatar(response.assets[0].uri || null);
        }
      }
    );
  };

  const pickImageFromCamera = () => {
    setShowPickerModal(false);
    launchCamera(
      { mediaType: 'photo', quality: 0.7, saveToPhotos: true },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setAvatar(response.assets[0].uri || null);
        }
      }
    );
  };

  const pickCoverFromLibrary = () => {
    setShowCoverPickerModal(false);
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.7 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setCover(response.assets[0].uri || null);
        }
      }
    );
  };

  const pickCoverFromCamera = () => {
    setShowCoverPickerModal(false);
    launchCamera(
      { mediaType: 'photo', quality: 0.7, saveToPhotos: true },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setCover(response.assets[0].uri || null);
        }
      }
    );
  };

  const pickAvatarFromLibrary = () => {
    setShowAvatarPickerModal(false);
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.7 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setAvatarUrl(response.assets[0].uri || null);
        }
      }
    );
  };

  const pickAvatarFromCamera = () => {
    setShowAvatarPickerModal(false);
    launchCamera(
      { mediaType: 'photo', quality: 0.7, saveToPhotos: true },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setAvatarUrl(response.assets[0].uri || null);
        }
      }
    );
  };

  // Khi bấm lưu hồ sơ, cập nhật user context nếu có thay đổi
  const handleSave = () => {
    setUser({
      ...user,
      name,
      email,
      avatar: avatarUrl || avatar || user?.avatar, // luôn ưu tiên avatarUrl mới nhất
      cover: cover || user?.cover, // luôn ưu tiên cover mới nhất
      joined: user?.joined,
      point: user?.point,
    });
    navigation.goBack();
  };

  // Kiểm tra có thay đổi gì không để disable nút lưu nếu không đổi gì
  const isChanged =
    name !== user?.name ||
    email !== user?.email ||
    (avatarUrl && avatarUrl !== user?.avatar) ||
    (cover && cover !== user?.cover);

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
          source={cover ? { uri: cover } : require('../../assert/image/cover.png')}
          style={styles.bannerImg}
        />
        {/* Camera icon ở chính giữa cover */}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: [{ translateX: -12 }, { translateY: -12 }], // icon 24x24
            zIndex: 2,
            padding: 0,
            backgroundColor: 'transparent',
            borderRadius: 0,
            elevation: 0,
          }}
          onPress={() => setShowCoverPickerModal(true)}
        >
          <Image
            source={require('../../assert/image/camera.png')}
            style={{ width: 24, height: 24, tintColor: undefined }}
          />
        </TouchableOpacity>
      </View>
      {/* Avatar + Thay ảnh */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F6F6F6', paddingVertical: 20, paddingHorizontal: 20 }}>
        <Image
          source={avatarUrl ? { uri: avatarUrl } : require('../../assert/image/avatar.png')}
          style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#eee', marginRight: 16 }}
        />
        <TouchableOpacity
          style={{
            backgroundColor: '#E5E5E5',
            borderRadius: 8,
            paddingVertical: 8,
            paddingHorizontal: 24,
          }}
          onPress={() => setShowAvatarPickerModal(true)}
        >
          <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 15 }}>Thay ảnh</Text>
        </TouchableOpacity>
      </View>
      {/* Modal chọn ảnh/camera */}
      <Modal
        visible={showPickerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPickerModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: 320 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Chọn hình đại diện</Text>
            <TouchableOpacity style={{ marginBottom: 12 }} onPress={pickImageFromLibrary}>
              <Text style={{ color: '#ff6f2c', fontWeight: 'bold', fontSize: 15 }}>Chọn từ thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginBottom: 12 }} onPress={pickImageFromCamera}>
              <Text style={{ color: '#ff6f2c', fontWeight: 'bold', fontSize: 15 }}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowPickerModal(false)}>
              <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 15 }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal chọn ảnh/camera cho cover */}
      <Modal
        visible={showCoverPickerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCoverPickerModal(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: 320 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Chọn ảnh cover</Text>
            <TouchableOpacity style={{ marginBottom: 12 }} onPress={pickCoverFromLibrary}>
              <Text style={{ color: '#ff6f2c', fontWeight: 'bold', fontSize: 15 }}>Chọn từ thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginBottom: 12 }} onPress={pickCoverFromCamera}>
              <Text style={{ color: '#ff6f2c', fontWeight: 'bold', fontSize: 15 }}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowCoverPickerModal(false)}>
              <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 15 }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Modal chọn ảnh/camera cho avatar */}
      <Modal
        visible={showAvatarPickerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAvatarPickerModal(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Chọn ảnh đại diện</Text>
            <TouchableOpacity
              style={[styles.dialogBtn, { backgroundColor: '#ff6f2c', marginBottom: 12 }]}
              onPress={pickAvatarFromLibrary}
            >
              <Text style={styles.dialogBtnText}>Chọn từ thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dialogBtn, { backgroundColor: '#ff6f2c', marginBottom: 12 }]}
              onPress={pickAvatarFromCamera}
            >
              <Text style={styles.dialogBtnText}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dialogBtn, { backgroundColor: '#eee' }]}
              onPress={() => setShowAvatarPickerModal(false)}
            >
              <Text style={[styles.dialogBtnText, { color: '#888' }]}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Form nhập liệu trong ScrollView */}
      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
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
      </ScrollView>
      {/* Nút lưu hồ sơ luôn cố định dưới cùng màn hình, không bị đẩy lên khi bàn phím hiện */}
      <View style={[styles.saveBtnWrapper, { zIndex: 10 }]} pointerEvents="box-none">
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
    height: 180,
    position: 'relative',
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImg: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    resizeMode: 'cover',
  },
  cameraBtnCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -24 }, { translateY: -24 }],
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    elevation: 2,
    zIndex: 2,
  },
  cameraIcon: {
    width: 32,
    height: 32,
    tintColor: '#ff6f2c',
  },
  bigChangeCoverBtn: {
    alignSelf: 'center',
    backgroundColor: '#ff6f2c',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  bigChangeCoverBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
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
    marginTop: 10,
    backgroundColor: '#ff6f2c',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  changeAvatarText: {
    color: '#fff',
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
  dialogOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  dialogBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: 320,
  },
  dialogTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    textAlign: 'center',
  },
  dialogBtn: {
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default EditProfileScreen;

