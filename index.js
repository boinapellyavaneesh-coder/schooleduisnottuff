const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use(cors());
app.use(express.json());

/**
 * HEALTH CHECKS (CRITICAL for Railway)
 */
app.get('/', (req, res) => {
    res.status(200).send('Proxy server running');
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

/**
 * SAFE PROXY ROUTE
 * Usage:
 * /browse?url=https://example.com/path
 */
app.use('/browse', (req, res, next) => {
    const target = req.query.url;

    if (!target) {
        return res.status(400).send('Missing url query parameter');
    }

    let parsed;
    try {
        parsed = new URL(target);
    } catch (err) {
        return res.status(400).send('Invalid URL');
    }

    const proxy = createProxyMiddleware({
        target: parsed.origin,
        changeOrigin: true,
        secure: false,
        followRedirects: true,

        pathRewrite: () => {
            return parsed.pathname + parsed.search;
        },

        onError(err, req, res) {
            console.error('Proxy error:', err.message);
            if (!res.headersSent) {
                res.status(500).send('Proxy error');
            }
        }
    });

    return proxy(req, res, next);
});

/**
 * GLOBAL ERROR SAFETY (prevents Railway shutdowns)
 */
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

/**
 * START SERVER (Railway PORT REQUIRED)
 */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Proxy running on port ${PORT}`);
});
