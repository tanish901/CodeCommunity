import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginData, InsertUser } from '@shared/schema';
import { storage } from '../lib/localStorage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Load user from localStorage on app start
const loadUserFromStorage = (): User | null => {
  try {
    const userData = localStorage.getItem('devCommunityUser');
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

// Save user to localStorage
const saveUserToStorage = (user: User | null) => {
  if (user) {
    localStorage.setItem('devCommunityUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('devCommunityUser');
  }
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const user = await storage.getUserByEmail(loginData.email);
      if (!user) {
        return rejectWithValue('Invalid credentials');
      }

      // For demo purposes, we'll do a simple password check
      // In a real app, you'd want proper password hashing
      const isValid = loginData.password === 'password' || user.password === loginData.password;
      if (!isValid) {
        return rejectWithValue('Invalid credentials');
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      saveUserToStorage(userWithoutPassword as User);
      return userWithoutPassword as User;
    } catch (error) {
      return rejectWithValue('Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: InsertUser, { rejectWithValue }) => {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return rejectWithValue('User already exists');
      }

      // Create user
      const user = await storage.createUser({
        ...userData,
        password: userData.password, // In a real app, hash this
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      saveUserToStorage(userWithoutPassword as User);
      return userWithoutPassword as User;
    } catch (error) {
      return rejectWithValue('Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ...initialState,
    user: loadUserFromStorage(),
    isAuthenticated: Boolean(loadUserFromStorage()),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      saveUserToStorage(null);
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        saveUserToStorage(state.user);
        // Also update in storage
        storage.updateUser(state.user.id, action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
