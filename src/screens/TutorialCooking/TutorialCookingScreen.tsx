import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView, // Đảm bảo bạn đã import ScrollView
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import axios from 'axios';
import Tts from 'react-native-tts';
import { useTranslation } from 'react-i18next';
// Đảm bảo bạn đã cài đặt và cấu hình @react-native-community/netinfo
// npm install @react-native-community/netinfo
// hoặc yarn add @react-native-community/netinfo
// Sau đó chạy npx react-native link @react-native-community/netinfo
const NetInfo = require('@react-native-community/netinfo');

const { width } = Dimensions.get('window');
const API_URL = 'http://103.72.99.132:3000'; // Đảm bảo địa chỉ API này có thể truy cập được từ thiết bị/emulator của bạn

const StepCookingViewer = ({
  steps,
  onFinish,
  onBack,
  isConnected,
  offlineStart,
  setOfflineStart,
  setOfflineDuration,
  autoTts,
  setAutoTts,
  showImageModal,
  setShowImageModal,
  currentImageIdx,
  setCurrentImageIdx,
}: {
  steps: {
    imageUrls: string[];
    title: string;
    desc: string;
  }[];
  onFinish: () => void;
  onBack?: () => void;
  isConnected: boolean;
  offlineStart: number | null;
  setOfflineStart: (v: number | null) => void;
  setOfflineDuration: (fn: (prev: number) => number) => void;
  autoTts: boolean;
  setAutoTts: (v: boolean) => void;
  showImageModal: boolean;
  setShowImageModal: (v: boolean) => void;
  currentImageIdx: number;
  setCurrentImageIdx: (v: number | ((prev: number) => number)) => void;
}) => {
  const [stepIdx, setStepIdx] = useState(0);
  const step = steps[stepIdx];
  const [isVisibleTts, setIsVisibleTts] = useState(false);
  const { t } = useTranslation();

  const stepImages = step.imageUrls || [];
  const scrollViewRef = useRef<ScrollView>(null); // Ref cho ScrollView của ảnh

  // Ref cho ScrollView của mô tả bước
  const descScrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    Tts.getInitStatus().then(
      () => setIsVisibleTts(true),
      () => setIsVisibleTts(false)
    );

    // Cleanup function to stop TTS when component unmounts
    return () => {
      Tts.stop();
    };
  }, []);

  useEffect(() => {
    if (isVisibleTts && autoTts) {
      Tts.stop(); // Dừng bất kỳ giọng nói nào đang diễn ra trước khi bắt đầu cái mới
      Tts.speak(String(step.title));
      Tts.speak(String(step.desc));
    }
    setCurrentImageIdx(0);
    // Cuộn ảnh về đầu mỗi khi bước thay đổi
    if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 0, animated: false });
    }
    // Cuộn mô tả về đầu mỗi khi bước thay đổi
    if (descScrollViewRef.current) {
      descScrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [stepIdx, isVisibleTts, autoTts, setCurrentImageIdx, step.title, step.desc]); // Thêm dependencies

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentImageIdx) {
      setCurrentImageIdx(index);
    }
  };

  // CHỈNH SỬA: Nút back luôn thoát về màn hình DetailScreen
  const handleBack = async () => {
    // Tùy chọn: Bạn có thể giữ cảnh báo nếu muốn, hoặc bỏ qua để luôn cho phép thoát
    // if (!isConnected) {
    //   Alert.alert('Không có kết nối mạng', 'Vui lòng bật wifi hoặc dữ liệu di động để quay lại.');
    //   return;
    // }
    Tts.stop(); // Dừng TTS trước khi quay lại
    onBack?.(); // Luôn gọi onBack prop để quay về màn hình trước đó trên stack (DetailScreen)
  };

  const handleNext = async () => {
    if (isConnected && offlineStart !== null) {
      setOfflineDuration(prev => prev + (Date.now() - (offlineStart || 0)));
      setOfflineStart(null);
    }
    if (stepIdx < steps.length - 1 && !isConnected) {
      Alert.alert('Không có kết nối mạng', 'Bạn đang tiếp tục nấu khi mất mạng. Khi có mạng lại, thời gian nấu sẽ được cập nhật.');
      if (offlineStart === null) setOfflineStart(Date.now());
    }
    Tts.stop(); // Dừng TTS trước khi chuyển sang bước tiếp theo hoặc kết thúc
    if (stepIdx === steps.length - 1) onFinish();
    else {
      setStepIdx(stepIdx + 1);
    }
  };

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack} // Nút back gọi handleBack đã chỉnh sửa
        >
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{`${stepIdx + 1}/${steps.length}`}</Text>
      </View>

      {/* Vùng ảnh chính có thể vuốt */}
      <View style={styles.stepImgContainer}>
        {stepImages.length > 0 ? (
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={styles.scrollViewContentContainer}
          >
            {stepImages.map((imageUri, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => {
                  setCurrentImageIdx(index);
                  setShowImageModal(true);
                }}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={styles.stepImg}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          // Không có ảnh, hiển thị placeholder
          <View style={styles.noImagePlaceholder} />
        )}

        {/* Hiển thị số lượng ảnh (ví dụ: 1/3) */}
        {stepImages.length > 0 && (
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>{currentImageIdx + 1}/{stepImages.length}</Text>
          </View>
        )}
      </View>

      {/* Vùng nội dung (title và description) có thể cuộn */}
      <ScrollView style={styles.contentWrap} ref={descScrollViewRef}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={styles.stepTitle}>{String(step.title)}</Text>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              if (!isVisibleTts) return; // Không làm gì nếu TTS chưa sẵn sàng
              if (autoTts) {
                setAutoTts(false);
                Tts.stop();
              } else {
                setAutoTts(true);
                Tts.stop(); // Dừng TTS hiện tại trước khi nói cái mới
                Tts.speak(String(step.title));
                Tts.speak(String(step.desc));
              }
            }}
          >
            <Image
              source={
                autoTts
                  ? require('../../assert/image/loa.png')
                  : require('../../assert/image/muteloa.png')
              }
              style={{ width: 28, height: 28, tintColor: '#FF6600' }}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.stepDesc}>{String(step.desc)}</Text>
      </ScrollView>

      <View style={styles.bottomBtnRow}>
        <ButtonNavigation
          title={t('back')}
          onPress={handleBack} // Nút "Back" dưới cùng cũng gọi handleBack
          backgroundColor="#00C48C"
          style={{ flex: 1, marginRight: 8 }}
        />
        <ButtonNavigation
          title={stepIdx === steps.length - 1 ? t('done') : t('continue')}
          onPress={handleNext}
          backgroundColor="#FF6600"
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>

      {/* Modal xem ảnh full screen, vuốt qua lại */}
      <Modal visible={showImageModal} transparent animationType="fade" onRequestClose={() => setShowImageModal(false)}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 36, paddingHorizontal: 16 }}>
            <TouchableOpacity onPress={() => setShowImageModal(false)}>
              <Text style={{ color: '#fff', fontSize: 28 }}>×</Text>
            </TouchableOpacity>
            <Text style={{ color: '#fff', fontSize: 16 }}>{currentImageIdx + 1}/{stepImages.length}</Text>
            <View style={{ width: 28 }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {stepImages.length > 0 && (
              <Image
                source={{ uri: stepImages[currentImageIdx] }}
                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
              />
            )}
          </View>
          {/* Nút chuyển ảnh nếu có nhiều ảnh */}
          {stepImages.length > 1 && (
            <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 }}>
              <TouchableOpacity disabled={currentImageIdx === 0} onPress={() => setCurrentImageIdx(idx => Math.max(0, idx - 1))} style={{ padding: 16, opacity: currentImageIdx === 0 ? 0.3 : 1 }}>
                <Text style={{ color: '#fff', fontSize: 32 }}>{'<'}</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={currentImageIdx === stepImages.length - 1} onPress={() => setCurrentImageIdx(idx => Math.min(stepImages.length - 1, idx + 1))} style={{ padding: 16, opacity: currentImageIdx === stepImages.length - 1 ? 0.3 : 1 }}>
                <Text style={{ color: '#fff', fontSize: 32 }}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

const TutorialCookingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [steps, setSteps] = useState<
    { imageUrls: string[]; title: string; desc: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const recipeId = route.params?.recipeId;
  const [startTime, setStartTime] = useState(Date.now());
  const [offlineStart, setOfflineStart] = useState<number | null>(null);
  const [offlineDuration, setOfflineDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [autoTts, setAutoTts] = useState(true);

  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const estimatedTime = route.params?.estimatedTime || 40;

  React.useEffect(() => {
    // Đăng ký lắng nghe sự kiện thay đổi trạng thái mạng
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      const connected = !!state.isConnected;
      setIsConnected(connected);
      // Nếu mất kết nối và chưa ghi nhận thời gian offline, bắt đầu ghi nhận
      if (!connected && offlineStart === null) {
        setOfflineStart(Date.now());
      }
      // Nếu có kết nối lại và đã ghi nhận thời gian offline, tính tổng thời gian offline
      if (connected && offlineStart !== null) {
        setOfflineDuration(prev => prev + (Date.now() - (offlineStart || 0)));
        setOfflineStart(null);
      }
    });
    // Cleanup function: Hủy đăng ký lắng nghe khi component unmount
    return () => unsubscribe();
  }, [offlineStart]);

  useEffect(() => {
    const fetchSteps = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/steps/recipe/${recipeId}`);
        const data = Array.isArray(res.data) ? res.data : [];
        let stepsData = data.map((stepObj: any, idx: number) => ({
          imageUrls: stepObj.imageUrls && stepObj.imageUrls.length > 0 ? stepObj.imageUrls : [],
          title: t('step_title', { step: stepObj.step || (idx + 1) }),
          desc: String(stepObj.tutorial || 'Không có hướng dẫn cho bước này.'),
        }));
        // Nếu không có bước nào từ API, hiển thị bước mặc định
        if (!stepsData.length) {
          stepsData = [
            {
              imageUrls: [],
              title: t('step_title', { step: 1 }),
              desc: String(t('no_tutorial')),
            },
          ];
        }
        setSteps(stepsData);
      } catch (e) {
        console.error("Error fetching steps:", e); // In ra lỗi để dễ debug
        // Xử lý lỗi: hiển thị bước mặc định nếu có lỗi tải dữ liệu
        setSteps([
          {
            imageUrls: [],
            title: t('step_title', { step: 1 }),
            desc: String(t('no_tutorial')),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSteps();
  }, [recipeId, t]);

  // Dừng TTS khi màn hình TutorialCookingScreen bị unmount
  useEffect(() => {
    return () => {
      Tts.stop();
    };
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6600" />
      </SafeAreaView>
    );
  }

  const handleFinish = async () => {
    let totalOffline = offlineDuration;
    if (!isConnected && offlineStart !== null) {
      totalOffline += Date.now() - offlineStart;
    }
    const now = Date.now();
    const totalDuration = now - startTime - totalOffline;
    Tts.stop(); // Dừng TTS trước khi chuyển sang màn hình EndCookingScreen
    navigation.navigate(nav.endCooking, {
      startTime,
      cookedDuration: totalDuration > 0 ? totalDuration : 0,
      estimatedTime,
      wasOffline: totalOffline > 0 || !isConnected,
      offlineAtEnd: !isConnected,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StepCookingViewer
        steps={steps}
        onFinish={handleFinish}
        onBack={() => {
          Tts.stop(); // Dừng TTS trước khi quay lại từ StepCookingViewer
          navigation.goBack(); // navigation.goBack() sẽ đưa bạn về màn hình DetailScreen
        }}
        isConnected={isConnected}
        offlineStart={offlineStart}
        setOfflineStart={setOfflineStart}
        setOfflineDuration={setOfflineDuration}
        autoTts={autoTts}
        setAutoTts={setAutoTts}
        showImageModal={showImageModal}
        setShowImageModal={setShowImageModal}
        currentImageIdx={currentImageIdx}
        setCurrentImageIdx={setCurrentImageIdx}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FF6600',
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 12,
    paddingTop: 0,
  },
  backBtn: {
    padding: 8,
    marginRight: 4,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 24,
  },
  stepImgContainer: {
    width: width,
    height: 220,
    position: 'relative',
    backgroundColor: '#eee',
  },
  scrollViewContentContainer: {
    // Không cần đặt width ở đây vì các Image bên trong đã có width: width
  },
  stepImg: {
    width: width,
    height: '100%',
    resizeMode: 'cover',
  },
  // Style cho placeholder khi không có ảnh
  noImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc', // Màu xám nhạt
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCounter: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 44,
    minHeight: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  contentWrap: {
    flex: 1, // Rất quan trọng để ScrollView chiếm hết không gian còn lại
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: '#fff',
  },
  stepTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  stepDesc: {
    color: '#222',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16, // Thêm khoảng cách dưới cùng cho Text
  },
  bottomBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
});

export default TutorialCookingScreen;