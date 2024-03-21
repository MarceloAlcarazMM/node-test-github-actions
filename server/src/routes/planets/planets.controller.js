const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(req, res) {
    // console.log(req);
    return res.json(await getAllPlanets());
}

module.exports = {
    httpGetAllPlanets
};