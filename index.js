const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3000;
const SHARED_SECRET = process.env.SHARED_SECRET;

app.use(bodyParser.raw({ type: 'application/json' }));

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-cc-webhook-signature'];
  const payload = req.body;

  const hmac = crypto.createHmac('sha256', SHARED_SECRET);
  hmac.update(payload);
  const digest = hmac.digest('hex');

  if (digest !== signature) {
    return res.status(400).send('Invalid signature');
  }

  const data = JSON.parse(payload);
  console.log('✅ Webhook received:', data);

  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
