import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/Profile/ProfileScreen';
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
import HomeScreen from '../screens/homeScreen/HomeScreen';
import DiscoveryScreen from '../screens/Discovery/DiscoveryScreen';
import DetailScreen from '../screens/Detail/DetailScreen';
import ReviewScreen from '../screens/Review/ReviewScreen';
import TutorialCookingScreen from '../screens/TutorialCooking/TutorialCookingScreen';
import EndCookingScreen from '../screens/End/EndCookingScreen';
import BuyScreen from '../screens/Buy/BuyScreen';
import AddRecipeScreen from '../screens/AddRecipe/AddRecipeScreen';
import EditProfileScreen from '../screens/EditProfile/EditProfileScreen';
import SearchScreen from '../screens/Search/Searchscreen';

const Stack = createNativeStackNavigator();

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={nav.onboarding} screenOptions={{ headerShown: false }}>
        <Stack.Screen name={nav.onboarding} component={OnBoardingScreen} />
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
        <Stack.Screen name={nav.home} component={HomeScreen} />
        <Stack.Screen name={nav.discovery} component={DiscoveryScreen} />
        <Stack.Screen name={nav.detail} component={DetailScreen} />
        <Stack.Screen name={nav.review} component={ReviewScreen} />
        <Stack.Screen name={nav.tutorialCooking} component={TutorialCookingScreen} />
        <Stack.Screen name={nav.endCooking} component={EndCookingScreen} />
        <Stack.Screen name={nav.buy} component={BuyScreen} />
        <Stack.Screen name={nav.addRecipe} component={AddRecipeScreen} />
        <Stack.Screen name={nav.editProfile} component={EditProfileScreen} />
         <Stack.Screen name={nav.search} component={SearchScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default RootNavigation;
