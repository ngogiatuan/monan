import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import { useTranslation } from 'react-i18next';
import {
  getReviewsByRecipeId,
  getAverageRatingByRecipeId,
  createNewReview
} from '../../api/reviewApi';
import { UserContext } from '../../context/UserContext';

const ReviewScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const { user } = useContext(UserContext);
  const recipeId = route.params?.recipeId;
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState<number | null>(null);

  // ✅ Thêm state để lưu thông tin user của từng review
  const [reviewUsers, setReviewUsers] = useState<{ [userId: string]: any }>({});

  useEffect(() => {
    const fetchReviews = async () => {
      if (recipeId) {
        try {
          const [reviewList, avg] = await Promise.all([
            getReviewsByRecipeId(recipeId),
            getAverageRatingByRecipeId(recipeId)
          ]);
          setReviews(reviewList);
          setAvgRating(avg);

          // ✅ Lấy thông tin user cho từng review
          const usersInfo: { [userId: string]: any } = {};
          for (const review of reviewList) {
            if (review.userId && typeof review.userId === 'string') {
              try {
                // Gọi API để lấy thông tin user
                const response = await fetch(`http://103.72.99.132:3000/api/users/${review.userId}`);
                if (response.ok) {
                  const userData = await response.json();
                  usersInfo[review.userId] = userData;
                }
              } catch (error) {
                console.error('Error fetching user info:', error);
              }
            }
          }
          setReviewUsers(usersInfo);
        } catch (e) {
          setReviews([]);
          setAvgRating(null);
        }
      }
    };
    fetchReviews();
  }, [recipeId]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchReviews = async () => {
        if (recipeId) {
          try {
            const [reviewList, avg] = await Promise.all([
              getReviewsByRecipeId(recipeId),
              getAverageRatingByRecipeId(recipeId)
            ]);
            setReviews(reviewList);
            setAvgRating(avg);

            // ✅ Lấy thông tin user cho từng review
            const usersInfo: { [userId: string]: any } = {};
            for (const review of reviewList) {
              if (review.userId && typeof review.userId === 'string') {
                try {
                  const response = await fetch(`http://103.72.99.132:3000/api/users/${review.userId}`);
                  if (response.ok) {
                    const userData = await response.json();
                    usersInfo[review.userId] = userData;
                  }
                } catch (error) {
                  console.error('Error fetching user info:', error);
                }
              }
            }
            setReviewUsers(usersInfo);
          } catch (e) {
            setReviews([]);
            setAvgRating(null);
          }
        }
      };
      fetchReviews();
    }, [recipeId])
  );

  // ✅ Thêm function để lấy avatar user
  const getUserAvatar = (review: any) => {
    if (review.userId?.avatar) {
      return { uri: review.userId.avatar };
    }
    return require('../../assert/image/user1.png');
  };

  // ✅ Cập nhật function để lấy tên user
  const getUserName = (review: any) => {
    if (review.userId?.fullName?.trim()) {
      return review.userId.fullName;
    }
    return 'Ẩn danh';
  };

  // ✅ Thêm function để lấy màu và label dựa trên rating
  const getRatingColorAndLabel = (rating: number) => {
    if (rating >= 4.5) {
      return { color: '#1CB0F6', label: t('excellent') };
    } else if (rating >= 3.0) {
      return { color: '#EDA145', label: t('good') };
    } else {
      return { color: '#E4626F', label: t('bad') };
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
          <Image
            source={require('../../assert/image/back.png')}
            style={{ width: 44, height: 44, tintColor: '#fff' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('review')}</Text>
      </View>
      {/* Tổng điểm */}
      <View style={styles.summaryRow}>
        <View style={[styles.summaryScoreBox, { backgroundColor: getRatingColorAndLabel(avgRating || 0).color }]}>
          <Image source={require('../../assert/image/bluestar.png')} style={styles.summaryStar} />
          <Text style={styles.summaryScore}>
            {avgRating !== null ? avgRating.toFixed(1) : '0.0'}
          </Text>
        </View>
        <Text style={[styles.summaryLabel, { color: getRatingColorAndLabel(avgRating || 0).color }]}>
          {getRatingColorAndLabel(avgRating || 0).label}
        </Text>
      </View>
      {/* Danh sách review */}
      <FlatList
        data={reviews}
        keyExtractor={item => item._id || item.id || Math.random().toString()}
        contentContainerStyle={{ paddingHorizontal: 0, paddingBottom: 16 }}
        renderItem={({ item }) => {
          const ratingColor = getRatingColorAndLabel(item.rating || 0).color;
          return (
            <View style={styles.reviewItem}>
              <Image
                source={getUserAvatar(item)}
                style={styles.reviewAvatar}
              />
              <View style={styles.reviewContent}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewName}>
                    {getUserName(item)}
                  </Text>
                  <Text style={styles.reviewDate}>
                    {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                  </Text>
                  <View style={[styles.reviewScoreBox, { borderColor: ratingColor }]}>
                    <Image source={require('../../assert/image/bluestar.png')} style={[styles.reviewStarIcon, { tintColor: ratingColor }]} />
                    <Text style={[styles.reviewScore, { color: ratingColor }]}>
                      {item.rating?.toFixed(1) || '5.0'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{item.comment}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={{ color: '#888', fontStyle: 'italic', textAlign: 'center', marginTop: 24 }}>
            {t('no_review')}
          </Text>
        }
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
  headerBackBtn: {
    marginRight: 12,
    padding: 4,
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
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  summaryScore: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 4, // ✅ Thay đổi từ marginRight thành marginLeft
  },
  summaryStar: {
    width: 16,
    height: 16,
    tintColor: '#fff',
  },
  summaryLabel: {
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
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 'auto',
    backgroundColor: '#fff',
  },
  reviewScore: {
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 4, // ✅ Thay đổi từ marginRight thành marginLeft
  },
  reviewStarIcon: {
    width: 13,
    height: 13,
  },
  reviewComment: {
    color: '#222',
    fontSize: 14,
    marginTop: 2,
  },
  modalButton: {
    backgroundColor: '#FF6600',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  modalButtonDisabled: {
    backgroundColor: '#ccc',
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReviewScreen;
