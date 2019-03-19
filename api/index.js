const app = require('express')();

app.get('/ok', (req, res) => res.sendStatus(200));

module.exports = app;