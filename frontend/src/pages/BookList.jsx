import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CardActionArea
} from '@mui/material';
import { fetchBooks } from '../store/slices/bookSlice';

function BookList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { books, loading } = useSelector((state) => state.books);
  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('all');

  useEffect(() => {
    dispatch(fetchBooks({ page: 1, limit: 50 }));
  }, [dispatch]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenreChange = (event) => {
    setGenre(event.target.value);
  };

  const allGenres = Array.from(new Set(books?.map((book) => book.genre))).filter(Boolean);

  const filteredBooks = books?.filter((book) => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = genre === 'all' || (genre === 'Featured' ? book.isFeatured : book.genre === genre);
    return matchesSearch && matchesGenre;
  });

  const handleBookClick = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Browse Books
        </Typography>

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search books"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by title or author"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                value={genre}
                label="Genre"
                onChange={handleGenreChange}
              >
                <MenuItem value="all">All Genres</MenuItem>
                <MenuItem value="Featured">Featured</MenuItem>
                {allGenres.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {loading ? (
          <Typography>Loading books...</Typography>
        ) : (
          <Grid container spacing={4}>
            {filteredBooks?.map((book) => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Card>
                  <CardActionArea onClick={() => handleBookClick(book._id)}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={book.coverImage}
                      alt={book.title}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h6" component="div">
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        by {book.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Genre: {book.genre}
                      </Typography>
                      {book.isFeatured && (
                        <Typography variant="caption" color="primary">
                          Featured
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}

export default BookList;