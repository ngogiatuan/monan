import React from 'react';
import { View, StyleSheet, ImageBackground, Image, Text } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';

const ICON_SIZE = 20;

const AuthenScreen = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
      source={require('../../assert/image/authen.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.bottomSheet}>
        <ButtonNavigation
          title="Đăng nhập bằng Email"
          backgroundColor="#fff"
          color="#222"
          style={styles.button}
          textStyle={styles.buttonText}
          onPress={() => navigation.navigate(nav.login as never)}
          children={
            <Image
              source={require('../../assert/image/email.png')}
              style={styles.icon}
            />
          }
        />
        <ButtonNavigation
          title="Đăng nhập bằng Google"
          backgroundColor="#fff"
          color="#222"
          style={styles.button}
          textStyle={styles.buttonText}
          children={
            <Image
              source={require('../../assert/image/Google.png')}
              style={styles.icon}
            />
          }
        />
        <ButtonNavigation
          title="Đăng nhập bằng Facebook"
          backgroundColor="#fff"
          color="#222"
          style={styles.button}
          textStyle={styles.buttonText}
          children={
            <Image
              source={require('../../assert/image/facebook.png')}
              style={styles.icon}
            />
          }
        />
        <Text style={styles.policy}>
          Bằng cách đăng nhập, bạn sẽ đồng ý với Điều khoản sử dụng
          và Chính sách bảo mật của chúng tôi
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  buttonText: {
    flex: 1,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 16,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    marginLeft: 12,
    alignSelf: 'center',
  },
  policy: {
    marginTop: 18,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default AuthenScreen;
