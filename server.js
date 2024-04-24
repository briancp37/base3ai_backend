// const PORT = 8000;
const PORT = 443;
const https = require('https');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const API_KEY = process.env.API_KEY;

// HTTPS options: Load SSL/TLS certificates
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.base3ai.net/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.base3ai.net/fullchain.pem')
};


app.post('/completions', async (req, res) => {
    const options = {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${API_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{role:"user", content:req.body.message}],
            max_tokens:100
        })
    }
    console.log(options)
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options)
        const data = await response.json()
        res.send(data)
    } catch (error) {
        console.log(error)
        res.status(500).send(error);
    }
})

// Create HTTPS server
https.createServer(options, app).listen(PORT, () => {
    console.log('Your server1 is running on HTTPS port ' + PORT);
});



// app.listen(PORT, () => console.log('Your server is running on PORT ' + PORT))
