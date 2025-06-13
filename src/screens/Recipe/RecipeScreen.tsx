import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import BottomNavigation from '../../compoments/Bottomnavigation';
import RecipeEmpty from '../../compoments/RecipeEmpty';
import { nav } from '../../navigation/navigationName';

// Dữ liệu mẫu cho "Công thức của tôi"
const MY_RECIPES: any[] = [];

const SCREEN_WIDTH = 393;
const CARD_MAX_WIDTH = 360;

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff6f2c',
    height: 60,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
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
    tintColor: '#bbb',
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

  // Render từng item công thức của tôi
  const renderMyRecipe = ({ item }: { item: typeof MY_RECIPES[0] }) => (
    <View style={styles.recipeCard}>
      <View style={styles.recipeImgWrap}>
        <Image source={item.image} style={styles.recipeImg} />
        <View style={styles.recipeTimeOverlay}>
          <Image source={require('../../assert/image/time.png')} style={styles.timeIconOverlay} />
          <Text style={styles.timeTextOverlay}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.recipeInfo}>
        <Text style={styles.recipeTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.recipeRateRow}>
          <View style={styles.recipeRateBox}>
            <Image source={require('../../assert/image/whitestar.png')} style={styles.starIcon} />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.reviewText}>{item.reviews} Reviews</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreBtn}>
        <View style={styles.moreIconWrap}>
          <Image source={require('../../assert/image/more.png')} style={styles.moreIcon} />
        </View>
      </TouchableOpacity>
    </View>
  );

  // Kiểm tra danh sách công thức của tôi có rỗng không
  const isMyRecipesEmpty = MY_RECIPES.length === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Công thức</Text>
      </View>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'my' && styles.tabBtnActive]}
          onPress={() => setTab('my')}
        >
          <Text style={[styles.tabText, tab === 'my' && styles.tabTextActive]}>Công thức của tôi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'saved' && styles.tabBtnActive]}
          onPress={() => setTab('saved')}
        >
          <Text style={[styles.tabText, tab === 'saved' && styles.tabTextActive]}>Công thức đã lưu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        {tab === 'my' ? (
          isMyRecipesEmpty ? (
            <View style={styles.savedEmptyWrap}>
              <Image
                source={require('../../assert/image/fire.png')}
                style={styles.fireIconEmpty}
              />
              <TouchableOpacity
                style={styles.addMyRecipeBtn}
                onPress={() => navigation.navigate(nav.addRecipe)}
              >
                <Text style={styles.addMyRecipeText}>Thêm công thức của tôi  {'>'}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={MY_RECIPES}
              keyExtractor={item => item.id}
              renderItem={renderMyRecipe}
              contentContainerStyle={{ padding: 16 }}
              showsVerticalScrollIndicator={false}
            />
          )
        ) : (
          <View style={styles.savedEmptyWrap}>
            <RecipeEmpty onExplore={() => navigation.navigate(nav.discovery)} />
          </View>
        )}
      </View>
      <BottomNavigation current="recipe" />
    </SafeAreaView>
  );
};

export default RecipeScreen;
