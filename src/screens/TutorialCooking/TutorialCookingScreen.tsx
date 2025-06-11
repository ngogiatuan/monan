import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import ButtonNavigation from '../../compoments/ButtonNavigation';

const { width } = Dimensions.get('window');

// Component tái sử dụng cho các bước nấu ăn
const StepCookingViewer = ({
  steps,
  onFinish,
  onBack,
}: {
  steps: {
    image: any;
    title: string;
    desc: string;
  }[];
  onFinish: () => void;
  onBack?: () => void;
}) => {
  const [stepIdx, setStepIdx] = useState(0);
  const step = steps[stepIdx];

  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (stepIdx === 0) {
              onBack?.();
            } else {
              setStepIdx(stepIdx - 1);
            }
          }}
        >
          <Image source={require('../../assert/image/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{`${stepIdx + 1}/${steps.length}`}</Text>
      </View>
      {/* Image */}
      <Image source={step.image} style={styles.stepImg} />
      {/* Content */}
      <View style={styles.contentWrap}>
        <Text style={styles.stepTitle}>{step.title}</Text>
        <Text style={styles.stepDesc}>{step.desc}</Text>
      </View>
      {/* Bottom Buttons */}
      <View style={styles.bottomBtnRow}>
        <ButtonNavigation
          title="Quay lại"
          onPress={() => {
            if (stepIdx === 0) {
              onBack?.();
            } else {
              setStepIdx(stepIdx - 1);
            }
          }}
          backgroundColor="#00C48C"
          style={{ flex: 1, marginRight: 8 }}
        />
        <ButtonNavigation
          title={stepIdx === steps.length - 1 ? 'Xong' : 'Tiếp tục'}
          onPress={() => {
            if (stepIdx === steps.length - 1) onFinish();
            else setStepIdx(stepIdx + 1);
          }}
          backgroundColor="#FF6600"
          style={{ flex: 1, marginLeft: 8 }}
        />
      </View>
    </>
  );
};

// Dữ liệu mẫu cho một công thức
const STEPS = [
  {
    image: require('../../assert/image/step1.png'),
    title: 'Bước 1: Khâu chuẩn bị nguyên vật liệu',
    desc: 'Chuẩn bị các nguyên vật liệu sẵn sàng trước khi bắt đầu:\n• 500g cá lóc làm sạch, cắt khúc.\n• 2 quả cà chua bổ múi cau.\n• 1/4 trái thơm (dứa) cắt lát mỏng.\n• 5 trái đậu bắp cắt xéo.\n• 100g giá đỗ.\n• 2 cây bạc hà (dọc mùng) tước vỏ, cắt khúc.\n• 100g đậu rồng.\n• 2 muỗng me chua hoặc 1 vắt me tươi.\n• 2 củ, 2 tép hành tím, tỏi băm nhỏ.\n• 3 - 4 nhánh rau thơm, ngò gai thái nhỏ.\n• Gia vị : Muối, đường, hạt nêm, nước mắm, tiêu.\n• 1 trái ớt hiểm nếu muốn ăn cay.',
  },
  {
    image: require('../../assert/image/step5.png'),
    title: 'Bước 2: Chuẩn bị hành ngò các thứ',
    desc:
      'Chuẩn bị các nguyên vật liệu sau trước khi bắt đầu:\n' +
      '500g cá lóc làm sạch, cắt khúc.\n' +
      '2 quả cà chua bổ múi cau.\n' +
      '1/4 trái thơm (dứa) cắt lát mỏng.\n' +
      '5 trái đậu bắp cắt xéo.\n' +
      '2 cây bạc hà (dọc mùng) tước vỏ, cắt khúc.\n' +
      '100g giá đỗ.\n' +
      '2 muỗng me chua hoặc 1 vắt me tươi.\n' +
      '2 củ, 2 tép hành tím, tỏi băm nhỏ.\n' +
      '3 - 4 nhánh rau thơm, ngò gai thái nhỏ.\n' +
      'Gia vị : Muối, đường, hạt nêm, nước mắm, tiêu.\n' +
      '1 trái ớt hiểm nếu muốn ăn cay.',
  },
];

const TutorialCookingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [startTime] = useState(Date.now());
  const estimatedTime = route.params?.estimatedTime || 40; // fallback nếu không có param

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StepCookingViewer
        steps={STEPS}
        onFinish={() =>
          navigation.navigate(nav.endCooking, { startTime, estimatedTime })
        }
        onBack={() => navigation.goBack()}
      />
      {/* <BottomNavigation current="" /> */}
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
    marginBottom: 8,
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
