const express = require('express');
const request = require('request');
const cors = require('cors');
const app = express();

const port = process.env.PORT || 3000;

app.use(cors());

app.get('/proxy', (req, res) => {
  const url = req.query.url;
  try {
    if (!url) {
      res.status(400).send('URL is required');
      return;
    }

    request(url)
      .on('response', function(response) {
        // Set CORS headers in the response
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

        // Pipe the response from the requested URL to the original response
        response.pipe(res);
      })
      .on('error', function(error) {
        console.error(error);
        res.status(501).json({ error: error.message });
      });
  } catch (error) {
    console.error(error);
    res.status(501).json({ error });
  }
});


app.listen(port, () => {
  console.log('Proxy server running on 0001 port '+port);
});
