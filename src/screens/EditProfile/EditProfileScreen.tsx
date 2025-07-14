import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Modal, ScrollView, Keyboard } from 'react-native';
import { UserContext } from '../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import InputNavigation from '../../compoments/InputNavigation';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useTranslation } from 'react-i18next';

const EditProfileScreen = () => {
  const { user, setUser } = useContext(UserContext);
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    typeof user?.avatar === 'string' ? user.avatar : null
  );
  const [cover, setCover] = useState<string | null>(
    typeof user?.cover === 'string' ? user.cover : null
  );
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [showCoverPickerModal, setShowCoverPickerModal] = useState(false);
  const [showAvatarPickerModal, setShowAvatarPickerModal] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);


  useEffect(() => {
    // Khi vào màn hình, input phải rỗng, chỉ hiện hint (placeholder) là tên/email hiện tại
    setName('');
    setEmail('');
    setAvatarUrl(typeof user?.avatar === 'string' ? user.avatar : null);
    setCover(typeof user?.cover === 'string' ? user.cover : null);
  }, [user]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

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

  // --- SỬA: Khi bấm lưu, lưu đúng avatarUrl và cover vào context ---
  const handleSave = () => {
    setUser({
      ...user,
      name,
      email,
      avatar: avatarUrl || require('../../assert/image/avatar.png'),
      cover: cover || require('../../assert/image/cover.png'), // Nếu không có thì dùng cover mặc định
      joined: user?.joined,
      point: user?.point,
    });
    navigation.goBack();
  };

  // --- SỬA: Kiểm tra thay đổi đúng ---
  const isChanged =
    name !== user?.name ||
    email !== user?.email ||
    (avatarUrl && avatarUrl !== (typeof user?.avatar === 'string' ? user.avatar : null)) ||
    (cover && cover !== (typeof user?.cover === 'string' ? user.cover : null));

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Image
            source={require('../../assert/image/back.png')}
            style={{ width: 44, height: 44, tintColor: '#fff' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('editprofile')}</Text>
        <View style={{ width: 40 }} />
      </View>
      {/* Cover image */}
      <ScrollView>
        <View style={styles.bannerWrap}>
          <Image
            source={
              cover
                ? { uri: cover }
                : require('../../assert/image/cover.png')
            }
            style={styles.bannerImg}
          />
          {/* Camera icon ở chính giữa cover */}
          <TouchableOpacity
            style={styles.cameraBtnCenter}
            onPress={() => setShowCoverPickerModal(true)}
          >
            <Image
              source={require('../../assert/image/camera.png')}
              style={{ width: 24, height: 24, tintColor: undefined }}
            />
          </TouchableOpacity>
        </View>
        {/* Avatar + Thay ảnh */}
        <View style={styles.avatarSection}>
          <Image
            source={
              avatarUrl
                ? { uri: avatarUrl }
                : require('../../assert/image/avatar.png')
            }
            style={styles.avatar}
          />
          <TouchableOpacity
            style={styles.changeAvatarBtn}
            onPress={() => setShowAvatarPickerModal(true)}
          >
            <Text style={styles.changeAvatarText}>{t('changeavatar')}</Text>
          </TouchableOpacity>
        </View>
        <Modal
          visible={showPickerModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPickerModal(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: 320 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>{t('chooseavatar')}</Text>
              <TouchableOpacity style={{ marginBottom: 12 }} onPress={pickAvatarFromLibrary}>
                <Text style={{ color: '#ff6f2c', fontWeight: 'bold', fontSize: 15 }}>{t('choosefromlibrary')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginBottom: 12 }} onPress={pickAvatarFromCamera}>
                <Text style={{ color: '#ff6f2c', fontWeight: 'bold', fontSize: 15 }}>{t('takephoto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowPickerModal(false)}>
                <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 15 }}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={showCoverPickerModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowCoverPickerModal(false)}
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.25)' }}>
            <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 20, width: 320 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>{t('choosecover')}</Text>
              <TouchableOpacity style={{ marginBottom: 12 }} onPress={pickCoverFromLibrary}>
                <Text style={{ color: '#ff6f2c', fontWeight: 'bold', fontSize: 15 }}>{t('choosefromlibrary')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ marginBottom: 12 }} onPress={pickCoverFromCamera}>
                <Text style={{ color: '#ff6f2c', fontWeight: 'bold', fontSize: 15 }}>{t('takephoto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowCoverPickerModal(false)}>
                <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 15 }}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Modal
          visible={showAvatarPickerModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAvatarPickerModal(false)}
        >
          <View style={styles.dialogOverlay}>
            <View style={styles.dialogBox}>
              <Text style={styles.dialogTitle}>{t('chooseavatar')}</Text>
              <TouchableOpacity
                style={[styles.dialogBtn, { backgroundColor: '#ff6f2c', marginBottom: 12 }]}
                onPress={pickAvatarFromLibrary}
              >
                <Text style={styles.dialogBtnText}>{t('choosefromlibrary')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogBtn, { backgroundColor: '#ff6f2c', marginBottom: 12 }]}
                onPress={pickAvatarFromCamera}
              >
                <Text style={styles.dialogBtnText}>{t('takephoto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogBtn, { backgroundColor: '#eee' }]}
                onPress={() => setShowAvatarPickerModal(false)}
              >
                <Text style={[styles.dialogBtnText, { color: '#888' }]}>{t('cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <Text style={styles.label}>{t('fullname')}</Text>
            <View style={styles.inputWrap}>
              <InputNavigation
                value={name}
                onChangeText={setName}
                placeholder={user?.name || t('enterfullnameplaceholder')}
                placeholderTextColor="#bbb"
                style={styles.input}
              />
              {/* Chỉ hiện icon clear khi có text */}
              {name.length > 0 && (
                <TouchableOpacity style={styles.clearBtn} onPress={() => setName('')}>
                  <Image source={require('../../assert/image/cancel.png')} style={styles.clearIcon} />
                </TouchableOpacity>
              )}
            </View>
            <Text style={styles.label}>{t('emailaddress')}</Text>
            <View style={styles.inputWrap}>
              <InputNavigation
                value={email}
                onChangeText={setEmail}
                placeholder={user?.email || t('emailplaceholder')}
                placeholderTextColor="#bbb"
                style={styles.input}
              />
              {/* Chỉ hiện icon clear khi có text */}
              {email.length > 0 && (
                <TouchableOpacity style={styles.clearBtn} onPress={() => setEmail('')}>
                  <Image source={require('../../assert/image/cancel.png')} style={styles.clearIcon} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      {!isKeyboardVisible && <View style={[styles.saveBtnWrapper, { zIndex: 10 }]} pointerEvents="box-none">
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          disabled={!isChanged}
        >
          <Text style={styles.saveBtnText}>{t('saveprofile')}</Text>
        </TouchableOpacity>
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6', // Nền tổng thể là màu xám
  },
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
    transform: [{ translateX: -12 }, { translateY: -12 }], // icon 24x24
    zIndex: 2,
    padding: 0,
    backgroundColor: 'transparent',
    borderRadius: 0,
    elevation: 0,
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
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6', // Grey background for this section
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#eee',
    marginRight: 16,
    borderWidth: 1, // Add border to avatar
    borderColor: '#ddd', // Avatar border color
  },
  changeAvatarBtn: {
    backgroundColor: '#AAB9C5',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  changeAvatarText: {
    color: '#FCFCFC',
    fontWeight: 'bold',
    fontSize: 15,
  },
  formContainer: { // New container to manage the white form area's layout
    backgroundColor: '#F6F6F6', // The background outside the white form
    paddingTop: 8, // Small padding on top to separate from the avatar section
    flex: 1, // Allow it to take up remaining space
  },
  form: {
    backgroundColor: '#fff', // Form background is white
    borderRadius: 0, // No border radius to make it span full width
    marginHorizontal: 0, // Remove horizontal margin to span full width
    padding: 16,
    // Removed marginBottom, as the save button wrapper handles bottom spacing
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
    borderWidth: 1, // Add border to input wrap
    borderColor: '#ccc', // Border color for input wrap
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
    borderTopWidth: 1,
    borderColor: '#eee',
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