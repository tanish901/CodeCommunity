import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  following: string[];
  error: string | null;
}

// 🔃 Load state from localStorage (if it exists)
const storedAuth = localStorage.getItem('auth');
const initialState: AuthState = storedAuth
  ? JSON.parse(storedAuth)
  : {
      user: null,
      token: null,
      isAuthenticated: false,
      following: [],
      error: null,
    };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      persistState(state);
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      persistState(state);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.following = [];
      state.error = null;
      persistState(state);
    },
    followUser: (state, action: PayloadAction<string>) => {
      if (!state.following.includes(action.payload)) {
        state.following.push(action.payload);
        persistState(state);
      }
    },
    unfollowUser: (state, action: PayloadAction<string>) => {
      state.following = state.following.filter(id => id !== action.payload);
      persistState(state);
    },
    setFollowing: (state, action: PayloadAction<string[]>) => {
      state.following = action.payload;
      persistState(state);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      persistState(state);
    },
    clearError: (state) => {
      state.error = null;
      persistState(state);
    },
  },
});

// 🔐 Save updated state to localStorage
function persistState(state: AuthState) {
  localStorage.setItem('auth', JSON.stringify(state));
}

export const {
  setUser,
  setToken,
  logout,
  followUser,
  unfollowUser,
  setFollowing,
  setError,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
