import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Keyboard } from 'react-native';
import InputNavigation from '../../compoments/InputNavigation';
import BottomNavigation from '../../compoments/Bottomnavigation';
import RankingList from '../../compoments/RankingList';

const TABS = [
  { key: 'all', label: 'Tất cả' },
  { key: 'week', label: 'Top tuần' },
  { key: 'month', label: 'Top tháng' },
];

const RankingScreen = () => {
  const [tab, setTab] = useState('all');
  const [searchMode, setSearchMode] = useState(false);
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);

  const guestRanking = [
    {
      id: 'guest',
      name: 'Guest',
      avatar: require('../../assert/image/avatar.png'),
      point: '-',
      quests: 0,
      rank: 1,
    },
  ];

  // Dữ liệu search: chỉ có guest, filter theo tên (case-insensitive)
  const filteredRanking = search.trim().length === 0
    ? []
    : guestRanking.filter(item =>
        item.name.toLowerCase().includes(search.trim().toLowerCase())
      );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        {!searchMode ? (
          <>
            <Text style={styles.headerTitle}>Xếp hạng</Text>
            <TouchableOpacity onPress={() => setSearchMode(true)}>
              <Image source={require('../../assert/image/whitesearch.png')} style={styles.searchIcon} />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.searchBarWrap}>
            <View style={styles.searchBar}>
              <Image source={require('../../assert/image/blacksearch.png')} style={styles.searchInputIcon} />
              <InputNavigation
                style={styles.searchInput}
                placeholder="Tìm người chơi"
                placeholderTextColor="#888"
                value={search}
                onChangeText={text => {
                  setSearch(text);
                  setSearchSubmitted(false);
                }}
                autoFocus
                returnKeyType="search"
                onSubmitEditing={() => setSearchSubmitted(true)}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => {
                  setSearch('');
                  setSearchSubmitted(false);
                }}>
                  <Image source={require('../../assert/image/cancel.png')} style={styles.cancelIcon} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setSearch('');
                setSearchMode(false);
                setSearchSubmitted(false);
                Keyboard.dismiss();
              }}
            >
              <Text style={styles.cancelText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Tabs */}
      {!searchMode && (
        <View style={styles.tabRow}>
          {TABS.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
              onPress={() => setTab(t.key)}
            >
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {/* Content */}
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {!searchMode ? (
          <RankingList
            data={guestRanking}
            tab={tab}
          />
        ) : (
          // Chỉ render list khi đã bấm enter (searchSubmitted)
          searchSubmitted
            ? <RankingList
                data={filteredRanking}
                tab="search"
              />
            : null
        )}
      </View>
      <BottomNavigation current="rank" />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff6f2c',
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchIcon: {
    width: 24,
    height: 24,
    tintColor: '#fff',
  },
  searchBarWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ff6f2c',
    paddingRight: 0,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    paddingHorizontal: 8,
    marginRight: 0,
  },
  searchInputIcon: {
    width: 20,
    height: 20,
    marginRight: 6,
    tintColor: '#888',
  },
  searchInput: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    fontSize: 16,
    paddingVertical: 8,
    color: '#222',
  },
  cancelIcon: {
    width: 18,
    height: 18,
    marginLeft: 4,
    tintColor: '#888',
  },
  cancelBtn: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  tabBtnActive: {
    borderColor: '#ff6f2c',
  },
  tabText: {
    color: '#888',
    fontSize: 15,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#ff6f2c',
  },
});

export default RankingScreen;
