// src/App.jsx
import React, { memo, useEffect, useState } from 'react';
import axios from 'axios';
import { Container, TextField, Grid, Card, CardContent, Typography, CircularProgress } from '@mui/material';
import { useDebounce } from 'use-debounce';

const EmojiCard = memo(({ emoji }) => (
  <Card>
    <CardContent>
      <Typography variant="h4" align="center">{emoji.character}</Typography>
      <Typography variant="body2" align="center">{emoji.slug}</Typography>
    </CardContent>
  </Card>
));

const App = () => {
  const [emojis, setEmojis] = useState([]);
  const [filteredEmojis, setFilteredEmojis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  useEffect(() => {
    const fetchEmojis = async () => {
      try {
        const response = await axios.get('https://emoji-api.com/emojis?access_key=847365738d8e08d49b4849fcdeb4b79072a2df24');
        setEmojis(response.data);
        setFilteredEmojis(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching emojis:', err);
        setError('Failed to fetch emojis. Please check your network connection or the API.');
        setLoading(false);
      }
    };

    fetchEmojis();
  }, []);

  useEffect(() => {
    const results = emojis.filter((emoji) =>
      emoji.slug.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
    setFilteredEmojis(results);
  }, [debouncedSearchTerm, emojis]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', paddingTop: '50px' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ textAlign: 'center', paddingTop: '50px' }}>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ paddingTop: '20px' }}>
      <TextField
        fullWidth
        variant="outlined"
        label="Search Emojis"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ marginBottom: '20px' }}
      />
      <Grid container spacing={2}>
        {filteredEmojis.map((emoji) => (
          <Grid item xs={6} sm={4} md={3} key={emoji.slug}>
            <EmojiCard emoji={emoji} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default App;
