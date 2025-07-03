import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { nav } from '../navigation/navigationName';
import { useTranslation } from 'react-i18next';

const icons = {
  home: require('../assert/image/home.png'),
  homeActive: require('../assert/image/homeactive.png'), // Assuming you have this active icon
  rank: require('../assert/image/addrecipe.png'), // Lên món (default)
  rankActive: require('../assert/image/addrecipeactive.png'), // Assuming you have this active icon
  recipe: require('../assert/image/recipe.png'), // Công thức (default)
  recipeActive: require('../assert/image/recipeactive.png'), // Now using your specified active icon
  profile: require('../assert/image/account.png'), // (default)
  profileActive: require('../assert/image/accountactive.png'), // Assuming you have this active icon
};

const BottomNavigation = ({ current = 'profile' }: { current?: string }) => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate(nav.home)}>
        <Image
          source={current === 'home' ? icons.homeActive : icons.home}
          style={styles.icon} // No longer need iconActive style for tintColor
        />
        <Text style={[styles.label, current === 'home' && styles.labelActive]}>
          {t('tab_home')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate(nav.recipe)}>
        <Image
          source={current === 'recipe' ? icons.recipeActive : icons.recipe}
          style={styles.icon} // No longer need iconActive style for tintColor
        />
        <Text style={[styles.label, current === 'recipe' && styles.labelActive]}>
          {t('tab_recipe')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate(nav.addRecipe)}>
        <Image
          source={current === 'addrecipe' ? icons.rankActive : icons.rank}
          style={styles.icon} // No longer need iconActive style for tintColor
        />
        {/* Note: Your `current` prop for this tab in HomeScreen is 'addrecipe', but your label active check is 'rank'. 
            I've updated the label check to 'addrecipe' for consistency. */}
        <Text style={[styles.label, current === 'addrecipe' && styles.labelActive]}>
          {t('add_recipe')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tab} onPress={() => navigation.navigate(nav.profile)}>
        <Image
          source={current === 'profile' ? icons.profileActive : icons.profile}
          style={styles.icon} // No longer need iconActive style for tintColor
        />
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
    marginBottom: 2,
    // Removed tintColor here, as images will handle active state visually
  },
  // iconActive is no longer needed for tintColor directly on the image
  // It could be used for other styling if desired, but not for color tint.
  // iconActive: {
  //   // No tintColor anymore
  // },
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