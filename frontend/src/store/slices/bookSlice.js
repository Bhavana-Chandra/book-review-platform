import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for book actions
export const fetchBooks = createAsyncThunk(
  'books/fetchBooks',
  async ({ page = 1, limit = 10, genre = '', search = '' }, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/books', {
        params: { page, limit, genre, search }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchBookDetails = createAsyncThunk(
  'books/fetchBookDetails',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/books/${bookId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchFeaturedBooks = createAsyncThunk(
  'books/fetchFeaturedBooks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/books/featured/list');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  books: [],
  featuredBooks: [],
  currentBook: null,
  totalPages: 0,
  currentPage: 1,
  totalBooks: 0,
  loading: false,
  error: null
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    clearBookDetails: (state) => {
      state.currentBook = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload.books;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
        state.totalBooks = action.payload.totalBooks;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch books';
      })
      // Fetch Book Details
      .addCase(fetchBookDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch book details';
      })
      // Fetch Featured Books
      .addCase(fetchFeaturedBooks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturedBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.featuredBooks = action.payload;
      })
      .addCase(fetchFeaturedBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch featured books';
      });
  }
});

export const { clearBookDetails, clearError } = bookSlice.actions;
export default bookSlice.reducer;