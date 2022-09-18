import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { client } from '../../graphql/api';
import { AuthState } from '../state/AuthState';

const initialState: AuthState = {
  user: undefined
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<
        | {
            email: string;
            id: string;
            displayName: string;
            accessToken: string;
          }
        | undefined
      >
    ) => {
      state.user = action.payload;
      if (action.payload?.id) {
        client.setHeader('x-hasura-user-id', action.payload?.id as string);
        client.setHeader(
          'Authorization',
          `Bearer ${action.payload?.accessToken}`
        );
      }
    },
    logout: (state) => {
      state.user = undefined;
    }
  }
});

export const { setUser, logout } = authSlice.actions;

export const selectUser = (state: any) => state.auth.user;

export default authSlice.reducer;
