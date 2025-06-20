/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
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
  Alert,
} from 'react-native';
import BottomNavigation from '../../compoments/Bottomnavigation';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import { UserContext } from '../../context/UserContext';
import { getRecipes } from '../../api/recipeApi';
import { getAllCategories } from '../../api/categoryApi';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation<any>();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  // Effect để fetch danh sách món ăn (recipes)
  useEffect(() => {
    (async () => {
      try {
        const data = await getRecipes(1, 10); // Lấy 10 món ăn đầu tiên
        setRecipes(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách món ăn:', error);
      }
    })();

     (async () => {
      try {
        const data = await getAllCategories(); // Lấy 10 món ăn đầu tiên
        setCategories(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách món ăn:', error);
        setCategories([]);
      }
    })();
  }, []);

  console.log('categories', categories);

  // Hàm tạo lời chào dựa trên thời gian trong ngày
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) return 'Chào buổi sáng';
    if (hour >= 11 && hour < 13) return 'Chào buổi trưa';
    if (hour >= 13 && hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  // Hàm trả về ảnh món ăn từ API (ưu tiên imageUrls[0])
  const getProductImage = (item: any) => {
    if (item.imageUrls && item.imageUrls.length > 0) {
      return { uri: item.imageUrls[0] };
    }
    // Nếu không có ảnh, có thể trả về một ảnh mặc định khác nếu muốn
    return undefined;
  };

  // Dữ liệu món ăn thịnh hành (top 5)
  const trendingData = recipes.slice(0, 5).map((item) => ({
    id: item._id,
    image: getProductImage(item),
    title: item.name,
    time: item.cookingTime || '',
    rating: 4.8,
    reviews: 23,
    free: true,
    price: item.price,
  }));

  // Dữ liệu món ăn cảm hứng hàng ngày (5 món tiếp theo)
  const todayData = recipes.slice(5, 10).map((item) => ({
    id: item._id,
    image: getProductImage(item),
    title: item.name,
    time: item.cookingTime || '',
    rating: 4.8,
    reviews: 23,
    free: true,
    price: item.price,
  }));

  // Dữ liệu ưu đãi demo
  const offerData = [
    {
      id: '1',
      image: require('../../assert/image/gift.png'),
      title: 'Giảm giá 20% cho đơn đầu tiên!',
      desc: 'Nhanh tay nhận ưu đãi hấp dẫn cho đơn hàng đầu tiên của bạn.',
      button: 'Nhận ngay',
    },
    {
      id: '2',
      image: require('../../assert/image/gift.png'),
      title: 'Tặng kèm món tráng miệng',
      desc: 'Đặt món hôm nay, nhận ngay món tráng miệng miễn phí.',
      button: 'Xem chi tiết',
    },
  ];

  const handleGuestAccess = () => {
    Alert.alert('Khách hàng cần đăng nhập để xem chi tiết.');
  };

  // Dùng FlatList cho toàn bộ màn hình, các section ngang dùng ScrollView ngang hoặc FlatList ngang bên trong
  const homeScreenSections = [
    { type: 'header_search' },
    { type: 'categories', title: 'Các loại công thức', data: categories }, // Sử dụng categories từ API
    { type: 'trending_recipes', title: 'Món ăn thịnh hành', data: trendingData },
    { type: 'today_recipes', title: 'Hôm nay nấu món gì?', data: todayData },
    { type: 'offers', title: 'Ưu đãi mới', data: offerData },
    { type: 'daily_inspiration', title: 'Cảm hứng hàng ngày', data: todayData },
  ];

  const renderSection = ({ item }) => {
    switch (item.type) {
      case 'header_search':
        return (
          <>
            <ImageBackground
              source={require('../../assert/image/Header.png')}
              style={styles.banner}
              resizeMode="cover"
              imageStyle={styles.bannerImg}
            >
              <View style={styles.headerProfileRow}>
                <Image
                  source={user?.avatar || require('../../assert/image/avatar.png')}
                  style={styles.headerAvatar}
                />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.headerGreeting}>
                    {getGreeting()}, hôm nay bạn muốn nấu gì?
                  </Text>
                  <Text style={styles.headerName}>{user?.name || 'Guest'}</Text>
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
                  <Text style={styles.pointText}>{user ? 0 : '-'}</Text>
                </View>
              </View>
            </View>
          </>
        );
      case 'categories':
        return (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <TouchableOpacity>
                <Text style={styles.seeMore}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryListContainer}>
              {categories.map(catItem => (
                <TouchableOpacity
                key={catItem?._id}
                  style={styles.categoryItem}
                  disabled={!user}
                  onPress={() => {
                    if (user) {
                      // navigation.navigate(nav.categoryDetail, { categoryKey: catItem.key, categoryName: catItem.name });
                    } else {
                      handleGuestAccess();
                    }
                  }}
                >
                  <Image source={{uri:catItem?.imageUrl}} style={styles.categoryIcon} />
                  <Text style={styles.categoryText}>{catItem.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        );
      case 'trending_recipes':
      case 'today_recipes':
      case 'daily_inspiration':
        return (
          <>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <TouchableOpacity>
                <Text style={styles.seeMore}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8, marginBottom: item.type === 'daily_inspiration' ? 20 : 0 }}>
              {item.data.map((recipeItem, idx) => (
                <View style={styles.productCard} key={recipeItem.id}>
                  <View style={styles.productImgWrap}>
                    {recipeItem.image ? (
                      <Image source={recipeItem.image} style={styles.productImg} />
                    ) : (
                      <View style={[styles.productImg, { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }]}>
                        <Text style={{ color: '#bbb', fontSize: 12 }}>Không có ảnh</Text>
                      </View>
                    )}
                    <View style={styles.productMarkCircle}>
                      <Image
                        source={require('../../assert/image/mark.png')}
                        style={styles.productMark}
                      />
                    </View>
                    <View style={styles.productTimeOverlay}>
                      <Image source={require('../../assert/image/time.png')} style={styles.timeIcon} />
                      <Text style={styles.timeText}>{recipeItem.time}</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      console.log('uer', user);
                      if (user) {

                        navigation.navigate(nav.detail, { recipeId: recipeItem.id });
                      } else {
                        handleGuestAccess();
                      }
                    }}
                  >
                    <Text style={styles.productTitle} numberOfLines={2}>{recipeItem.title}</Text>
                  </TouchableOpacity>
                  <View style={styles.productInfoRow}>
                    <View style={styles.ratingBox}>
                      <Text style={styles.ratingText}>★ {recipeItem.rating}</Text>
                      {item.type === 'trending_recipes' && <Text style={styles.reviewText}>· {recipeItem.reviews} Reviews</Text>}
                    </View>
                    <Text style={styles.freeTag}>Miễn phí</Text>
                  </View>
                  {/* Hiển thị giá nếu có */}
                  {recipeItem.price ? (
                    <Text style={{ color: '#FF6600', fontWeight: 'bold', fontSize: 13, marginTop: 2 }}>
                      Giá: {recipeItem.price}đ
                    </Text>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          </>
        );
      case 'offers':
        return (
          <View style={styles.offerSection}>
            <Text style={styles.offerSectionTitle}>{item.title}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}>
              {item.data.map(offerItem => (
                <View style={styles.offerCardFullImg} key={offerItem.id}>
                  <Image source={offerItem.image} style={styles.offerImgBanner} />
                  <View style={styles.offerContentFull}>
                    <View style={styles.offerTextRowFull}>
                      <Text
                        style={styles.offerTitleFull}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {offerItem.title}
                      </Text>
                      <TouchableOpacity style={styles.offerBtnFull}>
                        <Text style={styles.offerBtnTextFull}>{offerItem.button}</Text>
                      </TouchableOpacity>
                    </View>
                    <Text
                      style={styles.offerDescFull}
                      numberOfLines={2}
                      ellipsizeMode="tail"
                    >
                      {offerItem.desc}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        data={homeScreenSections}
        keyExtractor={(item, index) => item.type + index}
        showsVerticalScrollIndicator={false}
        renderItem={renderSection}
        contentContainerStyle={{ paddingBottom: 0 }}
        style={{ flex: 1 }}
      />
      <BottomNavigation current="home" />
    </View>
  );
};

// Định nghĩa các StyleSheet
const CARD_WIDTH = 180; // Chiều rộng cố định của thẻ sản phẩm

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
    marginTop: 18,
    marginLeft: 12,
    marginBottom: 12,
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
  categoryListContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryItem: {
    alignItems: 'center',
    width: 80,
    marginRight: 10,
  },
  categoryIcon: {
    width: 50,
    height: 50,
    marginBottom: 4,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    resizeMode: 'cover',
  },
  categoryText: {
    fontSize: 12,
    color: '#222',
    textAlign: 'center',
    marginTop: 4,
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
  rankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginLeft: 16,
  },
  rankLabel: {
    fontSize: 15,
    color: '#888',
    marginRight: 8,
  },
  rankValue: {
    fontSize: 18,
    color: '#FF6600',
    fontWeight: 'bold',
  },
});

export default HomeScreen;