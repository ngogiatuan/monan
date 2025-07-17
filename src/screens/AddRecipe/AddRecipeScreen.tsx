/* eslint-disable react-native/no-inline-styles */
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TextInput, Platform, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import InputNavigation from '../../compoments/InputNavigation';
import { nav } from '../../navigation/navigationName';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { getRecipes } from '../../api/recipeApi'; // Import your getRecipes API

const AddRecipeScreen = () => {
  const navigation = useNavigation<any>();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [servings, setServings] = useState(0);
  const [time, setTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // New state for custom error modal
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorTitle, setErrorTitle] = useState(''); // Added state for title

  // Function to show custom error modal
  const showCustomError = (title: string, message: string) => {
    setErrorTitle(title); // Set the title
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  const validateInputs = () => {
    if (!name.trim()) {
      showCustomError('Lỗi', 'Vui lòng nhập tên công thức.');
      return false;
    }
    if (!imageUrl) {
      showCustomError('Lỗi', 'Vui lòng thêm hình ảnh cho công thức.');
      return false;
    }
    if (servings === 0) {
      showCustomError('Lỗi', 'Vui lòng chọn khẩu phần ăn (phải lớn hơn 0).');
      return false;
    }
    if (!time.trim() || isNaN(Number(time)) || Number(time) <= 0) {
      showCustomError('Lỗi', 'Vui lòng nhập thời gian dự kiến hợp lệ (phải là số và lớn hơn 0 phút).');
      return false;
    }
    return true;
  };

  const checkDuplicateRecipeName = async (recipeName: string) => {
    try {
      const allRecipes = await getRecipes(1, 1000);
      const lowerCaseNewName = recipeName.trim().toLowerCase();
      const isDuplicate = allRecipes.some(
        (recipe: any) => recipe.name.toLowerCase() === lowerCaseNewName
      );
      return isDuplicate;
    } catch (error) {
      console.error('Error checking duplicate recipe name:', error);
      showCustomError('Lỗi', 'Không thể kiểm tra trùng lặp tên món ăn. Vui lòng thử lại.');
      return true;
    }
  };

  const handleContinue = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);

    const isDuplicate = await checkDuplicateRecipeName(name);

    setIsLoading(false);

    if (isDuplicate) {
      showCustomError(
        'Lỗi',
        'Tên công thức này đã tồn tại. Vui lòng chọn một tên khác.'
      );
    } else {
      navigation.navigate(nav.rank);
    }
  };

  const pickImageFromLibrary = () => {
    setShowImagePickerModal(false);
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.7 },
      (response) => {
        if (response.assets && response.assets.length > 0) {
          setImageUrl(response.assets[0].uri || null);
        }
      }
    );
  };

  const pickImageFromCamera = () => {
    setShowImagePickerModal(false);
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
          <Image
            source={require('../../assert/image/back.png')}
            style={styles.backIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tổng quan công thức</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContentContainer}>
        {/* Tên công thức */}
        <Text style={styles.label}>
          Tên công thức <Text style={styles.required}>*</Text>
        </Text>
        <Text style={styles.note}>* nghĩa là ô bắt buộc</Text>
        <View style={styles.inputWrap}>
          <InputNavigation
            placeholder="Nhập tên công thức"
            placeholderTextColor="#bdbdbd"
            value={name}
            onChangeText={setName}
            style={[styles.input, { fontSize: 14, minHeight: 36 }]}
          />
          {name.length > 0 && (
            <TouchableOpacity onPress={() => setName('')}>
              <Image
                source={require('../../assert/image/cancel.png')}
                style={styles.cancelIcon}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Thêm hình ảnh - Sử dụng lựa chọn ảnh từ thư viện/camera */}
        <Text style={styles.label}>
          Thêm hình ảnh <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity style={styles.imageUpload} onPress={() => setShowImagePickerModal(true)}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
          ) : (
            <>
              <Image source={require('../../assert/image/anh.png')} style={styles.imageUploadIconGray} />
              <Text style={styles.imageUploadTextGray}>Tải hình ảnh lên</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Mô tả công thức */}
        <Text style={styles.label}>Mô tả công thức</Text>
        <View style={styles.inputWrap}>
          <InputNavigation
            style={[styles.input, { height: 80, textAlignVertical: 'top', fontSize: 14 }]}
            placeholder="Mô tả về công thức của bạn"
            placeholderTextColor="#bdbdbd"
            value={desc}
            onChangeText={setDesc}
            multiline
          />
        </View>

        {/* Khẩu phần ăn */}
        <Text style={styles.label}>Khẩu phần ăn <Text style={styles.required}>*</Text></Text>
        <View style={styles.servingRow}>
          <Text style={styles.servingLabel}>Có bao nhiêu người có thể thoải mái thưởng thức món ăn này? (khẩu phần)</Text>
          <View style={styles.servingInputRow}>
            <TouchableOpacity
              style={styles.servingBtn}
              onPress={() => setServings(prev => Math.max(0, prev - 1))}
            >
              <Image source={require('../../assert/image/minus.png')} style={styles.servingBtnIcon} />
            </TouchableOpacity>
            <View style={styles.servingNumberBox}>
              <Text style={styles.servingNumberText}>{servings}</Text>
            </View>
            <TouchableOpacity
              style={styles.servingBtn}
              onPress={() => setServings(prev => prev + 1)}
            >
              <Image source={require('../../assert/image/plus.png')} style={styles.servingBtnIcon} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Thời gian dự kiến */}
        <Text style={styles.label}>Thời gian dự kiến <Text style={styles.required}>*</Text></Text>
        <Text style={styles.timeDesc}>
          Thời gian ước tính cần thiết để hoàn thành món ăn của bạn (theo đơn vị phút).
        </Text>
        <InputNavigation
          style={[styles.input2, { fontSize: 14, minHeight: 36 }]}
          keyboardType="numeric"
          value={time}
          onChangeText={setTime}
          placeholder="Nhập thời gian (phút)"
          placeholderTextColor="#bdbdbd"
        />

        {/* Thêm nguyên liệu */}
        <Text style={styles.label}>Thêm nguyên liệu</Text>
        <InputNavigation
          style={[styles.input2, { height: 80, fontSize: 14, textAlignVertical: 'top' }]}
          placeholder="Thêm nguyên liệu của bạn ở đây"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />
      </ScrollView>

      {/* Fixed Button Container */}
      <View style={styles.bottomButtonContainer}>
        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Tiếp tục</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal for Image Picking Options */}
      <Modal
        visible={showImagePickerModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImagePickerModal(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Chọn ảnh công thức</Text>
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

      {/* Custom Error Modal (Updated) */}
      <Modal
        visible={showErrorModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowErrorModal(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.errorDialogBox}>
            <Text style={styles.errorDialogTitle}>{errorTitle}</Text> {/* Use errorTitle here */}
            <Text style={styles.errorDialogMessage}>{errorMessage}</Text>
            <View style={styles.errorButtonContainer}> {/* New container for button */}
              <TouchableOpacity
                style={styles.errorOkButton}
                onPress={() => setShowErrorModal(false)}
              >
                <Text style={styles.errorOkButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    position: 'relative',
  },
  headerBackBtn: {
    padding: 4,
    marginRight: 0,
    zIndex: 1,
  },
  backIcon: {
    width: 30,
    height: 30,
    tintColor: '#fff',
    marginLeft: -4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    textAlignVertical: 'center',
  },
  scrollContentContainer: {
    padding: 16,
    paddingBottom: 24,
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
    marginBottom: 0,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingRight: 8,
    borderColor: '#E0E0E0'
  },
  input: {
    borderWidth: 0,
    borderColor: 'transparent',
    flex: 1,
    marginRight: 4,
  },
  input2: {
    flex: 1,
    marginRight: 4,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingRight: 8,
    borderColor: '#E0E0E0',
    paddingVertical: 10,
    paddingLeft: 12,
  },
  cancelIcon: {
    width: 20,
    height: 20,
    tintColor: '#bbb',
    marginLeft: 4,
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
    marginBottom: 16,
    height: 300,
    width: '100%',
    overflow: 'hidden',
    borderStyle: 'dashed',
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
  servingRow: {
    marginBottom: 16,
  },
  servingLabel: {
    color: '#888',
    fontSize: 13,
    marginBottom: 6,
  },
  servingInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  servingBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f2f2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  servingBtnIcon: {
    width: 18,
    height: 18,
    tintColor: '#ff6f2c',
  },
  servingNumberBox: {
    width: 48,
    height: 36,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
  servingNumberText: {
    fontSize: 16,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  timeDesc: {
    color: '#888',
    fontSize: 13,
    marginBottom: 6,
  },
  bottomButtonContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  submitBtn: {
    backgroundColor: '#ff6f2c',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
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
    textAlign: 'center',
  },
  dialogBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
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
  // Updated styles for custom error modal
  errorDialogBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    // Adjusted padding for a more horizontal rectangle look
    paddingHorizontal: 24,
    paddingVertical: 18,
    width: '85%', // Wider
    // Removed alignItems: 'center' from here
    elevation: 4,
  },
  errorDialogTitle: { // New style for the title in error dialog
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 10,
  },
  errorDialogMessage: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
  },
  errorButtonContainer: { // Container to align button to the right
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  errorOkButton: {
    backgroundColor: '#ff6f2c',
    borderRadius: 8, // Slightly more rounded corners
    paddingVertical: 8, // Smaller vertical padding
    paddingHorizontal: 18, // More horizontal padding
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default AddRecipeScreen;