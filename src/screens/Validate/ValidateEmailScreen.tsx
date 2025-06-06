import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';

const ValidateEmailScreen = () => {
  const navigation = useNavigation();
  const [code, setCode] = useState(['', '', '', '']);
  const inputs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (text: string, idx: number) => {
    if (/^\d*$/.test(text)) {
      const newCode = [...code];
      newCode[idx] = text;
      setCode(newCode);
      if (text && idx < 3) {
        // @ts-ignore
        inputs[idx + 1].current.focus();
      }
    }
  };

  return (
    <ImageBackground
      source={require('../../assert/image/authen.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: 'flex-end' }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.bottomSheet}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>{'< Quay lại'}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Xác thực email</Text>
          <Text style={styles.desc}>
            Bạn vui lòng nhập mã xác thực đã được gửi qua exa****@email.com
          </Text>
          <View style={styles.codeRow}>
            {code.map((v, idx) => (
              <TextInput
                key={idx}
                ref={inputs[idx]}
                style={styles.codeInput}
                value={v}
                onChangeText={text => handleChange(text, idx)}
                keyboardType="number-pad"
                maxLength={1}
                textAlign="center"
                autoFocus={idx === 0}
              />
            ))}
          </View>
          <ButtonNavigation
            title="Tiếp tục"
            onPress={() => navigation.navigate(nav.resetPassword as never)}
          />
        </View>
      </KeyboardAvoidingView>
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
  backText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 8,
    color: '#222',
  },
  desc: {
    color: '#888',
    fontSize: 13,
    marginBottom: 16,
  },
  codeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 12,
  },
  codeInput: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    fontSize: 20,
    backgroundColor: '#fafafa',
    marginHorizontal: 6,
  },
});

export default ValidateEmailScreen;
