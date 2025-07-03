import React from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';

interface RankingItem {
  id: string;
  name: string;
  avatar: any;
  point: string | number;
  quests: number;
  rank: number;
}

interface Props {
  data: RankingItem[];
  tab: string; // 'all' | 'week' | 'month'
}

const RankingList: React.FC<Props> = ({ data, tab }) => {
  const { t } = useTranslation();

  // Nếu đang search và không có kết quả, hiển thị dòng "Chưa có dữ liệu xếp hạng"
  if (tab === 'search' && (!data || data.length === 0)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 32 }}>
        <Text style={{ color: '#888', fontSize: 15 }}>{t('no_ranking_data', { defaultValue: 'Chưa có dữ liệu xếp hạng' })}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Điểm của bạn */}
      {/* Ẩn khi ở chế độ search */}
      {tab !== 'search' && (
        <View style={styles.yourPointRow}>
          <View style={styles.pointCircle}>
            <Image source={require('../assert/image/point.png')} style={styles.pointIcon} />
          </View>
          <View>
            <Text style={styles.yourPointLabel}>{t('your_point', { defaultValue: 'Số điểm của bạn' })}</Text>
            <Text style={styles.yourPointValue}>
              {data && data[0] && data[0].point !== undefined && data[0].point !== null ? data[0].point : '-'}
            </Text>
          </View>
        </View>
      )}
      {/* Danh sách xếp hạng */}
      <FlatList
        data={data}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 0, paddingTop: 8 }}
        renderItem={({ item }) => (
          <View style={styles.rankRow}>
            <Text style={[
              styles.rankIndex,
              item.rank === 1 && styles.rankIndexTop
            ]}>{item.rank}</Text>
            <View style={styles.avatarWrap}>
              <Image source={item.avatar} style={styles.avatar} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nameText}>{item.name}</Text>
              <View style={styles.questRow}>
                <Text style={styles.questText}>{item.quests} {t('quests', { defaultValue: 'Quests' })}</Text>
                {item.rank === 1 && (
                  <Image source={require('../assert/image/king.png')} style={styles.kingIcon} />
                )}
                <View style={styles.verifiedCircle}>
                  <Image source={require('../assert/image/check.png')} style={styles.verifiedIcon} />
                </View>
              </View>
            </View>
            <View style={styles.pointValueRow}>
              <Text style={[
                styles.pointText,
                item.rank === 1 && styles.pointTextTop
              ]}>{item.point}</Text>
              <View style={styles.pointCircleRank}>
                <Image source={require('../assert/image/point.png')} style={styles.pointIconRank} />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  yourPointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    borderRadius: 12,
    margin: 16,
    padding: 12,
    marginBottom: 8,
  },
  pointCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EAF7F3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  pointIcon: {
    width: 18,
    height: 18,
    tintColor: '#1ABC9C',
  },
  yourPointLabel: {
    color: '#888',
    fontSize: 13,
    fontWeight: '400',
  },
  yourPointValue: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 2,
  },
  pointValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointCircleRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8E1E4',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  pointIconRank: {
    width: 15,
    height: 15,
    tintColor: '#C03744',
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  rankIndex: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#888',
    width: 28,
    textAlign: 'center',
    marginRight: 8,
  },
  rankIndexTop: {
    color: '#C03744',
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#eee',
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#222',
  },
  questRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  questText: {
    color: '#888',
    fontSize: 13,
    marginRight: 6,
  },
  kingIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 6,
  },
  verifiedCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1ABC9C',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedIcon: {
    width: 12,
    height: 12,
    tintColor: '#fff',
  },
  pointText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#222',
    minWidth: 40,
    textAlign: 'right',
    marginRight: 4,
  },
  pointTextTop: {
    color: '#C03744',
  },
});

export default RankingList;
