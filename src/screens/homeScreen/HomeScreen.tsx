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
import { addFavorite, removeFavorite, getFavorites, findFavoriteId } from '../../api/favoriteApi';
import NetInfo from '@react-native-community/netinfo';
import { checkNetworkAndAlert } from '../../compoments/NetworkAlert';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const HomeScreen = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation<any>();
  const { t, i18n } = useTranslation();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [recipesCache, setRecipesCache] = useState<any[]>([]);
  const [categoriesCache, setCategoriesCache] = useState<any[]>([]);

  // State lưu các id món đã được "lưu" (chỉ trên UI, cho user)
  const [localFavoriteIds, setLocalFavoriteIds] = useState<string[]>([]);

  // State lưu các id món đã được lưu (favorite) từ API cho user
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [hasLoadedRecipes, setHasLoadedRecipes] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Theo dõi trạng thái mạng
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Fetch danh sách món ăn và category chỉ khi có mạng
  useEffect(() => {
    let ignore = false;
    if (isConnected) {
      (async () => {
        try {
          const data = await getRecipes(1, 10);
          if (!ignore && data && data.length > 0) {
            setRecipes(data);
            setRecipesCache(data);
            setHasLoadedRecipes(true);
          }
        } catch (error) {
          if (!ignore && recipesCache.length > 0) {
            setRecipes(recipesCache);
            setHasLoadedRecipes(true);
          }
        }
      })();

      (async () => {
        try {
          const data = await getAllCategories();
          if (!ignore && data && data.length > 0) {
            setCategories(data);
            setCategoriesCache(data);
          }
        } catch (error) {
          if (!ignore && categoriesCache.length > 0) {
            setCategories(categoriesCache);
          }
        }
      })();
    } else {
      // Nếu mất mạng, dùng cache nếu có
      if (recipesCache.length > 0) setRecipes(recipesCache);
      if (categoriesCache.length > 0) setCategories(categoriesCache);
      setHasLoadedRecipes(true);
    }
    return () => { ignore = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]); // chỉ chạy 1 lần khi mount

  // Lấy danh sách favorites từ API khi user thay đổi hoặc khi thao tác lưu/xóa
  const reloadFavorites = async () => {
    if (!isConnected) return; // Không gọi API khi offline
    if (user?.token) {
      try {
        const favs = await getFavorites(user.token);
        setFavorites(favs);
        setFavoriteIds(favs.map((f: any) => f.recipeId?._id || f.recipeId));
      } catch {
        // Không setFavorites([]) để giữ trạng thái cũ khi mất mạng
      }
    }
  };

  useEffect(() => {
    if (isConnected) reloadFavorites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isConnected]);

  // Hàm tạo lời chào dựa trên thời gian trong ngày, đa ngôn ngữ
  const getGreeting = () => {
    // Luôn trả về tiếng Việt nếu chưa đổi ngôn ngữ (i18n.language === 'vi' hoặc không tồn tại key)
    const hour = new Date().getHours();
    if (i18n.language === 'en') {
      if (hour >= 5 && hour < 11) return t('good_morning');
      if (hour >= 11 && hour < 13) return t('good_noon');
      if (hour >= 13 && hour < 18) return t('good_afternoon');
      return t('good_evening', { defaultValue: 'Good evening' });
    }
    // Mặc định tiếng Việt
    if (hour >= 5 && hour < 11) return t('good_morning');
    if (hour >= 11 && hour < 13) return t('good_noon');
    if (hour >= 13 && hour < 18) return t('good_afternoon');
    return t('good_evening', { defaultValue: 'Chào buổi tối' });
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
    free: true,
  }));

  // Dữ liệu món ăn cảm hứng hàng ngày (5 món tiếp theo)
  const todayData = recipes.slice(5, 10).map((item) => ({
    id: item._id,
    image: getProductImage(item),
    title: item.name,
    time: item.cookingTime || '',
    rating: 4.8,
    free: true,
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
    { type: 'categories', title: t('categories'), data: categories },
    { type: 'trending_recipes', title: t('trending_recipes'), data: trendingData },
    { type: 'today_recipes', title: t('today_recipes'), data: todayData },
    { type: 'offers', title: t('offers'), data: offerData },
    { type: 'daily_inspiration', title: t('daily_inspiration'), data: todayData },
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
                  source={typeof user?.avatar === 'string' ? { uri: user?.avatar } : require('../../assert/image/avatar.png')}
                  style={styles.headerAvatar}
                />
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.headerGreeting}>
                    {getGreeting()}, {t('what_to_cook_today')}
                  </Text>
                  <Text style={styles.headerName}>{user?.name || t('guest')}</Text>
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
                  placeholder={t('search_recipe_placeholder')}
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
                  <Text style={styles.pointLabel}>{t('ranking_point')}</Text>
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
              <TouchableOpacity >
                <Text style={styles.seeMore}>{t('see_more')}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryListContainer}>
              {(categories.length > 0 ? categories : categoriesCache).map(catItem => (
                <TouchableOpacity
                  key={catItem?._id || catItem.key}
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
                  {catItem.imageUrl ? (
                    <Image
                      source={{ uri: catItem.imageUrl }}
                      style={styles.categoryIcon}
                    />
                  ) : (
                    <View style={[styles.categoryIcon, { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }]}>
                      <Text style={{ color: '#bbb', fontSize: 12 }}>?</Text>
                    </View>
                  )}
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
              <TouchableOpacity onPress={goDiscovery}>
                <Text style={styles.seeMore}>{t('see_more')}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8, marginBottom: item.type === 'daily_inspiration' ? 20 : 0 }}>
              {item.data.map((recipeItem, idx) => {
                const isFav = favoriteIds.includes(recipeItem.id);
                const favoriteId = findFavoriteId(favorites, recipeItem.id);
                return (
                  <View style={styles.productCard} key={recipeItem.id}>
                    {/* Changed this section */}
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={async () => {
                        const ok = await checkNetworkAndAlert(t('networkviewrecipe'));
                        if (!ok) return;
                        navigation.navigate(nav.detail, { recipeId: recipeItem.id });
                      }}
                    >
                      <View style={styles.productImgWrap}>
                        {recipeItem.image ? (
                          <Image source={recipeItem.image} style={styles.productImg} />
                        ) : (
                          <View style={[styles.productImg, { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }]}>
                            <Text style={{ color: '#bbb', fontSize: 12 }}>{t('no_image')}</Text>
                          </View>
                        )}
                        <TouchableOpacity
                          style={styles.productMarkCircle}
                          onPress={async () => {
                            const ok = await checkNetworkAndAlert(t('networksaverecipe'));
                            if (!ok) return;
                            if (!user?.token) return;
                            try {
                              if (!isFav) {
                                await addFavorite(user.token, recipeItem.id);
                              } else {
                                await removeFavorite(user.token, favoriteId);
                              }
                              await reloadFavorites();
                            } catch (e) {
                              Alert.alert('Lỗi', t('cannotsaverecipe'));
                            }
                          }}
                          activeOpacity={0.7}
                        >
                          <Image
                            source={
                              isFav
                                ? require('../../assert/image/yellowmark.png')
                                : require('../../assert/image/mark.png')
                            }
                            style={styles.productMark}
                          />
                        </TouchableOpacity>
                        <View style={styles.productTimeOverlay}>
                          <Image source={require('../../assert/image/time.png')} style={styles.timeIcon} />
                          <Text style={styles.timeText}>{recipeItem.time}</Text>
                        </View>
                      </View>
                      <Text style={styles.productTitle} numberOfLines={2}>{recipeItem.title}</Text>
                    </TouchableOpacity>
                    {/* End of changed section */}
                    <View style={styles.productInfoRow}>
                      <View style={styles.ratingBox}>
                        <Text style={styles.ratingText}>★ {recipeItem.rating}</Text>
                      </View>
                      <Text style={styles.freeTag}>{t('free')}</Text>
                    </View>
                  </View>
                );
              })}
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
                        <Text style={styles.offerBtnTextFull}>{t('get_now', { defaultValue: offerItem.button })}</Text>
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

  const goDiscovery = () => {
    navigation.navigate(nav.discovery)
  }

  const goSearchScreen = () => {
    navigation.navigate(nav.search)
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header cố định */}
      <>
        <ImageBackground
          source={typeof user?.cover === 'string' ? { uri: user?.cover } : require('../../assert/image/Header.png')}
          style={styles.banner}
          resizeMode="cover"
          imageStyle={styles.bannerImg}
        >
          <View style={styles.headerProfileRow}>
            <Image
              source={typeof user?.avatar === 'string' ? { uri: user?.avatar } : require('../../assert/image/avatar.png')}
              style={styles.headerAvatar}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.headerGreeting}>
                {getGreeting()}, {t('what_to_cook_today')}
              </Text>
              <Text style={styles.headerName}>{user?.name || t('guest')}</Text>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.searchRow}>
          <TouchableOpacity style={styles.searchBox} onPress={goSearchScreen} >
            <Image
              source={require('../../assert/image/blacksearch.png')}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={t('search_recipe_placeholder')}
              placeholderTextColor="#888"
              editable={false}
            />
          </TouchableOpacity>
          <View style={styles.pointBox}>
            <View style={styles.pointIconWrap}>
              <Image
                source={require('../../assert/image/point.png')}
                style={styles.pointIcon}
              />
            </View>
            <View style={styles.pointInfo}>
              <Text style={styles.pointLabel}>{t('ranking_point')}</Text>
              <Text style={styles.pointText}>{user ? 0 : '-'}</Text>
            </View>
          </View>
        </View>
      </>
      {/* Các section cuộn được */}
      {!isConnected && recipes.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#ff6f2c', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
            {t('nonetworkhome')}
          </Text>
        </View>
      ) : hasLoadedRecipes ? (
        <FlatList
          data={homeScreenSections}
          keyExtractor={(item, index) => item.type + index}
          showsVerticalScrollIndicator={false}
          renderItem={renderSection}
          contentContainerStyle={{ paddingBottom: 0 }}
          style={{ flex: 1 }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>
            {t('loadingData')}
          </Text>
        </View>
      )}
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
    fontSize: 12, // giảm font size để placeholder gọn hơn
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