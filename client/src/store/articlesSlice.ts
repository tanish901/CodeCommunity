import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ArticleWithAuthor, Article, InsertArticle } from '@shared/schema';

interface ArticlesState {
  articles: ArticleWithAuthor[];
  currentArticle: ArticleWithAuthor | null;
  loading: boolean;
  error: string | null;
  filter: 'relevant' | 'latest' | 'top';
  searchQuery: string;
  selectedTag: string | null;
}

const initialState: ArticlesState = {
  articles: [],
  currentArticle: null,
  loading: false,
  error: null,
  filter: 'relevant',
  searchQuery: '',
  selectedTag: null,
};

export const fetchArticles = createAsyncThunk(
  'articles/fetchArticles',
  async (params: { search?: string; tag?: string; published?: boolean; authorId?: string } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params?.search) queryParams.append('search', params.search);
      if (params?.tag) queryParams.append('tag', params.tag);
      if (params?.published !== undefined) queryParams.append('published', params.published.toString());
      if (params?.authorId) queryParams.append('authorId', params.authorId);

      const response = await fetch(`/api/articles?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch articles');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to load articles');
    }
  }
);

export const fetchArticle = createAsyncThunk(
  'articles/fetchArticle',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/articles/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to load article');
    }
  }
);

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (articleData: InsertArticle, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(articleData),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue('Failed to create article');
    }
  }
);

export const toggleLike = createAsyncThunk(
  'articles/toggleLike',
  async ({ articleId, userId }: { articleId: string; userId: string }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/articles/${articleId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const result = await response.json();
      return { articleId, ...result };
    } catch (error) {
      return rejectWithValue('Failed to toggle like');
    }
  }
);

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<'relevant' | 'latest' | 'top'>) => {
      state.filter = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSelectedTag: (state, action: PayloadAction<string | null>) => {
      state.selectedTag = action.payload;
    },
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch articles cases
      .addCase(fetchArticles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading = false;
        state.articles = action.payload;
        state.error = null;
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch article cases
      .addCase(fetchArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.currentArticle = action.payload;
        state.error = null;
      })
      .addCase(fetchArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create article cases
      .addCase(createArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle like cases
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { articleId, liked, likesCount } = action.payload;
        
        // Update articles list
        const articleIndex = state.articles.findIndex(a => a.id === articleId);
        if (articleIndex !== -1) {
          state.articles[articleIndex].likes = likesCount;
          state.articles[articleIndex].isLiked = liked;
        }
        
        // Update current article
        if (state.currentArticle && state.currentArticle.id === articleId) {
          state.currentArticle.likes = likesCount;
          state.currentArticle.isLiked = liked;
        }
      });
  },
});

export const { setFilter, setSearchQuery, setSelectedTag, clearCurrentArticle, clearError } = articlesSlice.actions;
export default articlesSlice.reducer;
