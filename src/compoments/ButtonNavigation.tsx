import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ButtonNavigationProps {
  title: string;
  onPress?: () => void;
  backgroundColor?: string;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode; // thêm dòng này
}

const ButtonNavigation = ({
  title,
  onPress,
  backgroundColor = '#ff9800',
  color = '#fff',
  disabled = false,
  style,
  textStyle,
  children, // thêm dòng này
}: ButtonNavigationProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: disabled ? '#eee' : backgroundColor },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.text, { color: disabled ? '#bbb' : color }, textStyle]}>
        {title}
      </Text>
      {children /* icon truyền vào sẽ nằm bên phải */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ButtonNavigation;
