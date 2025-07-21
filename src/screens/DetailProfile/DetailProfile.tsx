import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { addFavorite, removeFavorite, getFavorites, findFavoriteId } from '../../api/favoriteApi';
import { UserContext } from '../../context/UserContext';
import RecipeEmpty from '../../compoments/RecipeEmpty';

import DetailProfileInfo from '../../compoments/DetailProfileInfo';
import BottomNavigation from '../../compoments/Bottomnavigation';
import { useNavigation } from '@react-navigation/native';
import { getRecipeStatsByUser } from '../../api/recipeApi';
import { nav } from '../../navigation/navigationName';
import { uniqBy } from 'lodash'; // thêm thư viện lodash nếu chưa có
import { getReviewsByRecipeId, getAverageRatingByRecipeId } from '../../api/reviewApi';
import { getRecipeById } from '../../api/recipeApi';
import { useState } from 'react';

const { width } = Dimensions.get('window');

const AchievementCard = ({ item }) => {
  return (
    <View style={styles.achievementCard}>
      <Image source={item.icon} style={styles.achievementCardIcon} />
      <Text style={styles.achievementCardLabel}>{item.label}</Text>
      <Text style={[styles.achievementCardValue, { color: item.valueColor }]}>{item.value}</Text>
    </View>
  );
};

