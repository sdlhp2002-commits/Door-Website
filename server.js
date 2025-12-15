const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(express.json());

// Serve all static files from project root
app.use(express.static(path.join(__dirname)));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Fallback to index.html for client-side routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, HOST, () => console.log(`Server running at http://${HOST}:${PORT}/`));