const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Velvet webhook server is live!');
});

app.post('/webhook', (req, res) => {
  console.log('Webhook received:', req.body);
  res.status(200).send('Webhook received');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
