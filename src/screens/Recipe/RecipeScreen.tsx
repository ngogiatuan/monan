import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import BottomNavigation from '../../compoments/Bottomnavigation';
import RecipeEmpty from '../../compoments/RecipeEmpty';
import { nav } from '../../navigation/navigationName';
import { getFavorites, removeFavorite } from '../../api/favoriteApi';
import { UserContext } from '../../context/UserContext';
import { addEventListener } from '@react-native-community/netinfo';
import { checkNetworkAndAlert } from '../../compoments/NetworkAlert';

// Đảm bảo mọi chỗ navigate(nav.recipe) và import đều đúng với folder mới

// Xóa dữ liệu mẫu MY_RECIPES, chỉ để mảng rỗng để test trạng thái empty
const MY_RECIPES: any[] = [];

const SCREEN_WIDTH = 393;
const CARD_MAX_WIDTH = 360;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff6f2c',
    height: 60,
    justifyContent: 'flex-end',
    paddingHorizontal: 30,
    paddingBottom: 10,
    width: SCREEN_WIDTH,
    alignSelf: 'center',

  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
    width: SCREEN_WIDTH,
    alignSelf: 'center',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabBtnActive: {
    borderColor: '#00c6b7',
  },
  tabText: {
    color: '#888',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#00c6b7',
  },
  body: {
    flex: 1,
    backgroundColor: '#F7F9FA',
    paddingHorizontal: 0,
    paddingTop: 0,
    width: SCREEN_WIDTH,
    alignSelf: 'center',
  },
  savedEmptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH,
    alignSelf: 'center',
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    alignSelf: 'center',
    width: CARD_MAX_WIDTH,
    minWidth: CARD_MAX_WIDTH,
    maxWidth: CARD_MAX_WIDTH,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    minHeight: 100,
    position: 'relative',
  },
  recipeImgWrap: {
    position: 'relative',
    width: 90,
    height: 64,
    marginRight: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recipeImg: {
    width: 90,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#eee',
  },
  recipeTimeOverlay: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,34,34,0.8)',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    zIndex: 2,
  },
  timeIconOverlay: {
    width: 13,
    height: 13,
    tintColor: '#fff',
    marginRight: 3,
  },
  timeTextOverlay: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recipeInfo: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 64,
  },
  recipeTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 8,
  },
  recipeRateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
  },
  recipeRateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A90E2',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
    minWidth: 44,
    justifyContent: 'center',
  },
  starIcon: {
    width: 14,
    height: 14,
    tintColor: '#fff',
    marginRight: 2,
  },
  ratingText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  reviewText: {
    color: '#888',
    fontSize: 13,
    marginLeft: 0,
    fontWeight: '500',
  },
  moreBtn: {
    position: 'absolute',
    top: 18,
    right: 18,
    zIndex: 10,
  },
  moreIconWrap: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  moreIcon: {
    width: 18,
    height: 18,
  },
  fireIconEmpty: {
    width: 80,
    height: 80,
    marginBottom: 24,
    alignSelf: 'center',
  },
  addMyRecipeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6f2c',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 18,
    alignSelf: 'center',
    marginTop: 0,
    marginBottom: 8,
  },
  addMyRecipeIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
    marginRight: 8,
  },
  addMyRecipeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

