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

  const [localFavoriteIds, setLocalFavoriteIds] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [hasLoadedRecipes, setHasLoadedRecipes] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

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
          console.error('Error fetching recipes:', error);
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
          console.error('Error fetching categories:', error);
          if (!ignore && categoriesCache.length > 0) {
            setCategories(categoriesCache);
          }
        }
      })();
    } else {
      if (recipesCache.length > 0) setRecipes(recipesCache);
      if (categoriesCache.length > 0) setCategories(categoriesCache);
      setHasLoadedRecipes(true);
    }
    return () => { ignore = true; };
  }, [isConnected]);

  const reloadFavorites = async () => {
    if (!isConnected) return;
    if (user?.token) {
      try {
        const favs = await getFavorites(user.token);
        setFavorites(favs);
        setFavoriteIds(favs.map((f: any) => f.recipeId?.id || f.recipeId));
      } catch (error) {
        console.error('Error reloading favorites:', error);
      }
    }
  };

  useEffect(() => {
    if (isConnected) reloadFavorites();
  }, [user, isConnected]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (i18n.language === 'en') {
      if (hour >= 5 && hour < 11) return t('good_morning');
      if (hour >= 11 && hour < 13) return t('good_noon');
      if (hour >= 13 && hour < 18) return t('good_afternoon');
      return t('good_evening', { defaultValue: 'Good evening' });
    }
    if (hour >= 5 && hour < 11) return t('good_morning');
    if (hour >= 11 && hour < 13) return t('good_noon');
    if (hour >= 13 && hour < 18) return t('good_afternoon');
    return t('good_evening', { defaultValue: 'Chào buổi tối' });
  };

  const getProductImage = (item: any) => {
    if (item.imageUrls && item.imageUrls.length > 0) {
      return { uri: item.imageUrls[0] };
    }
    return undefined;
  };

  const trendingData = recipes.slice(0, 5).map((item) => ({
    id: item?.id || item?._id,
    image: getProductImage(item),
    title: item.name,
    time: item.cookingTime || '',
    rating: 4.8,
    free: true,
  }));

  const todayData = recipes.slice(5, 10).map((item) => ({
    id: item?._id || item?.id,
    image: getProductImage(item),
    title: item.name,
    time: item.cookingTime || '',
    rating: 4.8,
    free: true,
  }));

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

  const scrollableSections = [
    { type: 'trending_recipes', title: t('trending_recipes'), data: trendingData },
    { type: 'today_recipes', title: t('today_recipes'), data: todayData },
    { type: 'offers', title: t('offers'), data: offerData },
    { type: 'daily_inspiration', title: t('daily_inspiration'), data: todayData },
  ];

  const renderScrollableSection = ({ item }) => {
    switch (item.type) {
      case 'trending_recipes':
      case 'today_recipes':
      case 'daily_inspiration':
        return (
          <View style={styles.contentBlock}>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <TouchableOpacity onPress={goDiscovery}>
                <Text style={styles.seeMore}>{t('see_more')}</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingLeft: 16, paddingVertical: 8 }}>
              {item.data.map((recipeItem) => {
                const isFav = favoriteIds.includes(recipeItem.id);
                const favoriteId = findFavoriteId(favorites, recipeItem.id);

                return (
                  <View style={styles.productCard} key={recipeItem?.id}>
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
                            if (!user?.token) {
                                Alert.alert(t('login_required_title'), t('login_required_message'));
                                return;
                            }
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
                        {/* Đã chỉnh sửa style cho productTimeOverlay */}
                        <View style={styles.productTimeOverlay}>
                          <Image source={require('../../assert/image/time.png')} style={styles.timeIcon} />
                          <Text style={styles.timeText}>{recipeItem.time}</Text>
                        </View>
                      </View>
                      <Text style={styles.productTitle} numberOfLines={2}>
                        {recipeItem.title}
                      </Text>
                    </TouchableOpacity>
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
          </View>
        );
      case 'offers':
        return (
          <View style={styles.contentBlock}>
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
    navigation.navigate(nav.discovery);
  };

  const goSearchScreen = () => {
    navigation.navigate(nav.search);
  };

  return (
    // View ngoài cùng của HomeScreen sẽ có nền xám nhạt
    <View style={{ flex: 1, backgroundColor: '#F6F6F6' }}>
      {/* KHỐI LỚN ĐẦU TIÊN: Header, Search, Categories - Cùng một nền trắng */}
      <View style={styles.topSectionBlock}>
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
          <TouchableOpacity style={styles.searchBox} onPress={goSearchScreen}>
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
          <TouchableOpacity style={styles.notificationIconContainer}>
            <Image
              source={require('../../assert/image/notification.png')}
              style={styles.notificationIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Categories cố định và cuộn ngang */}
        <View>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>{t('categories')}</Text>
            <TouchableOpacity onPress={goDiscovery}>
              <Text style={styles.seeMore}>{t('see_more')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryListContainer}>
            {(categories.length > 0 ? categories : categoriesCache).map(catItem => (
              <TouchableOpacity
                key={catItem?.id || catItem.key}
                style={styles.categoryItem}
                onPress={() => {
                  navigation.navigate(nav.discovery, { category: catItem });
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
        </View>
      </View> {/* END of topSectionBlock */}

      {/* Các section cuộn dọc (Món ăn thịnh hành, Cảm hứng, Ưu đãi) */}
      {!isConnected && recipes.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6F6F6' }}>
          <Text style={{ color: '#ff6f2c', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>
            {t('nonetworkhome')}
          </Text>
        </View>
      ) : hasLoadedRecipes ? (
        <FlatList
          data={scrollableSections}
          keyExtractor={(item, index) => item.type + index}
          showsVerticalScrollIndicator={false}
          renderItem={renderScrollableSection}
          // contentContainerStyle={{ paddingBottom: 0 }} // Bỏ paddingBottom ở đây
          style={{ flex: 1, backgroundColor: 'transparent' }} // Đảm bảo FlatList trong suốt
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6F6F6' }}>
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
const PRODUCT_CARD_MAIN_WIDTH = 260; // Chiều rộng cố định của thẻ sản phẩm chính

const styles = StyleSheet.create({
  // Style chung cho khối đầu tiên (Header + Search + Categories)
  topSectionBlock: {
    backgroundColor: '#fff',
    marginBottom: 8, // Khoảng cách màu xám bên dưới khối này
  },
  // Style chung cho các khối nội dung sau đó (Món ăn thịnh hành, Ưu đãi, Cảm hứng)
  contentBlock: {
    backgroundColor: '#fff',
    marginBottom: 8, // Khoảng cách màu xám giữa các khối này
  },

  // Header and Search Bar Styles (giữ nguyên)
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
    justifyContent: 'space-between',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
    marginRight: 10,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#222',
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EAF7F3',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  notificationIcon: {
    width: 22,
    height: 22,
    tintColor: '#1ABC9C',
  },

  // Section Headers (giữ nguyên)
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

  // Category List (giữ nguyên, chỉ cần View bọc bên ngoài có style topSectionBlock)
  categoryListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12, // Điều chỉnh paddingBottom thay vì marginBottom
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

  // Styles cho productCard (áp dụng cho Trending, Daily Inspiration - đã được chỉnh sửa như lần trước)
  productCard: {
    width: PRODUCT_CARD_MAIN_WIDTH,
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    padding: 10,
  },
  productImgWrap: {
    width: PRODUCT_CARD_MAIN_WIDTH - 20,
    height: PRODUCT_CARD_MAIN_WIDTH - 20,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  productImg: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
    textAlign: 'center',
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
    left: 0, // Đã thay đổi từ 8 thành 0 để sát lề trái
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A5E6D', // Đã thay đổi màu nền
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
  productInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1CB0F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  ratingText: {
    color: '#fff',
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

  // Offer Section Styles (giữ nguyên)
  offerSection: {
    // Không cần background hay padding riêng ở đây nữa vì đã có contentBlock
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
});

export default HomeScreen;