import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import BottomNavigation from '../../compoments/Bottomnavigation';

const RecipeScreen = () => {
  const [tab, setTab] = useState<'my' | 'saved'>('saved');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Công thức</Text>
      </View>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'my' && styles.tabBtnActive]}
          onPress={() => setTab('my')}
        >
          <Text style={[styles.tabText, tab === 'my' && styles.tabTextActive]}>Công thức của tôi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === 'saved' && styles.tabBtnActive]}
          onPress={() => setTab('saved')}
        >
          <Text style={[styles.tabText, tab === 'saved' && styles.tabTextActive]}>Công thức đã lưu</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.body}>
        {tab === 'my' ? (
          <View style={styles.emptyContainer} />
        ) : (
          <View style={styles.savedContainer}>
            <Image source={require('../../assert/image/fire.png')} style={styles.fureIcon} />
            <Text style={styles.savedText}>Bạn chưa sở hữu Quest nào</Text>
            <TouchableOpacity style={styles.exploreBtn}>
              <Text style={styles.exploreText}>Khám phá ngay {'>'}</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <BottomNavigation current="recipe" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#ff6f2c',
    height: 60,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
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
    borderColor: '#00c6b7',
  },
  tabText: {
    color: '#888',
    fontSize: 15,
    fontWeight: 'bold',
  },
  tabTextActive: {
    color: '#00c6b7',
  },
  body: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
  },
  savedContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  fureIcon: {
    width: 48,
    height: 48,
    marginBottom: 18,
  },
  savedText: {
    color: '#888',
    fontSize: 15,
    marginBottom: 18,
  },
  exploreBtn: {
    backgroundColor: '#ff6f2c',
    borderRadius: 8,
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginTop: 8,
  },
  exploreText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});

export default RecipeScreen;
