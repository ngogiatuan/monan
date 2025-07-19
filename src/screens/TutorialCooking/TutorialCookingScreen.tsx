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
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import axios from 'axios';
import Tts from 'react-native-tts';
import { useTranslation } from 'react-i18next';
import { countRecipe } from '../../api/recipeApi';
import { UserContext } from '../../context/UserContext';
import { isPre } from '../../api/userApi';
const NetInfo = require('@react-native-community/netinfo');

const { width } = Dimensions.get('window');
const API_URL = 'http://103.72.99.132:3000';

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
  user,
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
  user: any;
}) => {
  const [stepIdx, setStepIdx] = useState(0);
  // Đảm bảo step luôn có giá trị mặc định để tránh lỗi Text string must be rendered
  const step = steps[stepIdx] || { imageUrls: [], title: '', desc: '' };

  const [isVisibleTts, setIsVisibleTts] = useState(false);
  const { t } = useTranslation();

  const stepImages = step.imageUrls || [];
  const scrollViewRef = useRef<ScrollView>(null); // Ref cho ScrollView của ảnh
  const isPremium = isPre(user);

  useEffect(() => {
    Tts.getInitStatus().then(
      () => setIsVisibleTts(true),
      () => setIsVisibleTts(false)
    );
    return () => {
      Tts.stop();
    };
  }, []);

  useEffect(() => {
    // Chỉ tự động đọc khi là premium
    if (isVisibleTts && autoTts && isPremium) {
      Tts.stop();
      Tts.speak(String(step.title || ''));
      Tts.speak(String(step.desc || ''));
    }
    setCurrentImageIdx(0);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, animated: false });
    }
  }, [stepIdx, isVisibleTts, autoTts, setCurrentImageIdx, step.title, step.desc, isPremium]);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentImageIdx) {
      setCurrentImageIdx(index);
    }
  };

  const handleBack = async () => {
    Tts.stop();
    onBack?.();
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
    Tts.stop();
    if (stepIdx === steps.length - 1) onFinish();
    else {
      setStepIdx(stepIdx + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header - CỐ ĐỊNH */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
        >
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{`${stepIdx + 1}/${steps.length}`}</Text>
      </View>

      {/* Vùng ảnh chính có thể vuốt - CỐ ĐỊNH */}
      <View style={styles.stepImgContainer}>
        {stepImages?.length > 0 ? (
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
          <View style={styles.noImagePlaceholder} />
        )}

        {/* Hiển thị số lượng ảnh (ví dụ: 1/3) */}
        {stepImages?.length > 0 && (
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>{currentImageIdx + 1}/{stepImages.length}</Text>
          </View>
        )}
      </View>

      {/* Vùng chứa tiêu đề và nút loa - CỐ ĐỊNH */}
      <View style={styles.contentAndTtsFixed}>
        <View style={styles.titleAndTtsRow}>
          {/* Đảm bảo step.title luôn là chuỗi */}
          <Text style={styles.stepTitle}>{String(step.title || '')}</Text>
          <TouchableOpacity
            style={styles.ttsButton}
            disabled={!isPremium}
            onPress={() => {
              if (!isVisibleTts || !isPremium) return;
              if (autoTts) {
                setAutoTts(false);
                Tts.stop();
              } else {
                setAutoTts(true);
                Tts.stop();
                Tts.speak(String(step.title || ''));
                Tts.speak(String(step.desc || ''));
              }
            }}
          >
            <Image
              source={
                autoTts && isPremium
                  ? require('../../assert/image/loa.png')
                  : require('../../assert/image/muteloa.png')
              }
              style={[
                styles.ttsIcon,
                !isPremium && { opacity: 0.4 }
              ]}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ScrollView chỉ dành cho phần mô tả - CUỘN ĐƯỢC */}
      <ScrollView style={styles.descScrollView}>
        {/* Đảm bảo step.desc luôn là chuỗi */}
        <Text style={styles.stepDesc}>{step.desc || ''}</Text>
      </ScrollView>

      {/* Vùng nút điều hướng dưới cùng - CỐ ĐỊNH */}
      <View style={styles.bottomBtnRow}>
        <ButtonNavigation
          title={t('back')}
          onPress={handleBack}
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

      {/* Modal xem ảnh full screen, vuốt qua lại - Không thay đổi */}
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
    </View>
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
  const { user } = React.useContext(UserContext); // Thêm dòng này để lấy user từ context

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
    const unsubscribe = NetInfo.addEventListener((state: any) => {
      const connected = !!state.isConnected;
      setIsConnected(connected);
      if (!connected && offlineStart === null) {
        setOfflineStart(Date.now());
      }
      if (connected && offlineStart !== null) {
        setOfflineDuration(prev => prev + (Date.now() - (offlineStart || 0)));
        setOfflineStart(null);
      }
    });
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
          // Đảm bảo title và desc luôn là chuỗi hoặc có giá trị mặc định ngay khi fetch
          title: String(t('step_title', { step: stepObj.step || (idx + 1) })),
          desc: String(stepObj.tutorial || t('no_tutorial')),
        }));
        if (!stepsData.length) {
          stepsData = [
            {
              imageUrls: [],
              title: String(t('step_title', { step: 1 })),
              desc: String(t('no_tutorial')),
            },
          ];
        }
        setSteps(stepsData);
      } catch (e) {
        console.error("Error fetching steps:", e);
        setSteps([
          {
            imageUrls: [],
            title: String(t('step_title', { step: 1 })),
            desc: String(t('no_tutorial')),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSteps();
  }, [recipeId, t]);

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
    countRecipe(recipeId);
    let totalOffline = offlineDuration;
    if (!isConnected && offlineStart !== null) {
      totalOffline += Date.now() - offlineStart;
    }
    const now = Date.now();
    const totalDuration = now - startTime - totalOffline;
    Tts.stop();
    navigation.navigate(nav.endCooking, {
      recipeId: recipeId, // ✅ Thêm recipeId vào params
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
          Tts.stop();
          navigation.goBack();
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
        user={user}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
    // paddingBottom:100
  },
  stepImg: {
    width: width,
    height: '100%',
    resizeMode: 'cover',
  },
  noImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#ccc',
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
  // Vùng chứa tiêu đề và nút loa, CỐ ĐỊNH
  contentAndTtsFixed: {
    paddingHorizontal: 16,
    paddingTop: 16, // Padding trên cho toàn bộ phần này
    backgroundColor: '#fff',
  },
  titleAndTtsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8, // Khoảng cách giữa hàng tiêu đề/loa và ScrollView mô tả
  },
  stepTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    flexShrink: 1, // Cho phép text co lại nếu dài
    marginRight: 10,
  },
  ttsButton: {
    padding: 5,
  },
  ttsIcon: {
    width: 28,
    height: 28,
    tintColor: '#FF6600',
  },
  // ScrollView chỉ dành riêng cho mô tả
  descScrollView: {
    flex: 1, // Quan trọng: để ScrollView này chiếm hết không gian còn lại
    paddingHorizontal: 16, // Đặt padding ngang tại đây để chỉ mô tả bị ảnh hưởng
    backgroundColor: '#fff',
  },
  stepDesc: {
    color: '#222',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16, // Khoảng cách cuối cùng cho text mô tả
  },
  bottomBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
});

export default TutorialCookingScreen;