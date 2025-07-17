import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, FlatList, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { getFavorites } from '../../api/favoriteApi';
import { UserContext } from '../../context/UserContext';
import RecipeEmpty from '../../compoments/RecipeEmpty';

import DetailProfileInfo from '../../compoments/DetailProfileInfo';
import BottomNavigation from '../../compoments/Bottomnavigation';
import { useNavigation } from '@react-navigation/native';
import { getRecipeStatsByUser } from '../../api/recipeApi';

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
          {favorites.length === 0 ? (
            <RecipeEmpty
              isConnected={isConnected}
              isGuest={!user}
              // Removed onExplore prop here, as it's no longer needed or expected
            />
          ) : (
            <FlatList
              data={favorites}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  marginBottom: 12,
                  alignSelf: 'center',
                  width: 360,
                  minWidth: 360,
                  maxWidth: 360,
                  shadowColor: '#000',
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                  borderWidth: 1,
                  borderColor: '#F2F2F2',
                  minHeight: 100,
                  position: 'relative',
                }}>
                  <View style={{ width: 90, height: 64, marginRight: 14 }}>
                    <Image source={{ uri: item?.recipeId?.imageUrls?.[0] }} style={{ width: 90, height: 64, borderRadius: 12, backgroundColor: '#eee' }} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 15, color: '#222', marginBottom: 8 }}>{item?.recipeId?.name}</Text>
                  </View>
                </View>
              )}
              contentContainerStyle={{ padding: 0 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </ScrollView>
      <BottomNavigation current="profile" />
    </View>
  );
};

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
    paddingBottom: 100,
  },
});

export default DetailProfile;