import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Image
} from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import BottomNavigation from '../../compoments/Bottomnavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../../context/UserContext';
import { useTranslation } from 'react-i18next';

const { height } = Dimensions.get('window');

interface NotificationItem {
  id: string;
  type: 'app_open' | 'user_login' | 'premium_upgrade';
  timestamp: number;
  message?: string;
}

const NOTIFICATION_STORAGE_KEY = '@app_notifications';
const HAS_UNREAD_NOTIFICATIONS_KEY = '@has_unread_notifications'; // Keep this key

const NotificationScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { user } = useContext(UserContext);
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // Hàm lấy ngày bắt đầu premium từ chuỗi ngày hết hạn (giả sử premium là ngày hết hạn, 1 tháng)
  function getPremiumStartDate(premiumEndDateStr: string): Date {
    // Nếu chuỗi là ISO hoặc yyyy-mm-dd, new Date sẽ parse được
    const endDate = new Date(premiumEndDateStr);
    // Trừ đi 1 tháng (30 ngày)
    const startDate = new Date(endDate);
    startDate.setMonth(startDate.getMonth() - 1);
    // Nếu ngày bắt đầu lớn hơn ngày hiện tại (do setMonth tràn tháng), lùi về cuối tháng trước
    if (startDate > endDate) {
      startDate.setDate(0);
    }
    return startDate;
  }

  const loadNotifications = useCallback(async () => {
    try {
      const storedNotificationsString = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
      let parsedNotifications: NotificationItem[] = [];
      if (storedNotificationsString) {
        parsedNotifications = JSON.parse(storedNotificationsString);
      }
      // Nếu user có premium mà chưa có notification premium_upgrade thì thêm vào
      if (user?.premium) {
        const hasPremiumNotif = parsedNotifications.some(n => n.type === 'premium_upgrade');
        if (!hasPremiumNotif) {
          // Lấy ngày bắt đầu premium từ ngày hết hạn
          const premiumStartDate = getPremiumStartDate(user.premium);
          parsedNotifications.push({
            id: 'premium_upgrade_' + premiumStartDate.getTime(),
            type: 'premium_upgrade',
            timestamp: premiumStartDate.getTime(),
            message: '',
          });
          // Lưu lại vào AsyncStorage để lần sau vẫn còn
          await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(parsedNotifications));
        }
      }
      setNotifications(parsedNotifications.filter(notif =>
        notif.type === 'app_open' ||
        notif.type === 'user_login' ||
        notif.type === 'premium_upgrade'
      ));
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, [user?.premium]);

  // Effect to mark notifications as read when NotificationScreen is focused
  useEffect(() => {
    if (isFocused) {
      loadNotifications();
      // Mark notifications as read when this screen is focused by removing the flag
      AsyncStorage.removeItem(HAS_UNREAD_NOTIFICATIONS_KEY)
        .then(() => {
          console.log('Unread notifications flag cleared by NotificationScreen.');
        })
        .catch(error => {
          console.error('Failed to clear unread notifications flag from NotificationScreen:', error);
        });
    }
  }, [isFocused, loadNotifications]);

  const groupNotificationsByDate = () => {
    const grouped: { [key: string]: NotificationItem[] } = {};
    const today = new Date();
    const todayString = today.toDateString();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toDateString();

    notifications.forEach((notif) => {
      const notifDate = new Date(notif.timestamp);
      const dateString = notifDate.toDateString();
      let key = '';

      if (dateString === todayString) {
        key = 'Hôm nay';
      } else if (dateString === yesterdayString) {
        key = 'Hôm qua';
      } else {
        key = `${notifDate.getDate().toString().padStart(2, '0')}/${(notifDate.getMonth() + 1).toString().padStart(2, '0')}/${notifDate.getFullYear()}`;
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(notif);
    });

    const sortedGroupKeys = Object.keys(grouped).sort((a, b) => {
      if (a === 'Hôm nay') return -1;
      if (b === 'Hôm nay') return 1;
      if (a === 'Hôm qua' && b !== 'Hôm nay') return -1;
      if (b === 'Hôm qua' && a !== 'Hôm nay') return 1;

      const parseDate = (dateStr: string) => {
        const parts = dateStr.split('/');
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
      };

      const dateA = parseDate(a);
      const dateB = parseDate(b);
      return dateB.getTime() - dateA.getTime();
    });

    return sortedGroupKeys.map(key => ({
      title: key,
      data: grouped[key].sort((a, b) => b.timestamp - a.timestamp),
    }));
  };

  const groupedNotifications = groupNotificationsByDate();

  const renderNotificationItem = ({ item, index, section }: { item: NotificationItem, index: number, section: any }) => {
    const notificationTime = new Date(item.timestamp);
    const hours = notificationTime.getHours();
    const minutes = notificationTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const timeString = `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;

    const isLastItemInSection = index === section.data.length - 1;

    // Xử lý message cho thông báo premium_upgrade
    let message = item.message;
    if (item.type === 'premium_upgrade') {
      const month = notificationTime.getMonth() + 1;
      message = `Nâng cấp thành công tài khoản Premium tháng ${month}`;
    }

    return (
      <View>
        <View style={styles.notificationItem}>
          {item.type === 'user_login' && (
            <View style={styles.loginIconContainer}>
              <Image source={require('../../assert/image/act.png')} style={styles.loginIcon} />
            </View>
          )}
          {item.type === 'premium_upgrade' && (
            <View style={[styles.loginIconContainer, { backgroundColor: '#15B097' }]}>
              <Image source={require('../../assert/image/updatepremium.png')} style={styles.loginIcon} />
            </View>
          )}
          <View style={styles.notificationContent}>
            <Text style={styles.notificationTitle}>
              {item.type === 'app_open'
                ? t('notification_app_open', 'Bạn đã truy cập ứng dụng.')
                : message || t('notification_login', 'Bạn đã đăng nhập.')}
            </Text>
            <Text style={styles.notificationTime}>{timeString}</Text>
          </View>
        </View>
        {!isLastItemInSection && <View style={styles.separator} />}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assert/image/back.png')}
            style={{ width: 44, height: 44, tintColor: '#fff' }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
      </View>

      <View style={styles.contentArea}>
        {groupedNotifications.length > 0 ? (
          <FlatList
            data={groupedNotifications}
            keyExtractor={(item) => item.title}
            renderItem={({ item: section }) => (
              <View style={styles.notificationBlock}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                <FlatList
                  data={section.data}
                  keyExtractor={(notifItem) => notifItem.id}
                  renderItem={({ item, index }) => renderNotificationItem({ item, index, section })}
                  scrollEnabled={false}
                />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContentContainer}
          />
        ) : (
          <View style={styles.emptyNotifications}>
            <Text style={styles.emptyNotificationsText}>Bạn chưa có thông báo nào.</Text>
          </View>
        )}
      </View>

      <BottomNavigation current="home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FF6F2C',
    paddingTop: 15,
    paddingHorizontal: 16,
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    paddingVertical: 5,
    paddingRight: 10,
  },
  backBtnText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  flatListContentContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  notificationBlock: {
    backgroundColor: '#fff',
    borderRadius: 0,
    paddingVertical: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center', // This aligns items vertically in the center
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 4,
  },
  loginIconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  loginIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#222',
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  emptyNotifications: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 0,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  emptyNotificationsText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default NotificationScreen;