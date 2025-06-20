import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks for review actions
export const fetchBookReviews = createAsyncThunk(
  'reviews/fetchBookReviews',
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/reviews/book/${bookId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async ({ bookId, rating, reviewText }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/reviews',
        { book: bookId, rating, reviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, rating, reviewText }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/reviews/${reviewId}`,
        { rating, reviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return reviewId;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  success: false
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviewStatus: (state) => {
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Book Reviews
      .addCase(fetchBookReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchBookReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch reviews';
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews.unshift(action.payload);
        state.success = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to create review';
        state.success = false;
      })
      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.reviews.findIndex(review => review._id === action.payload._id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
        state.success = true;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update review';
        state.success = false;
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = state.reviews.filter(review => review._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete review';
        state.success = false;
      });
  }
});

export const { clearReviewStatus } = reviewSlice.actions;
export default reviewSlice.reducer;