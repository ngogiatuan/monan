/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import BottomNavigation from '../../compoments/Bottomnavigation';
import ButtonNavigation from '../../compoments/ButtonNavigation';

const { width } = Dimensions.get('window');

const trendingData = [
  {
    id: '1',
    image: require('../../assert/image/product.png'),
    title: 'Canh chua cá lóc theo chuẩn gu miền Tây',
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

const todayData = [
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

const offerData = [
  {
    id: '1',
    image: require('../../assert/image/gift.png'),
    title: 'Quà 100K chờ bạn!',
    desc: 'Hãy giới thiệu tới bạn bè để được nhận quà hấp dẫn từ chúng tôi.',
    button: 'Xem ngay',
  },
  {
    id: '2',
    image: require('../../assert/image/gift.png'),
    title: 'Quà tặng đặc biệt',
    desc: 'Đăng nhập mỗi ngày để nhận ưu đãi hấp dẫn.',
    button: 'Nhận quà',
  },
];

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <ImageBackground
        source={require('../../assert/image/Header.png')}
        style={styles.banner}
        resizeMode="cover"
        imageStyle={styles.bannerImg}
      >
        <View style={styles.headerProfileRow}>
          <Image
            source={require('../../assert/image/user.png')}
            style={styles.headerAvatar}
          />
          <View>
            <Text style={styles.headerGreeting}>Chào buổi sáng, hôm nay bạn muốn nấu gì?</Text>
            <Text style={styles.headerName}>Bessie Cooper</Text>
          </View>
        </View>
      </ImageBackground>
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Image
            source={require('../../assert/image/blacksearch.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm món ăn/thể loại..."
            placeholderTextColor="#888"
          />
        </View>
        <View style={styles.pointBox}>
          <View style={styles.pointIconWrap}>
            <Image
              source={require('../../assert/image/point.png')}
              style={styles.pointIcon}
            />
          </View>
          <View style={styles.pointInfo}>
            <Text style={styles.pointLabel}>Điểm xếp hạng</Text>
            <Text style={styles.pointText}>-</Text>
          </View>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Các loại công thức</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>Xem thêm</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryRow}>
          <View style={styles.categoryItem}>
            <Image
              source={require('../../assert/image/Breakfast.png')}
              style={styles.categoryIcon}
            />
            <Text style={styles.categoryText}>Breakfast</Text>
          </View>
          <View style={styles.categoryItem}>
            <Image
              source={require('../../assert/image/Lunch.png')}
              style={styles.categoryIcon}
            />
            <Text style={styles.categoryText}>Lunch</Text>
          </View>
          <View style={styles.categoryItem}>
            <Image
              source={require('../../assert/image/Dinner.png')}
              style={styles.categoryIcon}
            />
            <Text style={styles.categoryText}>Dinner</Text>
          </View>
          <View style={styles.categoryItem}>
            <Image
              source={require('../../assert/image/Dessert.png')}
              style={styles.categoryIcon}
            />
            <Text style={styles.categoryText}>Dessert</Text>
          </View>
          <View style={styles.categoryItem}>
            <Image
              source={require('../../assert/image/Lunch.png')}
              style={styles.categoryIcon}
            />
            <Text style={styles.categoryText}>Lunch</Text>
          </View>
        </View>
         <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Món ăn thịnh hành</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>Xem thêm</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={trendingData}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.productImgWrap}>
                <Image source={item.image} style={styles.productImg} />
                <View style={styles.productMarkCircle}>
                  <Image
                    source={require('../../assert/image/mark.png')}
                    style={styles.productMark}
                  />
                </View>
                <View style={styles.productTimeOverlay}>
                  <Image source={require('../../assert/image/time.png')} style={styles.timeIcon} />
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </View>
              <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.productInfoRow}>
                <View style={styles.ratingBox}>
                  <Text style={styles.ratingText}>★ {item.rating}</Text>
                  <Text style={styles.reviewText}>· {item.reviews} Reviews</Text>
                </View>
                <Text style={styles.freeTag}>Miễn phí</Text>
              </View>
            </View>
          )}
        />
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Hôm nay nấu món gì?</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>Xem thêm</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={todayData}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.productImgWrap}>
                <Image source={item.image} style={styles.productImg} />
                <View style={styles.productMarkCircle}>
                  <Image
                    source={require('../../assert/image/mark.png')}
                    style={styles.productMark}
                  />
                </View>
                <View style={styles.productTimeOverlay}>
                  <Image source={require('../../assert/image/time.png')} style={styles.timeIcon} />
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </View>
              <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.productInfoRow}>
                <Text style={styles.ratingText}>★ {item.rating}</Text>
                <Text style={styles.freeTag}>Miễn phí</Text>
              </View>
            </View>
          )}
        />
        {/* Ưu đãi mới nằm dưới mục hôm nay nấu món gì */}
        <View style={styles.offerSection}>
          <Text style={styles.offerSectionTitle}>Ưu đãi mới</Text>
          <FlatList
            data={offerData}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
            renderItem={({ item }) => (
              <View style={styles.offerCardFullImg}>
                <Image source={item.image} style={styles.offerImgBanner} />
                <View style={styles.offerContentFull}>
                  <View style={styles.offerTextRowFull}>
                    <Text
                      style={styles.offerTitleFull}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.title}
                    </Text>
                    <TouchableOpacity style={styles.offerBtnFull}>
                      <Text style={styles.offerBtnTextFull}>{item.button}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text
                    style={styles.offerDescFull}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {item.desc}
                  </Text>
                </View>
              </View>
            )}
          />
        </View>
        {/* Cảm hứng hàng ngày */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Cảm hứng hàng ngày</Text>
          <TouchableOpacity>
            <Text style={styles.seeMore}>Xem thêm</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={todayData}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <View style={styles.productImgWrap}>
                <Image source={item.image} style={styles.productImg} />
                <View style={styles.productMarkCircle}>
                  <Image
                    source={require('../../assert/image/mark.png')}
                    style={styles.productMark}
                  />
                </View>
                <View style={styles.productTimeOverlay}>
                  <Image source={require('../../assert/image/time.png')} style={styles.timeIcon} />
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </View>
              <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
              <View style={styles.productInfoRow}>
                <Text style={styles.ratingText}>★ {item.rating}</Text>
                <Text style={styles.freeTag}>Miễn phí</Text>
              </View>
            </View>
          )}
        />
      </ScrollView>
      <BottomNavigation current="home" />
    </View>
  );
};

