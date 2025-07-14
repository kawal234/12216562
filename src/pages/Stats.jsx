import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, CircularProgress } from '@mui/material';
import { fetchStats } from '../api';
import Log from '../services/logger';

function Stats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function getStats() {
      try {
        const data = await fetchStats();
        setStats(data.urls || []);
        Log('frontend', 'info', 'middleware', 'Fetched stats successfully');
      } catch (err) {
        setError('Failed to fetch stats');
        Log('frontend', 'error', 'middleware', `Stats fetch error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    getStats();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Shortened URLs & Stats</Typography>
      {stats.length === 0 ? (
        <Typography>No URLs found.</Typography>
      ) : (
        stats.map((url, idx) => (
          <Box key={idx} mb={2}>
            <Typography>Short URL: <a href={url.shortUrl} target="_blank" rel="noopener noreferrer">{url.shortUrl}</a></Typography>
            <Typography variant="body2">Original: {url.originalUrl}</Typography>
            <Typography variant="body2">Created: {url.createdAt}</Typography>
            <Typography variant="body2">Expires: {url.expiry}</Typography>
            <Typography variant="body2">Clicks: {url.clicks.length}</Typography>
            {url.clicks && url.clicks.length > 0 && (
              <Box ml={2} mt={1}>
                <Typography variant="subtitle2">Click Details:</Typography>
                {url.clicks.map((click, i) => (
                  <Typography key={i} variant="body2">
                    {click.time} - {click.location} - {click.source}
                  </Typography>
                ))}
              </Box>
            )}
          </Box>
        ))
      )}
    </Paper>
  );
}

export default Stats; 