
const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');


//const db = require('../../db');
const mongoose = require('mongoose');
const db = {
    mongoose,
    connect : () =>{
        const db = 'mongodb://localhost/vidly_test1';
        mongoose.connect(db, { useNewUrlParser: true });
    },

    disconnect : (done) => {
        mongoose.disconnect(done);
    }
}

let app;
describe('auth middleware', () => {

    beforeEach(() => {
        db.connect();
        app = require('../../app');
    });
    afterEach(async (done) => {
        await Genre.remove({});
        db.disconnect(done);
    });
    let token;

    beforeEach(() => {token = new User().generateAuthToken()});
    const exec = () => {
        return request(app)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({name : 'genre1'});
    };

    it('should return 401 if no token is provided', async() => {
        token = '';
        res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async() => {
        token = 'a';
        res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async() => {
        res = await exec();
        expect(res.status).toBe(200);
    });
});
