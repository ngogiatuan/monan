import React, { useEffect, useState, useContext } from 'react';
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
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import InputNavigation from '../../compoments/InputNavigation';
import { getRecipes } from '../../api/recipeApi';
import { useTranslation } from 'react-i18next';
import { getAllCategories } from '../../api/categoryApi';
import RBSheet from 'react-native-raw-bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { searchRecipesByIngredientsPremium } from '../../api/recipeApi';
import { UserContext } from '../../context/UserContext';
import { isPre } from '../../api/userApi'; // Hàm kiểm tra premium
import { getReviewsByRecipeId, getAverageRatingByRecipeId } from '../../api/reviewApi';

const { width, height } = Dimensions.get('window');

type DiscoveryScreenRouteProp = RouteProp<{
  Discovery: {
    mealType?: string;
    categoryName?: string;
    category: any;
    type?: string; // <-- Add this line
  };
}, 'Discovery'>;

const MEAL_OPTIONS = [
  'Tất cả',
  'Bữa sáng ',
  'Bữa trưa ',
  'Bữa chiều ',
  'Bữa tối',
];

const TYPE_OPTIONS = [
  'Tất cả',
  'Món ăn thịnh hành',
  'Hôm nay  nấu gì?',
  'Cảm hứng hàng ngày',
];

const DiscoveryScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<DiscoveryScreenRouteProp>();
  const { type: initialType, category } = route.params || {};
  const { t } = useTranslation();
  const { user } = useContext(UserContext);

  const [type, setType] = useState(initialType || 'Món ăn thịnh hành');
  const [ingredients, setIngredients] = useState('');
  const [recipes, setRecipes] = useState<any[]>([]);
  const [pageTitle, setPageTitle] = useState(t('trending_recipes'));
  const [categories, setCategories] = useState<any[]>([]);
  const [categorySelected, setCategorySelected] = useState(category || null);
  const [recipesFiltered, setRecipeFiltered] = useState<any[]>([]);
  const [recipeRatings, setRecipeRatings] = useState<{ [recipeId: string]: { avg: number, count: number } }>({});

  const [showFilter, setShowFilter] = useState(false);
  const [showMealDialog, setShowMealDialog] = useState(false);
  const [showTypeDialog, setShowTypeDialog] = useState(false);
  const [mealSearch, setMealSearch] = useState('');
  const [typeSearch, setTypeSearch] = useState('');

  const [categorySelectedTemp, setCategorySelectedTemp] = useState<any | null>(null);
  const [typeTemp, setTypeTemp] = useState('Món ăn thịnh hành');
  const [ingredientsTemp, setIngredientsTemp] = useState('');
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const bottomSheetCategoryRef = React.useRef<BottomSheetModal>(null);
  const bottomSheetTypeRef = React.useRef<BottomSheetModal>(null);

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
          const initialCategory = category?.id ? category : data[0];
          setCategorySelected(initialCategory);
          setCategorySelectedTemp(initialCategory);
        }
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        setCategories([]);
      }
    })();
  }, [route.params, t]);

  useEffect(() => {
    console.log('DiscoveryScreen params:', initialType, category);
    if (initialType) {
      setType(initialType);
    }
    if (category) {
      setCategorySelected(category);
    }
  }, [initialType, category]);

  useEffect(() => {
    let filtered = [...recipes];

    if (type === 'Món ăn thịnh hành') {
      // Chỉ lấy món premium
      filtered = filtered.filter(item => item.isPrevailing);
    } else if (type === 'Hôm nay nấu gì?') {
      // Lấy cả premium và free, filter theo category nếu có
      if (categorySelected && categorySelected.id) {
        filtered = filtered.filter(item =>
          item.categoryIds?.some(cat => cat._id === categorySelected.id)
        );
      }
      // Không filter isPrevailing
    } else if (type === 'Cảm hứng hàng ngày') {
      // Không filter gì cả, lấy hết
    }

    setRecipeFiltered(filtered);
  }, [recipes, type, categorySelected]);

  useEffect(() => {
    const fetchRatings = async () => {
      const ratingsObj: { [recipeId: string]: { avg: number, count: number } } = {};
      await Promise.all(recipesFiltered.map(async (r) => {
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
    if (recipesFiltered.length > 0) fetchRatings();
  }, [recipesFiltered]);

  useEffect(() => {
    if (type === 'Món ăn thịnh hành') {
      setPageTitle(t('trending_recipes'));
    } else if (type === 'Hôm nay nấu gì?') {
      setPageTitle(t('what_to_cook_today'));
    } else if (type === 'Cảm hứng hàng ngày') {
      setPageTitle(t('daily_inspiration'));
    } else {
      setPageTitle(type); // fallback
    }
  }, [type, t]);

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => {
        navigation.navigate(nav.detail, { recipeId: String(item?._id) });
      }}>
      <View style={styles.card}>
        <View style={styles.cardImgWrap}>
          <Image source={{ uri: item?.imageUrls?.[0] || 'https://via.placeholder.com/150' }} style={styles.cardImg} />
          <View style={styles.cardTimeRight}>
            <Image source={require('../../assert/image/time.png')} style={styles.timeIcon} />
            <Text style={styles.timeText}>{String(item.cookingTime || '')}</Text>
          </View>
        </View>
        <View style={styles.cardContent}>
          <View style={styles.markCircleTitle}>
            <Image source={require('../../assert/image/mark.png')} style={styles.markIconImg} />
          </View>
          <Text style={styles.cardTitle} numberOfLines={2}>
            {String(item?.name || '')}
          </Text>
          <View style={styles.cardRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={styles.ratingBox}>
                <Image source={require('../../assert/image/whitestar.png')} style={styles.starIconRatingBox} />
                <Text style={styles.ratingTextRatingBox}>
                  {recipeRatings[item._id || item.id]?.avg?.toFixed(1) ?? '0.0'}
                </Text>
              </View>
              <Text style={styles.reviewText}>
                {recipeRatings[item._id || item.id]?.count ?? 0} Reviews
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', marginTop: 4 }}>
            <Text style={item.isPrevailing ? styles.premiumTag : styles.freeTag}>
              {item.isPrevailing ? t('buyrecipe') : t('free')}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assert/image/back.png')}
            style={{ width: 44, height: 44, tintColor: '#fff' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('discovery')}</Text>
        <TouchableOpacity style={styles.filterBtn} onPress={() => {
          //  setShowFilter(true);
          setCategorySelectedTemp(categorySelected);
          setTypeTemp(type);
          setIngredientsTemp(ingredients);
          bottomSheetRef.current?.present()
        }}>
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
          <Text style={styles.sectionSubTitle}>{String(categorySelected?.name || '')}</Text>
          <Text style={styles.sectionTitle}>{pageTitle}</Text>
        </View>
      </View>
      <FlatList
        data={recipesFiltered}
        keyExtractor={item => String(item?._id)}
        renderItem={renderItem}
        style={{ backgroundColor: '#F2F2F2' }}
        contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>{t('norecipesfound')}</Text>
          </View>
        )}
      />



      {/* Filter Modal (main filter screen) */}

      <BottomSheetModal ref={bottomSheetRef} enablePanDownToClose backdropComponent={
        (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} opacity={0.5} appearsOnIndex={0} pressBehavior={'none'} />
      } >
        <BottomSheetView style={{ flex: 1 }} >
          <View style={styles.modalOverlay}>
            <View style={styles.filterModal}>
              {/* END - Modal Drag Handle */}
              <Text style={styles.filterTitle}>{t('filterrecipe')}</Text>
              <View style={styles.filterGroup}>
                <View style={styles.filterRowCol}>
                  <Text style={styles.filterLabel}>{t('meal')}</Text>
                  <TouchableOpacity
                    style={styles.filterSelect}
                    activeOpacity={0.7}
                    onPress={() => {
                      bottomSheetCategoryRef.current?.present()

                    }}>
                    <Text style={styles.filterSelectText}>{String(categorySelectedTemp?.name || t('all'))}</Text>
                    <Image source={require('../../assert/image/down.png')} style={styles.arrowDownIcon} />
                  </TouchableOpacity>
                </View>
                <View style={styles.filterRowCol}>
                  <Text style={styles.filterLabel}>{t('type')}</Text>
                  <TouchableOpacity
                    style={styles.filterSelect}
                    activeOpacity={0.7}
                    onPress={() => bottomSheetTypeRef.current?.present()}>
                    <Text style={styles.filterSelectText}>{typeTemp}</Text>
                    <Image source={require('../../assert/image/down.png')} style={styles.arrowDownIcon} />
                  </TouchableOpacity>
                </View>

                {/* Premium Feature Section */}
                <View style={styles.filterRowCol}>
                  <View style={styles.premiumHeader}>
                    <Text style={styles.filterLabel}>{t('premiumfeatures')}</Text>
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
                      placeholder={t('searchbyingredients')}
                      placeholderTextColor="#888"
                      value={ingredientsTemp}
                      onChangeText={setIngredientsTemp}
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
                onPress={async () => {
                  // Nếu có nhập nguyên liệu
                  if (ingredientsTemp && ingredientsTemp.trim().length > 0) {
                    if (!isPre(user)) {
                      // Show dialog mua premium
                      Alert.alert(
                        t('premiumrequiredtitle'),
                        t('premiumrequiredmessage'),
                        [
                          { text: t('cancel'), style: 'cancel' },
                          { text: t('buynow'), onPress: () => navigation.navigate(nav.buy) }
                        ]
                      );
                      return;
                    }
                    // Nếu là premium, gọi API tìm kiếm theo nguyên liệu và category
                    try {
                      const filteredIngredients = filterIngredientsInput(ingredientsTemp);
                      if (!filteredIngredients) {
                        Alert.alert('Vui lòng nhập tên nguyên liệu hợp lệ!');
                        return;
                      }
                      const result = await searchRecipesByIngredientsPremium(filteredIngredients);
                      // Lọc theo category nếu có chọn
                      let filtered = result;
                      if (categorySelectedTemp && categorySelectedTemp.id) {
                        filtered = result.filter(item =>
                          item?.categoryIds?.some((cat: any) => cat?._id === categorySelectedTemp.id)
                        );
                      }
                      setRecipeFiltered(filtered);
                      setIngredients(ingredientsTemp);
                      setCategorySelected(categorySelectedTemp);
                      setType(typeTemp);
                      // Đặt lại pageTitle nếu cần
                      if (typeTemp === 'Món ăn thịnh hành') {
                        setPageTitle(t('trending_recipes'));
                      } else if (typeTemp === 'Hôm nay bạn nấu gì?') {
                        setPageTitle(t('what_to_cook_today')); // Assuming you have this translation key
                      } else if (typeTemp === 'Cảm hứng hàng ngày') {
                        setPageTitle(t('daily_inspiration')); // Assuming you have this translation key
                      } else {
                        setPageTitle(typeTemp); // Fallback to raw type if no specific translation
                      }
                      bottomSheetRef.current?.dismiss();
                      return;
                    } catch (e) {
                      Alert.alert(t('error'), t('norecipesfound'));
                      return;
                    }
                  }
                  // Nếu không nhập nguyên liệu, filter như cũ
                  setCategorySelected(categorySelectedTemp);
                  setType(typeTemp);
                  setIngredients(ingredientsTemp);
                  // Đặt lại pageTitle nếu cần
                  if (typeTemp === 'Món ăn thịnh hành') {
                    setPageTitle(t('trending_recipes'));
                  } else if (typeTemp === 'Hôm nay bạn nấu gì?') {
                    setPageTitle(t('what_to_cook_today')); // Assuming you have this translation key
                  } else if (typeTemp === 'Cảm hứng hàng ngày') {
                    setPageTitle(t('daily_inspiration')); // Assuming you have this translation key
                  } else {
                    setPageTitle(typeTemp); // Fallback to raw type if no specific translation
                  }
                  bottomSheetRef.current?.dismiss();
                }}
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Meal Dialog (sub-dialog for meal selection) */}
      <BottomSheetModal ref={bottomSheetCategoryRef} enablePanDownToClose backdropComponent={
        (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} opacity={0.5} appearsOnIndex={0} pressBehavior={'none'} />
      } >
        <BottomSheetView style={{ flex: 1 }} >
          <View style={styles.dialogOverlay}>
            <View style={styles.dialogContainer}>
              <View style={styles.dialogHeader}>
                <TouchableOpacity onPress={() => bottomSheetCategoryRef?.current?.dismiss()}>
                  <Image
                    source={require('../../assert/image/back.png')}
                    style={{ width: 44, height: 44, tintColor: '#888' }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text style={styles.dialogTitle}>{t('bymeal')}</Text>
              </View>
              <View style={styles.dialogInputWrap}>
                <Image
                  source={require('../../assert/image/blacksearch.png')}
                  style={styles.searchIcon}
                />
                <TextInput
                  placeholder={t('searchmeal')}
                  style={styles.dialogInput}
                  value={mealSearch}
                  onChangeText={setMealSearch}
                  placeholderTextColor="#888"
                />
              </View>
              <View style={{ maxHeight: Dimensions.get('window').height * 0.5, flexGrow: 0 }}>
                <FlatList
                  data={categories.filter(opt =>
                    String(opt.name || '').toLowerCase().includes(mealSearch.toLowerCase())
                  )}
                  keyExtractor={item => String(item?.id || item?._id)}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dialogOption,
                        categorySelectedTemp?.id === item?.id ? styles.dialogOptionSelected : null,
                      ]}
                      onPress={() => {
                        setCategorySelectedTemp(item);
                        setMealSearch('');
                        bottomSheetCategoryRef?.current?.dismiss()
                      }}>
                      <Text
                        style={[
                          styles.dialogOptionText,
                          categorySelectedTemp?.id === item?.id ? styles.dialogOptionTextActive : null,
                        ]}>
                        {String(item?.name || '')}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Type Dialog (sub-dialog for type selection) */}
      <BottomSheetModal ref={bottomSheetTypeRef} enablePanDownToClose backdropComponent={
        (props) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} opacity={0.5} appearsOnIndex={0} pressBehavior={'none'} />
      } >
        <BottomSheetView style={{ flex: 1 }} >
          <View style={styles.dialogOverlay}>
            <View style={styles.dialogContainer}>
              {/* END - Modal Drag Handle */}
              <View style={styles.dialogHeader}>
                <TouchableOpacity onPress={() => bottomSheetTypeRef?.current?.dismiss()}>
                  <Image
                    source={require('../../assert/image/back.png')}
                    style={{ width: 44, height: 44, tintColor: '#888' }}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <Text style={styles.dialogTitle}>{t('bytype')}</Text>
              </View>
              <View style={styles.dialogInputWrap}>
                <Image
                  source={require('../../assert/image/blacksearch.png')}
                  style={styles.searchIcon}
                />
                <TextInput
                  placeholder={t('searchtype')}
                  style={styles.dialogInput}
                  value={typeSearch}
                  onChangeText={setTypeSearch}
                  placeholderTextColor="#888"
                />
              </View>
              <View style={{ maxHeight: Dimensions.get('window').height * 0.5, flexGrow: 0 }}>
                <FlatList
                  data={TYPE_OPTIONS.filter(opt => opt.toLowerCase().includes(typeSearch.toLowerCase()))}
                  keyExtractor={item => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.dialogOption,
                        typeTemp === item ? styles.dialogOptionSelected : null,
                      ]}
                      onPress={() => {
                        setTypeTemp(item);
                        setTypeSearch('');
                        bottomSheetTypeRef.current?.dismiss()
                      }}>
                      <Text
                        style={[
                          styles.dialogOptionText,
                          typeTemp === item ? styles.dialogOptionTextActive : null,
                        ]}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyboardShouldPersistTaps="handled"
                />
              </View>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
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
    top: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4A5E6D',
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
    backgroundColor: 'rgba(136,136,136,0.7)',
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
    backgroundColor: '#1CB0F6',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  starIconRatingBox: {
    width: 16,
    height: 16,
    marginRight: 2,
    tintColor: '#fff',
  },
  ratingTextRatingBox: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 13,
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
    fontSize: 13,
    marginLeft: 8,
    fontWeight: '400',
  },
  modalOverlay: {
    //  flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.18)',
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
  dialogOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dialogContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingBottom: 0,
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
    left: 12,
    zIndex: 2,
  },
  dialogInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    color: '#222',
    paddingLeft: 40,
  },
  dialogOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 18,
    backgroundColor: '#fff',
  },
  dialogOptionSelected: {
    backgroundColor: '#F8F8F8',
    borderRadius: 0,
    marginHorizontal: 0,
  },
  dialogOptionText: {
    fontSize: 15,
    color: '#000',
    flex: 1,
  },
  dialogOptionTextActive: {
    color: '#FF6600',
    fontWeight: 'bold',
  },
  dialogCheckIcon: {
    width: 18,
    height: 18,
    tintColor: '#FF6600',
  },
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
    paddingVertical: 10, // Added vertical padding to match other inputs better
    color: '#222',
  },
  inputSearchIcon: {
    width: 18,
    height: 18,
    tintColor: '#888',
    marginLeft: 8,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyListText: {
    fontSize: 16,
    color: '#888',
  },
  modalDragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#CCCCCC',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 10,
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
    marginRight: 8,
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
    marginRight: 8,
  },
});

const UNITS = [
  'gr', 'kg', 'ml', 'l', 'muỗng', 'thìa', 'muoi', 'muỗng canh', 'muỗng cà phê', 'g', 'gam', 'lít', 'cc'
];

function filterIngredientsInput(input: string) {
  return input
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(word =>
      // Không chứa số và không phải đơn vị đo lường
      !/\d/.test(word) && !UNITS.some(unit => word.includes(unit))
    )
    .join(', ');
}

export default DiscoveryScreen;