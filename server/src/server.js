
// this file contains only code related to the server
// express code was separated to app.js to have better organized code
const http = require('http');
require('dotenv').config();

const app = require('./app');
const { mongoConnect } = require('../services/mongo')

const {loadPlanetsData} = require('./models/planets.model');
const {loadLaunchData} = require('./models/launches.model');

// by starting the server using the http server instead of express app.listen
// allow us to listen not using only http request but also other types using websockets
const PORT = process.env.PORT || 8000;


const server = http.createServer(app);

async function startServer () {
    await mongoConnect();
    await loadPlanetsData();
    await loadLaunchData();
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    });
}

startServer();