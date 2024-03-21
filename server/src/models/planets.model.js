const fs = require('fs');
const path = require('path');
const {parse} = require('csv-parse');

const planets = require('./planets.mongo');


// these conditions for habitable planes were taken from https://www.centauri-dreams.org/2015/01/30/a-review-of-the-best-habitable-planet-candidates/

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
    && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
    && planet['koi_prad'] < 1.6;
}

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
        .pipe(parse({
            comment: '#', //comment symbol
            columns: true, //will return each row as a keyvalue pair
        }))
        .on('data', async (data) => {
            if (isHabitablePlanet(data)){
                await savePlanet(data);
            } 
        })
        .on('error', (err) => {
            console.log(err);
            reject(err);
        })
        .on('end', () => {
            // console.log(`${habitablePlanets.length} habitable planets found`);
            // console.log(habitablePlanets.map(function(planet){
            //     return planet['kepler_name'];
            // }))
            // console.log('done');
            resolve();
        })
    });
}

async function getAllPlanets() {
    // https://mongoosejs.com/docs/api/model.html#Model.find()
    return await planets.find({}, {
        '__v': 0,
        '_id': 0
    });
}

async function savePlanet(planet) {
    try {
        // insert + update = upsert
        // https://mongoosejs.com/docs/api/query.html#Query.prototype.updateOne()
        await planets.updateOne({
            keplerName: planet.kepler_name
        }, {
            keplerName: planet.kepler_name 
        }, {
            upsert: true
        });
    } catch(err) {
        console.error(`Could not save the planet ${err}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets
}