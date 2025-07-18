const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const SHARED_SECRET = process.env.COINBASE_SECRET;

// Middleware to parse raw body
app.use(bodyParser.json({ verify: (req, res, buf) => {
    req.rawBody = buf;
}}));

app.post('/coinbase', (req, res) => {
    const signature = req.headers['x-cc-webhook-signature'];
    const hmac = crypto.createHmac('sha256', SHARED_SECRET);
    hmac.update(req.rawBody);
    const expectedSig = hmac.digest('hex');

    if (signature !== expectedSig) {
        console.log('Invalid webhook signature');
        return res.status(400).send('Invalid signature');
    }

    const event = req.body.event;
    console.log('Webhook received:', event.type);

    // You can handle event types here
    if (event.type === 'charge:confirmed') {
        console.log('Payment confirmed for:', event.data.code);
        // Add your logic here
    }

    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.send('Velvet Webhook is running 🚀');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

