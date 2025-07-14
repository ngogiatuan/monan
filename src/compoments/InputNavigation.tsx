import React from 'react';
import { View, TextInput, StyleSheet, TextStyle, TextInputProps, TouchableOpacity } from 'react-native';

interface InputNavigationProps extends TextInputProps {
  style?: TextStyle | TextStyle[];
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
}

const InputNavigation = React.forwardRef<TextInput, InputNavigationProps>(
  ({ style, rightIcon, onRightIconPress, ...props }, ref) => {
    // Nếu có rightIcon thì bọc TextInput và icon trong một View với flexDirection: 'row'
    if (rightIcon) {
      return (
        <View style={styles.inputWrap}>
          <TextInput
            ref={ref}
            style={[styles.input, style, { flex: 1 }]}
            {...props}
            underlineColorAndroid="transparent"
            placeholderTextColor={props.placeholderTextColor || '#bdbdbd'}
            selectionColor="#ff6f2c"
          />
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={onRightIconPress}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {rightIcon}
          </TouchableOpacity>
        </View>
      );
    }
    // Nếu không có rightIcon thì chỉ render TextInput như cũ
    return (
      <TextInput
        ref={ref}
        style={[styles.input, style]}
        {...props}
        underlineColorAndroid="transparent"
        placeholderTextColor={props.placeholderTextColor || '#bdbdbd'}
        selectionColor="#ff6f2c"
      />
    );
  }
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontSize: 17,
    color: '#222',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    // Đảm bảo không bị tràn icon ra ngoài
    paddingRight: 4,
    paddingLeft: 0,
  },
  rightIcon: {
    marginLeft: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 8,
  },
});

export default InputNavigation;