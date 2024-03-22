const request = require('supertest');
const app = require('../../app');

const { mongoConnect, mongoDisconnect } = require('../../../services/mongo');
const { loadPlanetsData } = require('../../models/planets.model');

describe('Launches API test', () =>{

    beforeAll(async () => {
        await mongoConnect();
        await loadPlanetsData();
    });

    afterAll(async ()=> {
        await mongoDisconnect();
    });

    // block of related tests
    describe('Test GET /launches', ()=>{
        // individual test
        test('It should respond with 200 success', async ()=>{
            // better use await than promises and callbacks
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type', /json/)
            .expect(200);

            // assertion using jets. Unnecessary. We already did it before
            expect(response.statusCode).toBe(200);
        });
    });

    describe('Test POTS /launches', ()=>{
        // test data
        const completeLaunchData = {
            mission: 'test mission',
            rocket: 'test rocket',
            launchDate:'December 27, 2030',
            target: 'Kepler-62 f',
        }

        const launchDataWithoutDate = {
            mission: 'test mission',
            rocket: 'test rocket',
            target: 'Kepler-62 f',
        }

        const launcheDateWithInvalidDate = {
            mission: 'test mission',
            rocket: 'test rocket',
            launchDate:'this is not a date',
            target: 'Kepler-62 f',
        }

        test('It should respond with 201 created', async ()=>{
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);
            
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();

            expect(response.body).toMatchObject(launchDataWithoutDate);

            expect(responseDate).toBe(requestDate);
        });

        test('It should cath missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'Missing required property'
            });
        });
        
        test('It should cath invalid dates', async() => {
            const response = await request(app)
                .post('/v1/launches')
                .send(launcheDateWithInvalidDate)
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body).toStrictEqual({
                error: 'invalid launch date'
            });
        });
    });
});