import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import InputNavigation from '../../compoments/InputNavigation';
import { getRecipes } from '../../api/recipeApi';
import { useTranslation } from 'react-i18next';
import { getAllCategories } from '../../api/categoryApi';

const { width } = Dimensions.get('window');

type DiscoveryScreenRouteProp = RouteProp<{
  Discovery: {
    mealType?: string;
    categoryName?: string;
    category: any;
  };
}, 'Discovery'>;

const MEAL_OPTIONS = [
  'Tất cả',
  'Bữa sáng sáng năng lượng',
  'Bữa trưa đầy đủ',
  'Bữa chiều thư giãn',
  'Bữa xế tiếp sức',
  'Bữa tối nhẹ nhàng',
  'Tráng miệng ngọt ngào',
  'Ăn vặt vui vẻ',
  'Món nhậu tuyệt hảo',
];

const TYPE_OPTIONS = [
  'Tất cả',
  'Món ăn thịnh hành',
  'Hôm nay bạn nấu gì?',
  'Cảm hứng hàng ngày',
];

const DiscoveryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<DiscoveryScreenRouteProp>();
  const { mealType, category } = route.params || {};
  const { t } = useTranslation();
  const [showFilter, setShowFilter] = useState(false);
  const [meal, setMeal] = useState();
  const [type, setType] = useState('Món ăn thịnh hành');
  const [ingredients, setIngredients] = useState('');
  const [showMealDialog, setShowMealDialog] = useState(false);
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const [mealSearch, setMealSearch] = useState('');
  const [typeSearch, setTypeSearch] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [pageTitle, setPageTitle] = useState(t('trending_recipes'));
  const [categories, setCategories] = useState<any[]>([]);
  const [categorySelected, setCategorySelected] = useState<any>();
  const [recipesFiltered, setRecipeFiltered] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const data = await getRecipes(1, 20);
        setRecipes(data);
      } catch (error) {
        console.error('Lỗi khi lấy danh sách món ăn:', error);
      }
    })();

    (async () => {
      try {
        const data = await getAllCategories();
        if (data && data.length > 0) {
          setCategories(data);
          setCategorySelected(category?.id ? category : data?.[0]);
        }
      } catch (error) {
        setCategories([]);
      }
    })();
  }, [route.params, t]);

  useEffect(() => {
    const temp = recipes?.length
      ? recipes?.filter(itemRe => {
          const isInclude = itemRe?.categoryIds?.find(itemCa => {
            return itemCa?._id === categorySelected?.id;
          });
          return isInclude?._id;
        })
      : [];
    setRecipeFiltered(temp);
  }, [recipes, categorySelected]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate(nav.buy as never, { item } as never);
      }}>
      <View style={styles.card}>
        <View style={styles.cardImgWrap}>
          <Image source={{ uri: item?.imageUrls?.[0] }} style={styles.cardImg} />
          <View style={styles.cardTimeRight}>
            <Image source={require('../../assert/image/time.png')} style={styles.timeIcon} />
            <Text style={styles.timeText}>{item.cookingTime || ''}</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.markCircleTitle}>
            <Image source={require('../../assert/image/mark.png')} style={styles.markIconImg} />
          </View>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {item?.name}
          </Text>
          <View style={styles.cardRow}>
            <View style={styles.ratingBox}>
              <Image source={require('../../assert/image/whitestar.png')} style={styles.starIconBlue} />
              <Text style={styles.ratingTextBlue}>4.8</Text>
            </View>
          </View>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('discovery')}</Text>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilter(true)}>
          <Image source={require('../../assert/image/filter.png')} style={styles.filterIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.sectionRow}>
        <Image
          source={require('../../assert/image/favorite.png')}
          style={styles.fireIcon}
          resizeMode="contain"
        />
        <View>
          <Text style={styles.sectionSubTitle}>{categorySelected?.name || ''}</Text>
          <Text style={styles.sectionTitle}>{pageTitle}</Text>
        </View>
      </View>
      <FlatList
        data={recipesFiltered}
        keyExtractor={item => item?._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        animationType="slide"
        transparent
        onRequestClose={() => setShowFilter(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <Text style={styles.filterTitle}>{t('filterrecipe')}</Text>
            <View style={styles.filterGroup}>
              <View style={styles.filterRowCol}>
                <Text style={styles.filterLabel}>{t('meal')}</Text>
                <TouchableOpacity
                  style={styles.filterSelect}
                  activeOpacity={0.7}
                  onPress={() => setShowMealDialog(true)}>
                  <Text style={styles.filterSelectText}>{categorySelected?.name}</Text>
                  <Image source={require('../../assert/image/down.png')} style={styles.arrowDownIcon} />
                </TouchableOpacity>
              </View>
              <View style={styles.filterRowCol}>
                <Text style={styles.filterLabel}>{t('type')}</Text>
                <TouchableOpacity
                  style={styles.filterSelect}
                  activeOpacity={0.7}
                  onPress={() => setShowTypeDialog(true)}>
                  <Text style={styles.filterSelectText}>{type}</Text>
                  <Image source={require('../../assert/image/down.png')} style={styles.arrowDownIcon} />
                </TouchableOpacity>
              </View>

              {/* Premium Feature Section */}
              <View style={styles.filterRowCol}>
                <View style={styles.premiumHeader}>
                  <Text style={styles.filterLabel}>{t('premium_features')}</Text>
                  <TouchableOpacity>
                    <Text style={styles.viewNowText}>{t('see_more')}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Ingredients Input */}
              <View style={styles.filterRowCol}>
                <Text style={styles.filterLabel}>{t('ingredients')}</Text>
                <View style={styles.inputSearchContainer}>
                  <TextInput
                    style={styles.ingredientsInput}
                    placeholder={t('search_by_ingredients')}
                    placeholderTextColor="#888"
                    value={ingredients}
                    onChangeText={setIngredients}
                  />
                  <Image
                    source={require('../../assert/image/blacksearch.png')}
                    style={styles.inputSearchIcon}
                  />
                </View>
              </View>
            </View>
            <ButtonNavigation
              title={t('confirm')}
              style={styles.filterBtnConfirm}
              onPress={() => setShowFilter(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Meal Dialog */}
      <Modal
        visible={showMealDialog}
        animationType="slide"
        transparent
        onRequestClose={() => setShowMealDialog(false)}>
        <View style={styles.dialogOverlay}>
          {/* Removed flex: 1 from dialogContainer for auto height */}
          <View style={styles.dialogContainer}>
            <View style={styles.dialogHeader}>
              <TouchableOpacity onPress={() => setShowMealDialog(false)}>
                <Text style={{ color: '#888', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
              </TouchableOpacity>
              <Text style={styles.dialogTitle}>{t('bymeal')}</Text>
            </View>
            <View style={styles.dialogInputWrap}>
              <Image
                source={require('../../assert/image/blacksearch.png')}
                style={styles.searchIcon}
              />
              <InputNavigation
                placeholder={t('searchmeal')}
                style={[styles.dialogInput, { paddingLeft: 32 }]}
                value={mealSearch}
                onChangeText={setMealSearch}
                placeholderTextColor="#888"
              />
            </View>
            {/* Added maxHeight to this View for scrollability */}
            <View style={{ maxHeight: Dimensions.get('window').height * 0.5, flexGrow: 0 }}>
              <FlatList
                data={categories.filter(opt =>
                  opt.name.toLowerCase().includes(mealSearch.toLowerCase())
                )}
                keyExtractor={item => item?.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dialogOption}
                    onPress={() => {
                      setCategorySelected(item);
                      setShowMealDialog(false);
                      setMealSearch('');
                    }}>
                    <Text
                      style={[
                        styles.dialogOptionText,
                        categorySelected?.id === item?.id
                          ? styles.dialogOptionTextActive
                          : styles.dialogOptionTextAll, // Apply this style for 'Tất cả' or default
                      ]}>
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                )}
                keyboardShouldPersistTaps="handled"
                // Optional: For very few items, you might want this:
                // contentContainerStyle={{ flexGrow: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Type Dialog */}
      <Modal
        visible={showTypeDialog}
        animationType="slide"
        transparent
        onRequestClose={() => setShowTypeDialog(false)}>
        <View style={styles.dialogOverlay}>
          {/* Removed flex: 1 from dialogContainer for auto height */}
          <View style={styles.dialogContainer}>
            <View style={styles.dialogHeader}>
              <TouchableOpacity onPress={() => setShowTypeDialog(false)}>
                <Text style={{ color: '#888', fontSize: 22, fontWeight: 'bold' }}>{'<'}</Text>
              </TouchableOpacity>
              <Text style={styles.dialogTitle}>{t('bytype')}</Text>
            </View>
            <View style={styles.dialogInputWrap}>
              <Image
                source={require('../../assert/image/blacksearch.png')}
                style={styles.searchIcon}
              />
              <InputNavigation
                placeholder={t('searchtype')}
                style={[styles.dialogInput, { paddingLeft: 32 }]}
                value={typeSearch}
                onChangeText={setTypeSearch}
                placeholderTextColor="#888"
              />
            </View>
            {/* Added maxHeight to this View for scrollability */}
            <View style={{ maxHeight: Dimensions.get('window').height * 0.5, flexGrow: 0 }}>
              <FlatList
                data={TYPE_OPTIONS.filter(opt => opt.toLowerCase().includes(typeSearch.toLowerCase()))}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dialogOption}
                    onPress={() => {
                      setType(item);
                      setShowTypeDialog(false);
                      setPageTitle(item);
                      setTypeSearch('');
                    }}>
                    <Text
                      style={[
                        styles.dialogOptionText,
                        type === item
                          ? styles.dialogOptionTextActive
                          : item === 'Tất cả' && type === 'Tất cả'
                          ? styles.dialogOptionTextAll
                          : null,
                      ]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                )}
                keyboardShouldPersistTaps="handled"
                // Optional: For very few items, you might want this:
                // contentContainerStyle={{ flexGrow: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const CARD_HEIGHT = 110;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6600',
    height: 56,
    paddingHorizontal: 12,
    paddingTop: 0,
  },
  backBtn: {
    padding: 8,
    marginRight: 4,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 24,
  },
  filterBtn: {
    padding: 8,
  },
  filterIcon: {
    width: 20,
    height: 18,
    tintColor: '#fff',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
    backgroundColor: '#fff',
  },
  fireIcon: {
    width: 28,
    height: 28,
    marginRight: 10,
    marginTop: 2,
    resizeMode: 'contain',
  },
  sectionSubTitle: {
    fontSize: 12,
    color: '#888',
    marginBottom: -2,
    marginLeft: 0,
    fontWeight: '400',
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 0,
    marginLeft: 0,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 14,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F2F2F2',
  },
  cardImgWrap: {
    width: 90,
    height: CARD_HEIGHT - 10,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 12,
    position: 'relative',
    backgroundColor: '#f6f6f6',
  },
  cardImg: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  cardTimeRight: {
    position: 'absolute',
    top: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(34,34,34,0.8)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  timeIcon: {
    width: 12,
    height: 12,
    tintColor: '#fff',
    marginRight: 4,
  },
  timeText: {
    color: '#fff',
    fontSize: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    position: 'relative',
    paddingTop: 8,
  },
  markCircleTitle: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  markIconImg: {
    width: 10,
    height: 13,
    tintColor: '#fff',
    resizeMode: 'contain',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 6,
    paddingRight: 26,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    justifyContent: 'space-between',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: 2,
    tintColor: '#00C48C',
  },
  starIconBlue: {
    width: 16,
    height: 16,
    marginRight: 2,
    tintColor: '#4A90E2',
  },
  ratingText: {
    color: '#00C48C',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 2,
  },
  ratingTextBlue: {
    color: '#4A90E2',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 2,
  },
  reviewText: {
    color: '#888',
    fontSize: 12,
    marginLeft: 2,
  },
  priceText: {
    color: '#00C48C',
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 2,
  },
  // Filter modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 24,
  },
  filterTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#222',
    textAlign: 'center',
    marginBottom: 18,
  },
  filterGroup: {
    marginBottom: 10,
  },
  filterRowCol: {
    marginBottom: 18,
  },
  filterLabel: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
    marginBottom: 6,
  },
  filterSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    minWidth: 120,
  },
  filterSelectText: {
    fontSize: 15,
    color: '#222',
    marginRight: 8,
  },
  arrowDownIcon: {
    width: 18,
    height: 18,
    tintColor: '#888',
    marginLeft: 'auto',
    marginTop: 1,
  },
  filterBtnConfirm: {
    marginTop: 10,
    backgroundColor: '#FF6600',
  },
  // Dialog styles
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },
  dialogContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
    // Removed maxHeight and flex: 1 from here
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
  },
  dialogBackIcon: {
    width: 22,
    height: 22,
    tintColor: '#888',
    marginRight: 8,
  },
  dialogTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    flex: 1,
    textAlign: 'center',
    marginRight: 30,
  },
  dialogInputWrap: {
    marginHorizontal: 12,
    marginTop: 10,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#888',
    position: 'absolute',
    left: 16,
    zIndex: 2,
  },
  dialogInput: {
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F6F6F6',
    borderRadius: 8,
    borderWidth: 0,
    color: '#222',
    paddingLeft: 32,
    flex: 1,
    marginLeft: 15,
  },
  dialogOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderColor: '#f2f2f2',
    backgroundColor: '#fff',
  },
  dialogOptionText: {
    fontSize: 15,
    color: '#222',
    flex: 1,
  },
  dialogOptionTextActive: {
    color: '#FF6600',
    fontWeight: 'bold',
  },
  dialogOptionTextAll: {
    color: '#FF6600',
  },
  dialogCheckIcon: {
    width: 18,
    height: 18,
    tintColor: '#FF6600',
  },
  // New styles for Premium Feature and Ingredients Input
  premiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  viewNowText: {
    color: '#FF6600',
    fontSize: 13,
    fontWeight: 'bold',
  },
  inputSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  ingredientsInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    color: '#222',
  },
  inputSearchIcon: {
    width: 18,
    height: 18,
    tintColor: '#888',
    marginLeft: 8,
  },
});

export default DiscoveryScreen;