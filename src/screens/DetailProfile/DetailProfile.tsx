// screens/DetailProfile.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Image } from 'react-native'; // Bỏ FlatList
import { useTranslation } from 'react-i18next';

// Imports component ProfileInfo của bạn
import DetailProfileInfo from '../../compoments/DetailProfileInfo';
import BottomNavigation from '../../compoments/Bottomnavigation';

const { width } = Dimensions.get('window');

// Dữ liệu cứng cho Thành tích
const achievementsData = [
  {
    id: '1',
    icon: require('../../assert/image/totaltime.png'), // Đường dẫn bạn đã cung cấp
    label: 'Tổng thời gian',
    value: '20h30\'',
    valueColor: '#1a73e8',
  },
  {
    id: '2',
    icon: require('../../assert/image/total.png'), // Đường dẫn bạn đã cung cấp
    label: 'Tổng số món đã nấu',
    value: '120',
    valueColor: '#1a73e8',
  },
];

// Component để render từng thẻ Thành tích
const AchievementCard = ({ item }) => {
  return (
    <View style={styles.achievementCard}>
      <Image source={item.icon} style={styles.achievementCardIcon} />
      <Text style={styles.achievementCardLabel}>{item.label}</Text>
      <Text style={[styles.achievementCardValue, { color: item.valueColor }]}>{item.value}</Text>
    </View>
  );
};

const DetailProfile = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <DetailProfileInfo />

        {/* Section Thành tích */}
        <View style={styles.section}>
          {/* Tiêu đề và icon Thành tích */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitleWithIcon}>{t('achievements')}</Text>
            <Image
              source={require('../../assert/image/achievement.png')}
              style={styles.achievementIcon}
            />
          </View>
          {/* Thay thế FlatList bằng View với flexWrap */}
          <View style={styles.achievementsGrid}>
            {achievementsData.map((item) => (
              <AchievementCard key={item.id} item={item} />
            ))}
          </View>
        </View>

        {/* Section Công thức đã mua */}
        <View style={styles.purchasedRecipesSection}>
          <Text style={styles.purchasedRecipesTitle}>{t('purchasedrecipes')}</Text>
        </View>
      </ScrollView>
      {/* Bottom Navigation */}
      <BottomNavigation current="profile" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContentContainer: {
    paddingBottom: 0,
  },
  section: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 8,
  },
  sectionTitleWithIcon: {
    color: '#474747',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 6,
  },
  achievementIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#FF8000',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Cho phép các item xuống dòng
    justifyContent: 'space-between', // Căn đều các item và tạo khoảng cách giữa chúng
  },
  achievementCard: {
    width: (width - (16 * 2) - 8) / 2, // 16*2 là padding của section, 8 là khoảng cách giữa 2 thẻ (4+4)
    height: 100, // Cố định chiều cao để đồng nhất
    marginVertical: 4, // Khoảng cách trên/dưới cho mỗi thẻ
    backgroundColor: '#D9F2FE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#B3E5FC',
    padding: 12,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  achievementCardIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
    tintColor: '#1a73e8',
  },
  achievementCardLabel: {
    fontSize: 13,
    color: '#474747',
    flexWrap: 'wrap',
  },
  achievementCardValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // --- Hết Styles cho phần Thành tích ---
  purchasedRecipesTitle: {
    color: '#474747',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  purchasedRecipesSection: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 100, // Giảm paddingBottom nếu thấy quá nhiều
  },
});

export default DetailProfile;