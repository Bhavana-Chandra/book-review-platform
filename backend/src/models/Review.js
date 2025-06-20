import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  reviewText: {
    type: String,
    required: true,
    trim: true,
    minlength: 10
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update book's average rating and review count when a review is added or modified
reviewSchema.post('save', async function() {
  const Review = this.constructor;
  const bookId = this.book;
  
  const stats = await Review.aggregate([
    { $match: { book: bookId } },
    {
      $group: {
        _id: '$book',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 }
      }
    }
  ]);

  await mongoose.model('Book').findByIdAndUpdate(bookId, {
    averageRating: stats[0]?.averageRating || 0,
    reviewCount: stats[0]?.reviewCount || 0
  });
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;