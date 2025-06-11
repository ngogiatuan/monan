import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface RecipeEmptyProps {
  onExplore: () => void;
}

const RecipeEmpty = ({ onExplore }: RecipeEmptyProps) => (
  <View style={styles.container}>
    <Image source={require('../assert/image/fire.png')} style={styles.icon} />
    <Text style={styles.text}>Bạn chưa sở hữu Quest nào</Text>
    <TouchableOpacity style={styles.btn} onPress={onExplore}>
      <Text style={styles.btnText}>Khám phá ngay {'>'}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 60,
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: 18,
  },
  text: {
    color: '#888',
    fontSize: 15,
    marginBottom: 18,
  },
  btn: {
    backgroundColor: '#ff6f2c',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginTop: 8,
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default RecipeEmpty;
