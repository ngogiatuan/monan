import React, { useRef, useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import AuthForm from '../../compoments/AuthForm';

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
    <AuthForm
      title="Xác thực email"
      desc="Bạn vui lòng nhập mã xác thực đã được gửi qua exa****@email.com"
      showBack
      onBack={() => navigation.goBack()}
    >
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
    </AuthForm>
  );
};

const styles = StyleSheet.create({
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
