const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const compression = require('compression');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(compression());


app.use('/', createProxyMiddleware({
    target: 'https://youtube.com',
    changeOrigin: true,
}));

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
    console.log('Proxy server running on http://localhost:'+PORT);
});