const CARD_WIDTH = 180;

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 120,
    justifyContent: 'flex-end',
    paddingHorizontal: 0,
    paddingVertical: 0,
    margin: 0,
    overflow: 'hidden',
  },
  bannerImg: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  headerProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18, // giảm xuống để nhích lên so với cạnh dưới
    marginLeft: 12,
    marginBottom: 12, // thêm khoảng cách với cạnh dưới banner
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerGreeting: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    marginBottom: 2,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerName: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#222',
  },
  pointBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    marginLeft: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    borderWidth: 0,
    minWidth: 120,
  },
  pointIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EAF7F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  pointIcon: {
    width: 22,
    height: 22,
    tintColor: '#1ABC9C',
  },
  pointInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  pointLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '400',
    marginBottom: 0,
  },
  pointText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 0,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
  },
  seeMore: {
    color: '#FF8000',
    fontWeight: 'bold',
    fontSize: 13,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  categoryItem: {
    alignItems: 'center',
    width: 60,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#222',
    textAlign: 'center',
  },
  productCard: {
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
  productImgWrap: {
    position: 'relative',
    width: '100%',
    height: 100,
    marginBottom: 8,
  },
  productImg: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  productMarkCircle: {
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
  productMark: {
    width: 10,
    height: 13,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  productTimeOverlay: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,34,34,0.8)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  timeIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
    tintColor: '#fff',
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
    marginBottom: 4,
  },
  productInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  reviewText: {
    color: '#888',
    fontSize: 12,
    marginLeft: 4,
  },
  freeTag: {
    color: '#00C48C',
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: '#E6FFF6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },
  pointRow: {
    display: 'none',
  },
  icon: {
    width: 13,
    height: 12,
    marginRight: 6,
  },
  point: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  offerSection: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    marginBottom: 8,
  },
  offerSectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginLeft: 16,
    marginBottom: 2,
  },
  // --- NEW FULL WIDTH OFFER CARD STYLE ---
  offerCardFullImg: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 12,
    width: width - 32,
    minHeight: 120,
    alignSelf: 'center',
    padding: 0,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 8,
  },
  offerImgBanner: {
    width: '100%',
    height: 90,
    resizeMode: 'cover',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  offerContentFull: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  offerTextRowFull: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  offerTitleFull: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    flex: 1,
    marginRight: 8,
  },
  offerBtnFull: {
    backgroundColor: '#0099FF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginLeft: 8,
  },
  offerBtnTextFull: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  offerDescFull: {
    color: '#222',
    fontSize: 13,
    marginBottom: 0,
    marginTop: 2,
  },
});

export default HomeScreen;
