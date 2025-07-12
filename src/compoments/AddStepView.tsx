/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';

// Import InputNavigation (đảm bảo đường dẫn này đúng)
import InputNavigation from './InputNavigation';

const { width: screenWidth } = Dimensions.get('window');

interface AddStepViewProps {
    imageUrl: string | null;
    title: string;
    content: string;
    setImageUrl: (url: string | null) => void; // Callback để thay đổi ảnh
    setTitle: (text: string) => void;
    setContent: (text: string) => void;
    onShowImagePicker: () => void; // Callback để mở modal chọn ảnh (modal nằm ở màn hình cha)
}

const AddStepView: React.FC<AddStepViewProps> = ({
    imageUrl,
    title,
    content,
    setTitle,
    setContent,
    setImageUrl, // Thêm setImageUrl vào props để có thể reset ảnh từ nút cancel
    onShowImagePicker,
}) => {
    return (
        <View style={styles.container}>
            {/* Thêm hình ảnh */}
            <Text style={styles.label}>
                Thêm hình ảnh <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.note}>* nghĩa là ô bắt buộc</Text>
            <TouchableOpacity
                style={styles.imageUpload}
                onPress={onShowImagePicker} // Gọi callback để mở modal
            >
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
                ) : (
                    <>
                        <Image source={require('../assert/image/anh.png')} style={styles.imageUploadIconGray} />
                        <Text style={styles.imageUploadTextGray}>Tải hình ảnh lên</Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Tiêu đề */}
            <Text style={styles.label}>
                Tiêu đề <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.inputWrap}>
                <InputNavigation
                    placeholder="Khâu chuẩn bị nguyên vật liệu"
                    placeholderTextColor="#bdbdbd"
                    value={title}
                    onChangeText={setTitle}
                    style={styles.input}
                />
                {title.length > 0 && (
                    <TouchableOpacity onPress={() => setTitle('')}>
                        <Image
                            source={require('../assert/image/cancel.png')}
                            style={styles.cancelIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>

            {/* Nội dung */}
            <Text style={styles.label}>
                Nội dung <Text style={styles.required}>*</Text>
            </Text>
            <View style={styles.finalInputWrap}>
                <InputNavigation
                    style={[styles.input, styles.contentInput]}
                    placeholder="Mô tả về công thức của bạn"
                    placeholderTextColor="#bdbdbd"
                    value={content}
                    onChangeText={setContent}
                    multiline
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, // Để nó có thể giãn ra hết không gian còn lại trong ScrollView
        padding: 16,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 15,
        marginTop: 18,
        marginBottom: 6,
        color: '#222',
    },
    required: {
        color: '#ff6f2c',
    },
    note: {
        color: '#bbb',
        fontSize: 11,
        marginBottom: 4,
        marginTop: -4,
        marginLeft: 2,
    },
    inputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    finalInputWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    input: {
        flex: 1,
        marginRight: 4,
        fontSize: 14,
        height: 36,
        minHeight: 36,
        maxHeight: 150,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
    },
    contentInput: {
        width: screenWidth - 32,
        height: 110,
        textAlignVertical: 'top',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 12,
        paddingRight: 12,
        alignSelf: 'center',
    },
    cancelIcon: {
        width: 20,
        height: 20,
        tintColor: '#bbb',
        marginLeft: 4,
    },
    imageUpload: {
        width: screenWidth - 32,
        height: 160,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 10,
        paddingVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
        marginBottom: 16,
        overflow: 'hidden',
        borderStyle: 'dashed',
        alignSelf: 'center',
    },
    imageUploadIconGray: {
        width: 40,
        height: 40,
        marginBottom: 8,
        tintColor: '#bbb',
    },
    imageUploadTextGray: {
        color: '#bbb',
        fontSize: 16,
        fontWeight: 'bold',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
        backgroundColor: '#eee',
    },
});

export default AddStepView;