const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
app.use(cors());

/**
 * HOME UI
 */
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html>
<head>
<title>Proxy</title>
<style>
body { font-family: Arial; background:#0f172a; color:white; display:flex; justify-content:center; align-items:center; height:100vh; }
.box { background:#111827; padding:30px; border-radius:12px; width:90%; max-width:500px; text-align:center; }
input { width:100%; padding:12px; margin:10px 0; border:none; border-radius:8px; }
button { width:100%; padding:12px; border:none; border-radius:8px; background:#38bdf8; cursor:pointer; font-weight:bold; }
</style>
</head>
<body>
<div class="box">
<h1>Web Proxy</h1>

<form onsubmit="
event.preventDefault();
let url = document.getElementById('u').value;
if(!url.startsWith('http')) url='https://'+url;
window.location.href='/browse?url='+encodeURIComponent(url);
">
<input id="u" placeholder="Enter URL (google.com)" />
<button type="submit">Go</button>
</form>

</div>
</body>
</html>
    `);
});

/**
 * HEALTH CHECK
 */
app.get('/health', (req, res) => {
    res.send('OK');
});

/**
 * PROXY
 */
app.use('/browse', (req, res, next) => {
    const targetUrl = req.query.url;

    if (!targetUrl) return res.status(400).send('Missing url');

    let parsed;
    try {
        parsed = new URL(targetUrl);
    } catch {
        return res.status(400).send('Invalid URL');
    }

    return createProxyMiddleware({
        target: parsed.origin,
        changeOrigin: true,
        secure: false,
        followRedirects: true,
        pathRewrite: () => parsed.pathname + parsed.search,
        onError(err, req, res) {
            res.status(500).send('Proxy error');
        }
    })(req, res, next);
});

/**
 * START SERVER
 */
const PORT = process.env.PORT;

app.listen(PORT, '0.0.0.0', () => {
    console.log('Running on', PORT);
});
