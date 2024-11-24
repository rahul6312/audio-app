const express = require('express');
const axios = require('axios');
const cors = require('cors');

const apiKey = process.env.API_KEY;

// Initialize Express app
const app = express();
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Example API endpoint that calls GPT API
app.post('/api/get-data', async (req, res) => {
  const { prompt } = req.body;
  console.log('Prompt is', prompt);

  let updatedPrompt = `${process.env.INITIAL_PROMPT} ${prompt}`;
  if (process.env.USE_HINDI) {
    updatedPrompt = `${updatedPrompt}. Give your responses in hindi`;
  }
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-3.5-turbo-instruct',
        prompt: updatedPrompt,
        max_tokens: parseInt(process.env.MAX_TOKENS),
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
    console.log(JSON.stringify(error));
    res.status(500).json({ error: 'Something went wrong' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on PORT: ${PORT}`);
});

