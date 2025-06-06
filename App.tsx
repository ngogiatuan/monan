/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaView} from 'react-native-safe-area-context';

import RootNavigation from './src/navigation/rootNavigation';
import { UserProvider } from './src/context/UserContext';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <SafeAreaView style={{flex: 1}}>
          <UserProvider>
            <RootNavigation />
          </UserProvider>
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
