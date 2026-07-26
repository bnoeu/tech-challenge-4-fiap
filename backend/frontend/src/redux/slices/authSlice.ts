import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { authService } from '../../services/authService';
import type { AuthUser } from '../../types';

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: authService.getCurrentUser(),
  isAuthenticated: !!authService.getCurrentUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      authService.logout();
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
