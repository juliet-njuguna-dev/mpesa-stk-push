require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Generates a Safaricom access token
async function getAccessToken() {
  const auth = Buffer.from(
    `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
  ).toString('base64');

  const response = await axios.get(
    'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return response.data.access_token;
}

// Test route to confirm the token works
app.get('/token', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({ token });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to get token' });
  }
});

function getTimestamp() {
  const date = new Date();
  const pad = (n) => (n < 10 ? '0' + n : n);
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

app.post('/stkpush', async (req, res) => {
  try {
    const { phone, amount } = req.body;
    const token = await getAccessToken();
    const timestamp = getTimestamp();

    const password = Buffer.from(
      `${process.env.SHORTCODE}${process.env.PASSKEY}${timestamp}`
    ).toString('base64');

    const response = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: phone,
        PartyB: process.env.SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.CALLBACK_URL,
        AccountReference: 'STKPushTest',
        TransactionDesc: 'Payment test',
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'STK push failed' });
  }
});

// This is where Safaricom sends the result of the payment
app.post('/callback', (req, res) => {
  console.log('CALLBACK RECEIVED:', JSON.stringify(req.body, null, 2));
  res.status(200).json({ message: 'Callback received' });
});
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));