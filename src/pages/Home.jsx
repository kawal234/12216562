import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Grid, Paper } from '@mui/material';
import { shortenUrl } from '../api';
import Log from '../services/logger';

const defaultValidity = 30; // minutes

function Home() {
  const [urls, setUrls] = useState(['']);
  const [shortcodes, setShortcodes] = useState(['']);
  const [validities, setValidities] = useState(['']);
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (idx, value, setter, arr) => {
    const copy = [...arr];
    copy[idx] = value;
    setter(copy);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, '']);
      setShortcodes([...shortcodes, '']);
      setValidities([...validities, '']);
    }
  };

  const removeUrlField = idx => {
    setUrls(urls.filter((_, i) => i !== idx));
    setShortcodes(shortcodes.filter((_, i) => i !== idx));
    setValidities(validities.filter((_, i) => i !== idx));
  };

  const validateUrl = url => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setResults([]);
    // Validate
    for (let i = 0; i < urls.length; i++) {
      if (!urls[i] || !validateUrl(urls[i])) {
        setError(`Invalid URL at row ${i + 1}`);
        Log('frontend', 'error', 'middleware', `Invalid URL at row ${i + 1}: ${urls[i]}`);
        return;
      }
      if (shortcodes[i] && !/^[a-zA-Z0-9_-]+$/.test(shortcodes[i])) {
        setError(`Invalid shortcode at row ${i + 1}`);
        Log('frontend', 'error', 'middleware', `Invalid shortcode at row ${i + 1}: ${shortcodes[i]}`);
        return;
      }
    }
    // Prepare data
    const data = urls.map((url, i) => ({
      url,
      shortcode: shortcodes[i] || undefined,
      validity: validities[i] ? parseInt(validities[i]) : defaultValidity
    }));
    try {
      const response = await shortenUrl({ urls: data });
      setResults(response.results || []);
      Log('frontend', 'info', 'middleware', `Shorten attempt for ${urls.length} URLs, response status ${response.status || 'unknown'}`);
    } catch (err) {
      setError('Failed to shorten URLs');
      Log('frontend', 'error', 'middleware', `Shorten error: ${err.message}`);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Shorten URLs</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {urls.map((url, idx) => (
            <React.Fragment key={idx}>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Long URL"
                  value={url}
                  onChange={e => handleInputChange(idx, e.target.value, setUrls, urls)}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Shortcode (optional)"
                  value={shortcodes[idx]}
                  onChange={e => handleInputChange(idx, e.target.value, setShortcodes, shortcodes)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Validity (min)"
                  type="number"
                  value={validities[idx]}
                  onChange={e => handleInputChange(idx, e.target.value, setValidities, validities)}
                  fullWidth
                  placeholder={defaultValidity}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                {urls.length > 1 && (
                  <Button color="error" onClick={() => removeUrlField(idx)}>Remove</Button>
                )}
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
        <Box mt={2}>
          {urls.length < 5 && (
            <Button onClick={addUrlField}>Add URL</Button>
          )}
        </Box>
        <Box mt={2}>
          <Button type="submit" variant="contained">Shorten</Button>
        </Box>
      </form>
      {error && <Typography color="error" mt={2}>{error}</Typography>}
      {results.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6">Results</Typography>
          {results.map((res, i) => (
            <Box key={i} mb={1}>
              <Typography>Short URL: <a href={res.shortUrl} target="_blank" rel="noopener noreferrer">{res.shortUrl}</a></Typography>
              <Typography variant="body2">Original: {res.originalUrl}</Typography>
              <Typography variant="body2">Expires: {res.expiry}</Typography>
            </Box>
          ))}
        </Box>
      )}
    </Paper>
  );
}

export default Home; 