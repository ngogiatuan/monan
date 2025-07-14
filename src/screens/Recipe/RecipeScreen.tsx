import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

import BottomNavigation from '../../compoments/Bottomnavigation';
import RecipeEmpty from '../../compoments/RecipeEmpty';
import { nav } from '../../navigation/navigationName';
import { UserContext } from '../../context/UserContext';
import { addEventListener } from '@react-native-community/netinfo';


const MY_RECIPES: any[] = []; // Giữ nguyên để test empty

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
  const navigation = useNavigation<any>();
  const { user } = useContext(UserContext);
  const { t } = useTranslation();
  const [isConnected, setIsConnected] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Render từng item công thức của tôi
  const renderMyRecipe = ({ item }: { item: typeof MY_RECIPES[0] }) => (
    <View style={styles.recipeCard}>
      <View style={styles.recipeImgWrap}>
        <Image source={{ uri: item?.recipeId?.imageUrls?.[0] }} style={styles.recipeImg} />
        <View style={styles.recipeTimeOverlay}>
          <Image source={require('../../assert/image/time.png')} style={styles.timeIconOverlay} />
          <Text style={styles.timeTextOverlay}>{item?.recipeId?.cookingTime}</Text>
        </View>
        {/* Hiển thị icon more.png ở góc phải trên thay vì mark.png */}
        <View style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: 'rgba(0,0,0,0.08)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2,
        }}>
          <Image source={require('../../assert/image/more.png')} style={{ width: 20, height: 20, tintColor: '#888' }} />
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
    </View>
  );
  const isMyRecipesEmpty = MY_RECIPES.length === 0;
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('my_recipe')}</Text>
      </View>
      <View style={styles.body}>
        {isMyRecipesEmpty ? (
          <View style={styles.savedEmptyWrap}>
            <RecipeEmpty
              isConnected={isConnected}
              isGuest={!user}
              // Đổi text và button cho trường hợp chưa có công thức của tôi
              onAddRecipe={() => {
                navigation.navigate(nav.addRecipe);
              }}
            />
          </View>
        ) : (
          <FlatList
            data={MY_RECIPES}
            keyExtractor={item => item._id}
            renderItem={renderMyRecipe}
            contentContainerStyle={{ padding: 16 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <BottomNavigation current="recipe" />
    </SafeAreaView>
  );
};

export default RecipeScreen;
