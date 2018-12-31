const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const Fawn = require('Fawn');
Fawn.init(mongoose);

router.get('/', async (req, res) => {

    const rentals = await Rental.find();
    res.send(rentals);

});


router.post('/', async (req, res) => {

    const {error} = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);

    }

    const customerId = req.body.customerId;
    const movieId = req.body.movieId;

    const customer = await Customer.findOne({_id : customerId});

    if (!customer) {
       return res.status('400').send('Invalid customer');

    }

    const movie = await Movie.findOne({_id : movieId});

    if (!movie) {
        returnres.status('400').send('Invalid movie');
    }

    if (movie.numberInStock === 0) {
        return res.status('400').send('Movie not in stock');
    }


    let rental = new Rental({
        customer : {
            _id : customer._id,
            name : customer.name,
            phone : customer.phone,
            isGold : customer.isGold,
        },
        movie : {
            _id : movie._id,
            title : movie.title,
            dailyRentalRate : movie.dailyRentalRate
        }
    });

    try {
        await new Fawn.Task()
            .save('rentals', rental)
            .update('movies', {_id : movie._id}, {
                $inc:{numberInStock: -1}
            }).run();
            res.send(rental);
    } catch(ex) {
        res.status('500').send('internal request error');
    }


});

module.exports = router;
