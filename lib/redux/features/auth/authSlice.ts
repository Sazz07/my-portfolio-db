import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

type User = {
  id: string;
  email: string;
  role: string;
} | null;

type AuthState = {
  user: User;
  accessToken: string | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user: User }>
    ) => {
      const { accessToken, user } = action.payload;

      state.accessToken = accessToken;
      state.user = user;
      state.isAuthenticated = true;
    },
    updateToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;

      if (!state.user && action.payload) {
        try {
          const decoded: {
            userId: string;
            email: string;
            role: string;
          } = jwtDecode(action.payload);
          if (decoded) {
            state.user = {
              id: decoded.userId,
              email: decoded.email,
              role: decoded.role,
            };
          }
        } catch (error) {
          console.error('Failed to decode token:', error);
        }
      }
    },
    logOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, updateToken, logOut } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.accessToken;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
