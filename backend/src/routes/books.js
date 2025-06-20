import express from 'express';
import { body, query, param } from 'express-validator';
import Book from '../models/Book.js';
import { validateRequest, isAdmin, authenticate } from '../middleware/auth.js';

const router = express.Router();

// GET /books - Retrieve all books (with pagination)
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 50 }),
  query('genre').optional().isString(),
  query('search').optional().isString(),
  validateRequest
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    let query = {};
    
    // Apply filters
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { author: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    const [books, total] = await Promise.all([
      Book.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Book.countDocuments(query)
    ]);
    
    res.json({
      books,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalBooks: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
});

// GET /books/:id - Retrieve a specific book
router.get('/:id', [
  param('id').isMongoId(),
  validateRequest
], async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching book', error: error.message });
  }
});

// POST /books - Add a new book (admin only)
router.post('/', [
  authenticate,
  isAdmin,
  body('title').trim().notEmpty(),
  body('author').trim().notEmpty(),
  body('description').trim().notEmpty(),
  body('coverImage').trim().isURL(),
  body('genre').trim().notEmpty(),
  body('publishedYear').isInt({ min: 1000, max: new Date().getFullYear() }),
  validateRequest
], async (req, res) => {
  try {
    const newBook = new Book(req.body);
    await newBook.save();
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ message: 'Error creating book', error: error.message });
  }
});

// GET /books/featured - Get featured books
router.get('/featured/list', async (req, res) => {
  try {
    const featuredBooks = await Book.find({ isFeatured: true })
      .limit(6)
      .sort({ averageRating: -1 });
    res.json(featuredBooks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured books', error: error.message });
  }
});

export default router;