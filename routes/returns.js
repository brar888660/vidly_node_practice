

//should return 401 if cliner is not logged in
//should return 404 if customer id is not provided
//should return 404 if moive id is not provided
//should return 400 if no retanl found for cusomter/movie
//should return 400 if retnal already process;
//should return 200 if valid request
//set the return date
//conculate the tental fee
//increase the sock
//return the rental
const Joi = require('joi');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const winston = require('winston');
const auth = require('../middleware/auth');
const moment = require('moment');
const Fawn = require('Fawn');
const validate = require('../middleware/validate');



router.post('/', [auth, validate(validateReturn)], async (req, res) => {

    let rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    if (!rental) {
        return res.status(404).send('rental not found');
    }

    if (rental.dateReturned) {
        return res.status(400).send('return already processed');
    }


    rental.return();

    rental = await rental.save();

    const movie = await Movie.findOne({_id : req.body.movieId});
    await Movie.update({_id : req.body.movieId} , {$inc : {numberInStock : 1}});


    return res.send(rental);


});

function validateReturn(req)
{
    const schema = {
        customerId : Joi.objectId().required(),
        movieId : Joi.objectId().required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;
