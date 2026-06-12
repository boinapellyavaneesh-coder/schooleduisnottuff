app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Proxy Browser</title>
<style>
    body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: #0f172a;
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }

    .box {
        width: 90%;
        max-width: 600px;
        background: #111827;
        padding: 30px;
        border-radius: 12px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.4);
    }

    h1 {
        margin-bottom: 20px;
        color: #38bdf8;
    }

    input {
        width: 100%;
        padding: 14px;
        border-radius: 8px;
        border: none;
        outline: none;
        margin-bottom: 15px;
        font-size: 16px;
    }

    button {
        width: 100%;
        padding: 14px;
        border: none;
        border-radius: 8px;
        background: #38bdf8;
        color: black;
        font-weight: bold;
        cursor: pointer;
        font-size: 16px;
    }

    button:hover {
        background: #0ea5e9;
    }

    .hint {
        margin-top: 10px;
        font-size: 12px;
        opacity: 0.7;
    }
</style>
</head>

<body>
<div class="box">
    <h1>Web Proxy</h1>

    <form onsubmit="
        event.preventDefault();
        let url = document.getElementById('url').value;
        if (!url.startsWith('http')) url = 'https://' + url;
        window.location.href = '/browse?url=' + encodeURIComponent(url);
    ">
        <input id="url" type="text" placeholder="Enter URL (e.g. google.com)" required />
        <button type="submit">Go</button>
    </form>

    <div class="hint">
        Example: https://example.com
    </div>
</div>
</body>
</html>
    `);
});
