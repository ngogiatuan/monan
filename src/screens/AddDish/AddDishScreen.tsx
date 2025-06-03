import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const AddDishScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.uploadBtn}>
        <Text style={styles.uploadText}>Đăng tải ảnh đại diện món ăn</Text>
      </TouchableOpacity>
      <TextInput style={styles.input} placeholder="Tên món / Cách nấu" />
      <TextInput style={styles.input} placeholder="Thời gian nấu" />
      <Text style={styles.label}>Nguyên Liệu</Text>
      <TextInput style={styles.input} placeholder="***" />
      <TextInput style={styles.input} placeholder="250g thịt" />
      <TextInput style={styles.input} placeholder="300ml nước" />
      <TouchableOpacity>
        <Text style={styles.addIngredient}>+ Nguyên liệu</Text>
      </TouchableOpacity>
      <Text style={styles.label}>Cách Làm</Text>
      <TouchableOpacity style={styles.stepBtn}>
        <Text>+ Thêm bước</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveText}>Lưu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  uploadBtn: { backgroundColor: '#eee', padding: 16, alignItems: 'center', borderRadius: 8, marginBottom: 16 },
  uploadText: { color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 12 },
  label: { fontWeight: 'bold', marginBottom: 4 },
  addIngredient: { color: '#ff9800', marginBottom: 16 },
  stepBtn: { backgroundColor: '#eee', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 24 },
  saveBtn: { backgroundColor: '#ff9800', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 32 },
  saveText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default AddDishScreen;
