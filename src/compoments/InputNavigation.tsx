import React from 'react';
import { View, TextInput, StyleSheet, TextStyle, TextInputProps } from 'react-native';

interface InputNavigationProps extends TextInputProps {
  style?: TextStyle | TextStyle[];
  rightIcon?: React.ReactNode;
}

const InputNavigation = React.forwardRef<TextInput, InputNavigationProps>(
  ({ style, rightIcon, ...props }, ref) => (
    // Áp dụng style prop lên TextInput trực tiếp để các thuộc tính như height, paddingTop, textAlignVertical có tác dụng
    // Nếu bạn vẫn muốn có một View bọc bên ngoài cho border, hãy cẩn thận với height và padding của nó.
    // Cách an toàn hơn là áp dụng border và borderRadius trực tiếp lên TextInput.
    <TextInput
      ref={ref}
      style={[styles.input, style]} // <--- THAY ĐỔI LỚN Ở ĐÂY: style prop được truyền trực tiếp vào TextInput
      {...props}
      underlineColorAndroid="transparent"
      placeholderTextColor={props.placeholderTextColor || '#bdbdbd'}
      selectionColor="#ff6f2c"
    />
    // Nếu bạn cần rightIcon, bạn sẽ cần phải cấu trúc lại component này để bọc TextInput và rightIcon trong một View
    // và quản lý flexbox cho chúng. Nhưng với mục tiêu hiện tại là sửa placeholder, chúng ta tập trung vào TextInput.
    // Tạm thời loại bỏ View bọc nếu rightIcon không phải là yêu cầu bắt buộc cho mọi InputNavigation.
    // Hoặc giữ View bọc nhưng điều chỉnh style cho nó và TextInput bên trong.
  )
);

const styles = StyleSheet.create({
  // Giữ các style chung cho TextInput ở đây, nhưng loại bỏ chiều cao và padding dọc cố định.
  // Các style này sẽ là "base" cho mọi InputNavigation.
  input: {
    flex: 1, // Để nó tự co giãn theo không gian
    borderWidth: 1.5, // Border được áp dụng trực tiếp lên TextInput
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 12, // padding ngang cố định
    fontSize: 17, // cỡ chữ mặc định
    color: '#222',
    // Loại bỏ height, minHeight, paddingVertical cứng ở đây
    // Thay vào đó, để chúng được kiểm soát từ bên ngoài thông qua style prop
    // Ví dụ: AddStepScreen sẽ truyền height: 110, paddingTop: 4 cho contentInput
  },
  // Nếu bạn vẫn muốn có một View bọc để căn chỉnh rightIcon, bạn sẽ cần một cấu trúc khác
  // inputWrap: { // Cái này có thể không cần nếu border và borderRadius áp dụng trực tiếp cho input
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  //   paddingRight: 8,
  //   paddingLeft: 12,
  //   marginTop: 2,
  //   marginBottom: 2,
  // },
  rightIcon: {
    marginLeft: 0,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default InputNavigation;