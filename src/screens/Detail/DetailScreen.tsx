import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, FlatList, TouchableOpacity, Dimensions, Modal, Alert } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { nav } from '../../navigation/navigationName';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { UserContext } from '../../context/UserContext';
import { addFavorite, removeFavorite, getFavorites, findFavoriteId } from '../../api/favoriteApi';
import NetInfo from '@react-native-community/netinfo';
import { checkNetworkAndAlert } from '../../compoments/NetworkAlert';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const API_URL = 'http://103.72.99.132:3000';

const DetailScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const recipeId = route.params?.recipeId;
  const [recipe, setRecipe] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const { user } = useContext(UserContext);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [firstRecipeId, setFirstRecipeId] = useState<string | null>(null);
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const { t } = useTranslation();

  // Đảm bảo mỗi lần vào lại màn này đều fetch lại đúng công thức theo id
  useFocusEffect(
    React.useCallback(() => {
      let isMounted = true;
      const fetchRecipe = async () => {
        try {
          const res = await axios.get(`${API_URL}/api/recipes?page=1&limit=50`);
          const allRecipes = res.data?.data || [];
          const found = allRecipes.find((r: any) => r._id === recipeId);
          if (isMounted) setRecipe(found || null);
          setRelated(allRecipes.filter((r: any) => r._id !== recipeId).slice(0, 6));
        } catch (e) {
          setRecipe(null);
          setRelated([]);
        } finally {
          setLoading(false);
        }
      };
      fetchRecipe();
      return () => { isMounted = false; };
    }, [recipeId])
  );

  // Lấy danh sách favorites từ API khi user hoặc recipeId thay đổi

   const fetchFavorites = async () => {
       if (user?.token) {
           try {
             const favs = await getFavorites(user.token);
             setFavorites(favs);
             setFavoriteIds(favs.map((f: any) => f.recipeId?._id || f.recipeId)); // Hỗ trợ cả object và string
           } catch {
             setFavorites([]);
             setFavoriteIds([]);
           }
         } else {
           setFavorites([]);
           setFavoriteIds([]);
         }
    };

  useEffect(() => {
    fetchFavorites();
  }, [user, recipeId]);

  // Kiểm tra kết nối mạng
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Hàm lấy ảnh món ăn từ API (ưu tiên imageUrls[0])
  const getRecipeImage = (recipeObj: any) => {
    if (recipeObj?.imageUrls && Array.isArray(recipeObj.imageUrls) && recipeObj.imageUrls.length > 0) {
      return { uri: recipeObj.imageUrls[0] };
    }
    // fallback nếu không có ảnh
    return undefined;
  };

  // Hàm lấy danh sách ảnh món ăn
  const getRecipeImages = (recipeObj: any) => {
    if (recipeObj?.imageUrls && Array.isArray(recipeObj.imageUrls) && recipeObj.imageUrls.length > 0) {
      return recipeObj.imageUrls;
    }
    return [];
  };
  const images = getRecipeImages(recipe);

  useEffect(() => {
    // Lưu lại recipeId đầu tiên khi vào từ HomeScreen
    if (!firstRecipeId && recipeId) {
      setFirstRecipeId(recipeId);
    }
  }, [recipeId, firstRecipeId]);

  useEffect(() => {
    // Khi vào lần đầu, lưu lại recipeId đầu tiên vào historyStack
    if (historyStack.length === 0 && recipeId) {
      setHistoryStack([recipeId]);
    }
    // Nếu vào từ công thức liên quan, push vào stack
    else if (historyStack.length > 0 && recipeId && recipeId !== historyStack[historyStack.length - 1]) {
      setHistoryStack(prev => [...prev, recipeId]);
    }
    // eslint-disable-next-line
  }, [recipeId]);

  if (loading) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <ActivityIndicator size="large" color="#FF6600" />
      </View>
    );
  }

  if (!recipe) {
    return (
      <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
        <Text>{t('not_found_recipe') || "Không tìm thấy món ăn."}</Text>
      </View>
    );
  }

  // Demo comment
  const comments = [
    {
      id: 1,
      user: {
        name: 'Van Dung Tran',
        avatar: require('../../assert/image/user1.png'),
      },
      content:'Công thức nấu chuẩn chỉnh quá',
      time: '2 ngày trước',
    },
    {
      id: 2,
      user: {
        name: 'Quang Lam',
        avatar: require('../../assert/image/user2.png'),
      },
      content: 'Mới nghe thôi đã thèm lắm rồi. Công thức này đúng chuẩn người miền Tây nấu luôn ấy. Rất tuyệt vời!',
      time: '5 ngày trước',
    },
  ];

   const isFav = favoriteIds.includes(recipe._id);
   const favoriteId = findFavoriteId(favorites, recipe._id);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Ảnh món ăn với overlay nút back, whitemark, share */}
      <View style={{ position: 'relative' }}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setShowImageModal(true)}>
          <Image
            source={getRecipeImage(recipe)}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Số lượng ảnh 1/x ở góc phải dưới */}
          {images.length > 0 && (
            <View style={{ position: 'absolute', right: 0, bottom: 8, backgroundColor: 'rgba(0,0,0,0.38)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, minWidth: 44, minHeight: 28, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{currentImageIdx + 1}/{images.length}</Text>
            </View>
          )}
        </TouchableOpacity>
        {/* Overlay nút trên ảnh */}
        <View style={styles.imageOverlayRow}>
          <TouchableOpacity
            onPress={() => {
              // Nếu chỉ có 1 phần tử trong stack, về HomeScreen
              // Nếu có nhiều phần tử, pop stack và replace về công thức trước đó
              if (historyStack.length <= 1) {
                navigation.navigate(nav.home);
              } else {
                const newStack = [...historyStack];
                newStack.pop();
                const prevRecipeId = newStack[newStack.length - 1];
                setHistoryStack(newStack);
                navigation.replace(nav.detail, { recipeId: prevRecipeId });
              }
            }}
            style={styles.overlayBtn}
          >
            <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold' }}>{'<'}</Text>
          </TouchableOpacity>
          <View style={styles.overlayRight}>
            <TouchableOpacity
              style={styles.overlayBtn}
              onPress={async () => {
                if (!isConnected) {
                  Alert.alert('Không có kết nối mạng', 'Vui lòng bật wifi hoặc dữ liệu di động để sử dụng chức năng này.');
                  return;
                }
                if (!user?.token) return;
                try {
                  if (!isFav) {
                    await addFavorite(user.token, recipe._id);
                  } else {
                    await removeFavorite(user.token, favoriteId);
                  }
                  await fetchFavorites();
                } catch (e) {
                  Alert.alert('Lỗi', 'Không thể lưu công thức. Vui lòng thử lại!');
                }
              }}
            >
              <Image
                source={
                 isFav
                    ? require('../../assert/image/yellowmark.png')
                    : require('../../assert/image/mark.png')
                }
                style={styles.overlayIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.overlayBtn}>
              <Image source={require('../../assert/image/share.png')} style={styles.overlayIcon} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Thông tin món */}
        <View style={styles.infoSection}>
          <Text style={styles.title}>{recipe.name}</Text>
          <View style={styles.authorRow}>
            <Image source={require('../../assert/image/author.png')} style={styles.authorAvatar} />
            <Text style={styles.authorName}>{recipe.idUser?.full_name || 'Emily Harris'}</Text>
            <Text style={styles.authorLabel}>· {t('author')}</Text>
          </View>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{t('energy_breakfast') }</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{t('trending_recipes')}</Text>
            </View>
          </View>
          <Text style={styles.desc}>{recipe.description}</Text>
          {/* Thời gian dự kiến & Khẩu phần ăn trình bày như mẫu */}
          <View style={styles.infoRowWrap}>
            <View style={styles.infoBox}>
              <Image source={require('../../assert/image/time.png')} style={styles.infoBoxIcon} />
              <View>
                <Text style={styles.infoBoxLabel}>{t('estimated_time')}</Text>
                <Text style={styles.infoBoxValue}>{recipe.cookingTime || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.infoBox}>
              <Image source={require('../../assert/image/people.png')} style={styles.infoBoxIcon} />
              <View>
                <Text style={styles.infoBoxLabel}>{t('servings') || 'Khẩu phần ăn'}</Text>
                <Text style={styles.infoBoxValue}>{recipe.servings || 'N/A'}</Text>
              </View>
            </View>
          </View>
          {/* Nguyên liệu */}
          <View style={styles.ingredientSection}>
            <Text style={styles.ingredientTitle}>{t('ingredients')}</Text>
            <View style={styles.ingredientList}>
              {(recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0
                ? recipe.ingredients
                : [
                    '500g cá lóc làm sạch, cắt khúc.',
                    '2 quả cà chua bổ múi cau.',
                    '1/4 trái thơm (dứa) cắt lát mỏng.',
                    '5 trái đậu bắp cắt xéo.',
                    '2 cây bạc hà (dọc mùng) tước vỏ, cắt khúc.',
                    '100g giá đỗ.',
                    '2 muỗng me chua hoặc 1 vắt me tươi.',
                    '2 củ, 2 tép hành tím, tỏi băm nhỏ.',
                    '3 - 4 nhánh rau thơm, ngò gai thái nhỏ.',
                    'Gia vị : Muối, đường, hạt nêm, nước mắm, tiêu.',
                    '1 trái ớt hiểm nếu muốn ăn cay.',
                  ]
              ).map((item, idx) => (
                <Text style={styles.ingredientItem} key={idx}>• {item}</Text>
              ))}
            </View>
          </View>
        </View>
        {/* Đánh giá (review) */}
        <View style={styles.reviewSection}>
          <Text style={styles.reviewTagText}>{t('review')}</Text>
          <View style={styles.reviewHeaderRow}>
            <View style={styles.reviewScoreBox}>
              <Image source={require('../../assert/image/whitestar.png')} style={styles.reviewStarIcon} />
              <Text style={styles.reviewScoreText}>5.0</Text>
            </View>
            <Text style={styles.reviewHighlight}>{t('excellent')}</Text>
            <Text style={styles.reviewDot}>•</Text>
          </View>

          <ScrollView  showsHorizontalScrollIndicator={false}>
            {comments.map((item, index) => (
              <View key={item?.id} style={styles.commentRow}>
                <Image source={item.user.avatar} style={styles.commentAvatar} />
                <View style={{ flex: 1 }}>
                  <View style={styles.commentNameRow}>
                    <Text style={styles.commentName}>{item.user.name}</Text>
                    <View style={{ flex: 1 }} />
                    <View style={styles.commentStarBox}>
                      <Image source={require('../../assert/image/bluestar.png')} style={styles.commentStarIcon} />
                      <Text style={styles.commentStarText}>5.0</Text>
                    </View>
                  </View>
                  <Text style={styles.commentDate}>{item.time}</Text>
                  <Text style={styles.commentContent}>{item.content}</Text>
                </View>
              </View>
            ) )}
            </ScrollView>
        
          <TouchableOpacity onPress={() => navigation.navigate(nav.review, { recipeId })}>
            <Text style={styles.seeMoreReview}>{t('see_more')}</Text>
          </TouchableOpacity>
        </View>
        {/* Công thức liên quan */}
        <View style={styles.relatedSection}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={styles.relatedTitle}>{t('related_recipes')}</Text>
            <TouchableOpacity onPress={() => {/* có thể điều hướng tới trang danh sách công thức nếu muốn */}}>
              <Text style={styles.seeMoreReview}>{t('see_more') || 'Xem thêm'}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={related}
            keyExtractor={item => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 8, paddingLeft: 8, paddingRight: 24, paddingBottom: 70 }}
            renderItem={({ item }) => {
              const relatedIsFav = favoriteIds.includes(item._id);
              const relatedFavoriteId = findFavoriteId(favorites, item._id);
              return (
                <View style={styles.relatedCard}>
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      // Khi bấm công thức liên quan, push vào stack và replace
                      setHistoryStack(prev => [...prev, item._id]);
                      navigation.replace(nav.detail, { recipeId: item._id });
                    }}
                  >
                    <View style={styles.relatedImgWrap}>
                      <Image
                        source={getRecipeImage(item)}
                        style={styles.relatedImg}
                      />
                      {/* mark góc phải trên cùng: có thể lưu công thức liên quan */}
                      <TouchableOpacity
                        style={styles.relatedMarkCircle}
                        onPress={async (e) => {
                          e.stopPropagation && e.stopPropagation();
                          if (!isConnected) {
                            Alert.alert('Không có kết nối mạng', 'Vui lòng bật wifi hoặc dữ liệu di động để sử dụng chức năng này.');
                            return;
                          }
                          if (!user?.token) return;
                          try {
                            if (!relatedIsFav) {
                              await addFavorite(user.token, item._id);
                            } else {
                              await removeFavorite(user.token, relatedFavoriteId);
                            }
                            await fetchFavorites();
                          } catch (e) {
                            Alert.alert('Lỗi', 'Không thể lưu công thức. Vui lòng thử lại!');
                          }
                        }}
                      >
                        <Image
                          source={
                            relatedIsFav
                              ? require('../../assert/image/yellowmark.png')
                              : require('../../assert/image/mark.png')
                          }
                          style={styles.relatedMark}
                        />
                      </TouchableOpacity>
                      {/* time.png góc trái dưới cùng + thời gian từ API */}
                      <View style={styles.relatedTimeOverlay}>
                        <Image source={require('../../assert/image/time.png')} style={styles.relatedTimeIcon} />
                        <Text style={styles.relatedTimeText}>{item.cookingTime || ''}</Text>
                      </View>
                    </View>
                    <Text style={styles.relatedName} numberOfLines={2}>{item.name}</Text>
                    <View style={styles.relatedInfoRow}>
                      <View style={styles.relatedRatingBox}>
                        <Image source={require('../../assert/image/bluestar.png')} style={styles.relatedStarIcon} />
                        <Text style={styles.relatedRatingText}>4.8</Text>
                      </View>
                      <View style={styles.relatedFreeTag}>
                        <Text style={styles.relatedFreeTagText}>Miễn phí</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              );
            }}
          />
        </View>
      </ScrollView>
      {/* Nút "Vào bếp thôi!" cố định dưới cùng, dùng ButtonNavigation */}
      <View style={styles.fixedCookBtnWrapper}>
        <ButtonNavigation
          title={t('start_cooking') || "Vào bếp thôi !"}
          onPress={async () => {
            const ok = await checkNetworkAndAlert(t('network_view_tutorial') || 'Không có kết nối mạng. Vui lòng bật wifi hoặc dữ liệu di động để xem hướng dẫn nấu ăn.');
            if (!ok) return;
            navigation.navigate(nav.tutorialCooking, {
              recipeId,
              imageUrl:
                recipe?.imageUrls && recipe.imageUrls.length > 0
                  ? recipe.imageUrls[0]
                  : null,
              name: recipe?.name || '',
            });
          }}
          backgroundColor="#FF6600"
          style={styles.cookBtn}
          textStyle={styles.cookBtnText}
        />
      </View>

      {/* Modal xem ảnh full screen, vuốt qua lại */}
      <Modal visible={showImageModal} transparent animationType="fade" onRequestClose={() => setShowImageModal(false)}>
        <View style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 36, paddingHorizontal: 16 }}>
            <TouchableOpacity onPress={() => setShowImageModal(false)}>
              <Text style={{ color: '#fff', fontSize: 28 }}>×</Text>
            </TouchableOpacity>
            <Text style={{ color: '#fff', fontSize: 16 }}>{currentImageIdx + 1}/{images.length}</Text>
            <View style={{ width: 28 }} />
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {images.length > 0 && (
              <Image
                source={{ uri: images[currentImageIdx] }}
                style={{ width: '100%', height: 300, resizeMode: 'contain' }}
              />
            )}
          </View>
          {/* Nút chuyển ảnh nếu có nhiều ảnh */}
          {images.length > 1 && (
            <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 }}>
              <TouchableOpacity disabled={currentImageIdx === 0} onPress={() => setCurrentImageIdx(idx => Math.max(0, idx - 1))} style={{ padding: 16, opacity: currentImageIdx === 0 ? 0.3 : 1 }}>
                <Text style={{ color: '#fff', fontSize: 32 }}>{'<'}</Text>
              </TouchableOpacity>
              <TouchableOpacity disabled={currentImageIdx === images.length - 1} onPress={() => setCurrentImageIdx(idx => Math.min(images.length - 1, idx + 1))} style={{ padding: 16, opacity: currentImageIdx === images.length - 1 ? 0.3 : 1 }}>
                <Text style={{ color: '#fff', fontSize: 32 }}>{'>'}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const scrênWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: 'rgba(255,102,0,0.98)',
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  headerBtn: {
    padding: 8,
    zIndex: 11,
  },
  headerIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
    marginHorizontal: 2,
    resizeMode: 'contain',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    flex: 1,
    textAlign: 'center',
    marginLeft: -24, // để căn giữa khi có 2 nút bên phải
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#eee',
  },
  imageOverlayRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    zIndex: 10,
  },
  overlayBtn: {
    padding: 8,
    zIndex: 11,
  },
  overlayIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 2,
    resizeMode: 'contain',
  },
  overlayRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoSection: {
    padding: 18,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#222',
    marginBottom: 8,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  authorAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
    backgroundColor: '#eee',
  },
  authorName: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 4,
  },
  authorLabel: {
    color: '#888',
    fontSize: 14,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#EAF7F3',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  tagText: {
    color: '#1ABC9C',
    fontSize: 12,
    fontWeight: 'bold',
  },
  desc: {
    color: '#222',
    fontSize: 15,
    marginTop: 6,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  icon: {
    width: 18,
    height: 18,
    tintColor: '#888',
    marginRight: 4,
  },
  infoLabel: {
    color: '#888',
    fontSize: 15,
    marginRight: 4,
    fontWeight: 'bold',
  },
  infoText: {
    color: '#888',
    fontSize: 15,
    marginRight: 8,
  },
  reviewSection: {
    marginTop: 12,
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  reviewScoreBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1DA1F2',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginRight: 8,
  },
  reviewStarIcon: {
    width: 16,
    height: 16,
    tintColor: undefined,
    marginRight: 3,
    resizeMode: 'contain',
  },
  reviewScoreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  reviewHighlight: {
    color: '#1DA1F2',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 4,
  },
  reviewDot: {
    color: '#bbb',
    fontSize: 16,
    marginHorizontal: 2,
  },
  reviewCount: {
    color: '#bbb',
    fontSize: 14,
  },
  reviewTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#FF8000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginBottom: 8,
    marginLeft: 0,
  },
  reviewTagText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 8,
    marginLeft: 0,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#eee',
  },
  commentNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 8,
  },
  commentName: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#222',
    marginRight: 8,
  },
  commentStarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1DA1F2',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: '#fff',
  },
  commentStarIcon: {
    width: 13,
    height: 13,
    tintColor: undefined,
    marginRight: 2,
    resizeMode: 'contain',
  },
  commentStarText: {
    color: '#1DA1F2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  commentDate: {
    color: '#888',
    fontSize: 12,
    marginBottom: 2,
  },
  commentContent: {
    color: '#222',
    fontSize: 13,
    marginTop: 2,
  },
  seeMoreReview: {
    color: '#FF8000',
    fontWeight: 'bold',
    fontSize: 13,
    marginRight: 2,
    marginTop: 2,
  },
  fixedCookBtnWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingBottom: 16,
    paddingTop: 8,
    paddingHorizontal: 16,
    borderTopWidth: 0.5,
    borderColor: '#eee',
  },
  cookBtn: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cookBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  ingredientSection: {
    marginTop: 10,
    marginBottom: 12,
    // bỏ nền xám, chỉ để padding dưới
    paddingBottom: 8,
  },
  ingredientTitle: {
    fontWeight: 'bold',
    color: '#222', // màu đen
    fontSize: 15,
    marginBottom: 8,
  },
  ingredientList: {
    // paddingLeft: 8,
  },
  ingredientItem: {
    color: '#222',
    fontSize: 14,
    marginBottom: 2,
    lineHeight: 20,
  },
  relatedSection: {
    marginTop: 16,
    paddingHorizontal: 12,
    paddingBottom: 24, // tăng paddingBottom để không bị che khi kéo hết
  },
  relatedTitle: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#222',
    marginBottom: 8,
  },
  relatedCard: {
    width:260, // 40% chiều rộng
    marginRight: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    alignItems: 'center',
    padding: 10
  },
  relatedImgWrap: {
    width: 250,
    height: 250,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#eee',

  },
  relatedImg: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  relatedMarkCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.7)', // màu đen trong suốt
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  relatedMark: {
    width: 16,
    height: 16,
    tintColor: '#fff',
  },
  relatedTimeOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  relatedTimeIcon: {
    width: 14,
    height: 14,
    tintColor: '#fff',
    marginRight: 4,
  },
  relatedTimeText: {
    color: '#fff',
    fontSize: 12,
  },
  relatedInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  relatedRatingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  relatedStarIcon: {
    width: 14,
    height: 14,
    tintColor: '#1DA1F2',
  },
  relatedRatingText: {
    color: '#222',
    fontSize: 12,
    fontWeight: 'bold',
  },
  relatedReviewText: {
    color: '#888',
    fontSize: 12,
    marginLeft: 5,
  },
  relatedFreeTag: {
    backgroundColor: '#EAF7F3',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  relatedFreeTagText: {
    color: '#1ABC9C',
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoRowWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 8,
    gap: 12,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    flex: 1,
    minWidth: 0,
    gap: 8,
  },
  infoBoxIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
    tintColor: '#00C48C',
  },
  infoBoxLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  infoBoxValue: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 15,
  },
  relatedName: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 4,
  },
});

export default DetailScreen;
