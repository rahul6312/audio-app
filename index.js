const express = require('express');
const path = require('path');
const functions = require('firebase-functions');
const axios = require('axios');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

// API Key for GPT (use Firebase environment variables)
const apiKey = functions.config().gpt.apikey;

// Initialize Express app
const app = express();

// Middleware to parse JSON
app.use(express.json());
// app.use(cors());

// Serve static files from 'public' directory (Angular build)
app.use(express.static(path.join(__dirname, 'public')));

// Example API endpoint that calls GPT API
app.post('/api/get-data', async (req, res) => {
  console.log(req)
  const { prompt } = req.body;

  const updatedPrompt = `Imagine you are a Chartered Accountant (CA) advising a client who is looking to optimize their tax strategy for the upcoming fiscal year. ${prompt}`
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-3.5-turbo-instruct',
        prompt: updatedPrompt,
        max_tokens: 50,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );
    res.json(response.data.choices[0].text.trim());
  } catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// For all other routes, serve the Angular app (SPA handling)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });

// Export the app as Firebase Function
exports.app = functions.https.onRequest(app);
