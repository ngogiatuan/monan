import React from 'react';
import { Image, Text } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import AuthForm from '../../compoments/AuthForm';

const ICON_SIZE = 20;

const AuthenScreen = () => {
  const navigation = useNavigation();

  return (
    <AuthForm>
      <ButtonNavigation
        title="Đăng nhập bằng Email"
        backgroundColor="#fff"
        color="#222"
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginVertical: 6,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#eee',
        }}
        textStyle={{
          flex: 1,
          textAlign: 'left',
          fontWeight: 'bold',
          fontSize: 16,
        }}
        onPress={() => navigation.navigate(nav.login as never)}
      >
        <Image
          source={require('../../assert/image/email.png')}
          style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            marginLeft: 12,
            alignSelf: 'center',
          }}
        />
      </ButtonNavigation>
      <ButtonNavigation
        title="Đăng nhập bằng Google"
        backgroundColor="#fff"
        color="#222"
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginVertical: 6,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#eee',
        }}
        textStyle={{
          flex: 1,
          textAlign: 'left',
          fontWeight: 'bold',
          fontSize: 16,
        }}
      >
        <Image
          source={require('../../assert/image/Google.png')}
          style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            marginLeft: 12,
            alignSelf: 'center',
          }}
        />
      </ButtonNavigation>
      <ButtonNavigation
        title="Đăng nhập bằng Facebook"
        backgroundColor="#fff"
        color="#222"
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          marginVertical: 6,
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#eee',
        }}
        textStyle={{
          flex: 1,
          textAlign: 'left',
          fontWeight: 'bold',
          fontSize: 16,
        }}
      >
        <Image
          source={require('../../assert/image/facebook.png')}
          style={{
            width: ICON_SIZE,
            height: ICON_SIZE,
            marginLeft: 12,
            alignSelf: 'center',
          }}
        />
      </ButtonNavigation>
      <Text
        style={{
          marginTop: 18,
          fontSize: 12,
          color: '#888',
          textAlign: 'center',
          lineHeight: 18,
        }}
      >
        Bằng cách đăng nhập, bạn sẽ đồng ý với Điều khoản sử dụng
        và Chính sách bảo mật của chúng tôi
      </Text>
    </AuthForm>
  );
};

export default AuthenScreen;
