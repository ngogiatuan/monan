/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TextInput, SafeAreaView, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'; // Import image picker

// Import các components cần thiết
import InputNavigation from '../../compoments/InputNavigation';
import { nav } from '../../navigation/navigationName';
import BottomNavigation from '../../compoments/Bottomnavigation';

const { width: screenWidth } = Dimensions.get('window');

const AddStepScreen = () => {
  const navigation = useNavigation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  // Thay thế showImageDialog (cho URL) bằng showImagePickerModal (cho chọn/chụp ảnh)
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Hàm chọn ảnh từ thư viện
  const pickImageFromLibrary = () => {
    setShowImagePickerModal(false); // Đóng modal chọn ảnh
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.7 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setImageUrl(response.assets[0].uri || null);
        }
      }
    );
  };

  // Hàm chụp ảnh từ camera
  const pickImageFromCamera = () => {
    setShowImagePickerModal(false); // Đóng modal chọn ảnh
    launchCamera(
      { mediaType: 'photo', quality: 0.7, saveToPhotos: true },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setImageUrl(response.assets[0].uri || null);
        }
      }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bước</Text>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentContainer}>
        {/* Thêm hình ảnh */}
        <Text style={styles.label}>
          Thêm hình ảnh <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.note}>* nghĩa là ô bắt buộc</Text>
        <TouchableOpacity
          style={styles.imageUpload}
          onPress={() => setShowImagePickerModal(true)} // Gọi modal chọn ảnh
        >
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
          ) : (
            <>
              <Image source={require('../../assert/image/anh.png')} style={styles.imageUploadIconGray} />
              <Text style={styles.imageUploadTextGray}>Tải hình ảnh lên</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Tiêu đề */}
        <Text style={styles.label}>
          Tiêu đề <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.inputWrap}>
          <InputNavigation
            placeholder="Khâu chuẩn bị nguyên vật liệu"
            placeholderTextColor="#bdbdbd"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />
          {title.length > 0 && (
            <TouchableOpacity onPress={() => setTitle('')}>
              <Image
                source={require('../../assert/image/cancel.png')}
                style={styles.cancelIcon}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Nội dung */}
        <Text style={styles.label}>
          Nội dung <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.finalInputWrap}>
          <InputNavigation
            style={[
              styles.input,
              styles.contentInput,
            ]}
            placeholder="Mô tả về công thức của bạn"
            placeholderTextColor="#bdbdbd"
            value={content}
            onChangeText={setContent}
            multiline
          />
        </View>

        {/* View có flex: 1 để đẩy các thành phần trên và đẩy footer xuống */}
        <View style={{ flex: 1 }} />

      </View>

      {/* Buttons - Cố định ở cuối màn hình */}
      <View style={styles.bottomButtonsContainer}>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.actionButton, styles.doneButton]}
            onPress={() => {
              console.log('Xong button pressed');
              navigation.goBack();
            }}
          >
            <Text style={styles.doneButtonText}>Xong</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.continueButton]}
            onPress={() => {
              console.log('Tiếp tục button pressed');
              // navigation.navigate(nav.someOtherScreen);
            }}
          >
            <Text style={styles.continueButtonText}>Tiếp tục</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* MODAL MỚI: Modal chọn ảnh/camera */}
      <Modal
        visible={showImagePickerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImagePickerModal(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Chọn hình ảnh</Text>
            <TouchableOpacity
              style={[styles.dialogBtn, { backgroundColor: '#ff6f2c', marginBottom: 12 }]}
              onPress={pickImageFromLibrary}
            >
              <Text style={styles.dialogBtnText}>Chọn từ thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dialogBtn, { backgroundColor: '#ff6f2c', marginBottom: 12 }]}
              onPress={pickImageFromCamera}
            >
              <Text style={styles.dialogBtnText}>Chụp ảnh mới</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.dialogBtn, { backgroundColor: '#eee' }]}
              onPress={() => setShowImagePickerModal(false)}
            >
              <Text style={[styles.dialogBtnText, { color: '#888' }]}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Navigation */}
      {/* <BottomNavigation current="rank" /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff6f2c',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  headerBackBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginLeft: -40,
  },

  contentContainer: {
    flex: 1,
    padding: 16,
  },

  label: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 18,
    marginBottom: 6,
    color: '#222',
  },
  required: {
    color: '#ff6f2c',
  },
  note: {
    color: '#bbb',
    fontSize: 11,
    marginBottom: 4,
    marginTop: -4,
    marginLeft: 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  finalInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, // Điều chỉnh giá trị này để có khoảng cách mong muốn
  },
  input: {
    flex: 1,
    marginRight: 4,
    fontSize: 14,
    height: 36,
    minHeight: 36,
    maxHeight: 150,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  contentInput: {
    width: screenWidth - 32,
    height: 110,
    textAlignVertical: 'top',
    paddingTop: 8, // Giảm paddingTop để chữ sát lên trên
    paddingBottom: 8,
    paddingLeft: 12, // Đảm bảo paddingLeft để chữ sát cạnh trái
    paddingRight: 12,
    alignSelf: 'center',
  },
  cancelIcon: {
    width: 20,
    height: 20,
    tintColor: '#bbb',
    marginLeft: 4,
  },
  imageUpload: {
    width: screenWidth - 32,
    height: 160,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    marginBottom: 16,
    overflow: 'hidden',
    borderStyle: 'dashed',
    alignSelf: 'center',
  },
  imageUploadIconGray: {
    width: 40,
    height: 40,
    marginBottom: 8,
    tintColor: '#bbb',
  },
  imageUploadTextGray: {
    color: '#bbb',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },

  bottomButtonsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  doneButton: {
    backgroundColor: '#4CAF50',
  },
  doneButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#ff6f2c',
  },
  continueButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialogBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: 320,
    alignItems: 'stretch',
    elevation: 4,
  },
  dialogTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#222',
    textAlign: 'center', // Căn giữa tiêu đề của dialog
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

export default AddStepScreen;