const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Proxy</title><style>body{font-family:Arial;max-width:800px;margin:50px auto;padding:20px;background:#1a1a2e;color:#eee}h1{color:#00d4aa;text-align:center}.box{background:#16213e;padding:30px;border-radius:10px}input{width:70%;padding:12px;border:none;border-radius:5px}button{padding:12px 24px;background:#00d4aa;border:none;border-radius:5px;cursor:pointer;margin-left:10px}</style></head><body><h1>Web Proxy</h1><div class="box"><form onsubmit="var u=document.getElementById(\'u\').value;if(!u.startsWith(\'http\'))u=\'https://\'+u;window.location.href=\'/browse/\'+encodeURIComponent(u);return false;"><input type="url" id="u" placeholder="example.com" required><button type="submit">Go</button></form></div></body></html>');
});

app.use('/browse/:target(*)', (req, res, next) => {
  const target = decodeURIComponent(req.params.target);
  createProxyMiddleware({
    target: target,
    changeOrigin: true,
    secure: false,
    followRedirects: true,
    logLevel: 'silent'
  })(req, res, next);
});

app.listen(process.env.PORT || 3000);