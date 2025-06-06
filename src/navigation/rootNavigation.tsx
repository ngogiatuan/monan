import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AddDishScreen from '../screens/AddDish/AddDishScreen';
import SettingsScreen from '../screens/Setting/SettingsScreen';
import NotificationScreen from '../screens/Notification/NotificationScreen';
import DeleteAccountScreen from '../screens/DeleteAccount/DeleteAccountScreen';
import LanguageScreen from '../screens/Language/LanguagueScreen';
import RecipeScreen from '../screens/Recipe/RecipeScreen';
import RankingScreen from '../screens/Ranking/RankingScreen';
import { nav } from './navigationName';
import OnBoardingScreen from '../screens/OnBoarding/OnBoardingScreen';
import AuthenScreen from '../screens/Authen/AuthenScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import RegisterScreen from '../screens/Register/RegisterScreen';
import ForgotPasswordScreen from '../screens/Forgot/ForgotPasswordScreen';
import ValidateEmailScreen from '../screens/Validate/ValidateEmailScreen';
import ResetPasswordScreen from '../screens/ResetPassword/ResetPasswordScreen';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowOnboarding(false);
    }, 5000); // 5 giây
    return () => clearTimeout(timeout);
  }, []);

  if (showOnboarding) {
    return <OnBoardingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={nav.authen} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={nav.authen} component={AuthenScreen} />
        <Stack.Screen name={nav.login} component={LoginScreen} />
        <Stack.Screen name={nav.register} component={RegisterScreen} />
        <Stack.Screen name={nav.profile} component={ProfileScreen} />
        <Stack.Screen name={nav.deleteAccount} component={DeleteAccountScreen} />
        <Stack.Screen name={nav.language} component={LanguageScreen} />
        <Stack.Screen name={nav.recipe} component={RecipeScreen} />
        <Stack.Screen name={nav.rank} component={RankingScreen} />
        <Stack.Screen name={nav.forgot} component={ForgotPasswordScreen} />
        <Stack.Screen name={nav.validate} component={ValidateEmailScreen} />
        <Stack.Screen name={nav.resetPassword} component={ResetPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default RootNavigation;