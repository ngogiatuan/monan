import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Keyboard, Alert } from 'react-native';
import InputNavigation from '../../compoments/InputNavigation';
import BottomNavigation from '../../compoments/Bottomnavigation';
import RankingList from '../../compoments/RankingList';
import { UserContext } from '../../context/UserContext';
import NetInfo from '@react-native-community/netinfo';
import { checkNetworkAndAlert } from '../../compoments/NetworkAlert';
import { useTranslation } from 'react-i18next';

const RankingScreen = () => {
  const [tab, setTab] = useState('all');
  const [searchMode, setSearchMode] = useState(false);
  const [search, setSearch] = useState('');
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const { user } = useContext(UserContext);
  const [isConnected, setIsConnected] = useState(true);
  const { t, i18n } = useTranslation();

  // Force re-render when language changes to update tab/header text
  const [, forceUpdate] = useState(0);
  useEffect(() => {
    // Sử dụng cả sự kiện languageChanged và navigation focus để đảm bảo đồng bộ UI
    const handler = () => forceUpdate(v => v + 1);
    i18n.on('languageChanged', handler);

    // Nếu dùng react-navigation v6+, có thể dùng useFocusEffect để force update khi quay lại từ LanguageScreen
    // (nếu navigation không tự re-render)
    // import { useIsFocused } from '@react-navigation/native';
    // const isFocused = useIsFocused();
    // useEffect(() => { forceUpdate(v => v + 1); }, [isFocused]);

    return () => {
      i18n.off('languageChanged', handler);
    };
  }, [i18n]);

  // Không dùng useMemo cho TABS/headerTitle, luôn tạo lại mỗi render để đảm bảo đồng bộ
  const TABS = [
    { key: 'all', label: t('all', { defaultValue: 'Tất cả' }) },
    { key: 'week', label: t('top_week', { defaultValue: 'Top tuần' }) },
    { key: 'month', label: t('top_month', { defaultValue: 'Top tháng' }) },
  ];
  const headerTitle = t('ranking', { defaultValue: 'Xếp hạng' });

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(!!state.isConnected);
    });
    return () => unsubscribe();
  }, []);

  // Nếu là guest
  const guestRanking = [
    {
      id: 'guest',
      name: t('guest', { defaultValue: 'Guest' }),
      avatar: require('../../assert/image/avatar.png'),
      point: '-',
      quests: 0,
      rank: 1,
    },
  ];

  // Nếu là user đã đăng nhập
  const userRanking = [
    {
      id: 'user',
      name: user?.name || '',
      avatar: typeof user?.avatar ==="string" ? {uri: user.avatar} : require('../../assert/image/avatar.png'),
      point: 0,
      quests: 0,
      rank: 1,
    },
  ];

  // Dữ liệu search: chỉ có guest hoặc user, filter theo tên (case-insensitive)
  const baseRanking = user ? [{
    id: 'user',
    name: user?.name || '',
    avatar: typeof user?.avatar ==="string" ? {uri: user.avatar} : require('../../assert/image/avatar.png'),
    point: 0,
    quests: 0,
    rank: 1,
  }] : [{
    id: 'guest',
    name: t('guest', { defaultValue: 'Guest' }),
    avatar: require('../../assert/image/avatar.png'),
    point: '-',
    quests: 0,
    rank: 1,
  }];

  const filteredRanking =
    search.trim().length === 0
      ? []
      : baseRanking.filter(item =>
          item.name.toLowerCase().includes(search.trim().toLowerCase())
        );

  // Đề xuất khi đang search và có input nhưng chưa submit
  const showSuggest =
    searchMode &&
    search.trim().length > 0 &&
    !searchSubmitted &&
    filteredRanking.length > 0;

  // Khi offline, chỉ hiện dòng nhắc, vẫn giữ header, 3 tab và input search nếu searchMode
  if (!isConnected) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* Header giữ nguyên, có thể là searchMode hoặc không */}
        <View style={styles.header}>
          {!searchMode ? (
            <>
              <Text style={styles.headerTitle}>{headerTitle}</Text>
              <TouchableOpacity
                onPress={() => setSearchMode(true)}
              >
                <Image source={require('../../assert/image/whitesearch.png')} style={styles.searchIcon} />
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.searchBarWrap}>
              <View style={styles.searchBar}>
                <Image source={require('../../assert/image/blacksearch.png')} style={styles.searchInputIcon} />
                <InputNavigation
                  style={styles.searchInput}
                  placeholder={t('search_player', { defaultValue: 'Tìm người chơi' })}
                  placeholderTextColor="#888"
                  value={search}
                  onChangeText={text => {
                    setSearch(text);
                    setSearchSubmitted(false);
                  }}
                  autoFocus
                  returnKeyType="search"
                  onSubmitEditing={() => {
                    Alert.alert(
                      t('no_network', { defaultValue: 'Không có kết nối mạng' }),
                      t('turn_on_network', { defaultValue: 'Vui lòng bật wifi hoặc dữ liệu di động để tìm kiếm tài khoản.' })
                    );
                  }}
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
                <Text style={styles.cancelText}>{t('cancel', { defaultValue: 'Hủy' })}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {/* Tabs giữ nguyên */}
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
        {/* Dòng nhắc ở giữa màn hình */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#ff6f2c', fontWeight: 'bold', fontSize: 16, textAlign: 'center', marginHorizontal: 24 }}>
            {t('no_network_ranking', { defaultValue: 'Không có kết nối mạng. Vui lòng bật wifi hoặc dữ liệu di động để xem bảng xếp hạng.' })}
          </Text>
        </View>
        <BottomNavigation current="rank" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        {!searchMode ? (
          <>
            <Text style={styles.headerTitle}>{headerTitle}</Text>
            <TouchableOpacity
              onPress={async () => {
                // Khi offline, không cho vào search
                if (!isConnected) {
                  Alert.alert(
                    t('no_network', { defaultValue: 'Không có kết nối mạng' }),
                    t('turn_on_network', { defaultValue: 'Vui lòng bật wifi hoặc dữ liệu di động để tìm kiếm tài khoản.' })
                  );
                  return;
                }
                setSearchMode(true);
              }}
            >
              <Image source={require('../../assert/image/whitesearch.png')} style={styles.searchIcon} />
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.searchBarWrap}>
            <View style={styles.searchBar}>
              <Image source={require('../../assert/image/blacksearch.png')} style={styles.searchInputIcon} />
              <InputNavigation
                style={styles.searchInput}
                placeholder={t('search_player', { defaultValue: 'Tìm người chơi' })}
                placeholderTextColor="#888"
                value={search}
                onChangeText={text => {
                  setSearch(text);
                  setSearchSubmitted(false);
                }}
                autoFocus
                returnKeyType="search"
                onSubmitEditing={async () => {
                  // Khi offline, alert khi bấm enter tìm kiếm
                  if (!isConnected) {
                    Alert.alert(
                      t('no_network', { defaultValue: 'Không có kết nối mạng' }),
                      t('turn_on_network', { defaultValue: 'Vui lòng bật wifi hoặc dữ liệu di động để tìm kiếm tài khoản.' })
                    );
                    return;
                  }
                  setSearchSubmitted(true);
                }}
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
              <Text style={styles.cancelText}>{t('cancel', { defaultValue: 'Hủy' })}</Text>
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
            data={baseRanking}
            tab={tab}
          />
        ) : (
          <>
            {/* Đề xuất bên dưới ô search khi có input và chưa submit */}
            {showSuggest && (
              <View style={styles.suggestBox}>
                {filteredRanking.map(item => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.suggestItem}
                    onPress={() => {
                      setSearch(item.name);
                      setSearchSubmitted(true);
                    }}
                  >
                    <Image source={item.avatar} style={styles.suggestAvatar} />
                    <Text style={styles.suggestText}>{item.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {/* Chỉ render list khi đã bấm enter (searchSubmitted) */}
            {searchSubmitted && filteredRanking.length > 0 ? (
              <RankingList
                data={filteredRanking}
                tab="search"
              />
            ) : null}
          </>
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
    height: 56, // Đảm bảo chiều cao bằng header
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 0, // bỏ margin dọc
    paddingHorizontal: 8,
    marginRight: 0,
    height: 40, // Giảm chiều cao input cho vừa header
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
    paddingVertical: 0, // giảm padding dọc
    color: '#222',
    height: 40, // Giảm chiều cao input cho vừa header
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
  suggestBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 4,
    paddingVertical: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 10,
  },
  suggestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  suggestAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 10,
    backgroundColor: '#eee',
  },
  suggestText: {
    fontSize: 15,
    color: '#222',
    fontWeight: 'bold',
  },
});

export default RankingScreen;

