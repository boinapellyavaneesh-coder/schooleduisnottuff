const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Homepage UI
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Web Proxy</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #1a1a2e; color: #eee; }
            h1 { color: #00d4aa; text-align: center; }
            .box { background: #16213e; padding: 30px; border-radius: 10px; text-align: center; }
            input { width: 70%; padding: 12px; border: none; border-radius: 5px; margin-bottom: 10px; font-size: 16px; }
            button { padding: 12px 24px; background: #00d4aa; border: none; border-radius: 5px; cursor: pointer; color: #1a1a2e; font-weight: bold; font-size: 16px; }
            button:hover { background: #00b392; }
        </style>
    </head>
    <body>
        <h1>Web Proxy Navigator</h1>
        <div class="box">
            <form onsubmit="var u=document.getElementById('u').value; if(!u.startsWith('http')) u='https://'+u; window.location.href='/browse/'+encodeURIComponent(u); return false;">
                <input type="url" id="u" placeholder="https://example.com" required><br>
                <button type="submit">Launch Proxy</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

// Single static instance of middleware configured correctly
const proxyHandler = createProxyMiddleware({
    target: 'http://localhost', // Required fallback by package architecture
    router: (req) => {
        try {
            // Dynamically extracts destination base URL safely
            const targetUrl = decodeURIComponent(req.params.target);
            const parsed = new URL(targetUrl);
            return parsed.origin; 
        } catch (err) {
            return 'http://localhost';
        }
    },
    changeOrigin: true,
    secure: false,
    followRedirects: true,
    logLevel: 'error', // Displays system crashes while muting standard verbose logs
    pathRewrite: (path, req) => {
        try {
            // Extracts only the path and query parameters from the original target
            const targetUrl = decodeURIComponent(req.params.target);
            const parsed = new URL(targetUrl);
            return parsed.pathname + parsed.search;
        } catch (err) {
            return '';
        }
    }
});

// Attach the proxy handler to the Express server wildcard route
app.use('/browse/:target(*)', proxyHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy actively running on port ${PORT}`));
