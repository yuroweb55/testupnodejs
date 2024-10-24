const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const compression = require('compression');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(compression());


app.get('/ip', (req, res, next) => {
    if(req.ip){
        res.send(req.ip.replace("::ffff:", ""));
    }else{
        res.send('not')
    }
});

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
    console.log('Proxy server running on http://localhost:'+PORT);
});
