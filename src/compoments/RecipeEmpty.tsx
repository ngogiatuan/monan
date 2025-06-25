import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import ButtonNavigation from './ButtonNavigation';
import { useTranslation } from 'react-i18next';

interface RecipeEmptyProps {
  onAddRecipe?: () => void;
  onExplore?: () => void;
  isConnected?: boolean;
  isGuest?: boolean;
}

const RecipeEmpty = ({ onAddRecipe, onExplore, isConnected, isGuest }: RecipeEmptyProps) => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Image source={require('../assert/image/fire.png')} style={styles.icon} resizeMode='contain' />
      <Text style={styles.text}>
        {onAddRecipe ? t('no_recipe') : t('no_quest')}
      </Text>
      {onAddRecipe ? (
        <ButtonNavigation
          title={t('add_my_recipe')}
          backgroundColor="#ff6f2c"
          color="#fff"
          style={styles.btn}
          textStyle={styles.btnText}
          onPress={onAddRecipe}
        />
      ) : onExplore ? (
        <ButtonNavigation
          title={t('explore_now')}
          backgroundColor="#ff6f2c"
          color="#fff"
          style={styles.btn}
          textStyle={styles.btnText}
          onPress={() => {
            if (isConnected === false) {
              Alert.alert(t('no_network'), t('turn_on_network_to_explore'));
              return;
            }
            if (isGuest) {
              Alert.alert(t('login_to_explore'));
              return;
            }
            onExplore && onExplore();
          }}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 60,
  },
  icon: {
    width: 48,
    height: 48,
    marginBottom: 18,
  },
  text: {
    color: '#888',
    fontSize: 15,
    marginBottom: 18,
  },
  btn: {
    borderRadius: 8,
    paddingHorizontal: 0,
    paddingVertical: 0,
    marginTop: 8,
    width: 200,
    alignSelf: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    paddingVertical: 12,
  },
});

export default RecipeEmpty;
