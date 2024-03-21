// this file contains only code related to the express app
// server code was separated to server.js to have better organized code
const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const api = require('./routes/api');


const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
// https://www.npmjs.com/package/morgan
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use('/v1', api);


// es esto necesario?
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

module.exports = app;