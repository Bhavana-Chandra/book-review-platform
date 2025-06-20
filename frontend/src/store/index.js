import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bookReducer from './slices/bookSlice';
import reviewReducer from './slices/reviewSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    reviews: reviewReducer
  }
});

export default store;