import {createSlice} from '@reduxjs/toolkit';

export interface UserState {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

const initialState: UserState = {
  user: null,
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: state => {
      state.user = null;
    },
  },
});
export const {setUser, clearUser} = userSlice.actions;
export const userReducer = userSlice.reducer;
