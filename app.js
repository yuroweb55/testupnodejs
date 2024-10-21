const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();

const port = process.env.PORT || 3000;
app.use(cors());
app.get('/proxy', (req, res) => {
  const url = req.query.url;
  if (!url) {
    res.status(400).send('URL is required');
    return;
  }

  request({
    url: url,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }).pipe(res);
});

app.listen(port, () => {
  console.log('Proxy server running on port '+port);
});
