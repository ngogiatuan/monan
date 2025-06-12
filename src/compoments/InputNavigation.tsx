import React from 'react';
import { View, TextInput, StyleSheet, TextStyle, TextInputProps } from 'react-native';

interface InputNavigationProps extends TextInputProps {
  style?: TextStyle | TextStyle[];
  rightIcon?: React.ReactNode;
}

const InputNavigation = React.forwardRef<TextInput, InputNavigationProps>(
  ({ style, rightIcon, ...props }, ref) => (
    <View style={[styles.inputWrap, style]}>
      <TextInput
        ref={ref}
        style={styles.input}
        {...props}
        // Fix: Không bị phóng to khi nhập, giữ chiều cao cố định
        underlineColorAndroid="transparent"
        placeholderTextColor={props.placeholderTextColor || '#bdbdbd'}
        // Thêm cỡ chữ nhỏ cho placeholder
        selectionColor="#ff6f2c"
      />
      {rightIcon ? <View style={styles.rightIcon}>{rightIcon}</View> : null}
    </View>
  )
);

const styles = StyleSheet.create({
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingRight: 8,
    paddingLeft: 12,
    minHeight: 52,
    height: 52, // Thêm height cố định
    marginTop: 2,
    marginBottom: 2,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 0,
    fontSize: 17,
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: '#222',
    height: 52, // Thêm height cố định
  },
  rightIcon: {
    marginLeft: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

// Đảm bảo placeholder fontSize nhỏ hơn bằng cách override trong style prop khi dùng
export default InputNavigation;
