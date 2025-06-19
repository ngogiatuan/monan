import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_URL = 'http://103.72.99.132:3000';

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

const TutorialCookingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const [steps, setSteps] = useState<
    { image: any; title: string; desc: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Lấy recipeId từ params truyền sang từ DetailScreen
  const recipeId = route.params?.recipeId;
  const [startTime] = useState(Date.now());
  const estimatedTime = route.params?.estimatedTime || 40;

  useEffect(() => {
    const fetchInstructions = async () => {
      setLoading(true);
      try {
        // Lấy chi tiết món ăn từ API
        const res = await axios.get(`${API_URL}/api/recipes?page=1&limit=50`);
        const allRecipes = res.data?.data || [];
        const recipe = allRecipes.find((r: any) => r._id === recipeId);
        let instructions: string[] = [];
        if (recipe && recipe.instructions) {
          // Tách từng bước theo số thứ tự hoặc xuống dòng
          // Ưu tiên tách theo số thứ tự "1.", "2.", ...
          const regex = /\d+\.\s/g;
          const parts = recipe.instructions.split(regex).filter(Boolean);
          if (parts.length > 1) {
            instructions = parts.map(s => s.trim());
          } else {
            // Nếu không có số thứ tự, tách theo xuống dòng
            instructions = recipe.instructions.split('\n').filter(Boolean);
          }
        }
        // Nếu không có bước nào, tạo 1 bước mặc định
        if (!instructions.length) {
          instructions = ['Không có hướng dẫn nấu ăn cho món này.'];
        }
        // Tạo mảng steps cho StepCookingViewer
        const stepsData = instructions.map((desc, idx) => ({
          image: require('../../assert/image/step1.png'),
          title: `Bước ${idx + 1}`,
          desc,
        }));
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
    fetchInstructions();
  }, [recipeId]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#FF6600" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <StepCookingViewer
        steps={steps}
        onFinish={() =>
          navigation.navigate(nav.endCooking, { startTime, estimatedTime })
        }
        onBack={() => navigation.goBack()}
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