const DetailProfile = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { user } = React.useContext(UserContext);
  const [favorites, setFavorites] = React.useState<any[]>([]);
  const [isConnected, setIsConnected] = React.useState(true); // You might want to get this from a network utility/hook

  const [totalTime, setTotalTime] = React.useState<number>(0);
  const [totalRecipes, setTotalRecipes] = React.useState<number>(0);
  const [recipeRatings, setRecipeRatings] = React.useState<{ [recipeId: string]: { avg: number, count: number } }>({});
  const [fullRecipes, setFullRecipes] = useState<{ [id: string]: any }>({});

  React.useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (user?.token) {
          const favs = await getFavorites(user.token);
          setFavorites(favs);
        } else {
          setFavorites([]);
        }
      } catch (error) {
        setFavorites([]);
      }
    };
    fetchFavorites();
  }, [user]);

  React.useEffect(() => {
    const fetchStats = async () => {
      if (!user?._id && !user?.id) {
        setTotalTime(0);
        setTotalRecipes(0);
        return;
      }
      try {
        const stats = await getRecipeStatsByUser(user._id || user.id);
        setTotalTime(stats?.totalTime || 0);
        setTotalRecipes(stats?.totalRecipes || 0);
      } catch (e) {
        setTotalTime(0);
        setTotalRecipes(0);
      }
    };
    fetchStats();
  }, [user]);

  React.useEffect(() => {
    const fetchRatings = async () => {
      const ratingsObj: { [recipeId: string]: { avg: number, count: number } } = {};
      await Promise.all(favorites.map(async (f) => {
        const recipeId = f.recipeId?._id || f.recipeId?.id;
        if (recipeId) {
          const [reviews, avg] = await Promise.all([
            getReviewsByRecipeId(recipeId),
            getAverageRatingByRecipeId(recipeId)
          ]);
          ratingsObj[recipeId] = {
            avg: avg ?? 0,
            count: reviews.length
          };
        }
      }));
      setRecipeRatings(ratingsObj);
    };
    if (favorites.length > 0) fetchRatings();
  }, [favorites]);

  React.useEffect(() => {
    const fetchFullRecipes = async () => {
      const newFullRecipes: { [id: string]: any } = {};
      await Promise.all(
        favorites.map(async (item) => {
          const recipeId = item.recipeId?._id || item.recipeId?.id || item.recipeId;
          if (recipeId) {
            const fullRecipe = await getRecipeById(recipeId);
            if (fullRecipe) newFullRecipes[recipeId] = fullRecipe;
          }
        })
      );
      setFullRecipes(newFullRecipes);
    };
    if (favorites.length > 0) fetchFullRecipes();
  }, [favorites]);

  const formatTotalTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h${m > 0 ? m + "'" : ""}`;
    return `${m}'`;
  };

  const achievementsData = [
    {
      id: '1',
      icon: require('../../assert/image/totaltime.png'),
      label: 'Tổng thời gian',
      value: formatTotalTime(totalTime),
      valueColor: '#1a73e8',
    },
    {
      id: '2',
      icon: require('../../assert/image/total.png'),
      label: 'Tổng số món đã nấu',
      value: totalRecipes.toString(),
      valueColor: '#1a73e8',
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <View style={{ position: 'absolute', top: 0, left: 0, zIndex: 10, padding: 4 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require('../../assert/image/back.png')}
              style={{ width: 44, height: 44, tintColor: '#fff' }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <DetailProfileInfo />

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleWithIcon}>{t('achievements')}</Text>
            <Image
              source={require('../../assert/image/achievement.png')}
              style={styles.achievementIcon}
            />
          </View>
          <View style={styles.achievementsGrid}>
            {achievementsData.map((item) => (
              <AchievementCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        <View style={styles.purchasedRecipesSection}>
          <Text style={styles.purchasedRecipesTitle}>{t('saved_recipe')}</Text>
          {uniqBy(favorites, f => f.recipeId?._id || f.recipeId?.id).length === 0
            ? <RecipeEmpty isConnected={isConnected} isGuest={!user} />
            : <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingLeft: 0, paddingRight: 8 }}
            >
              {uniqBy(favorites, f => f.recipeId?._id || f.recipeId?.id).map((item, idx, arr) => {
                const recipe = item.recipeId;
                if (!recipe) return null;
                const recipeId = recipe._id || recipe.id || recipe.recipeId;
                const fullRecipe = fullRecipes[recipeId];
                // Lấy đúng trường phân loại premium từ fullRecipe
                const isPremiumRecipe = fullRecipe?.isPrevailing === true || fullRecipe?.isPrevailing === 1;
                // Lấy đúng id của bản ghi favorite
                const favoriteId = item._id || item.id || item.favoriteId;
                console.log('Favorite item:', item, 'favoriteId:', favoriteId);
                return (
                  <TouchableOpacity
                    key={recipe._id || recipe.id}
                    style={[styles.productCard, { marginLeft: idx === 0 ? 0 : 8 }]}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate(nav.detail, { recipeId: recipe._id || recipe.id })}
                  >
                    <View style={styles.productImgWrap}>
                      {recipe.imageUrls && recipe.imageUrls.length > 0 ? (
                        <Image source={{ uri: recipe.imageUrls[0] }} style={styles.productImg} />
                      ) : (
                        <View style={[styles.productImg, { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }]}>
                          <Text style={{ color: '#bbb', fontSize: 12 }}>{t('no_image')}</Text>
                        </View>
                      )}
                      {/* Mark icon ở góc phải trên */}
                      <TouchableOpacity
                        style={styles.productMarkCircle}
                        onPress={async (e) => {
                          e.stopPropagation && e.stopPropagation();
                          console.log('Remove favoriteId:', favoriteId);
                          if (!favoriteId || !user?.token) {
                            console.log('No favoriteId or token');
                            return;
                          }
                          setFavorites(prev => prev.filter(f => {
                            const rid = f.recipeId?._id || f.recipeId?.id || f.recipeId;
                            const currentId = recipe._id || recipe.id;
                            return rid !== currentId;
                          }));
                          try {
                            await removeFavorite(user.token, favoriteId);
                            const favs = await getFavorites(user.token);
                            setFavorites(favs);
                            console.log('Removed favorite, new favorites:', favs);
                          } catch (err) {
                            console.log('Error removing favorite:', err);
                          }
                        }}
                        activeOpacity={0.7}
                      >
                        <Image
                          source={require('../../assert/image/yellowmark.png')}
                          style={styles.productMark}
                        />
                      </TouchableOpacity>
                      <View style={styles.productTimeOverlay}>
                        <Image source={require('../../assert/image/time.png')} style={styles.timeIcon} />
                        <Text style={styles.timeText}>{recipe.cookingTime || ''}</Text>
                      </View>
                    </View>
                    <Text style={styles.productTitle} numberOfLines={2}>
                      {recipe.name}
                    </Text>
                    <View style={styles.productInfoRow}>
                      {/* Rating sát trái */}
                      <View style={styles.ratingBox}>
                        <Text style={styles.ratingText}>
                          ★ {recipeRatings[recipe._id || recipe.id]?.avg?.toFixed(1) ?? '0.0'}
                        </Text>
                      </View>

                      {/* Review count căn giữa tuyệt đối */}
                      <Text
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          textAlign: 'center',
                          color: '#888',
                          fontSize: 13,
                          zIndex: 1,
                        }}
                      >
                        {recipeRatings[recipe._id || recipe.id]?.count ?? 0} Reviews
                      </Text>

                      {/* Tag sát phải */}
                      <Text style={isPremiumRecipe ? styles.premiumTag : styles.freeTag}>
                        {isPremiumRecipe ? t('buyrecipe') : t('free')}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          }
        </View>
        <View style={styles.bottomSpacer} />
      </ScrollView>
      <BottomNavigation current="profile" />
    </View>
  );
};

const PRODUCT_CARD_MAIN_WIDTH = 260;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContentContainer: {
    paddingBottom: 0,
  },
  section: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  sectionTitleWithIcon: {
    color: '#474747',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  achievementIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#FF8000',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  achievementCard: {
    width: (width - (16 * 2) - 8) / 2,
    height: 100,
    marginVertical: 4,
    backgroundColor: '#D9F2FE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B3E5FC',
    padding: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  achievementCardIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    tintColor: '#1a73e8',
  },
  achievementCardLabel: {
    fontSize: 13,
    color: '#474747',
    flexWrap: 'wrap',
  },
  achievementCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  purchasedRecipesTitle: {
    color: '#474747',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  purchasedRecipesSection: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 0, // bỏ paddingBottom ở đây
  },
  bottomSpacer: {
    height: 25,
    backgroundColor: '#F6F6F6',
    width: '100%',
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
    marginBottom: 16,
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
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 5,
    marginTop: 4,
    position: 'relative', // Để review count absolute căn giữa
    minHeight: 24, // Đảm bảo đủ cao cho text
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
});

export default DetailProfile;