import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const OnBoardingScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assert/image/Logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 260,
    height: 260,
  },
});

export default OnBoardingScreen;
