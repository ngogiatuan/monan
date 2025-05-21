/* eslint-disable react-native/no-inline-styles */
import {Provider} from 'react-redux';
import {persistor, store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {SafeAreaView} from 'react-native-safe-area-context';
import RootNavigation from './src/navigation/rootNavigation';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <SafeAreaView style={{flex: 1}}>
          <RootNavigation />
        </SafeAreaView>
      </PersistGate>
    </Provider>
  );
};

export default App;
