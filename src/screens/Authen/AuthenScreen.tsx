import React from 'react';
import { Image, Text } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import AuthForm from '../../compoments/AuthForm';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = 20;

const AuthenScreen = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  return (
    <AuthForm>
      <ButtonNavigation
        title={t('loginwithemail') }
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
        title={t('loginwithgoogle')}
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
        title={t('loginwithfacebook') }
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
        {t('loginagreeterms') }
      </Text>
    </AuthForm>
  );
};

export default AuthenScreen;
