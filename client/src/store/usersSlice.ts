import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserProfile {
  id: string;
  username: string;
  name: string;
  email: string;
  bio?: string;
  avatar?: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  joinedDate: string;
  followers: number;
  following: number;
  totalViews: number;
  totalLikes: number;
  articlesCount: number;
  achievements: string[];
  skills: string[];
  isVerified: boolean;
  profession?: string;
  company?: string;
  age?: number;
  gender?: string;
}

interface UsersState {
  profiles: Record<string, UserProfile>;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  profiles: {},
  loading: false,
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<UserProfile>) => {
      state.profiles[action.payload.id] = action.payload;
    },
    setProfiles: (state, action: PayloadAction<UserProfile[]>) => {
      action.payload.forEach(profile => {
        state.profiles[profile.id] = profile;
      });
    },
    updateProfile: (state, action: PayloadAction<{ id: string; updates: Partial<UserProfile> }>) => {
      if (state.profiles[action.payload.id]) {
        state.profiles[action.payload.id] = {
          ...state.profiles[action.payload.id],
          ...action.payload.updates,
        };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setProfile, setProfiles, updateProfile, setLoading, setError } = usersSlice.actions;
export default usersSlice.reducer;