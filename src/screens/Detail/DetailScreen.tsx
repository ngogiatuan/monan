import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import ButtonNavigation from '../../compoments/ButtonNavigation';

const { width } = Dimensions.get('window');

const author = {
  name: 'Emily Harris',
  avatar: require('../../assert/image/author.png'),
};

const user1 = {
  name: 'Van Dung Tran',
  avatar: require('../../assert/image/user1.png'),
  date: '15 May 2024',
  rating: 5,
  comment: 'Công thức nấu chuẩn chỉnh luôn.',
};

const user2 = {
  name: 'Quang Lam',
  avatar: require('../../assert/image/user2.png'),
  date: '25 July 2024',
  rating: 5,
  comment: 'Mới nghe thôi đã thèm lắm rồi. Công thức này đúng chuẩn người miền Tây nấu luôn ấy. Rất tuyệt vời!',
};

const INGREDIENTS = [
  '500g cá lóc làm sạch, cắt khúc.',
  '2 quả cà chua bổ múi cau.',
  '1/4 trái thơm (dứa) cắt lát mỏng.',
  '5 trái đậu bắp cắt xéo.',
  '100g giá đỗ.',
  '2 cây bạc hà (dọc mùng) tước vỏ, cắt khúc.',
  '100g đậu rồng.',
  '2 muỗng me chua hoặc 1 vắt me tươi.',
  '2 củ, 2 tép hành tím, tỏi băm nhỏ.',
  '3 - 4 nhánh rau thơm, ngò gai thái nhỏ.',
  'Gia vị : Muối, đường, hạt nêm, nước mắm, tiêu.',
  '1 trái ớt hiểm nếu muốn ăn cay.',
];

const REVIEWS = [
  user1,
  user2,
];

const RELATED = [
  {
    id: '1',
    image: require('../../assert/image/product.png'),
    title: 'Rainbow Veggie Bowl Delight Joiche/ Hander...',
    time: '20\'',
    rating: 4.8,
    reviews: 23,
    free: true,
  },
  {
    id: '2',
    image: require('../../assert/image/product.png'),
    title: 'Rainbow Veggie Bowl Delight Joiche/ Hander...',
    time: '20\'',
    rating: 4.8,
    reviews: 23,
    free: true,
  },
];

const DetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Header Image */}
          <View style={styles.headerImgWrap}>
            <Image
              source={require('../../assert/image/fish.png')}
              style={styles.headerImg}
            />
            <TouchableOpacity
              style={styles.headerBackBtn}
              onPress={() => navigation.goBack()}
            >
              <Image
                source={require('../../assert/image/back.png')}
                style={styles.headerBackIcon}
              />
            </TouchableOpacity>
            <View style={styles.headerRightIcons}>
              <TouchableOpacity style={styles.headerShareBtn}>
                <Image
                  source={require('../../assert/image/share.png')}
                  style={styles.headerShareIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerBookmarkBtn}>
                <Image
                  source={require('../../assert/image/whitemark.png')}
                  style={styles.headerBookmarkIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          {/* Title & Author */}
          <View style={styles.titleWrap}>
            <Text style={styles.title}>
              Canh chua cá lóc – Món ngon miền sông nước, chua thanh, ngọt dịu, ăn là nhớ cá quê nhà
            </Text>
            <View style={styles.authorRow}>
              <Image source={author.avatar} style={styles.authorAvatar} />
              <Text style={styles.authorName}>{author.name}</Text>
              <Text style={styles.authorLabel}>Tác giả</Text>
            </View>
            <View style={styles.tagRow}>
              <Text style={styles.tag}>Bữa sáng năng lượng</Text>
              <Text style={styles.tag}>Món ăn thịnh hành</Text>
            </View>
          </View>
          {/* Description */}
          <View style={styles.descWrap}>
            <Text style={styles.descText}>
              Canh chua cá lóc là món ăn truyền thống miền Nam với hương vị chua nhẹ, ngọt thanh và vị đậm đà từ cá lóc. Món này giúp thanh nhiệt, dễ ăn, đặc biệt thích hợp trong những ngày nóng hoặc dùng trong bữa cơm gia đình.
            </Text>
            <View style={styles.infoRow}>
              <View style={styles.infoItemBox}>
                <View style={styles.infoIconBox}>
                  <Image source={require('../../assert/image/date.png')} style={styles.infoIconSmall} />
                </View>
                <View style={styles.infoTextBox}>
                  <Text style={styles.infoLabel} numberOfLines={1} ellipsizeMode="tail">Thời gian dự kiến</Text>
                  <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">40 phút</Text>
                </View>
              </View>
              <View style={styles.infoItemBox}>
                <View style={styles.infoIconBox}>
                  <Image source={require('../../assert/image/people.png')} style={styles.infoIconSmall} />
                </View>
                <View style={styles.infoTextBox}>
                  <Text style={styles.infoLabel} numberOfLines={1} ellipsizeMode="tail">Khẩu phần ăn</Text>
                  <Text style={styles.infoValue} numberOfLines={1} ellipsizeMode="tail">2 - 3 người</Text>
                </View>
              </View>
            </View>
          </View>
          {/* Ingredients */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Nguyên liệu</Text>
            {INGREDIENTS.map((item, idx) => (
              <Text key={idx} style={styles.ingredientItem}>• {item}</Text>
            ))}
          </View>
          {/* Đánh giá */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đánh giá</Text>
            <View style={styles.ratingRow}>
              <View style={styles.ratingBox}>
                <Text style={styles.ratingScore}>5.0</Text>
                <Image
                  source={require('../../assert/image/whitestar.png')}
                  style={styles.ratingStarIcon}
                />
              </View>
              <Text style={styles.ratingLabel}>Xuất sắc</Text>
              <Text style={styles.ratingReviewCount}>· 23 Reviews</Text>
            </View>
            {REVIEWS.map((user, idx) => (
              <View key={idx} style={styles.reviewItem}>
                <Image source={user.avatar} style={styles.reviewAvatar} />
                <View style={{ flex: 1 }}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewName}>{user.name}</Text>
                    <Text style={styles.reviewDate}>{user.date}</Text>
                    <View style={styles.reviewScoreBoxBlue}>
                      <Text style={styles.reviewScoreBlue}>5.0</Text>
                      <Image
                        source={require('../../assert/image/bluestar.png')}
                        style={styles.reviewStarIconBlue}
                      />
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{user.comment}</Text>
                </View>
              </View>
            ))}
            <TouchableOpacity onPress={() => navigation.navigate(nav.review)}>
              <Text style={styles.seeMore}>Xem thêm</Text>
            </TouchableOpacity>
          </View>
          {/* Công thức liên quan */}
          <View style={styles.section}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Công thức liên quan</Text>
              <TouchableOpacity>
                <Text style={styles.seeMore}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={RELATED}
              keyExtractor={item => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 0, paddingVertical: 8 }}
              renderItem={({ item }) => (
                <View style={styles.relatedCard}>
                  <View style={styles.relatedImgWrap}>
                    <Image source={item.image} style={styles.relatedImg} />
                    <View style={styles.relatedMarkCircle}>
                      <Image
                        source={require('../../assert/image/mark.png')}
                        style={styles.relatedMark}
                      />
                    </View>
                    <View style={styles.relatedTimeOverlay}>
                      <Image source={require('../../assert/image/time.png')} style={styles.relatedTimeIcon} />
                      <Text style={styles.relatedTimeText}>{item.time}</Text>
                    </View>
                  </View>
                  <Text style={styles.relatedTitle} numberOfLines={2}>{item.title}</Text>
                  <View style={styles.relatedInfoRow}>
                    <Text style={styles.relatedRating}>★ {item.rating}</Text>
                    <Text style={styles.relatedReviewCount}>· {item.reviews} Reviews</Text>
                    <Text style={styles.relatedFreeTag}>Miễn phí</Text>
                  </View>
                </View>
              )}
            />
          </View>
        </ScrollView>
        {/* Button fixed bottom */}
        <View style={styles.bottomBtnWrap}>
          <ButtonNavigation
            title="Vào bếp thôi !"
            onPress={() => navigation.navigate(nav.tutorialCooking)}
            style={styles.bottomBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const CARD_WIDTH = 180;

const styles = StyleSheet.create({
  headerImgWrap: {
    width: '100%',
    height: 220,
    position: 'relative',
    backgroundColor: '#eee',
  },
  headerImg: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerBackBtn: {
    position: 'absolute',
    top: 18,
    left: 14,
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 20,
    padding: 6,
    zIndex: 2,
  },
  headerBackIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  headerRightIcons: {
    position: 'absolute',
    top: 18,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 2,
  },
  headerShareBtn: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 20,
    padding: 6,
    marginRight: 8,
  },
  headerShareIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  headerBookmarkBtn: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 20,
    padding: 6,
  },
  headerBookmarkIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  titleWrap: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  authorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  authorName: {
    fontWeight: 'bold',
    color: '#222',
    fontSize: 14,
    marginRight: 6,
  },
  authorLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '400',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
  },
  tag: {
    backgroundColor: '#E6FFF6',
    color: '#00C48C',
    fontSize: 12,
    fontWeight: 'bold',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginTop: 2,
  },
  descWrap: {
    paddingHorizontal: 16,
    paddingTop: 0,
    paddingBottom: 10,
    backgroundColor: '#fff',
  },
  descText: {
    color: '#222',
    fontSize: 14,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginBottom: 0,
    gap: 12,
  },
  infoItemBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F8F3',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 10,
    minWidth: 0,
    flex: 1,
    maxWidth: '50%',
  },
  infoIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#D1F5EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  infoIconSmall: {
    width: 18,
    height: 18,
    tintColor: '#00C48C',
  },
  infoTextBox: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  infoLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 2,
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: 17,
  },
  infoValue: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
    flexShrink: 1,
    flexWrap: 'wrap',
    lineHeight: 20,
  },
  section: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    marginTop: 10,
    marginBottom: 0,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 8,
  },
  ingredientItem: {
    color: '#222',
    fontSize: 14,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingBox: {
    backgroundColor: '#4A90E2',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingScore: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 4,
  },
  ratingStarIcon: {
    width: 16,
    height: 16,
    tintColor: '#fff',
  },
  ratingLabel: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 8,
  },
  ratingReviewCount: {
    color: '#888',
    fontSize: 13,
  },
  reviewItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
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
  reviewScoreBoxBlue: {
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
  reviewScoreBlue: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 4,
  },
  reviewStarIconBlue: {
    width: 14,
    height: 14,
    tintColor: '#4A90E2',
  },
  reviewComment: {
    color: '#222',
    fontSize: 14,
    marginTop: 2,
  },
  seeMore: {
    color: '#FF8000',
    fontWeight: 'bold',
    fontSize: 13,
    marginTop: 2,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  relatedCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  relatedImgWrap: {
    position: 'relative',
    width: '100%',
    height: 100,
    marginBottom: 8,
  },
  relatedImg: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  relatedMarkCircle: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  relatedMark: {
    width: 10,
    height: 13,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  relatedTimeOverlay: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,34,34,0.8)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
  },
  relatedTimeIcon: {
    width: 13,
    height: 13,
    marginRight: 4,
    tintColor: '#fff',
  },
  relatedTimeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  relatedTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
  },
  relatedInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  relatedRating: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 4,
  },
  relatedReviewCount: {
    color: '#888',
    fontSize: 12,
    marginRight: 4,
  },
  relatedFreeTag: {
    color: '#00C48C',
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: '#E6FFF6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  bottomBtnWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#f2f2f2',
  },
  bottomBtn: {
    backgroundColor: '#FF6600',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
  },
});

export default DetailScreen;
