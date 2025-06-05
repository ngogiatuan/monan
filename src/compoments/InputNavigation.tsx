import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TextStyle, TextInputProps } from 'react-native';

interface InputNavigationProps extends TextInputProps {
  style?: ViewStyle;
  inputStyle?: TextStyle;
}

const InputNavigation = React.forwardRef<TextInput, InputNavigationProps>(
  ({ style, inputStyle, ...props }, ref) => (
    <TextInput
      ref={ref}
      style={[styles.input, inputStyle, style]}
      {...props}
    />
  )
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
});

export default InputNavigation;
