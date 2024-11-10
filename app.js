const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const compression = require('compression');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(compression());


app.get('/ip', (req, res, next) => {
    if(req.ip){
        res.send(req.ip);
    }else{
        res.send('not')
    }
});

const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
    console.log('Proxy server running on http://localhost:'+PORT);
});

setInterval(() => {
    fetch('https://apiyw.onrender.com/')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response;
        })
        .catch(error => {
            console.error('Fetch failed:', error);
        });
}, 5000);

