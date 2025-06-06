import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../navigation/navigationName';

const icons = {
  home: require('../assert/image/home.png'),
  rank: require('../assert/image/ranking.png'),
  recipe: require('../assert/image/recipe.png'),
  profile: require('../assert/image/account.png'),
};

const BottomNavigation = ({ current = 'profile' }: { current?: string }) => {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate(nav.home)}>
        <Image source={icons.home} style={[styles.icon, current === 'home' && styles.iconActive]} />
        <Text style={[styles.label, current === 'home' && styles.labelActive]}>Trang chủ</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate(nav.rank)}>
        <Image source={icons.rank} style={[styles.icon, current === 'rank' && styles.iconActive]} />
        <Text style={[styles.label, current === 'rank' && styles.labelActive]}>Xếp hạng</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate(nav.recipe)}>
        <Image source={icons.recipe} style={[styles.icon, current === 'recipe' && styles.iconActive]} />
        <Text style={[styles.label, current === 'recipe' && styles.labelActive]}>Công thức</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate(nav.profile)}>
        <Image source={icons.profile} style={[styles.icon, current === 'profile' && styles.iconActive]} />
        <Text style={[styles.label, current === 'profile' && styles.labelActive]}>Tài khoản</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    tintColor: '#888',
    marginBottom: 2,
  },
  iconActive: {
      tintColor: '#FF6600', // cam đậm như mẫu
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  labelActive: {
    color: '#FF6600', // cam đậm như mẫu
    fontWeight: 'bold',
  },
});

export default BottomNavigation;
