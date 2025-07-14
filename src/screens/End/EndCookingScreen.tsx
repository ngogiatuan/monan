import React, { useState } from 'react';
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
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { nav } from '../../navigation/navigationName';
import ButtonNavigation from '../../compoments/ButtonNavigation';
import { checkNetworkAndAlert } from '../../compoments/NetworkAlert';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

const EndCookingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();

  // State cho dialog đánh giá
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isConnected, setIsConnected] = useState(true);

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
  // Không cần estimatedTime nữa
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
        {/* Removed the "You Got" section related to points */}
      </View>
      {/* Button cố định dưới cùng */}
      <View style={styles.fixedBottomBtnRow}>
        <ButtonNavigation
          title={t('continue')}
          onPress={async () => {
            const ok = await checkNetworkAndAlert(t('network_continue'));
            if (!ok) return;
            setShowRating(true);
          }}
          backgroundColor="#FF6600"
        />
      </View>
      {/* Dialog đánh giá */}
      <Modal
        visible={showRating}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRating(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={{ alignItems: 'center', marginBottom: 8 }}>
              <View style={styles.modalBar} />
            </View>
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
              onSubmitEditing={async () => {
                const ok = await checkNetworkAndAlert(t('network_comment'));
                if (!ok) return;
                // ...submit logic nếu có...
              }}
            />
            {/* Removed the point information in the rating modal */}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={async () => {
                const ok = await checkNetworkAndAlert(t('network_confirm'));
                if (!ok) return;
                setShowRating(false);
                navigation.navigate(nav.home);
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.modalButtonText}>{t('confirm')}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  // Removed rewardRowCenter and its related styles
  // Removed rewardIconCircle and its related styles
  // Removed rewardIconCenter and its related styles
  // Removed rewardValueCenter and its related styles
  rewardNoteContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
    marginBottom: 0,
    paddingHorizontal: 0,
  },
  rewardNote: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    maxWidth: 320,
    width: '100%',
    includeFontPadding: false,
    letterSpacing: 0.1,
  },
  bottomBtnRow: {
    // Xóa style này nếu có, hoặc để trống nếu dùng fixedBottomBtnRow
    display: 'none',
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
  // Thêm style cho modal nếu chưa có
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
  // Removed modalPointRow and its related styles
  // Removed modalPointText and its related styles
  // Removed modalPointIcon and its related styles
  modalButton: {
    backgroundColor: '#FF6600',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EndCookingScreen;