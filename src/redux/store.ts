import {configureStore} from '@reduxjs/toolkit';
import {PersistConfig, persistStore} from 'redux-persist';
import {userReducer} from './slice/user.slice';
import persistReducer from 'redux-persist/es/persistReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

const persistConfigUser: PersistConfig<ReturnType<typeof userReducer>> = {
  key: 'user',
  storage: AsyncStorage,
  stateReconciler: autoMergeLevel2,
};

export const store = configureStore({
  reducer: {
    user: persistReducer(persistConfigUser, userReducer),
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export const persistor = persistStore(store);
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
