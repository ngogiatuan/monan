import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';

const REVIEWS = [
  {
    id: '1',
    name: 'Van Dung Tran',
    avatar: require('../../assert/image/user1.png'),
    date: '15 May 2024',
    rating: 5,
    comment: 'Công thức nấu chuẩn chỉnh luôn.',
  },
  {
    id: '2',
    name: 'Quang Lam',
    avatar: require('../../assert/image/user2.png'),
    date: '25 July 2024',
    rating: 5,
    comment: 'Mới nghe thôi đã thèm lắm rồi. Công thức này đúng chuẩn người miền Tây nấu luôn ấy. Rất tuyệt vời!',
  },
];

const ReviewScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image source={require('../../assert/image/back.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review</Text>
      </View>
      {/* Tổng điểm */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryScoreBox}>
          <Text style={styles.summaryScore}>4.8</Text>
          <Image source={require('../../assert/image/bluestar.png')} style={styles.summaryStar} />
        </View>
        <Text style={styles.summaryLabel}>Xuất sắc</Text>
      </View>
      {/* Danh sách review */}
      <FlatList
        data={REVIEWS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 16 }}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Image source={item.avatar} style={styles.reviewAvatar} />
            <View style={styles.reviewContent}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewName}>{item.name}</Text>
                <Text style={styles.reviewDate}>{item.date}</Text>
                <View style={styles.reviewScoreBox}>
                  <Text style={styles.reviewScore}>{item.rating.toFixed(1)}</Text>
                  <Image source={require('../../assert/image/bluestar.png')} style={styles.reviewStarIcon} />
                </View>
              </View>
              <Text style={styles.reviewComment}>{item.comment}</Text>
            </View>
          </View>
        )}
        showsVerticalScrollIndicator={false}
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
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  summaryScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  summaryScore: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 4,
  },
  summaryStar: {
    width: 16,
    height: 16,
    tintColor: '#fff',
  },
  summaryLabel: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 8,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
    backgroundColor: '#fff',
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  reviewName: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 14,
    marginRight: 8,
  },
  reviewDate: {
    color: '#888',
    fontSize: 12,
    marginRight: 8,
  },
  reviewScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4A90E2',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 'auto',
    backgroundColor: '#fff',
  },
  reviewScore: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 4,
  },
  reviewStarIcon: {
    width: 13,
    height: 13,
    tintColor: '#4A90E2',
  },
  reviewComment: {
    color: '#222',
    fontSize: 14,
    marginTop: 2,
  },
});

export default ReviewScreen;
