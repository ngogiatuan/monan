/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState, useCallback } from 'react';
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
  Modal,
} from 'react-native';
import BottomNavigation from '../../compoments/Bottomnavigation';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import { UserContext } from '../../context/UserContext';
import { getRecipes } from '../../api/recipeApi';
import { getAllCategories } from '../../api/categoryApi';
import { addFavorite, removeFavorite, getFavorites, findFavoriteId } from '../../api/favoriteApi';
import NetInfo from '@react-native-community/netinfo';
import { checkNetworkAndAlert } from '../../compoments/NetworkAlert';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isPre } from '../../api/userApi';
import { getReviewsByRecipeId, getAverageRatingByRecipeId } from '../../api/reviewApi';
import { DeviceEventEmitter } from 'react-native';

const { width } = Dimensions.get('window');

interface AppOpenNotificationItem {
  id: string;
  type: 'app_open';
  timestamp: number;
  message?: string;
}

const NOTIFICATION_STORAGE_KEY = '@app_notifications';
const LAST_APP_ACCESS_TIMESTAMP_PREFIX = '@last_app_access_timestamp_';
const LAST_USER_ID_KEY = '@last_logged_user_id';
const HAS_UNREAD_NOTIFICATIONS_KEY = '@has_unread_notifications';

// Helper: xác định id hoặc tên category cho từng bữa ăn
const getMealCategoryKey = (hour: number) => {
  if (hour >= 5 && hour < 11) return 'Bữa sáng';
  if (hour >= 11 && hour < 13) return 'Bữa trưa';
  if (hour >= 13 && hour < 18) return 'Bữa chiều';
  return 'Bữa tối';
};

