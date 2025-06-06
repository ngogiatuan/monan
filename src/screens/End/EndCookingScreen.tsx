import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import ButtonNavigation from '../../compoments/ButtonNavigation';

const { width } = Dimensions.get('window');

const EndCookingScreen = () => {
  const navigation = useNavigation<any>();

  // State cho dialog đánh giá
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Render các ngôi sao (blank star và full star)
  const renderStars = () => {
    // Đổi khai báo mảng thành: const stars = [] as any[];
    const stars = [] as any[];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)} activeOpacity={0.7}>
          <Image
            source={
              i <= rating
                ? require('../../assert/image/fullstar.png')
                : require('../../assert/image/blank.png')
            }
            style={{
              width: 32,
              height: 32,
              marginHorizontal: 2,
              tintColor: i <= rating ? '#FF9900' : '#D3D3D3',
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    }
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>
        {stars}
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image source={require('../../assert/image/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kết thúc</Text>
      </View>
      {/* Banner */}
      <Image
        source={require('../../assert/image/Header.png')}
        style={styles.bannerImg}
      />
      {/* Content */}
      <View style={styles.card}>
        <View style={styles.doneRow}>
          <Image source={require('../../assert/image/check.png')} style={styles.doneIcon} />
          <Text style={styles.doneText}>Bạn đã hoàn thành món ăn</Text>
        </View>
        <Text style={styles.sectionLabel}>Bạn đã thực hiện</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeBox}>
            <Image source={require('../../assert/image/time.png')} style={styles.timeIcon} />
            <Text style={styles.timeValue}>40'</Text>
            <Text style={styles.timeLabel}>Thời gian bạn làm</Text>
          </View>
          <View style={styles.timeBox}>
            <Image source={require('../../assert/image/date.png')} style={[styles.timeIcon, { tintColor: '#FF8000' }]} />
            <Text style={[styles.timeValue, { color: '#FF8000' }]}>45'</Text>
            <Text style={styles.timeLabel}>Thời gian dự kiến</Text>
          </View>
        </View>
        <Text style={styles.sectionLabel}>Bạn nhận được</Text>
        <View style={styles.rewardRow}>
          <Image source={require('../../assert/image/point.png')} style={styles.rewardIcon} />
          <Text style={styles.rewardValue}>+1500</Text>
        </View>
        <Text style={styles.rewardNote}>
          Điểm kinh nghiệm sẽ giúp bạn thăng hạng ở bảng xếp hạng. Chúc mừng bạn!
        </Text>
      </View>
      {/* Button */}
      <View style={styles.bottomBtnRow}>
        <ButtonNavigation
          title="Tiếp tục"
          onPress={() => setShowRating(true)}
          backgroundColor="#FF6600"
        />
      </View>
      {/* Dialog đánh giá */}
      <Modal
        visible={showRating}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRating(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <View style={styles.modalBar} />
            </View>
            <Text style={styles.modalTitle}>Đánh giá công thức</Text>
            {renderStars()}
            <Text style={styles.modalLabel}>Nhận xét</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nhận xét về công thức"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
              placeholderTextColor="#BDBDBD"
            />
            <View style={styles.modalPointRow}>
              <Text style={styles.modalPointText}>
                Bạn sẽ nhận thêm <Text style={{ color: '#00C48C', fontWeight: 'bold' }}>+50</Text>
              </Text>
              <Image source={require('../../assert/image/point.png')} style={styles.modalPointIcon} />
              <Text style={styles.modalPointText}> từ việc đánh giá công thức</Text>
            </View>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowRating(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>Xác nhận</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
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
  bannerImg: {
    width: width,
    height: 120,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: -40,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E6F8F3',
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#E6F8F3',
    paddingBottom: 12,
  },
  doneIcon: {
    width: 22,
    height: 22,
    tintColor: '#00C48C',
    marginRight: 8,
  },
  doneText: {
    color: '#00C48C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  sectionLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  timeIcon: {
    width: 20,
    height: 20,
    tintColor: '#00C48C',
    marginBottom: 4,
  },
  timeValue: {
    color: '#00C48C',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 2,
  },
  timeLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '400',
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  rewardIcon: {
    width: 24,
    height: 24,
    tintColor: '#00C48C',
    marginRight: 8,
  },
  rewardValue: {
    color: '#00C48C',
    fontWeight: 'bold',
    fontSize: 20,
  },
  rewardNote: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
  },
  bottomBtnRow: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  // Thêm style cho modal nếu chưa có
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    marginTop: 40,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  modalBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#222',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#222',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    fontSize: 15,
    marginBottom: 10,
    color: '#222',
    backgroundColor: '#FAFAFA',
  },
  modalPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 2,
  },
  modalPointText: {
    fontSize: 13,
    color: '#888',
  },
  modalPointIcon: {
    width: 16,
    height: 16,
    marginHorizontal: 2,
    tintColor: '#00C48C',
  },
  modalButton: {
    backgroundColor: '#FF6600',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EndCookingScreen;
