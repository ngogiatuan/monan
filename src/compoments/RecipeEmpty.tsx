import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ButtonNavigation from './ButtonNavigation';

interface RecipeEmptyProps {
  onAddRecipe?: () => void;
  onExplore?: () => void;
  isConnected?: boolean;
  isGuest?: boolean;
}

const RecipeEmpty = ({ onAddRecipe, onExplore, isConnected, isGuest }: RecipeEmptyProps) => (
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
        onPress={() => {
          if (isConnected === false) {
            Alert.alert('Không có kết nối mạng', 'Vui lòng bật wifi hoặc dữ liệu di động để khám phá công thức.');
            return;
          }
          if (isGuest) {
            Alert.alert('Vui lòng đăng nhập để khám phá công thức!');
            return;
          }
          onExplore && onExplore();
        }}
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
