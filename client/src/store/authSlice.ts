import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, LoginData } from '@shared/schema';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  following: string[];
  error: string | null;
  loading: boolean;
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
      loading: false,
    };

// Helper function to get stored users
const getStoredUsers = (): Record<string, User> => {
  const stored = localStorage.getItem('users');
  if (stored) {
    const users = JSON.parse(stored);
    // Convert string dates back to Date objects
    Object.keys(users).forEach(email => {
      if (users[email].createdAt) {
        users[email].createdAt = new Date(users[email].createdAt);
      }
    });
    return users;
  }
  
  // Return default mock users if no stored users exist
  return {
    'sarah.chen@example.com': {
      id: 'user-1',
      username: 'sarahchen',
      email: 'sarah.chen@example.com',
      password: 'password123',
      bio: 'Passionate frontend developer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b29c?w=150&h=150&fit=crop&crop=face',
      location: 'San Francisco, CA',
      website: 'https://sarahchen.dev',
      createdAt: new Date('2022-03-15'),
    },
    'michael.rodriguez@example.com': {
      id: 'user-2',
      username: 'michaelr',
      email: 'michael.rodriguez@example.com',
      password: 'password123',
      bio: 'Fullstack developer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'New York, NY',
      website: 'https://michaelr.dev',
      createdAt: new Date('2021-08-15'),
    },
    'alex.kim@example.com': {
      id: 'user-3',
      username: 'alexkim',
      email: 'alex.kim@example.com',
      password: 'password123',
      bio: 'Frontend specialist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      location: 'Seattle, WA',
      website: 'https://alexkim.dev',
      createdAt: new Date('2023-01-10'),
    },
    'john.doe@example.com': {
      id: 'user-4',
      username: 'johndoe',
      email: 'john.doe@example.com',
      password: 'password123',
      bio: 'Senior Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      location: 'New York, NY',
      website: 'https://johndoe.dev',
      createdAt: new Date('2021-08-15'),
    },
  };
};

// Helper function to store users
const storeUsers = (users: Record<string, User>) => {
  localStorage.setItem('users', JSON.stringify(users));
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      // Get stored users
      const users = getStoredUsers();
      
      const user = users[loginData.email];
      
      if (!user || user.password !== loginData.password) {
        throw new Error('Invalid email or password');
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return user data and mock token
      return {
        user: { ...user, password: undefined }, // Don't include password in state
        token: `mock-token-${user.id}`,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (registerData: { username: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      // Get stored users
      const users = getStoredUsers();
      
      // Check if user already exists
      if (users[registerData.email]) {
        throw new Error('User with this email already exists');
      }
      
      // Check if username is already taken
      const existingUser = Object.values(users).find(user => user.username === registerData.username);
      if (existingUser) {
        throw new Error('Username is already taken');
      }
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create a new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        username: registerData.username,
        email: registerData.email,
        password: registerData.password,
        bio: null,
        avatar: null,
        location: null,
        website: null,
        createdAt: new Date(),
      };

      // Store the new user
      users[registerData.email] = newUser;
      storeUsers(users);

      // Return user data and mock token
      return {
        user: { ...newUser, password: undefined }, // Don't include password in state
        token: `mock-token-${newUser.id}`,
      };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

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
      state.loading = false;
      persistState(state);
      // Note: We don't clear users from localStorage on logout
      // as other users might still need to login
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
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        persistState(state);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        persistState(state);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
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
