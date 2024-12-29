const express = require('express');
const compression = require('compression');
const cors = require('cors');
const https = require('https');
const ytdl = require('@distube/ytdl-core');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();


app.use(cors());
app.use(compression());

app.use(
    '/api58911022',
    createProxyMiddleware({
      target: 'http://yuro09472.trueddns.com:27221/ywm/data/', 
      changeOrigin: true,
      onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['Cache-Control'] = 'public, max-age=31536000';
      },
    })
  );

app.get('/runvideo', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id) {
            return res.status(400).json({ error: 'กรุณาระบุ ID ของวิดีโอ' });
        }
        const info = await ytdl.getInfo(id);
        const formats = info.formats || [];
        
        let vidF = formats.filter(format => format.qualityLabel === '360p') || 
                          formats.filter(format => format.qualityLabel === '240p');
        if (!vidF) {
            return res.json({ url: 'not' });
        }
        if (req.aborted) {
            return;
        }
        res.json({ url: vidF[vidF.length-1].url || 'not' });
    } catch (error) {
        console.error('Error while fetching video info:', error.message || error);
        res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
    }
});




app.get('/httpsvideo', (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'Video URL is required' });
    }

    try {
        const decodedUrl = decodeURIComponent(videoUrl);
        const range = req.headers.range || 'bytes=0-';

        const headers = {
            'accept': '*/*',
            'accept-language': 'th',
            'range': range,
            'referer': 'https://www.youtube.com/',
            'referrer-policy': 'strict-origin-when-cross-origin',
        };

        https.get(decodedUrl, { headers }, (videoRes) => {
            const { statusCode, headers: videoHeaders } = videoRes;

            if (statusCode >= 200 && statusCode < 300) {
                res.writeHead(statusCode, {
                    'Content-Range': videoHeaders['content-range'] || '',
                    'Accept-Ranges': 'bytes',
                    'Content-Type': videoHeaders['content-type'] || 'application/octet-stream',
                    'Cache-Control': 'public, max-age=31536000',
                    'Connection': 'keep-alive',
                });

                // ส่งข้อมูลไปยัง client
                videoRes.pipe(res, { end: true });
            } else {
                res.status(statusCode).send('Failed to fetch video');
            }
        }).on('error', (err) => {
            console.error('Error fetching video:', err.message);
            res.status(502).json({ error: 'Failed to fetch video' });
        });
    } catch (error) {
        console.error('Unexpected error:', error.message);
        res.status(500).json({ error: 'Unexpected server error' });
    }
});




const PORT = process.env.PORT || 3500;

app.listen(PORT, () => {
    console.log('Proxy server running on http://localhost:'+PORT);
});


setInterval(() => {
    fetch('https://apiyw2.onrender.com/')
        .then()
        .catch();
}, 5000);