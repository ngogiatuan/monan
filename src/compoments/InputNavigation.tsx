import React from 'react';
import { TextInput, StyleSheet, TextStyle, TextInputProps } from 'react-native';

interface InputNavigationProps extends TextInputProps {
  style?: TextStyle | TextStyle[];
}

const InputNavigation = React.forwardRef<TextInput, InputNavigationProps>(
  ({ style, ...props }, ref) => (
    <TextInput
      ref={ref}
      style={[styles.input, style]}
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
