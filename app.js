
const express = require('express');
const compression = require('compression');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();


app.use(cors());
app.use(compression());

app.use(
    '/api58911022',
    createProxyMiddleware({
      target: 'http://58.9.110.22:27221/ywm/data/', 
      changeOrigin: true,
      onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['Cache-Control'] = 'public, max-age=31536000';
      },
    })
  );


const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
    console.log('Proxy server running on http://localhost:'+PORT);
});


setInterval(() => {
    fetch('https://testupnodejs-production.up.railway.app/')
        .then()
        .catch();
}, 30000);
