import express from 'express';
import { body, param } from 'express-validator';
import Review from '../models/Review.js';
import { validateRequest, authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /reviews - Retrieve reviews for a book
router.get('/book/:bookId', [
  param('bookId').isMongoId(),
  validateRequest
], async (req, res) => {
  try {
    const reviews = await Review.find({ book: req.params.bookId })
      .populate('user', 'username profilePicture')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
});

// POST /reviews - Submit a new review
router.post('/', [
  authenticate,
  body('book').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('reviewText').trim().isLength({ min: 10 }),
  validateRequest
], async (req, res) => {
  try {
    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      book: req.body.book,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const newReview = new Review({
      ...req.body,
      user: req.user._id
    });

    await newReview.save();

    const populatedReview = await Review.findById(newReview._id)
      .populate('user', 'username profilePicture');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error creating review', error: error.message });
  }
});

// PUT /reviews/:id - Update a review
router.put('/:id', [
  authenticate,
  param('id').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('reviewText').trim().isLength({ min: 10 }),
  validateRequest
], async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = req.body.rating;
    review.reviewText = req.body.reviewText;
    review.updatedAt = Date.now();

    await review.save();

    const updatedReview = await Review.findById(review._id)
      .populate('user', 'username profilePicture');

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review', error: error.message });
  }
});

// DELETE /reviews/:id - Delete a review
router.delete('/:id', [
  authenticate,
  param('id').isMongoId(),
  validateRequest
], async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review', error: error.message });
  }
});

export default router;