/* eslint-disable react-native/no-inline-styles */
import React, { useContext, useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import { UserContext } from '../../context/UserContext';
import { getRecipes } from '../../api/recipeApi';
import { useTranslation } from 'react-i18next';
import { checkNetworkAndAlert } from '../../compoments/NetworkAlert';
import NetInfo from '@react-native-community/netinfo';

const { width } = Dimensions.get('window');

type SearchScreenParams = {
  searchQuery?: string;
};

type SearchScreenRouteProp = RouteProp<{ SearchScreen: SearchScreenParams }, 'SearchScreen'>;

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<SearchScreenRouteProp>();
  const { user } = useContext(UserContext);
  const { t } = useTranslation();

  const initialQuery = route.params?.searchQuery || '';
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [recipes, setRecipes] = useState<any[]>([]); // All recipes fetched from API
  const [filteredRecipes, setFilteredRecipes] = useState<any[]>([]); // Recipes after filtering
  const [hasLoadedRecipes, setHasLoadedRecipes] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Network listener
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Fetch all recipes (or a larger initial set) when component mounts
  useEffect(() => {
    let ignore = false;
    const fetchAllRecipes = async () => {
      if (!isConnected) {
        setHasLoadedRecipes(true); // Treat as loaded even if no network, to show "No network" message
        return;
      }
      try {
        // Fetch more recipes for search, e.g., 50 items
        const data = await getRecipes(1, 50); // Increased limit for better search coverage
        if (!ignore && data) {
          setRecipes(data);
          // Apply initial filter if query exists, otherwise, filteredRecipes will be empty initially for search results
          if (initialQuery) {
            const lowercasedQuery = initialQuery.toLowerCase();
            setFilteredRecipes(data.filter((recipe: any) =>
              recipe.name.toLowerCase().includes(lowercasedQuery)
            ));
          } else {
            setFilteredRecipes([]); // IMPORTANT: Clear filtered recipes if initial query is empty
          }
          setHasLoadedRecipes(true);
        }
      } catch (error) {
        if (!ignore) {
          console.error('Failed to fetch recipes:', error);
          setHasLoadedRecipes(true); // Still set to true to show appropriate UI
          Alert.alert(t('error'), t('failed_to_load_recipes'));
        }
      }
    };

    fetchAllRecipes();
    return () => { ignore = true; };
  }, [isConnected, initialQuery]);

  // Filter recipes whenever searchQuery or recipes list changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredRecipes([]); // If query is empty, clear filtered recipes
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = recipes.filter((recipe: any) =>
        recipe.name.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredRecipes(filtered);
    }
  }, [searchQuery, recipes]);

  // Hàm trả về ảnh món ăn từ API (ưu tiên imageUrls[0])
  const getProductImage = (item: any) => {
    if (item.imageUrls && item.imageUrls.length > 0) {
      return { uri: item.imageUrls[0] };
    }
    return undefined; // Or a default placeholder image
  };

  // const handleRecipePress = async (recipeId: string) => {
  //   const ok = await checkNetworkAndAlert(t('networkviewrecipe'));
  //   if (!ok) return;
  //   navigation.navigate(nav.detail, { recipeId: recipeId });
  // };

  // Xác định nếu người dùng là khách (guest) - Cần thiết cho logic hiển thị "Gần đây"
  const isGuest = !user || !user.uid; // Giả định user là null hoặc undefined khi chưa đăng nhập, hoặc không có uid

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Image
            source={require('../../assert/image/blacksearch.png')}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder={t('search_recipe_placeholder')}
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={() => { /* Optionally trigger search on enter/submit */ }}
            autoFocus={true} // Auto-focus when entering search screen
          />
          {searchQuery.length > 0 && ( // Show clear button if there's text
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Image
                source={require('../../assert/image/cancel.png')} // Confirmed: Using cancel.png
                style={styles.clearIcon}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
          <Text style={styles.cancelButtonText}>{t('Hủy')}</Text>
        </TouchableOpacity>
      </View>

      {!isConnected && !hasLoadedRecipes ? (
        <View style={styles.centeredMessage}>
          <Text style={styles.errorMessage}>{t('nonetworkhome')}</Text>
        </View>
      ) : !hasLoadedRecipes ? (
        <View style={styles.centeredMessage}>
          <Text>{t('loadingData')}</Text>
        </View>
      ) : (
        <ScrollView style={styles.contentContainer}>
          {searchQuery.trim() !== '' && ( // ONLY render search results if search query is NOT empty
            <View style={styles.searchResultsContainer}>
              {filteredRecipes.length > 0 ? (
                <>
                  {/* Tiêu đề "Gần đây" vẫn hiển thị như Figma khi có kết quả tìm kiếm */}
                  <Text style={styles.sectionTitle}>{t('Gần đây')}</Text>
                  <FlatList
                    data={filteredRecipes}
                    keyExtractor={(item) => item._id}
                    numColumns={1}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.productListItem}
                        // onPress={() => handleRecipePress(item._id)} // Vẫn comment
                        activeOpacity={0.8}
                      >
                        <View style={styles.productImgWrapList}>
                          {getProductImage(item) ? (
                            <Image source={getProductImage(item)} style={styles.productImgList} />
                          ) : (
                            <View style={[styles.productImgList, { backgroundColor: '#eee', alignItems: 'center', justifyContent: 'center' }]}>
                              <Text style={{ color: '#bbb', fontSize: 12 }}>{t('no_image')}</Text>
                            </View>
                          )}
                        </View>
                        <View style={styles.productDetailsList}>
                          <Text style={styles.productTitleList} numberOfLines={2}>{item.name}</Text>
                          <View style={styles.productInfoRowList}>
                            <View style={styles.ratingBoxList}>
                              <Text style={styles.ratingTextList}>★ {item.rating || 0}</Text>
                            </View>
                            {/* Hiển thị số lượng Reviews CHỈ KHI reviewsCount > 0 */}
                            {item.reviewsCount > 0 && (
                              <Text style={styles.reviewsTextList}>{item.reviewsCount} Reviews</Text>
                            )}
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                    scrollEnabled={false}
                    contentContainerStyle={styles.flatListContent}
                  />
                </>
              ) : (
                <View style={styles.centeredMessage}>
                  <Text style={styles.noResultsText}>{t('no_matching_recipes_found')}</Text>
                </View>
              )}
            </View>
          )}
          {/* Nếu searchQuery.trim() === '', thì contentContainer sẽ rỗng, tạo khoảng trắng */}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#FF6600', // Header màu cam như Figma
    paddingTop: Dimensions.get('window').height > 800 ? 50 : 20, // Điều chỉnh cho các thiết bị có tai thỏ
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff', // Ô tìm kiếm màu trắng
    borderRadius: 20, // Bo góc nhiều hơn như Figma
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    tintColor: '#888', // Icon search màu xám
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#222',
    height: '100%',
    paddingVertical: 0, // Bỏ padding dọc mặc định
  },
  clearButton: {
    padding: 5,
  },
  clearIcon: {
    width: 16,
    height: 16,
    tintColor: '#888',
  },
  cancelButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  cancelButtonText: {
    color: '#fff', // Chữ "Hủy" màu trắng
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 0,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginTop: 15,
    marginBottom: 10,
    paddingHorizontal: 16,
  },
  searchResultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  flatListContent: {
    paddingBottom: 20,
  },
  productListItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 10,
    padding: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  productImgWrapList: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  productImgList: {
    width: '100%',
    height: '100%',
  },
  productDetailsList: {
    flex: 1,
  },
  productTitleList: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
  },
  productInfoRowList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBoxList: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F8F3', // Nền màu xanh nhạt cho rating box
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 8,
  },
  ratingTextList: {
    color: '#00C48C', // Chữ màu xanh cho rating
    fontWeight: 'bold',
    fontSize: 13,
  },
  reviewsTextList: {
    fontSize: 13,
    color: '#888',
  },
  centeredMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  errorMessage: {
    color: '#ff6f2c',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SearchScreen;