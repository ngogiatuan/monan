import React, { use, useEffect, useState } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import axios from 'axios';
import { checkNetworkAndAlert } from '../../compoments/NetworkAlert';
import Tts from 'react-native-tts';

const { width } = Dimensions.get('window');
const API_URL = 'http://103.72.99.132:3000';

// Component tái sử dụng cho các bước nấu ăn
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
}: {
  steps: {
    image: any;
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
}) => {
  const [stepIdx, setStepIdx] = useState(0);
  const step = steps[stepIdx];
  const [isVisibleTts, setIsVisibleTts] = useState(false);

  useEffect(() => {
    Tts.getInitStatus().then(
      () => setIsVisibleTts(true),
      () => setIsVisibleTts(false)
    );

  }, []);

  // Đọc tự động khi vào bước mới nếu autoTts bật
  useEffect(() => {
    if (isVisibleTts && autoTts) {
      Tts.stop();
      Tts.speak(step.title);
      Tts.speak(step.desc);
    }
    // eslint-disable-next-line
  }, [stepIdx, isVisibleTts, autoTts]);

  const handleBack = async () => {
    // Khi mất mạng thì không cho quay lại
    if (!isConnected) {
      Alert.alert('Không có kết nối mạng', 'Vui lòng bật wifi hoặc dữ liệu di động để quay lại bước trước.');
      return;
    }
    if (stepIdx === 0) {
      onBack?.();
    } else {
      setStepIdx(stepIdx - 1);
    }
  };

  const handleNext = async () => {
    // Nếu đang online trở lại, cộng dồn thời gian offline nếu có
    if (isConnected && offlineStart !== null) {
      setOfflineDuration(prev => prev + (Date.now() - (offlineStart || 0)));
      setOfflineStart(null);
    }
    // Nếu mất mạng ở các bước chưa phải bước cuối, vẫn cho bấm tiếp tục để realtime ghi nhận quá trình nấu
    // Chỉ cảnh báo, không chặn
    if (stepIdx < steps.length - 1 && !isConnected) {
      Alert.alert('Không có kết nối mạng', 'Bạn đang tiếp tục nấu khi mất mạng. Khi có mạng lại, thời gian nấu sẽ được cập nhật.');
      if (offlineStart === null) setOfflineStart(Date.now());
      // Không return, vẫn cho tiếp tục
    }
    if (stepIdx === steps.length - 1) onFinish();
    else setStepIdx(stepIdx + 1);
  };

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={handleBack}
        >
          <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{`${stepIdx + 1}/${steps.length}`}</Text>
      </View>
      <Image source={step.image} style={styles.stepImg} />
      <View style={styles.contentWrap}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.stepTitle}>{step.title}</Text>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              if (!isVisibleTts) return;
              if (autoTts) {
                setAutoTts(false);
                Tts.stop();
              } else {
                setAutoTts(true);
                Tts.stop();
                Tts.speak(step.title);
                Tts.speak(step.desc);
              }
            }}
          >
            <Image
              source={
                autoTts
                  ? require('../../assert/image/loa.png')
                  : require('../../assert/image/muteloa.png')
              }
              style={{ width: 40, height: 40, tintColor: '#FF6600' }}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.stepDesc}>{step.desc}</Text>
      </View>
      <View style={styles.bottomBtnRow}>
        <ButtonNavigation
          title="Quay lại"
          onPress={handleBack}
          backgroundColor="#00C48C"
          style={{ flex: 1, marginRight: 8 }}
        />
        <ButtonNavigation
          title={stepIdx === steps.length - 1 ? 'Xong' : 'Tiếp tục'}
          onPress={handleNext}
          backgroundColor="#FF6600"
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
    </>
  );
};

const TutorialCookingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [steps, setSteps] = useState<
    { image: any; title: string; desc: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Lấy recipeId từ params truyền sang từ DetailScreen
  const recipeId = route.params?.recipeId;
  const [startTime, setStartTime] = useState(Date.now());
  const [offlineStart, setOfflineStart] = useState<number | null>(null);
  const [offlineDuration, setOfflineDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(true);
  const [autoTts, setAutoTts] = useState(true);

  const estimatedTime = route.params?.estimatedTime || 40;

  React.useEffect(() => {
    const NetInfo = require('@react-native-community/netinfo');
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
        // Lấy các bước nấu ăn từ API mới
        const res = await axios.get(`${API_URL}/api/steps/recipe/${recipeId}`);
        const data = Array.isArray(res.data) ? res.data : [];
        let stepsData = data.map((stepObj: any, idx: number) => ({
          image:
            stepObj.imageUrls && stepObj.imageUrls.length > 0
              ? { uri: stepObj.imageUrls[0] }
              : require('../../assert/image/step1.png'),
          title: `Bước ${idx + 1}`,
          desc: stepObj.tutorial || 'Không có hướng dẫn cho bước này.',
        }));
        if (!stepsData.length) {
          stepsData = [
            {
              image: require('../../assert/image/step1.png'),
              title: 'Bước 1',
              desc: 'Không có hướng dẫn nấu ăn cho món này.',
            },
          ];
        }
        setSteps(stepsData);
      } catch (e) {
        setSteps([
          {
            image: require('../../assert/image/step1.png'),
            title: 'Bước 1',
            desc: 'Không có hướng dẫn nấu ăn cho món này.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchSteps();
  }, [recipeId]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6600" />
      </SafeAreaView>
    );
  }

  const handleFinish = async () => {
    // Khi bấm XONG ở bước cuối, luôn cho qua EndCookingScreen
    // Tính thời gian nấu thực tế (trừ thời gian offline)
    let totalOffline = offlineDuration;
    if (!isConnected && offlineStart !== null) {
      // Nếu đang offline khi bấm XONG, cộng dồn thời gian offline đến hiện tại
      totalOffline += Date.now() - offlineStart;
    }
    const now = Date.now();
    const totalDuration = now - startTime - totalOffline;
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
        onBack={() => navigation.goBack()}
        isConnected={isConnected}
        offlineStart={offlineStart}
        setOfflineStart={setOfflineStart}
        setOfflineDuration={setOfflineDuration}
        autoTts={autoTts}
        setAutoTts={setAutoTts}
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
  stepImg: {
    width: width,
    height: 220,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },
  contentWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 0,
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
    marginBottom: 0,
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
