// screens/DetailProfile.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image, FlatList, TouchableOpacity } from 'react-native'; // Bỏ FlatList
import { useTranslation } from 'react-i18next';
import { getFavorites } from '../../api/favoriteApi';
import { UserContext } from '../../context/UserContext';
import RecipeEmpty from '../../compoments/RecipeEmpty';

// Imports component ProfileInfo của bạn
import DetailProfileInfo from '../../compoments/DetailProfileInfo';
import BottomNavigation from '../../compoments/Bottomnavigation';
import { useNavigation } from '@react-navigation/native';
import { getRecipeStatsByUser } from '../../api/recipeApi'; // Thêm hàm API mới để lấy thống kê

const { width } = Dimensions.get('window');

// Component để render từng thẻ Thành tích
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
  const [isConnected, setIsConnected] = React.useState(true);

  // Thêm state cho thống kê
  const [totalTime, setTotalTime] = React.useState<number>(0); // tổng thời gian nấu (giây)
  const [totalRecipes, setTotalRecipes] = React.useState<number>(0); // tổng số món đã nấu

  React.useEffect(() => {
    // Lấy danh sách công thức đã lưu
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

  // Lấy thống kê tổng thời gian và tổng số món đã nấu theo user._id hoặc user.id
  React.useEffect(() => {
    const fetchStats = async () => {
      if (!user?._id && !user?.id) {
        setTotalTime(0);
        setTotalRecipes(0);
        return;
      }
      try {
        // Hàm này trả về { totalTime: số giây, totalRecipes: số lượng }
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

  // Format tổng thời gian nấu thành chuỗi "xhym"
  const formatTotalTime = (seconds: number) => {
    if (!seconds || seconds <= 0) return '0';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h${m > 0 ? m + "'" : ""}`;
    return `${m}'`;
  };

  // achievementsData dùng state thay vì cứng
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
        {/* Back button nằm trên cover */}
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
        {/* Section Thành tích */}
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

        {/* Section Công thức đã lưu */}
        <View style={styles.purchasedRecipesSection}>
          <Text style={styles.purchasedRecipesTitle}>{t('saved_recipe')}</Text>
          {favorites.length === 0 ? (
            <RecipeEmpty
              isConnected={isConnected}
              isGuest={!user}
              onExplore={() => {
                // Đã xử lý alert trong RecipeEmpty
              }}
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
      {/* Bottom Navigation */}
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
    flexWrap: 'wrap', // Cho phép các item xuống dòng
    justifyContent: 'space-between', // Căn đều các item và tạo khoảng cách giữa chúng
  },
  achievementCard: {
    width: (width - (16 * 2) - 8) / 2, // 16*2 là padding của section, 8 là khoảng cách giữa 2 thẻ (4+4)
    height: 100, // Cố định chiều cao để đồng nhất
    marginVertical: 4, // Khoảng cách trên/dưới cho mỗi thẻ
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
  // --- Hết Styles cho phần Thành tích ---
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
    paddingBottom: 100, // Giảm paddingBottom nếu thấy quá nhiều
  },
});

export default DetailProfile;