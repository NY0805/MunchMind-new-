const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.get('/api/restaurant-photo', async (req, res) => {
  const { name, location } = req.query;

  try {
    const searchRes = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: `${name} ${location}`,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
    });

    const place = searchRes.data.results[0];
    const photoRef = place?.photos?.[0]?.photo_reference;

    if (!photoRef) {
      return res.status(404).json({ error: 'No photo found' });
    }

    const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoRef}&key=${process.env.GOOGLE_MAPS_API_KEY}`;

    res.json({ imageUrl });
  } catch (error) {
    console.error('Google Maps error:', error.message);
    res.status(500).json({ error: 'Failed to get photo reference' });
  }
});

