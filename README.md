# URL Shortener React App

A React app to shorten up to 5 URLs at once, with optional shortcode and validity, stats page, and integrated logging middleware.

## Features
- Shorten up to 5 URLs at once
- Optional shortcode and validity period (default 30 min)
- View stats for all shortened URLs
- Material UI for all UI
- Logging middleware sends logs to remote server with Authorization token

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set your access token in `.env`:
   ```env
   REACT_APP_ACCESS_TOKEN=your_access_token_here
   ```
3. Start the app:
   ```bash
   npm start
   ```

## Logging
- All user actions (shorten, errors, stats) are logged to the remote server using the logger middleware in `src/services/logger.js`.
- The Authorization token is read from the `.env` file.

## Tech Stack
- React
- Material UI
- React Router 