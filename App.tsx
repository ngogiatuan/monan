/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { Provider } from 'react-redux';
import { persistor, store } from './src/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { SafeAreaView } from 'react-native-safe-area-context';

import RootNavigation from './src/navigation/rootNavigation';
import { UserProvider } from './src/context/UserContext';
import { addEventListener } from "@react-native-community/netinfo";
import { Alert, Linking, Text, View } from 'react-native';
import './src/locales/i18n'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {



  return (
    <GestureHandlerRootView style={{ flex: 1 }} >
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <BottomSheetModalProvider>
            <UserProvider>
              <SafeAreaView style={{ flex: 1 }}>
                <RootNavigation />
              </SafeAreaView>
            </UserProvider>
          </BottomSheetModalProvider>
        </PersistGate>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
