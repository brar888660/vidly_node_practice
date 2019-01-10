
const request = require('supertest');
const {Genre} = require('../../models/genre');
const mongoose = require('mongoose');
const {User} = require('../../models/user');

const db = require('../../db');

let app;
describe('/api/genres', () => {

    beforeEach( () => {
        db.connect();
        app = require('../../app');
    });

    afterEach(async (done) => {
        await Genre.remove({});
        db.disconnect(done);
    });

    describe('GET /', () => {
        it('should return all genres list', async () => {

            await Genre.collection.insertMany([
                {name : 'genre1'},
                {name : 'genre2'}
            ]);
            const res = await request(app).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {

        it('should return genre by id if source has been found', async () => {

            const genre = Genre({
                name :'genre1'
            });
            await genre.save();
            const res = await request(app).get('/api/genres/'+genre._id + '/');  //return promise
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const res = await request(app).get('/api/genres/1');
            expect(res.status).toBe(404);
        });

        it('should return 404 if no genre with given id exist', async () => {
            const id = mongoose.Types.ObjectId();
            const res = await request(app).get('/api/genres/'+id);
            expect(res.status).toBe(404);
        });
    });


    describe('POST /', () => {
        let token;
        let name;

        const exec = async ()=>{
            return await request(app)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({"name" : name});
        };

        beforeEach(()=> {
            token = new User().generateAuthToken();
            name = "genre1";
        });

        it('should return 401 if client is not logged in', async()=>{
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });



        it('should return 400 if name is less than 5 charecters', async()=>{
            name = "1234";
            const res = await exec();
            expect(res.status).toBe(400);
        });



        it('should return 400 if name is more than 50 charecters', async()=>{
            name = Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should save the genre if it is valid', async()=>{
            await exec();
            const genre = await Genre.findOne({"name" : name});

            expect(genre.name).toBe(name);
        });

        it('should return the genre if it is valid', async()=>{
            const res = await exec();
            expect(res).not.toBeNull();
        });
    });

    describe('PUT /:id', () => {


        let token;
        let name;
        let id;
        const exec = async ()=>{

            return await request(app)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({name: name});
        };

        beforeEach(async()=>{

            token = new User().generateAuthToken();
            name = "genre1";

            const genre = new Genre({
                name
            });
            await genre.save();
            id = genre._id;
        });


        it('should return 404 if invalid id is passed', async ()=>{
            id = 1;
            const res = await exec();

            expect(res.status).toBe(404);
        });

        it('should return 401 if client is not logged in', async ()=>{
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        });


        it('should return 400 if name is less than 5 characters', async()=>{
            name = '1234';
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 400 if name is more than 50 characters', async()=>{
            name = Array(52).join('a');
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('it should modify genre if it is valid', async() =>{
            name = "gerne_modify";
            await exec();
            const genre = await Genre.findOne({_id : id});
            expect(genre).toHaveProperty("name", "gerne_modify");
        });

        it('it return modified genre if it is valid', async() =>{
            name = "gerne_modify";
            const res = await exec();
            expect(res).not.toBeNull();
        });

        it('should return 400 if no genre with given id exist', async()=>{
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(400);
        });
    });


    describe('DELETE /:id', () => {


        let id;
        let token;

        beforeEach(async()=>{
            token = new User({isAdmin : true}).generateAuthToken();
            const genre = new Genre({
                name : 'genre1'
            });
            await genre.save();
            id = genre._id;
        });

        const exec = () =>{
            return request(app)
            .delete('/api/genres/'+id)
            .set('x-auth-token', token)
            .send({name: name});
        };


        it('should return 401 if clinet is not logged in', async()=>{
            token = '';
            const res = await exec();
            expect(res.status).toBe(401);
        });

        it('should return 400 if token is invalid', async()=>{
            token = "invalid_token";
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should return 404 if invalid id is passed', async() =>{
            id = 1;
            const res = await exec();
            expect(res.status).toBe(404);
        });

        it('should return 403 if client is not admin', async() =>{
            token = new User().generateAuthToken();
            const res = await exec();
            expect(res.status).toBe(403);
        });

        it('should return 400 if no genre with given id exist', async() => {
            id = mongoose.Types.ObjectId();
            const res = await exec();
            expect(res.status).toBe(400);
        });

        it('should delete genre if it is valid', async() =>{
            await exec();
            const genre = await Genre.findOne({_id : id});
            expect(genre).toBeNull();
        });

        it('should return deleted genre if it is valid', async() =>{
            const res = await exec();
            expect(res.text).not.toBeNull();
            expect(res.text._id).toBe(res._id);
        });
    });
});
