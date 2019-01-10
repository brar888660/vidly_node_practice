const request = require('supertest');
let app;
const {User} = require('../../models/user');
const {Genre} = require('../../models/genre');

const mongoose = require('mongoose');
const db = {
    mongoose,
    connect : () =>{
        const db = 'mongodb://localhost/vidly_test2';
        mongoose.connect(db, { useNewUrlParser: true });
    },
    disconnect : (done) => {
        mongoose.disconnect(done);
    }
}
const {Rental} = require('../../models/rental');
const moment = require('moment');
const {Movie} = require('../../models/movie');
const winston = require('winston');
describe('POST /', () => {
    let customerId;
    let movieId;
    let rental;
    let token;
    let movie;


    const exec = () => {
        return request(app)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, movieId});
    }

    beforeEach(async () =>{
        db.connect();
        app = require('../../app');
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();


        let genre = new Genre({
            name : '12345'
        });
        genre = await genre.save();

        movie = new Movie({
            _id : movieId,
            genre : genre,
            title : '12345',
            numberInStock : 5,
            dailyRentalRate : 2
        });
        movie = await movie.save();


        rental = new Rental({
            customer : {
                _id : customerId,
                name : "12345",
                phone : "123456789"
            },
            movie : {
                _id : movieId,
                title : "12345",
                dailyRentalRate : 2
            }
        });
        await rental.save();
    });
    afterEach(async (done) => {
        await Rental.remove({});
        db.disconnect(done);
    });


    it('should work', async() => {
        const result = await Rental.findOne({_id : rental._id});
        expect(result).not.toBeNull();
    });


    it('should return 401 if client is not logged in', async()=>{
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    });

    it('should return 400 if customer id is not provided', async() =>{
        customerId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movie id is not provided', async() =>{
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if no rental found for this customer', async() => {
        customerId = mongoose.Types.ObjectId();
        res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 404 if no rental found for this movie', async() => {
        movieId = mongoose.Types.ObjectId();
        res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 404 if no rental found for this customer/movie', async() => {
        movieId = mongoose.Types.ObjectId();
        customerId = mongoose.Types.ObjectId();
        res = await exec();
        expect(res.status).toBe(404);
    });

    it('should return 400 if return is already processed', async() => {
        rental.dateReturned = Date.now();
        rental.rentalFee = 2;
        await rental.save();
        res = await exec();
        expect(res.status).toBe(400);
    });

    it('should return 200 if return is valid request', async () => {
        res = await exec();
        expect(res.status).toBe(200);
    });

   it('should set rental return date if return is valid request', async () => {
        await exec();
        rental = await Rental.findOne({_id : rental._id});

        const diff = new Date() - rental.dateReturned;
        expect(diff).toBeLessThan(10*1000);
    });


   it('should set retnal fee if input is valid', async () => {

        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        await exec();
        rental = await Rental.findOne({_id : rental._id});

        expect(rental.rentalFee).toBe(14);
    });

   it('should add movie in stock  if input is valid', async () => {
        await exec();

        movieInDb = await Movie.findOne({_id : movie._id});

        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
    });

    if('should return rental if input is valid', async() => {

        const res = await exec();
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned','customer', 'movie', 'rentalFee'])
        );
    });


    // it('should return 400 if movie id is not provided', async() =>{

    //     const token = new User().generateAuthToken();
    //     const res = await request(app)
    //                     .post('/api/returns')
    //                     .set('x-auth-token', token)
    //                     .send({customerId : 1, movieId});
    //     expect(res.status).toBe(400);
    // });
});
