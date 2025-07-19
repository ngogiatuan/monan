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
import {
    getReviewsByRecipeId,
    getAverageRatingByRecipeId,
    createNewReview
} from '../../api/reviewApi';

const { width } = Dimensions.get('window');
const API_URL = 'http://103.72.99.132:3000';

const DetailScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const recipeId = route.params?.recipeId;

    // ✅ Xóa recipeData và cache logic
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
    const [reviews, setReviews] = useState<any[]>([]);
    const [avgRating, setAvgRating] = useState<number | null>(null);
    const [relatedRatings, setRelatedRatings] = useState<{ [recipeId: string]: { avg: number, count: number } }>({});
    const { t } = useTranslation();

    // Ensure that each time you return to this screen, the correct recipe is fetched by ID
    useFocusEffect(
        React.useCallback(() => {
            let isMounted = true;
            const fetchRecipe = async () => {
                try {
                    const res = await axios.get(`${API_URL}/api/recipes?page=1&limit=50`);
                    const allRecipes = res.data?.data || [];
                    const found = allRecipes.find((r: any) => r._id === recipeId);

                    if (isMounted) {
                        setRecipe(found || null);
                        setRelated(allRecipes.filter((r: any) => r._id !== recipeId).slice(0, 6));
                        setLoading(false);
                    }
                } catch (e) {
                    if (isMounted) {
                        setRecipe(null);
                        setRelated([]);
                        setLoading(false);
                    }
                }
            };
            fetchRecipe();
            return () => { isMounted = false; };
        }, [recipeId])
    );

    // Get favorite list from API when user or recipeId changes
    const fetchFavorites = async () => {
        if (user?.token) {
            try {
                const favs = await getFavorites(user.token);
                setFavorites(favs);
                setFavoriteIds(favs.map((f: any) => f.recipeId?._id || f.recipeId)); // Supports both object and string
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

    // Check network connection
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setIsConnected(!!state.isConnected);
        });
        return () => unsubscribe();
    }, []);

    // Function to get recipe image from API (prioritizes imageUrls[0])
    const getRecipeImage = (recipeObj: any) => {
        if (recipeObj?.imageUrls && Array.isArray(recipeObj.imageUrls) && recipeObj.imageUrls.length > 0) {
            return { uri: recipeObj.imageUrls[0] };
        }
        // fallback if no image
        return undefined;
    };

    // Function to get recipe image list
    const getRecipeImages = (recipeObj: any) => {
        if (recipeObj?.imageUrls && Array.isArray(recipeObj.imageUrls) && recipeObj.imageUrls.length > 0) {
            return recipeObj.imageUrls;
        }
        return [];
    };
    const images = getRecipeImages(recipe);

    useEffect(() => {
        // Save the first recipeId when entering from HomeScreen
        if (!firstRecipeId && recipeId) {
            setFirstRecipeId(recipeId);
        }
    }, [recipeId, firstRecipeId]);

    useEffect(() => {
        // When entering for the first time, save the initial recipeId to historyStack
        if (historyStack.length === 0 && recipeId) {
            setHistoryStack([recipeId]);
        }
        // If entering from a related recipe, push to stack
        else if (historyStack.length > 0 && recipeId && recipeId !== historyStack[historyStack.length - 1]) {
            setHistoryStack(prev => [...prev, recipeId]);
        }
        // eslint-disable-next-line
    }, [recipeId]);

    // Fetch reviews and average rating when recipeId changes
    useFocusEffect(
        React.useCallback(() => {
            const fetchReviews = async () => {
                if (recipeId) {
                    try {
                        const [reviewList, avg] = await Promise.all([
                            getReviewsByRecipeId(recipeId),
                            getAverageRatingByRecipeId(recipeId)
                        ]);
                        setReviews(reviewList);
                        setAvgRating(avg);
                    } catch (e) {
                        setReviews([]);
                        setAvgRating(null);
                    }
                }
            };
            fetchReviews();
        }, [recipeId])
    );

    useEffect(() => {
        const fetchRelatedRatings = async () => {
            const ratingsObj: { [recipeId: string]: { avg: number, count: number } } = {};
            await Promise.all(related.map(async (r) => {
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
            setRelatedRatings(ratingsObj);
        };
        if (related.length > 0) fetchRelatedRatings();
    }, [related]);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#FF6600" />
            </View>
        );
    }

    if (!recipe) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{t('notfoundrecipe')}</Text>
            </View>
        );
    }

    const isFav = favoriteIds.includes(recipe._id);
    const favoriteId = findFavoriteId(favorites, recipe._id);

    return (
        <View style={{ flex: 1, backgroundColor: '#F6F6F6' }}> {/* ✅ Thay đổi background thành #F6F6F6 */}
            {/* Food image with back button, bookmark, share overlay */}
            <View style={{ position: 'relative' }}>
                <TouchableOpacity activeOpacity={0.9} onPress={() => setShowImageModal(true)}>
                    <Image
                        source={getRecipeImage(recipe)}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    {/* Number of images 1/x at the bottom right corner of the image */}
                    {recipe?.imageUrls.length > 0 && (
                        <View style={{ position: 'absolute', right: 0, bottom: 8, backgroundColor: 'rgba(0,0,0,0.38)', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 4, minWidth: 44, minHeight: 28, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', fontSize: 15, fontWeight: 'bold' }}>{currentImageIdx + 1}/{recipe.imageUrls.length}</Text>
                        </View>
                    )}
                </TouchableOpacity>
                {/* Overlay buttons on the image */}
                <View style={styles.imageOverlayRow}>
                    <TouchableOpacity
                        onPress={() => {
                            // If there's only 1 item in the stack, go to HomeScreen
                            // If there are multiple items, pop the stack and replace with the previous recipe
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
                        <Image
                            source={require('../../assert/image/back.png')}
                            style={{ width: 44, height: 44, tintColor: '#fff' }}
                            resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <View style={styles.overlayRight}>
                        <TouchableOpacity
                            style={styles.overlayBtn}
                            onPress={async () => {
                                const ok = await checkNetworkAndAlert(t('networkviewtutorial'));
                                if (!ok) return;
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
            <ScrollView style={{ flex: 1, backgroundColor: '#F6F6F6' }}> {/* ✅ Thay đổi background */}
                {/* Recipe info */}
                <View style={styles.infoSection}>
                    <Text style={styles.title}>{recipe.name}</Text>
                    <View style={styles.authorRow}>
                        <Image source={require('../../assert/image/author.png')} style={styles.authorAvatar} />
                        <Text style={styles.authorName}>{recipe.idUser?.full_name || 'Emily Harris'}</Text>
                        <Text style={styles.authorLabel}>· {t('author')}</Text>
                    </View>
                    <View style={styles.tagRow}>
                        {/* Dynamically render categories from API */}
                        {recipe.categoryIds && recipe.categoryIds.map((category: any) => (
                            <View key={category._id} style={styles.tag}>
                                <Text style={styles.tagText}>{category.name}</Text>
                            </View>
                        ))}
                    </View>
                    <Text style={styles.desc}>{recipe.description}</Text>
                    {/* Estimated time & Servings as per template */}
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
                                <Text style={styles.infoBoxLabel}>{t('servings')}</Text>
                                <Text style={styles.infoBoxValue}>{recipe.servings || 'N/A'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                {/* Khoảng cách xám lớn trước nguyên liệu */}
                <View style={{ height: 10, backgroundColor: '#F6F6F6' }} />
                {/* Ingredients */}
                <View style={styles.ingredientSection}>
                    <Text style={styles.ingredientTitle}>{t('ingredients')}</Text>
                    <View style={styles.ingredientList}>
                        <Text style={styles.ingredientItem}>{recipe?.instructions}</Text>
                    </View>
                </View>
                {/* Reviews */}
                <View style={styles.reviewSection}>
                    <Text style={styles.reviewTagText}>{t('review')}</Text>
                    <View style={styles.reviewHeaderRow}>
                        <View style={styles.reviewScoreBox}>
                            <Image source={require('../../assert/image/whitestar.png')} style={styles.reviewStarIcon} />
                            <Text style={styles.reviewScoreText}>
                                {avgRating !== null ? avgRating.toFixed(1) : '0.0'}
                            </Text>
                        </View>
                        <Text style={{ color: '#1CB0F6', fontWeight: 'bold' }}>
                            {t('excellent')}
                        </Text>
                        <Text style={styles.reviewDot}>•</Text>
                        <Text style={styles.reviewCount}>
                            {reviews.length} {t('review')}
                        </Text>
                    </View>

                    <ScrollView showsHorizontalScrollIndicator={false}>
                        {reviews.length === 0 ? (
                            <Text style={{ color: '#888', fontStyle: 'italic' }}>{t('no_review')}</Text>
                        ) : (
                            reviews.slice(0, 2).map((item, index) => (
                                <View key={item?._id || index} style={styles.commentRow}>
                                    <Image
                                        source={require('../../assert/image/user1.png')}
                                        style={styles.commentAvatar}
                                    />
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.commentNameRow}>
                                            <Text style={styles.commentName}>
                                                {item.userId?.fullName?.trim()
                                                    ? item.userId.fullName
                                                    : t('anonymous') // hoặc 'Ẩn danh'
                                                }
                                            </Text>
                                            <View style={{ flex: 1 }} />
                                            <View style={styles.commentStarBox}>
                                                <Image source={require('../../assert/image/bluestar.png')} style={styles.commentStarIcon} />
                                                <Text style={styles.commentStarText}>
                                                    {item.rating?.toFixed(1) || '5.0'}
                                                </Text>
                                            </View>
                                        </View>
                                        <Text style={styles.commentDate}>
                                            {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : ''}
                                        </Text>
                                        <Text style={styles.commentContent}>{item.comment}</Text>
                                    </View>
                                </View>
                            ))
                        )}
                    </ScrollView>

                    <TouchableOpacity onPress={() => navigation.navigate(nav.review, { recipeId })}>
                        <Text style={styles.seeMoreReview}>{t('see_more')}</Text>
                    </TouchableOpacity>
                </View>
                {/* Related recipes */}
                <View style={styles.relatedSection}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.relatedTitle}>{t('related_recipes')}</Text>
                        <TouchableOpacity onPress={() => {/* can navigate to recipe list page if desired */ }}>
                            <Text style={styles.seeMoreReview}>{t('see_more')}</Text>
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
                                            // When pressing a related recipe, push to stack and replace
                                            setHistoryStack(prev => [...prev, item._id]);
                                            navigation.replace(nav.detail, { recipeId: item._id });
                                        }}
                                    >
                                        <View style={styles.relatedImgWrap}>
                                            <Image
                                                source={getRecipeImage(item)}
                                                style={styles.relatedImg}
                                            />
                                            {/* bookmark at the top right corner: can save related recipe */}
                                            <TouchableOpacity
                                                style={styles.relatedMarkCircle}
                                                onPress={async (e) => {
                                                    e.stopPropagation && e.stopPropagation();

                                                    const ok = await checkNetworkAndAlert(t('networkviewtutorial'));
                                                    if (!ok) return;
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
                                            {/* time.png at the bottom left corner + time from API */}
                                            <View style={styles.relatedTimeOverlay}>
                                                <Image source={require('../../assert/image/time.png')} style={styles.relatedTimeIcon} />
                                                <Text style={styles.relatedTimeText}>{item.cookingTime || ''}</Text>
                                            </View>
                                        </View>
                                        <Text style={styles.relatedName} numberOfLines={2}>{item.name}</Text>
                                        <View style={styles.relatedInfoRow}>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                                                <View style={styles.ratingBox}>
                                                    <Text style={styles.ratingText}>
                                                        ★ {relatedRatings[item._id || item.id]?.avg?.toFixed(1) ?? '0.0'}
                                                    </Text>
                                                </View>
                                                <Text style={{ color: '#888', fontSize: 13, marginLeft: 4 }}>
                                                    {relatedRatings[item._id || item.id]?.count ?? 0} Reviews
                                                </Text>
                                            </View>
                                            <Text style={item.isPrevailing ? styles.premiumTag : styles.freeTag}>
                                                {item.isPrevailing ? t('buyrecipe') : t('free')}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                    />
                </View>
            </ScrollView>
            {/* "Let's cook!" button fixed at the bottom, using ButtonNavigation */}
            <View style={styles.fixedCookBtnWrapper}>
                <ButtonNavigation
                    title={t('start_cooking')}
                    onPress={async () => {
                        const ok = await checkNetworkAndAlert(t('networkviewtutorial'));
                        if (!ok) return;
                        console.log('DetailScreen - Navigating to tutorial with recipeId:', recipeId);
                        navigation.navigate(nav.tutorialCooking, {
                            recipeId, // ✅ Đảm bảo có recipeId
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

            {/* Full-screen image modal, swipeable */}
            <Modal visible={showImageModal} transparent animationType="fade" onRequestClose={() => setShowImageModal(false)}>
                <View style={{ flex: 1, backgroundColor: '#000' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 36, paddingHorizontal: 16 }}>
                        <TouchableOpacity onPress={() => setShowImageModal(false)}>
                            <Text style={{ color: '#fff', fontSize: 28 }}>×</Text>
                        </TouchableOpacity>
                        <Text style={{ color: '#fff', fontSize: 16 }}>{currentImageIdx + 1}/{recipe?.imageUrls.length}</Text>
                        <View style={{ width: 28 }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        {recipe.imageUrls.length > 0 && (
                            <Image
                                source={{ uri: recipe?.imageUrls[currentImageIdx] }}
                                style={{ width: '100%', height: 300, resizeMode: 'contain' }}
                            />
                        )}
                    </View>
                    {/* Buttons to switch images if there are multiple images */}
                    {recipe.imageUrls.length > 1 && (
                        <View style={{ position: 'absolute', top: '50%', left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 8 }}>
                            <TouchableOpacity disabled={currentImageIdx === 0} onPress={() => setCurrentImageIdx(idx => Math.max(0, idx - 1))} style={{ padding: 16, opacity: currentImageIdx === 0 ? 0.3 : 1 }}>
                                <Text style={{ color: '#fff', fontSize: 32 }}>{'<'}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity disabled={currentImageIdx === recipe?.imageUrls.length - 1} onPress={() => setCurrentImageIdx(idx => Math.min(recipe?.imageUrls.length - 1, idx + 1))} style={{ padding: 16, opacity: currentImageIdx === images.length - 1 ? 0.3 : 1 }}>
                                <Text style={{ color: '#fff', fontSize: 32 }}>{'>'}</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Modal>
        </View>
    );
};

const screenWidth = Dimensions.get('window').width;

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
        marginLeft: -24, // to center when there are 2 buttons on the right
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
        marginBottom: 10, // ✅ Khoảng cách xám lớn giữa info và review
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
        paddingTop: 8, // ✅ Giữ nguyên - khoảng cách nhỏ
        borderTopWidth: 1, // ✅ Giữ nguyên - border mỏng
        borderTopColor: '#F0F0F0', // ✅ Giữ nguyên - màu xám nhạt
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
        marginTop: 0,
        paddingHorizontal: 18,
        paddingBottom: 8,
        backgroundColor: '#fff',
        paddingTop: 18,
        marginBottom: 10, // ✅ Khoảng cách xám lớn giữa review và related
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
        marginTop: 0, // ✅ Đổi về 0 vì đã có View khoảng cách riêng
        marginBottom: 12,
        paddingBottom: 8,
        paddingTop: 18, // ✅ Giữ padding top
        backgroundColor: '#fff', // ✅ Thêm background trắng
        paddingHorizontal: 18, // ✅ Thêm padding horizontal
    },
    ingredientTitle: {
        fontWeight: 'bold',
        color: '#222',
        fontSize: 15,
        marginBottom: 8,
    },
    ingredientList: {
        paddingLeft: 0, // ✅ Đổi từ paddingLeft: 8 thành 0
    },
    ingredientItem: {
        color: '#222',
        fontSize: 14,
        marginBottom: 2,
        lineHeight: 20,
        paddingLeft: 0, // ✅ Thêm paddingLeft: 0
    },
    relatedSection: {
        marginTop: 0,
        paddingHorizontal: 12,
        paddingBottom: 24,
        backgroundColor: '#fff',
        paddingTop: 18,
    },
    relatedTitle: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#222',
        marginBottom: 8,
    },
    relatedCard: {
        width: 260, // 40% width
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
        top: 6,
        right: 6,
        width: 24,
        height: 24,
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    relatedMark: {
        width: 16,
        height: 16,
        resizeMode: 'contain'
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
    relatedPremiumTagText: {
        color: '#FF8000',
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
    commentExcellent: {
        color: '#1CB0F6',
        fontWeight: 'bold',
    },
    ratingBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1DA1F2',
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 2,
        marginRight: 8,
    },
    ratingText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
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
    modalButton: {
        backgroundColor: '#FF6600',
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: 'center',
        marginTop: 4,
    },
    modalButtonDisabled: {
        backgroundColor: '#ccc',
    },
    modalButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default DetailScreen;