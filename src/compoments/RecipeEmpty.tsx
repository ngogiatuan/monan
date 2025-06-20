import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import ButtonNavigation from './ButtonNavigation';

interface RecipeEmptyProps {
  onAddRecipe?: () => void;
  onExplore?: () => void;
}

const RecipeEmpty = ({ onAddRecipe, onExplore }: RecipeEmptyProps) => (
  <View style={styles.container}>
    <Image source={require('../assert/image/fire.png')} style={styles.icon} resizeMode='contain' />
    <Text style={styles.text}>
      {onAddRecipe ? 'Bạn chưa có công thức nào' : 'Bạn chưa sở hữu Quest nào'}
    </Text>
    {onAddRecipe ? (
      <ButtonNavigation
        title="Thêm công thức của tôi"
        backgroundColor="#ff6f2c"
        color="#fff"
        style={styles.btn}
        textStyle={styles.btnText}
        onPress={onAddRecipe}
      />
    ) : onExplore ? (
      <ButtonNavigation
        title="Khám phá ngay >"
        backgroundColor="#ff6f2c"
        color="#fff"
        style={styles.btn}
        textStyle={styles.btnText}
        onPress={onExplore}
      />
    ) : null}
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
    borderRadius: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 8,
    width: 200,
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 12,
  },
});

export default RecipeEmpty;
// Đúng interface chỉ nhận onExplore, không nhận onAddRecipe.
// Nếu muốn dùng cho nhiều mục đích, hãy mở rộng interface, còn hiện tại chỉ dùng onExplore.
