const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const axios = require('axios');

app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());

async function handler(req, res) {
  try {
    const requestToken = req.query.code;
    const clientID = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    let response = await axios({
      method: 'post',
      url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
      headers: {
        Accept: 'application/json',
      },
    });
    let accessToken = response.data.access_token;
    res.status(200).json({ token: accessToken });
  } catch (e) {
    console.error(e);
    res.status(500).send({ error: 'Server error' });
  }
}

app.get('/', handler);

app.use((req, res, next) => {
  console.log('這裡是 404');
  res.send('404 not found');
});

app.listen(3001, () => {
  console.log('Server running at port 3001');
});
