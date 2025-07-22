import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, ScrollView } from 'react-native';
import ButtonNavigation from './ButtonNavigation';
import Video from 'react-native-video';
import { isPre } from '../api/userApi';

const { width } = Dimensions.get('window');

export interface StepCooking {
  image: any;
  title: string;
  desc: string;
}

interface StepCookingViewerProps {
  steps: {
    imageUrls: string[];
    videoUrl?: string;
    title: string;
    desc: string;
  }[];
  onFinish: () => void;
  onBack?: () => void;
  user: any;
}

const StepCookingViewer = ({ steps, onFinish, onBack, user }: StepCookingViewerProps) => {
  const [stepIdx, setStepIdx] = useState(0);
  const step = steps[stepIdx];

  console.log('Current stepIdx:', stepIdx, 'step:', step);

  const isPremium = isPre(user);
  const showVideo = isPremium && typeof step.videoUrl === 'string' && step.videoUrl.trim() !== '';

  console.log('step:', step);

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
          <Image source={require('../assert/image/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{`${stepIdx + 1}/${steps.length}`}</Text>
      </View>
      {/* Image/Video */}
      <View style={styles.stepImgContainer}>
        {showVideo ? (
          <Video
            source={{ uri: step.videoUrl }}
            style={styles.stepVideo}
            controls
            resizeMode="contain"
            paused={false}
            onError={e => console.log('Video error:', e)}
          />
        ) : step.imageUrls?.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {step.imageUrls.map((imageUrl, imgIdx) => (
              <Image key={imgIdx} source={{ uri: imageUrl }} style={styles.stepImg} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.noImagePlaceholder} />
        )}
      </View>
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
  stepVideo: {
    width: width,
    height: 220,
    backgroundColor: '#000',
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
  noImagePlaceholder: {
    width: width,
    height: 220,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepImgContainer: {
    width: width,
    height: 220,
    backgroundColor: '#eee',
  },
});

export default StepCookingViewer;
