import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../navigation/navigationName';
import { useTranslation } from 'react-i18next';

const icons = {
  home: require('../assert/image/home.png'),
  rank: require('../assert/image/addrecipe.png'), // Lên món
  recipe: require('../assert/image/recipe.png'), // Công thức
  profile: require('../assert/image/account.png'),
};

const BottomNavigation = ({ current = 'profile' }: { current?: string }) => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate(nav.home)}>
        <Image source={icons.home} style={[styles.icon, current === 'home' && styles.iconActive]} />
        <Text style={[styles.label, current === 'home' && styles.labelActive]}>
          {t('tab_home')}
        </Text>
      </TouchableOpacity>
      {/* Đã đảo vị trí: Công thức lên trên */}
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate(nav.recipe)}>
        <Image source={icons.recipe} style={[styles.icon, current === 'recipe' && styles.iconActive]} />
        <Text style={[styles.label, current === 'recipe' && styles.labelActive]}>
          {t('tab_recipe')}
        </Text>
      </TouchableOpacity>
      {/* Lên món xuống dưới */}
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate(nav.addRecipe)}>
        <Image source={icons.rank} style={[styles.icon, current === 'addrecipe' && styles.iconActive]} />
        <Text style={[styles.label, current === 'rank' && styles.labelActive]}>
          {t('add_recipe')}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate(nav.profile)}>
        <Image source={icons.profile} style={[styles.icon, current === 'profile' && styles.iconActive]} />
        <Text style={[styles.label, current === 'profile' && styles.labelActive]}>
          {t('tab_profile', { defaultValue: 'Tài khoản' })}
        </Text>
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
    tintColor: '#FF6600',
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  labelActive: {
    color: '#FF6600',
    fontWeight: 'bold',
  },
});

export default BottomNavigation;