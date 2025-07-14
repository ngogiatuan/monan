/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, SafeAreaView, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// Import AddStepView component
import AddStepView from '../../compoments/AddStepView'; // <-- Đảm bảo đường dẫn này đúng
import { nav } from '../../navigation/navigationName'; // Đảm bảo đường dẫn này đúng

// Định nghĩa interface StepCooking nếu chưa có trong file riêng
// Nếu bạn đã có trong StepCookingViewer.ts/tsx thì có thể import từ đó
export interface StepCooking {
    image: { uri: string } | any; // 'any' để chấp nhận require() hoặc {uri: string}
    title: string;
    desc: string;
}

const { width: screenWidth } = Dimensions.get('window');

const AddStepScreen = () => {
    const navigation = useNavigation();
    // State cho dữ liệu của bước HIỆN TẠI đang được chỉnh sửa/thêm vào
    const [currentStepImageUrl, setCurrentStepImageUrl] = useState<string | null>(null);
    const [currentStepTitle, setCurrentStepTitle] = useState('');
    const [currentStepContent, setCurrentStepContent] = useState('');
    const [showImagePickerModal, setShowImagePickerModal] = useState(false);

    // State để lưu trữ TẤT CẢ các bước đã được tạo
    const [allSteps, setAllSteps] = useState<StepCooking[]>([]);
    // currentStepIndex: chỉ số của bước hiện tại mà người dùng đang xem/chỉnh sửa/thêm mới
    // 0 là bước đầu tiên, allSteps.length là đang thêm một bước mới sau tất cả các bước đã có
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    // Effect để tải dữ liệu của bước hiện tại vào form khi currentStepIndex thay đổi
    useEffect(() => {
        if (currentStepIndex < allSteps.length) {
            // Đang chỉnh sửa một bước đã tồn tại
            const stepToEdit = allSteps[currentStepIndex];
            setCurrentStepImageUrl(stepToEdit.image.uri || null);
            setCurrentStepTitle(stepToEdit.title);
            setCurrentStepContent(stepToEdit.desc);
        } else {
            // Đang thêm một bước mới (currentStepIndex === allSteps.length)
            // Hoặc là lần đầu vào màn hình
            setCurrentStepImageUrl(null);
            setCurrentStepTitle('');
            setCurrentStepContent('');
        }
    }, [currentStepIndex, allSteps]); // allSteps trong dependency để re-run khi mảng bước thay đổi

    // Hàm chọn ảnh từ thư viện
    const pickImageFromLibrary = () => {
        setShowImagePickerModal(false);
        launchImageLibrary(
            { mediaType: 'photo', quality: 0.7 },
            (response) => {
                if (response.assets && response.assets.length > 0) {
                    setCurrentStepImageUrl(response.assets[0].uri || null);
                }
            }
        );
    };

    // Hàm chụp ảnh từ camera
    const pickImageFromCamera = () => {
        setShowImagePickerModal(false);
        launchCamera(
            { mediaType: 'photo', quality: 0.7, saveToPhotos: true },
            (response) => {
                if (response.assets && response.assets.length > 0) {
                    setCurrentStepImageUrl(response.assets[0].uri || null);
                }
            }
        );
    };

    // Hàm được gọi khi người dùng bấm "Tiếp tục" (trên màn hình AddStepScreen)
    const handleNextStep = () => {
        if (!currentStepImageUrl || !currentStepTitle || !currentStepContent) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin cho bước này (ảnh, tiêu đề, nội dung).');
            return;
        }

        const newOrUpdatedStep: StepCooking = {
            image: { uri: currentStepImageUrl },
            title: currentStepTitle,
            desc: currentStepContent,
        };

        setAllSteps((prevSteps) => {
            const updatedSteps = [...prevSteps];
            if (currentStepIndex < prevSteps.length) {
                // Nếu đang chỉnh sửa bước đã tồn tại
                updatedSteps[currentStepIndex] = newOrUpdatedStep;
            } else {
                // Nếu đang thêm bước mới
                updatedSteps.push(newOrUpdatedStep);
            }
            return updatedSteps;
        });

        // Chuyển sang bước tiếp theo (hoặc một bước mới)
        setCurrentStepIndex(currentStepIndex + 1);
    };

    // Hàm hoàn tất việc thêm các bước (Nút "Xong" của màn hình chính)
    const handleFinishAllSteps = () => {
        // Kiểm tra và lưu bước cuối cùng nếu người dùng bấm "Xong" khi form hiện tại có dữ liệu
        if (currentStepImageUrl || currentStepTitle || currentStepContent) {
            if (!currentStepImageUrl || !currentStepTitle || !currentStepContent) {
                Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin cho bước cuối cùng trước khi hoàn tất.');
                return;
            }
            const finalStepData: StepCooking = {
                image: { uri: currentStepImageUrl },
                title: currentStepTitle,
                desc: currentStepContent,
            };

            setAllSteps((prevSteps) => {
                const finalStepsArray = [...prevSteps];
                if (currentStepIndex < prevSteps.length) {
                    finalStepsArray[currentStepIndex] = finalStepData;
                } else {
                    finalStepsArray.push(finalStepData);
                }
                console.log('Final steps to be passed:', finalStepsArray);
                Alert.alert('Hoàn tất', 'Các bước đã được thêm! (Kiểm tra console log để xem dữ liệu)');
                // Đây là nơi bạn sẽ điều hướng hoặc gửi dữ liệu đi
                // Ví dụ: navigation.navigate(nav.RecipeDetailScreen, { steps: finalStepsArray });
                navigation.goBack(); // Hoặc navigate đến màn hình chi tiết món ăn
                return finalStepsArray;
            });
        } else {
            // Nếu không có dữ liệu nào trong form hiện tại (người dùng đã bấm "Tiếp tục" cho tất cả các bước)
            if (allSteps.length === 0) {
                Alert.alert('Lỗi', 'Vui lòng thêm ít nhất một bước cho công thức.');
                return;
            }
            console.log('Final steps (no new current step to add):', allSteps);
            Alert.alert('Hoàn tất', 'Các bước đã được thêm! (Kiểm tra console log để xem dữ liệu)');
            // Ví dụ: navigation.navigate(nav.RecipeDetailScreen, { steps: allSteps });
            navigation.goBack(); // Hoặc navigate đến màn hình chi tiết món ăn
        }
    };

    // Hàm quay lại bước trước đó (Nút "Quay lại" của màn hình chính)
    const handlePreviousStep = () => {
        if (currentStepIndex > 0) {
            setCurrentStepIndex(currentStepIndex - 1);
            // useEffect sẽ tự động tải dữ liệu của bước trước đó vào form
        } else {
            // Nếu đang ở bước đầu tiên, thoát màn hình tạo bước
            navigation.goBack();
        }
    };

    // Tính toán số bước hiện tại và tổng số bước để hiển thị trên header
    // Sửa đổi logic tính totalStepsCount ở đây
    const totalStepsCount = allSteps.length + (currentStepIndex === allSteps.length ? 1 : 0);
    const displayCurrentStep = currentStepIndex + 1; // Vì currentStepIndex bắt đầu từ 0

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
            {/* Header của màn hình AddStepScreen */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handlePreviousStep} style={styles.headerBackBtn}>
                    <Image
                        source={require('../../assert/image/back.png')}
                        style={{ width: 44, height: 44, tintColor: '#fff' }}
                        resizeMode="contain"
                    />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Bước {displayCurrentStep}{totalStepsCount > 0 ? ` / ${totalStepsCount}` : ''}
                </Text>
            </View>

            {/* ScrollView bao quanh AddStepView để có thể cuộn nội dung */}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Gọi component con AddStepView */}
                <AddStepView
                    imageUrl={currentStepImageUrl}
                    title={currentStepTitle}
                    content={currentStepContent}
                    setTitle={setCurrentStepTitle}
                    setContent={setCurrentStepContent}
                    setImageUrl={setCurrentStepImageUrl} // Truyền setter để AddStepView có thể reset ảnh
                    onShowImagePicker={() => setShowImagePickerModal(true)} // Mở modal từ màn hình cha
                />
            </ScrollView>

            {/* Các nút điều khiển ở cuối màn hình AddStepScreen */}
            <View style={styles.bottomButtonsContainer}>
                <TouchableOpacity
                    style={[styles.actionButton, styles.continueButton]}
                    onPress={handleNextStep} // Nút "Tiếp tục" của màn hình AddStepScreen
                >
                    <Text style={styles.continueButtonText}>Tiếp tục</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.actionButton, styles.doneButton]}
                    onPress={handleFinishAllSteps} // Nút "Xong" của màn hình AddStepScreen
                >
                    <Text style={styles.doneButtonText}>Xong</Text>
                </TouchableOpacity>
            </View>

            {/* MODAL: Modal chọn ảnh/camera (Vẫn nằm trong màn hình cha) */}
            <Modal
                visible={showImagePickerModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowImagePickerModal(false)}
            >
                <View style={styles.dialogOverlay}>
                    <View style={styles.dialogBox}>
                        <Text style={styles.dialogTitle}>Chọn hình ảnh</Text>
                        <TouchableOpacity
                            style={[styles.dialogBtn, { backgroundColor: '#ff6f2c', marginBottom: 12 }]}
                            onPress={pickImageFromLibrary}
                        >
                            <Text style={styles.dialogBtnText}>Chọn từ thư viện</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.dialogBtn, { backgroundColor: '#ff6f2c', marginBottom: 12 }]}
                            onPress={pickImageFromCamera}
                        >
                            <Text style={styles.dialogBtnText}>Chụp ảnh mới</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.dialogBtn, { backgroundColor: '#eee' }]}
                            onPress={() => setShowImagePickerModal(false)}
                        >
                            <Text style={[styles.dialogBtnText, { color: '#888' }]}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#ff6f2c',
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    headerBackBtn: {
        marginRight: 12,
        padding: 4,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        marginLeft: -40, // Adjusted to center better
    },

    bottomButtonsContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row', // Thêm flexDirection: 'row'
        justifyContent: 'space-between', // Để các nút cách đều nhau
        paddingHorizontal: 16,
        paddingTop: 10,
        paddingBottom: 10,
        borderTopWidth: 1,
        borderColor: '#eee',
    },
    actionButton: { // Style chung cho cả 2 nút
        flex: 1, // Để các nút chia đều không gian
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
        marginHorizontal: 5, // Khoảng cách giữa các nút
    },
    doneButton: {
        backgroundColor: '#4CAF50',
    },
    doneButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    continueButton: {
        backgroundColor: '#ff6f2c',
    },
    continueButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },

    dialogOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.25)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: 320,
        alignItems: 'stretch',
        elevation: 4,
    },
    dialogTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 12,
        color: '#222',
        textAlign: 'center',
    },
    dialogBtn: {
        borderRadius: 8,
        paddingVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dialogBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default AddStepScreen;