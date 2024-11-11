const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const compression = require('compression');
const cors = require('cors');
const sharp = require('sharp');
const https = require('https');

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

app.get('/vimg', async (req, res,next) => {
    var url = req.query.u;
    if (url) {
        console.log(url);
        url=decodeURIComponent(url);
        

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                return res.status(response.statusCode).send('Error fetching');
            }

            // เก็บข้อมูลภาพใน memory แทนการเขียนลง disk
            const chunks = [];
            response.on('data', (chunk) => {
                chunks.push(chunk);
            });

            response.on('end', async () => {
                try {
                    const imageBuffer = Buffer.concat(chunks);
                    
                    // ใช้ sharp เพื่อบีบอัดภาพใน memory และแปลงเป็น WebP
                    const webpBuffer = await sharp(imageBuffer)
                        .webp({ quality: 60 })
                        .toBuffer();
                    
                    res.set('Content-Type', 'image/webp');
                    res.set('Cache-Control', 'public, max-age=3600'); // 1 ชั่วโมง
                    // ส่งภาพจาก memory โดยตรง
                    res.send(webpBuffer);
                    //res.send(imageBuffer);
                } catch (error) {
                    console.error("Error processing image: " + error.message);
                    res.status(500).send('Error processing image -');
                }
            });
        }).on('error', (err) => {
            console.error("Error downloading file: " + err.message);
            res.status(500).send('Error fetching');
        });
    } else {
        res.status(400).send('Error: URL parameter is required');
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

