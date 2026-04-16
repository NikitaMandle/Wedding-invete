// api/chat.js — Vercel Serverless Function
// GROQ_API_KEY is set in Vercel Dashboard > Project Settings > Environment Variables
// It is NEVER sent to the browser.

const SYSTEM_PROMPT = `You are a friendly wedding assistant for Nikhil and Prachi's wedding. Answer warmly and briefly. Wedding details: Couple: Nikhil & Prachi. Date: 10 May 2026. Events: 1) Mehndi - 8 May 2026, 4PM, Sweta Lawn Nigdi Pune, Yellow/Green dress. 2) Sangeet - 9 May 2026, 7PM, Sweta Lawn Nigdi Pune, Cocktail/Festive dress. 3) Wedding - 10 May 2026, 11AM, Sweta Lawn Nigdi Pune, Traditional/Formal dress. 4) Reception - 10 May 2026, 7PM, Sweta Lawn Nigdi Pune, Ethnic/Formal dress. Venue: Sweta Lawn, Mata Amritanandamayi Math, Nigdi, Pune 411044. Story: 2021 journey began, 2023 proposal, 2026 wedding. RSVP: fill form on website. Keep answers short and warm.`;

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: 'No message provided' });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: message }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Chat error:', err);
    return res.status(500).json({ error: 'Failed to get response' });
  }
}
