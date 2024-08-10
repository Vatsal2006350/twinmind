const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = 3001;  // Make sure this doesn't conflict with your React app's port

app.use(cors());
app.use(express.json());

const API_KEY = 'O4Pjl1u1QLF99gdXA8bbifqZrV3kS8shJuZga7rgfMQ';
const API_URL = 'https://memory-api.vatsal-2cc.workers.dev/memory';

app.post('/api/memory', async (req, res) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.get('/api/memory/ask', async (req, res) => {
  try {
    const { query, user } = req.query;
    const url = `${API_URL}/ask?query=${encodeURIComponent(query)}&user=${encodeURIComponent(user)}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
