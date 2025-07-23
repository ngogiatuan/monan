import React, { useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  DeviceEventEmitter,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { checkNetworkAndAlert } from '../../compoments/NetworkAlert';
import { useTranslation } from 'react-i18next';
import { createNewReview, getUserReview, updateReview } from '../../api/reviewApi';
import { UserContext } from '../../context/UserContext';
import { BottomSheetModal, BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';

const { width } = Dimensions.get('window');

const EndCookingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const { user } = useContext(UserContext);

  // State cho dialog đánh giá
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showAlreadyReviewedModal, setShowAlreadyReviewedModal] = useState(false);

  // ✅ Lấy recipeId từ params
  const recipeId = route.params?.recipeId;

  const bottomSheetRef = useRef<BottomSheetModal>(null);

  React.useEffect(() => {
    const unsubscribe = require('@react-native-community/netinfo').addEventListener(
      (state: any) => setIsConnected(!!state.isConnected)
    );
    return () => unsubscribe();
  }, []);

  // Lấy thời gian bắt đầu từ params
  const startTime = route.params?.startTime;
  const cookedDuration = route.params?.cookedDuration;
  const wasOffline = route.params?.wasOffline;
  const offlineAtEnd = route.params?.offlineAtEnd;
  const [duration, setDuration] = useState<string>('0\'');
  const [showOfflineDialog, setShowOfflineDialog] = useState(!!(wasOffline && offlineAtEnd));
  const [realDuration, setRealDuration] = useState<number | null>(typeof cookedDuration === 'number' ? cookedDuration : null);

  React.useEffect(() => {
    // Nếu có cookedDuration (từ TutorialCookingScreen truyền sang), ưu tiên dùng
    if (typeof cookedDuration === 'number') {
      let diff = Math.floor(cookedDuration / 1000); // giây
      let text = '';
      if (diff < 60) text = `${diff}s`;
      else if (diff < 3600) text = `${Math.floor(diff / 60)}'${diff % 60 > 0 ? diff % 60 + 's' : ''}`;
      else text = `${Math.floor(diff / 3600)}h${Math.floor((diff % 3600) / 60)}'`;
      setDuration(text);
      setRealDuration(cookedDuration);
    } else if (startTime) {
      const now = Date.now();
      let diff = Math.floor((now - startTime) / 1000); // giây
      let text = '';
      if (diff < 60) text = `${diff}s`;
      else if (diff < 3600) text = `${Math.floor(diff / 60)}'${diff % 60 > 0 ? diff % 60 + 's' : ''}`;
      else text = `${Math.floor(diff / 3600)}h${Math.floor((diff % 3600) / 60)}'`;
      setDuration(text);
      setRealDuration(now - startTime);
    }
  }, [startTime, cookedDuration]);

  // Khi quay lại từ TutorialCookingScreen và đã bật mạng, cập nhật lại thời gian nấu thực tế
  React.useEffect(() => {
    if (wasOffline && !offlineAtEnd && typeof cookedDuration === 'number') {
      setShowOfflineDialog(false);
      // Đảm bảo duration hiển thị đúng
      let diff = Math.floor(cookedDuration / 1000);
      let text = '';
      if (diff < 60) text = `${diff}s`;
      else if (diff < 3600) text = `${Math.floor(diff / 60)}'${diff % 60 > 0 ? diff % 60 + 's' : ''}`;
      else text = `${Math.floor(diff / 3600)}h${Math.floor((diff % 3600) / 60)}'`;
      setDuration(text);
      setRealDuration(cookedDuration);
    }
  }, [wasOffline, offlineAtEnd, cookedDuration]);

  // Render các ngôi sao (blank star và full star)
  const renderStars = () => {
    const stars = [] as any[];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity
          key={i}
          onPress={async () => {
            const ok = await checkNetworkAndAlert(t('network_rating'));
            if (!ok) return;
            setRating(i);
          }}
          activeOpacity={0.7}
        >
          <Image
            source={
              i <= rating
                ? require('../../assert/image/fullstar.png')
                : require('../../assert/image/blank.png')
            }
            style={{
              width: 32,
              height: 32,
              marginHorizontal: 2,
              tintColor: i <= rating ? '#FF9900' : '#D3D3D3',
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    }
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 12 }}>
        {stars}
      </View>
    );
  };

  const handleSubmitReview = async () => {
    if (!user?.token) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để đánh giá');
      return;
    }
    if (!recipeId) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin công thức');
      return;
    }
    if (rating === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn số sao');
      return;
    }

    const ok = await checkNetworkAndAlert(t('network_comment'));
    if (!ok) return;

    setIsSubmitting(true);

    const userId = user._id || user.id || user.userId;
    if (!userId) {
      Alert.alert('Lỗi', 'Không tìm thấy userId');
      setIsSubmitting(false);
      return;
    }

    // Kiểm tra đã review chưa
    const existingReview = await getUserReview(recipeId, user.token);
    if (existingReview) {
      setShowAlreadyReviewedModal(true);
      setShowRating(false);
      setIsSubmitting(false);
      return;
    }

    // Chưa review, gọi create
    try {
      const reviewData = { userId, recipeId, rating, comment: comment.trim() };
      await createNewReview(reviewData, user.token);

      DeviceEventEmitter.emit('reviewCountUpdated', { recipeId, increment: 1 });

      setShowRating(false);
      setSuccessMessage('Đánh giá của bạn đã được gửi!');
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('❌ API Error:', error?.response?.data || error?.message || error);
      Alert.alert('Lỗi', error?.response?.data?.error || error?.message || 'Không thể gửi đánh giá. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={async () => {
            const ok = await checkNetworkAndAlert(t('network_back'));
            if (!ok) return;
            navigation.goBack();
          }}
        >
          <Image
            source={require('../../assert/image/back.png')}
            style={{ width: 44, height: 44, tintColor: '#fff' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('end_cooking')}</Text>
      </View>
      {/* Banner */}
      <Image
        source={require('../../assert/image/Header.png')}
        style={styles.bannerImg}
      />
      {/* Content */}
      <View style={styles.card}>
        <View style={styles.doneRow}>
          <View style={styles.doneIconCircle}>
            <Image source={require('../../assert/image/check.png')} style={styles.doneIconWhite} />
          </View>
          <Text style={styles.doneText}>{t('you_finished_dish')}</Text>
        </View>
        <Text style={styles.sectionLabel}>{t('you_finished')}</Text>
        <View style={styles.timeRow}>
          <View style={styles.timeBox}>
            <Image source={require('../../assert/image/time.png')} style={styles.timeIcon} />
            <Text style={styles.timeLabel}>{t('your_time')}</Text>
            <Text style={styles.timeValue}>
              {showOfflineDialog ? '0' : duration}
            </Text>
            <View style={styles.timeCheckCircle}>
              <Image source={require('../../assert/image/check.png')} style={styles.timeCheckIcon} />
            </View>
          </View>
        </View>
        {/* Nếu có wasOffline và offlineAtEnd thì show dialog nhắc bật mạng để xem thống kê */}
        {showOfflineDialog ? (
          <View style={{ alignItems: 'center', marginTop: 12 }}>
            <Text style={{ color: '#e53935', fontWeight: 'bold', fontSize: 15, textAlign: 'center' }}>
              {t('offline_end_notice')}
            </Text>
          </View>
        ) : null}
      </View>
      {/* Button cố định dưới cùng */}
      <View style={styles.fixedBottomBtnRow}>
        <ButtonNavigation
          title={t('continue')}
          onPress={async () => {
            const ok = await checkNetworkAndAlert(t('network_continue'));
            if (!ok) return;
            bottomSheetRef.current?.present();
          }}
          backgroundColor="#FF6600"
        />
      </View>
      {/* Dialog đánh giá */}
      <BottomSheetModal
        ref={bottomSheetRef}
        enablePanDownToClose
        backdropComponent={props => (
          <BottomSheetBackdrop {...props} disappearsOnIndex={-1} opacity={0.5} appearsOnIndex={0} pressBehavior={'none'} />
        )}
        snapPoints={['45%']} // hoặc ['60%'] tùy UI
      >
        <BottomSheetView style={{ flex: 1, padding: 20 }}>
          {/* Drag handle tự động có, hoặc custom nếu muốn */}
          <Text style={styles.modalTitle}>{t('rate_recipe')}</Text>
          {renderStars()}
          <Text style={styles.modalLabel}>{t('comment')}</Text>
          <TextInput
            style={styles.modalInput}
            placeholder={t('comment_recipe_placeholder')}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={3}
            placeholderTextColor="#BDBDBD"
          />
          <TouchableOpacity
            style={[styles.modalButton, isSubmitting && styles.modalButtonDisabled]}
            onPress={handleSubmitReview}
            disabled={isSubmitting || rating === 0}
            activeOpacity={0.8}
          >
            <Text style={styles.modalButtonText}>
              {isSubmitting ? 'Đang gửi...' : t('confirm')}
            </Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheetModal>

      {/* Modal thành công */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successDialog}>
            <Text style={styles.successTitle}>{t('success')}</Text>
            <Text style={styles.successDesc}>{successMessage}</Text>
            <ButtonNavigation
              title={t('back')}
              backgroundColor="#FF6600"
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate(nav.home);
              }}
              style={styles.dialogButton}
              textStyle={styles.dialogButtonText}
            />
          </View>
        </View>
      </Modal>

      {/* Modal đã đánh giá */}
      <Modal
        visible={showAlreadyReviewedModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAlreadyReviewedModal(false)}
      >
        <View style={styles.successOverlay}>
          <View style={styles.successDialog}>
            <Text style={styles.successTitle}>Bạn đã đánh giá món này rồi!</Text>
            <Text style={styles.successDesc}>Bạn chỉ có thể đánh giá một lần cho mỗi công thức.</Text>
            <ButtonNavigation
              title="OK"
              backgroundColor="#FF6600"
              onPress={() => setShowAlreadyReviewedModal(false)}
              style={styles.dialogButton}
              textStyle={styles.dialogButtonText}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FF6600',
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 12,
    paddingTop: 0,
  },
  backBtn: {
    padding: 8,
    marginRight: 4,
  },
  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginRight: 24,
  },
  bannerImg: {
    width: width,
    height: 120,
    resizeMode: 'cover',
    backgroundColor: '#eee',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: -32,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E6F8F3',
  },
  doneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#E6F8F3',
    paddingBottom: 10,
  },
  doneIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#00C48C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  doneIconWhite: {
    width: 14,
    height: 14,
    tintColor: '#fff',
  },
  doneText: {
    color: '#00C48C',
    fontWeight: 'bold',
    fontSize: 15,
  },
  sectionLabel: {
    color: '#222',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  timeBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    paddingVertical: 14,
    marginHorizontal: 0,
    position: 'relative',
    minHeight: 90,
    maxWidth: 320,
    alignSelf: 'center',
  },
  timeIcon: {
    width: 22,
    height: 22,
    marginBottom: 4,
    tintColor: '#00C48C',
  },
  timeLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 1,
    marginTop: 1,
  },
  timeValue: {
    color: '#00C48C',
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 1,
    marginTop: 1,
  },
  timeCheckCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#00C48C',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  timeCheckIcon: {
    width: 10,
    height: 10,
    tintColor: '#fff',
  },
  fixedBottomBtnRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#f2f2f2',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 20,
    marginTop: 40,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 10,
  },
  modalBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#222',
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#222',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    fontSize: 15,
    marginBottom: 10,
    color: '#222',
    backgroundColor: '#FAFAFA',
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
  modalDragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#CCCCCC',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 10,
  },
  dialogOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorDialogBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 18,
    width: '85%',
    elevation: 4,
  },
  errorDialogTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  errorDialogMessage: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  errorButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  errorOkButton: {
    backgroundColor: '#ff6f2c',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorOkButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  successOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successDialog: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 18,
    width: '85%',
    elevation: 4,
    alignItems: 'center',
  },
  successTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    marginBottom: 10,
    textAlign: 'center',
  },
  successDesc: {
    fontSize: 15,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  successImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F8F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successImage: {
    width: 40,
    height: 40,
    tintColor: '#00C48C',
  },
  dialogButton: {
    width: '100%',
    paddingVertical: 8,
    paddingHorizontal: 18,
  },
  dialogButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default EndCookingScreen;