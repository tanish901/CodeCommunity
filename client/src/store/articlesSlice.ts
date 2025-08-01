import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ArticleWithAuthor, Article, InsertArticle } from '@shared/schema';
import { storage } from '../lib/localStorage';

interface ArticlesState {
  articles: ArticleWithAuthor[];
  currentArticle: ArticleWithAuthor | null;
  loading: boolean;
  error: string | null;
  filter: 'relevant' | 'latest' | 'top' | 'following';
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
      const articles = await storage.getArticles({
        search: params.search,
        tag: params.tag,
        published: params.published ?? true, // Default to published articles
        authorId: params.authorId,
      });

      return articles;
    } catch (error) {
      return rejectWithValue('Failed to load articles');
    }
  }
);

export const fetchArticle = createAsyncThunk(
  'articles/fetchArticle',
  async (id: string, { rejectWithValue }) => {
    try {
      const article = await storage.getArticle(id);
      
      if (!article) {
        return rejectWithValue('Article not found');
      }

      return article;
    } catch (error) {
      return rejectWithValue('Failed to load article');
    }
  }
);

export const createArticle = createAsyncThunk(
  'articles/createArticle',
  async (articleData: InsertArticle, { rejectWithValue }) => {
    try {
      const article = await storage.createArticle(articleData);
      return article;
    } catch (error) {
      return rejectWithValue('Failed to create article');
    }
  }
);

export const updateArticle = createAsyncThunk(
  'articles/updateArticle',
  async ({ id, updates }: { id: string; updates: Partial<Article> }, { rejectWithValue }) => {
    try {
      const article = await storage.updateArticle(id, updates);
      if (!article) {
        return rejectWithValue('Article not found');
      }
      return article;
    } catch (error) {
      return rejectWithValue('Failed to update article');
    }
  }
);

export const deleteArticle = createAsyncThunk(
  'articles/deleteArticle',
  async (id: string, { rejectWithValue }) => {
    try {
      const success = await storage.deleteArticle(id);
      if (!success) {
        return rejectWithValue('Article not found');
      }
      return id;
    } catch (error) {
      return rejectWithValue('Failed to delete article');
    }
  }
);

export const toggleLike = createAsyncThunk(
  'articles/toggleLike',
  async ({ articleId, userId }: { articleId: string; userId: string }, { rejectWithValue }) => {
    try {
      const result = await storage.toggleLike(userId, articleId);
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
      // Update article cases
      .addCase(updateArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading = false;
        // Update the article in the list if it exists
        const index = state.articles.findIndex((a: ArticleWithAuthor) => a.id === action.payload.id);
        if (index !== -1) {
          // We need to get the full article with author info
          // This is a simplification - in a real app you might want to refetch
          state.articles[index] = { ...state.articles[index], ...action.payload };
        }
        // Update current article if it's the same one
        if (state.currentArticle && state.currentArticle.id === action.payload.id) {
          state.currentArticle = { ...state.currentArticle, ...action.payload };
        }
        state.error = null;
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete article cases
      .addCase(deleteArticle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the article from the list
        state.articles = state.articles.filter((a: ArticleWithAuthor) => a.id !== action.payload);
        // Clear current article if it's the deleted one
        if (state.currentArticle && state.currentArticle.id === action.payload) {
          state.currentArticle = null;
        }
        state.error = null;
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Toggle like cases
      .addCase(toggleLike.fulfilled, (state, action) => {
        const { articleId, liked, likesCount } = action.payload;
        
        // Update articles list
        const articleIndex = state.articles.findIndex((a: ArticleWithAuthor) => a.id === articleId);
        if (articleIndex !== -1) {
          state.articles[articleIndex].likes = likesCount;
          // Note: We don't have isLiked in the schema, so we'll skip this
          // state.articles[articleIndex].isLiked = liked;
        }
        
        // Update current article
        if (state.currentArticle && state.currentArticle.id === articleId) {
          state.currentArticle.likes = likesCount;
          // state.currentArticle.isLiked = liked;
        }
      });
  },
});

export const { setFilter, setSearchQuery, setSelectedTag, clearCurrentArticle, clearError } = articlesSlice.actions;
export default articlesSlice.reducer;
