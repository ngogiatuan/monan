import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import InputNavigation from '../../compoments/InputNavigation';

const AddRecipeScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [servings, setServings] = useState(0);
  const [time, setTime] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [tempUrl, setTempUrl] = useState('');

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
          {/* Đổi icon thành ký tự '<' thay vì back.png */}
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tổng quan</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
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
            style={[styles.input, { fontSize: 14, height: 36, minHeight: 36, maxHeight: 36 }]} // nhỏ lại, cùng size với input thời gian
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
        {/* Thêm hình ảnh */}
        <Text style={styles.label}>
          Thêm hình ảnh <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity style={styles.imageUpload} onPress={() => setShowImageDialog(true)}>
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
            style={[styles.input, { height: 80, textAlignVertical: 'top', fontSize: 14 }]} // nhỏ hơn
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
          style={[styles.input, { fontSize: 14, height: 36, minHeight: 36, maxHeight: 36 }]} // nhỏ lại, đồng bộ với tên công thức
          keyboardType="numeric"
          value={time}
          onChangeText={setTime}
          placeholder="Nhập thời gian (phút)"
          placeholderTextColor="#bdbdbd"
        />

        {/* Thêm nguyên liệu */}
        <Text style={styles.label}>Thêm nguyên liệu</Text>
        <InputNavigation
          style={[styles.input, { height: 80, fontSize: 14 }]} // nhỏ hơn
          placeholder="Thêm nguyên liệu của bạn ở đây"
          value={ingredients}
          onChangeText={setIngredients}
          multiline
        />

        {/* Tiếp tục */}
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>Tiếp tục</Text>
        </TouchableOpacity>
      </ScrollView>
      {/* Dialog nhập URL ảnh */}
      <Modal
        visible={showImageDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowImageDialog(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.dialogBox}>
            <Text style={styles.dialogTitle}>Nhập URL hình ảnh</Text>
            <TextInput
              style={styles.dialogInput}
              placeholder="https://example.com/image.jpg"
              value={tempUrl}
              onChangeText={setTempUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <View style={styles.dialogBtnRow}>
              <TouchableOpacity
                style={[styles.dialogBtn, { backgroundColor: '#eee' }]}
                onPress={() => {
                  setShowImageDialog(false);
                  setTempUrl('');
                }}
              >
                <Text style={[styles.dialogBtnText, { color: '#888' }]}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.dialogBtn, { backgroundColor: '#ff6f2c' }]}
                onPress={() => {
                  setImageUrl(tempUrl.trim());
                  setShowImageDialog(false);
                  setTempUrl('');
                }}
                disabled={!tempUrl.trim()}
              >
                <Text style={styles.dialogBtnText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff6f2c',
    height: 60,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerBackBtn: {
    marginRight: 12,
    padding: 4,
  },
  headerBackIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    fontSize: 11, // nhỏ hơn
    marginBottom: 4,
    marginTop: -4,
    marginLeft: 2,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  input: {
    flex: 1,
    marginRight: 4,
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
    minHeight: 120,
    minWidth: 120,
    overflow: 'hidden',
  },
  imageUploadIcon: {
    width: 40,
    height: 40,
    marginBottom: 8,
    tintColor: '#ff6f2c',
  },
  imageUploadIconGray: {
    width: 40,
    height: 40,
    marginBottom: 8,
    tintColor: '#bbb',
  },
  imageUploadText: {
    color: '#ff6f2c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageUploadTextGray: {
    color: '#bbb',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 120,
    height: 120,
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
    justifyContent: 'center', // đảm bảo các nút và số nằm giữa
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
  submitBtn: {
    backgroundColor: '#ff6f2c',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  // Dialog styles
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
  },
  dialogInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 16,
    color: '#222',
    backgroundColor: '#fafafa',
  },
  dialogBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  dialogBtn: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 22,
    marginLeft: 8,
  },
  dialogBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default AddRecipeScreen;
