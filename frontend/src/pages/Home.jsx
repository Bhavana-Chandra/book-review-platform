import { Box, Typography, Container, Grid } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedBooks } from '../store/slices/bookSlice';
import { Link } from 'react-router-dom';

function Home() {
  const dispatch = useDispatch();
  const { featuredBooks, loading } = useSelector((state) => state.books);

  useEffect(() => {
    dispatch(fetchFeaturedBooks());
  }, [dispatch]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to Book Review
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center" color="text.secondary">
          Discover, Review, and Share Your Favorite Books
        </Typography>
      </Box>

      <Box sx={{ mt: 6 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Featured Books
        </Typography>
        <Grid container spacing={4}>
          {loading ? (
            <Typography>Loading featured books...</Typography>
          ) : (
            featuredBooks?.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Link to={`/books/${book._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <Box sx={{ border: 1, borderRadius: 2, p: 2, minHeight: 300, transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 6 } }}>
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8, marginBottom: 8 }}
                    />
                    <Typography variant="h6" gutterBottom>{book.title}</Typography>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      by {book.author}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {book.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Genre: {book.genre} | Year: {book.publishedYear}
                    </Typography>
                  </Box>
                </Link>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default Home;