const HomeScreen = () => {
  const { user } = useContext(UserContext);
  const navigation = useNavigation<any>();
  const { t, i18n } = useTranslation();
  const [recipes, setRecipes] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [recipesCache, setRecipesCache] = useState<any[]>([]);
  const [categoriesCache, setCategoriesCache] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [hasLoadedRecipes, setHasLoadedRecipes] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [hasNewNotifications, setHasNewNotifications] = useState(false); // State for notification icon
  const [recipeRatings, setRecipeRatings] = useState<{ [recipeId: string]: { avg: number, count: number } }>({});
  const [reviewCountUpdates, setReviewCountUpdates] = useState<{ [recipeId: string]: number }>({}); // ✅ Thêm state track updates
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumMessage, setPremiumMessage] = useState('');
  const [premiumTitle, setPremiumTitle] = useState('');
  const [premiumBuyMessage, setPremiumBuyMessage] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');
  const [loginTitle, setLoginTitle] = useState('');

  const isFocused = useIsFocused(); // To detect when HomeScreen comes into focus
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      if (isConnected) {
        try {
          const recipeData = await getRecipes(1, 10);
          if (!ignore && recipeData && recipeData.length > 0) {
            setRecipes(recipeData);
            setRecipesCache(recipeData);
          }
        } catch (error) {
          console.error('Error fetching recipes:', error);
          if (!ignore && recipesCache.length > 0) {
            setRecipes(recipesCache);
          }
        }
        try {
          const categoryData = await getAllCategories();
          if (!ignore && categoryData && categoryData.length > 0) {
            setCategories(categoryData);
            setCategoriesCache(categoryData);
          }
        } catch (error) {
          console.error('Error fetching categories:', error);
          if (!ignore && categoriesCache.length > 0) {
            setCategories(categoriesCache);
          }
        }
      } else {
        if (recipesCache.length > 0) setRecipes(recipesCache);
        if (categoriesCache.length > 0) setCategories(categoriesCache);
      }
      setHasLoadedRecipes(true); // Mark as loaded whether from API or cache
    };

    fetchData();
    return () => { ignore = true; };
  }, [isConnected, recipesCache, categoriesCache]); // Depend on isConnected and caches

  useEffect(() => {
    const fetchRatings = async () => {
      const ratingsObj: { [recipeId: string]: { avg: number, count: number } } = {};
      await Promise.all(recipes.map(async (r) => {
        const id = r._id || r.id;
        const [reviews, avg] = await Promise.all([
          getReviewsByRecipeId(id),
          getAverageRatingByRecipeId(id)
        ]);
        ratingsObj[id] = {
          avg: avg ?? 0,
          count: reviews.length
        };
      }));
      setRecipeRatings(ratingsObj);
    };
    if (recipes.length > 0) fetchRatings();
  }, [recipes]);

  // ✅ Thêm useEffect để cập nhật review count khi có thay đổi
  useEffect(() => {
    if (Object.keys(reviewCountUpdates).length > 0) {
      setRecipeRatings(prev => {
        const updated = { ...prev };
        Object.keys(reviewCountUpdates).forEach(recipeId => {
          if (updated[recipeId]) {
            updated[recipeId] = {
              ...updated[recipeId],
              count: updated[recipeId].count + reviewCountUpdates[recipeId]
            };
          }
        });
        return updated;
      });
      // Reset updates sau khi apply
      setReviewCountUpdates({});
    }
  }, [reviewCountUpdates]);

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
  useEffect(() => {
    const logAppAccessAndSetNotification = async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      try {
        const lastLoggedUserId = await AsyncStorage.getItem(LAST_USER_ID_KEY);
        const currentUserId = user?.id || 'guest';

        if (user?.token && user?.id) { // User is logged in
          const lastAccessTimestampStr = await AsyncStorage.getItem(LAST_APP_ACCESS_TIMESTAMP_PREFIX + user.id);
          const lastAccessTimestamp = lastAccessTimestampStr ? parseInt(lastAccessTimestampStr, 10) : 0;
          if (lastAccessTimestamp < todayStart || lastLoggedUserId !== currentUserId) {
            const newAppOpenNotification: AppOpenNotificationItem = {
              id: `app_open_${now.getTime()}`,
              type: 'app_open',
              timestamp: now.getTime(),
              message: 'Bạn đã truy cập ứng dụng.',
            };

            const storedNotificationsString = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
            let storedNotifications: AppOpenNotificationItem[] = storedNotificationsString ? JSON.parse(storedNotificationsString) : [];

            const updatedNotifications = [newAppOpenNotification, ...storedNotifications];
            await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(updatedNotifications));
            console.log('Logged app access notification:', newAppOpenNotification.timestamp);

            await AsyncStorage.setItem(HAS_UNREAD_NOTIFICATIONS_KEY, 'true');

            await AsyncStorage.setItem(LAST_APP_ACCESS_TIMESTAMP_PREFIX + user.id, now.getTime().toString());
            await AsyncStorage.setItem(LAST_USER_ID_KEY, user.id);
          }
        } else {
          if (lastLoggedUserId && lastLoggedUserId !== 'guest') {
            await AsyncStorage.removeItem(LAST_APP_ACCESS_TIMESTAMP_PREFIX + lastLoggedUserId);
            console.log('Cleared last app access for previous user:', lastLoggedUserId);
          }
          await AsyncStorage.setItem(LAST_USER_ID_KEY, 'guest'); // Mark current session as guest
        }
      } catch (error) {
        console.error('Failed to log app access notification:', error);
      }
    };
    logAppAccessAndSetNotification();
  }, [user?.id, user?.token]); // Dependencies: user ID and token

  useEffect(() => {
    const checkNotificationIconStatus = async () => {
      if (isFocused) {
        try {
          const unreadStatus = await AsyncStorage.getItem(HAS_UNREAD_NOTIFICATIONS_KEY);
          setHasNewNotifications(unreadStatus === 'true');
          console.log('Notification icon status updated:', unreadStatus === 'true' ? 'new' : 'no new');
        } catch (error) {
          console.error('Failed to read unread notifications flag:', error);
        }
      }
    };

    checkNotificationIconStatus();
  }, [isFocused]); // Depend only on isFocused to re-check when returning to screen

  // ✅ Thêm function để update review count
  const updateReviewCount = (recipeId: string, increment: number = 1) => {
    setReviewCountUpdates(prev => ({
      ...prev,
      [recipeId]: (prev[recipeId] || 0) + increment
    }));
  };

  // ✅ Export function để các screen khác có thể gọi
  // The useImperativeHandle approach is not needed here as DeviceEventEmitter is more appropriate.
  // The original code had this line, but it was causing a type error.
  // I will remove it as per the edit hint.


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

  const sortedRecipes = [...recipes].sort((a, b) => {
    if (a.isPrevailing && !b.isPrevailing) {
      return -1;
    }
    if (!a.isPrevailing && b.isPrevailing) {
      return 1;
    }
    return 0;
  });

  const trendingData = sortedRecipes.slice(0, 5).map((item) => ({
    id: item?.id || item?._id,
    image: getProductImage(item),
    title: item.name,
    time: item.cookingTime || '',
    rating: 4.8,
    free: !item?.isPrevailing,
    isPremiumRecipe: item?.isPrevailing,
  }));


  const hour = new Date().getHours();
  const mealCateName = getMealCategoryKey(hour);

  const mealCateObj = categories.find(
    (cat) =>
      cat.name?.toLowerCase() === mealCateName.toLowerCase() ||
      cat.title?.toLowerCase() === mealCateName.toLowerCase()
  );
  const mealCateId = mealCateObj?.id || mealCateObj?._id;

  let todayData = recipes
    .filter((item) => {
      if (!mealCateId) return false;
      if (Array.isArray(item.categories)) {
        return item.categories.some(
          (cat) =>
            cat === mealCateId ||
            cat?.id === mealCateId ||
            cat?.name?.toLowerCase() === mealCateName.toLowerCase()
        );
      }
      return false;
    })
    .map((item) => ({
      id: item?._id || item?.id,
      image: getProductImage(item),
      title: item.name,
      time: item.cookingTime || '',
      rating: 4.8,
      free: !item?.isPrevailing,
      isPremiumRecipe: item?.isPrevailing,
    }));

  if (todayData.length === 0) {
    const fallbackCateName = 'Bữa tối';
    const fallbackCateObj = categories.find(
      (cat) =>
        cat.name?.toLowerCase() === fallbackCateName.toLowerCase() ||
        cat.title?.toLowerCase() === fallbackCateName.toLowerCase()
    );
    const fallbackCateId = fallbackCateObj?.id || fallbackCateObj?._id;
    todayData = recipes
      .filter((item) => {
        if (!fallbackCateId) return false;
        if (Array.isArray(item.categories)) {
          return item.categories.some(
            (cat) =>
              cat === fallbackCateId ||
              cat?.id === fallbackCateId ||
              cat?.name?.toLowerCase() === fallbackCateName.toLowerCase()
          );
        }
        return false;
      })
      .map((item) => ({
        id: item?._id || item?.id,
        image: getProductImage(item),
        title: item.name,
        time: item.cookingTime || '',
        rating: 4.8,
        free: !item?.isPrevailing,
        isPremiumRecipe: item?.isPrevailing,
      }));
  }

  if (todayData.length === 0) {
    const fallbackCateName = 'Bữa sáng';
    const fallbackCateObj = categories.find(
      (cat) =>
        cat.name?.toLowerCase() === fallbackCateName.toLowerCase() ||
        cat.title?.toLowerCase() === fallbackCateName.toLowerCase()
    );
    const fallbackCateId = fallbackCateObj?.id || fallbackCateObj?._id;
    todayData = recipes
      .filter((item) => {
        if (!fallbackCateId) return false;
        if (Array.isArray(item.categories)) {
          return item.categories.some(
            (cat) =>
              cat === fallbackCateId ||
              cat?.id === fallbackCateId ||
              cat?.name?.toLowerCase() === fallbackCateName.toLowerCase()
          );
        }
        return false;
      })
      .map((item) => ({
        id: item?._id || item?.id,
        image: getProductImage(item),
        title: item.name,
        time: item.cookingTime || '',
        rating: 4.8,
        free: !item?.isPrevailing,
        isPremiumRecipe: item?.isPrevailing,
      }));
  }

  if (todayData.length === 0) {
    todayData = recipes.map((item) => ({
      id: item?._id || item?.id,
      image: getProductImage(item),
      title: item.name,
      time: item.cookingTime || '',
      rating: 4.8,
      free: !item?.isPrevailing,
      isPremiumRecipe: item?.isPrevailing,
    }));
  }

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
                        // ✅ Thêm validation cho guest user với premium recipes
                        if (recipeItem.isPremiumRecipe) {
                          if (!user?.token) {
                            setLoginTitle(t('loginrequiredtitle'));
                            setLoginMessage(t('loginrequiredmessage'));
                            setShowLoginModal(true);
                            return;
                          }
                          if (!isPre(user)) {
                            setPremiumTitle(t('premiumrequiredtitle'));
                            setPremiumMessage(t('premiumrequiredmessage'));
                            setPremiumBuyMessage(t('buynow'));
                            setShowPremiumModal(true);
                            return;
                          }
                        }

                        const ok = await checkNetworkAndAlert(t('networkviewrecipe'));
                        if (!ok) return;

                        // ✅ Chỉ truyền recipeId, không truyền recipeData
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
                              Alert.alert(t('loginrequiredtitle'), t('loginrequiredmessage'));
                              return;
                            }
                            if (recipeItem.isPremiumRecipe && !isPre(user)) {
                              setPremiumTitle(t('premiumrequiredtitle'));
                              setPremiumMessage(t('premiumrequiredsavemessage')); // hoặc message phù hợp
                              setPremiumBuyMessage(t('buynow'));
                              setShowPremiumModal(true);
                              return;
                            }

                            try {
                              if (!isFav) {
                                await addFavorite(user.token, recipeItem.id);
                              } else if (favoriteId) {
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
                      <Text style={styles.productTitle} numberOfLines={2}>
                        {recipeItem.title}
                      </Text>
                    </TouchableOpacity>
                    <View style={styles.productInfoRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                        <View style={styles.ratingBox}>
                          <Text style={styles.ratingText}>★ {recipeRatings[recipeItem.id]?.avg?.toFixed(1) ?? '0.0'}</Text>
                        </View>
                        <Text style={{ color: '#888', fontSize: 13, marginLeft: 16 }}>
                          {recipeRatings[recipeItem.id]?.count ?? 0} Reviews
                        </Text>
                      </View>
                      <Text style={recipeItem.isPremiumRecipe ? styles.premiumTag : styles.freeTag}>
                        {recipeItem.isPremiumRecipe ? t('buyrecipe') : t('free')}
                      </Text>
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

  const goNotification = () => {
    navigation.navigate(nav.notification);
  };

  // ✅ Thêm useFocusEffect để check params khi quay lại
  useEffect(() => {
    const params = navigation.getState()?.routes?.find(r => r.name === nav.home)?.params;
    if (params?.updateReviewCount && params?.recipeId) {
      updateReviewCount(params.recipeId, params.increment || 1);
      // Clear params
      navigation.setParams({ updateReviewCount: undefined, recipeId: undefined, increment: undefined });
    }
  }, [navigation]);

  // ✅ Thêm listener cho review count updates
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('reviewCountUpdated', (data) => {
      if (data.recipeId && data.increment) {
        updateReviewCount(data.recipeId, data.increment);
      }
    });

    return () => subscription.remove();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
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
          <TouchableOpacity style={styles.notificationIconContainer} onPress={goNotification}>
            <Image
              source={hasNewNotifications ? require('../../assert/image/notification1.png') : require('../../assert/image/notfication2.png')}
              style={styles.notificationIcon}
            />
          </TouchableOpacity>
        </View>

        <View>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>{t('categories')}</Text>
            <TouchableOpacity onPress={goDiscovery}>
              <Text style={styles.seeMore}>{t('see_more')}</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.categoryListContainer, { flexDirection: 'row', justifyContent: 'space-between' }]}>
            {(categories.length > 0 ? categories : categoriesCache).map(catItem => (
              <TouchableOpacity
                key={catItem?.id || catItem.key}
                style={[styles.categoryItem, { flex: 1, maxWidth: 90 }]} // mỗi cate chiếm đều 1 phần, maxWidth để không quá to
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
          </View>
        </View>
      </View>

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
          style={{ backgroundColor: '#F6F6F6' }}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F6F6F6' }}>
          <Text>
            {t('loadingData')}
          </Text>
        </View>
      )}
      <BottomNavigation current="home" />
      <Modal
        visible={showLoginModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLoginModal(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.errorDialogBox}>
            <Text style={styles.errorDialogTitle}>{loginTitle}</Text>
            <Text style={styles.errorDialogMessage}>{loginMessage}</Text>
            <View style={styles.errorButtonContainer}>
              <TouchableOpacity
                style={[styles.errorOkButton, { backgroundColor: '#E0E0E0', marginRight: 8, flex: 1 }]}
                onPress={() => setShowLoginModal(false)}
              >
                <Text style={[styles.errorOkButtonText, { color: '#222' }]}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.errorOkButton, { flex: 1 }]}
                onPress={() => {
                  setShowLoginModal(false);
                  navigation.navigate(nav.authen);
                }}
              >
                <Text style={styles.errorOkButtonText}>{t('login')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={showPremiumModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPremiumModal(false)}
      >
        <View style={styles.dialogOverlay}>
          <View style={styles.errorDialogBox}>
            <Text style={styles.errorDialogTitle}>{premiumTitle}</Text>
            <Text style={styles.errorDialogMessage}>{premiumMessage}</Text>
            <View style={styles.errorButtonContainer}>
              <TouchableOpacity
                style={[styles.errorOkButton, { backgroundColor: '#E0E0E0', marginRight: 8, flex: 1 }]}
                onPress={() => setShowPremiumModal(false)}
              >
                <Text style={[styles.errorOkButtonText, { color: '#222' }]}>{t('cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.errorOkButton, { flex: 1 }]}
                onPress={() => {
                  setShowPremiumModal(false);
                  navigation.navigate(nav.buy, {
                    showPremiumDialog: true,
                    premiumDialogTitle: premiumTitle,
                    premiumDialogMessage: premiumMessage,
                  });
                }}
              >
                <Text style={styles.errorOkButtonText}>{premiumBuyMessage}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const PRODUCT_CARD_MAIN_WIDTH = 260;

const styles = StyleSheet.create({
  topSectionBlock: {
    backgroundColor: '#fff',
  },
  contentBlock: {
    backgroundColor: '#fff',
    borderTopWidth: 10,
    borderTopColor: "#f6f6f6",
    marginBottom: 8,
  },

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
    // Loại bỏ border tại đây
    borderWidth: 0, // Đặt borderWidth về 0
    borderColor: 'transparent', // Hoặc transparent nếu bạn muốn giữ thuộc tính nhưng không hiển thị
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
    borderWidth: 1,
    borderColor: "#E8E8E8",
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
    fontSize: 15,
    color: '#222'
  },
  notificationIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F1F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationIcon: {
    width: 22,
    height: 22,
    tintColor: '#000',
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
    left: 0,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A5E6D',
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
    justifyContent: 'space-between', // Đảm bảo tag nằm sát phải
    width: '100%',
    paddingHorizontal: 5,
    marginTop: 4,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1CB0F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
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
  premiumTag: {
    color: '#FF4500',
    fontWeight: 'bold',
    fontSize: 12,
    backgroundColor: '#FFECDF',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
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
    fontSize: 13,
  },
  offerDescFull: {
    color: '#222',
    fontSize: 13,
    marginBottom: 0,
    marginTop: 2,
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorDialogBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 18,
    width: '85%',
    elevation: 4,
  },
  errorDialogTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorDialogMessage: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12, // nếu dùng React Native >= 0.71, hoặc dùng marginRight như trên
  },
  errorOkButton: {
    backgroundColor: '#ff6f2c',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default HomeScreen;