const RecipeScreen = () => {
  const [tab, setTab] = useState<'my' | 'saved'>('saved');
  const navigation = useNavigation<any>();
  const [favorites, setFavorites] = useState<any[]>([]); // Danh sách công thức đã lưu
  const { user } = useContext(UserContext);
  const { t } = useTranslation();

  const [isConnected, setIsConnected] = React.useState(true);

  React.useEffect(() => {
    // Kiểm tra kết nối mạng khi ứng dụng khởi động
    const unsubscribe = addEventListener(state => {
      setIsConnected(!!state.isConnected);   
    });

    // Dọn dẹp khi component unmount
    return () => {
      unsubscribe();
    };
  }, []);

    const fetchFavorites = async () => {
      try {
        if (user?.token) {
        const favs = await getFavorites(user.token);
        console.log('favs', favs);
        setFavorites(favs);
        }else {
          setFavorites([]); 
        }
        
      } catch (error) {
        console.error('Error fetching favorites:', error);  
        setFavorites([]); 
      }
      
    
    };

  React.useEffect(() => {
    // Giả lập lấy danh sách công thức đã lưu từ API
    fetchFavorites();
  }, [user]);

  const onFav = async (recipeId: string) => {
try {
  if(user?.token)
    await removeFavorite(user.token, recipeId);
  await fetchFavorites(); // Cập nhật lại danh sách sau khi xóa

}catch (error) {  
  }
  }

  // Render từng item công thức của tôi
  const renderMyRecipe = ({ item }: { item: typeof MY_RECIPES[0] }) => (
    <View style={styles.recipeCard}>
      <View style={styles.recipeImgWrap}>
        <Image source={{uri:  item?.recipeId?.imageUrls?.[0]}} style={styles.recipeImg} />
        <View style={styles.recipeTimeOverlay}>
          <Image source={require('../../assert/image/time.png')} style={styles.timeIconOverlay} />
          <Text style={styles.timeTextOverlay}>{item?.recipeId?.cookingTime}</Text>
        </View>
      </View>
      <View style={styles.recipeInfo}>
        <TouchableOpacity
          onPress={async () => {
            if (!isConnected) {
              Alert.alert('Không có kết nối mạng', 'Vui lòng bật wifi hoặc dữ liệu di động để xem chi tiết công thức.');
              return;
            }
            navigation.navigate(nav.detail, { recipeId: item?.recipeId?._id });
          }}
        >
          <Text style={styles.recipeTitle} numberOfLines={2}>{item?.recipeId?.name}</Text>
        </TouchableOpacity>
        <View style={styles.recipeRateRow}>
          <View style={styles.recipeRateBox}>
            <Image source={require('../../assert/image/whitestar.png')} style={styles.starIcon} />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
          <Text style={styles.reviewText}>{item.reviews} Reviews</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.moreBtn}
        onPress={async () => {
          if (!isConnected) {
            Alert.alert('Không có kết nối mạng', 'Vui lòng bật wifi hoặc dữ liệu di động để bỏ lưu công thức.');
            return;
          }
          await onFav(item?._id);
        }}
      >
        <View style={styles.moreIconWrap}>
          <Image source={require('../../assert/image/yellowmark.png')} style={styles.moreIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );

  // Kiểm tra danh sách công thức của tôi có rỗng không
  const isMyRecipesEmpty = MY_RECIPES.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('recipe')}</Text>
      </View>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'my' && styles.tabBtnActive]}
          onPress={() => setTab('my')}
        >
          <Text style={[styles.tabText, tab === 'my' && styles.tabTextActive]}>{t('my_recipe')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'saved' && styles.tabBtnActive]}
          onPress={() => setTab('saved')}
        >
          <Text style={[styles.tabText, tab === 'saved' && styles.tabTextActive]}>{t('saved_recipe')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        {/* Khi mất mạng, vẫn giữ UI, chỉ chặn onPress các nút */}
        {tab !== 'my' ? (
          favorites.length === 0 ? (
            <View style={styles.savedEmptyWrap}>
              <RecipeEmpty
                isConnected={isConnected}
                isGuest={!user}
                onExplore={async () => {
                  // Đã xử lý alert trong RecipeEmpty, không cần xử lý ở đây nữa
                  if (!isConnected || !user) return;
                  navigation.navigate(nav.discovery);
                }}
              />
            </View>
          ) : (
            <FlatList
              data={favorites}
              keyExtractor={item => item._id}
              renderItem={renderMyRecipe}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          )
        ) : (
          <View style={styles.savedEmptyWrap}>
            <RecipeEmpty
              isConnected={isConnected}
              isGuest={!user}
              onAddRecipe={async () => {
                if (!isConnected) return;
                navigation.navigate(nav.recipe);
              }}
            />
          </View>
        )}
      </View>
      <BottomNavigation current="recipe" />
    </SafeAreaView>
  );
};

export default RecipeScreen;
