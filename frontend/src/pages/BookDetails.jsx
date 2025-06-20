import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Box,
  Rating,
  Divider,
  Paper,
  Button,
  TextField
} from '@mui/material';
import { fetchBookDetails } from '../store/slices/bookSlice';
import { createReview } from '../store/slices/reviewSlice';

function BookDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBook, loading } = useSelector((state) => state.books);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookDetails(id));
    }
  }, [dispatch, id]);

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const reviewData = {
      bookId: id,
      rating: Number(formData.get('rating')),
      reviewText: formData.get('comment')
    };
    dispatch(createReview(reviewData));
    event.target.reset();
  };

  // TEMP: Hardcoded reviews for demo
  const hardcodedReviews = [
    {
      _id: '1',
      user: { username: 'alice' },
      rating: 5,
      comment: 'A timeless classic! Gatsby\'s story is both tragic and beautiful.',
      createdAt: '2024-05-01T10:00:00.000Z',
    },
    {
      _id: '2',
      user: { username: 'bob' },
      rating: 4,
      comment: 'Loved the writing style and the depiction of the Jazz Age.',
      createdAt: '2024-05-02T12:30:00.000Z',
    },
  ];

  if (loading) {
    return <Typography>Loading book details...</Typography>;
  }

  if (!currentBook) {
    return <Typography>Book not found</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="500"
              image={currentBook.coverImage}
              alt={currentBook.title}
            />
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" gutterBottom>
            {currentBook.title}
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            by {currentBook.author}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={currentBook.averageRating} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({currentBook.reviews?.length} reviews)
            </Typography>
          </Box>
          <Typography variant="body1" paragraph>
            {currentBook.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Genre: {currentBook.genre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Published: {new Date(currentBook.publishedDate).toLocaleDateString()}
          </Typography>

          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              Reviews
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {isAuthenticated && (
              <Paper sx={{ p: 2, mb: 3 }}>
                <form onSubmit={handleReviewSubmit}>
                  <Typography variant="h6" gutterBottom>
                    Write a Review
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography component="legend">Rating</Typography>
                    <Rating
                      name="rating"
                      defaultValue={5}
                      precision={0.5}
                    />
                  </Box>
                  <TextField
                    name="comment"
                    label="Your Review"
                    multiline
                    rows={4}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                  />
                  <Button type="submit" variant="contained" color="primary">
                    Submit Review
                  </Button>
                </form>
              </Paper>
            )}

            {/* Show reviews (hardcoded for now) */}
            {hardcodedReviews.map((review) => (
              <Paper key={review._id} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={review.rating} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    by {review.user?.username || 'Anonymous'}
                  </Typography>
                </Box>
                <Typography variant="body1">{review.comment}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default BookDetails;