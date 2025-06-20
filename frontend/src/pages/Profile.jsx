import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Box,
  Typography,
  Avatar,
  Grid,
  Paper,
  Button,
  TextField,
  Divider,
  Card,
  CardContent,
  Rating
} from '@mui/material';
import { updateProfile } from '../store/slices/authSlice';

function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(formData));
    setIsEditing(false);
  };

  if (!user) {
    return <Typography>Loading profile...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={user.profilePicture}
              alt={user.username}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            {isEditing ? (
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="username"
                  label="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  name="bio"
                  label="Bio"
                  multiline
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                />
                <Box sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained" sx={{ mr: 1 }}>
                    Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6">{user.username}</Typography>
                <Typography color="text.secondary" gutterBottom>
                  {user.email}
                </Typography>
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {user.bio || 'No bio added yet'}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => setIsEditing(true)}
                  sx={{ mt: 2 }}
                >
                  Edit Profile
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Typography variant="h5" gutterBottom>
            My Reviews
          </Typography>
          <Divider sx={{ mb: 2 }} />

          {user.reviews?.map((review) => (
            <Card key={review.id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {review.book.title}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={review.rating} readOnly />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </Typography>
                </Box>
                <Typography variant="body1">{review.comment}</Typography>
              </CardContent>
            </Card>
          ))}

          {(!user.reviews || user.reviews.length === 0) && (
            <Typography color="text.secondary">
              You haven't written any reviews yet.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default Profile;