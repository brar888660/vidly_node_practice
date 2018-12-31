const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');

const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');



router.get('/', async (req, res) => {
    const movies = await Movie.find();
    res.send(movies);
});

router.get('/:id', async (req, res) => {
    const movie = await Movie.findOne({_id : req.params.id});
     if (!movie) {
        res.status(400).send('resource not find');
        return ;
    }
    res.send(movie);
});


router.post('/', async (req, res) => {


    const {error} = validate(req.body);
    if (error) {
        res.status(404).send(error.details[0].message);
        return ;
    }

    const movie = new Movie({
        title : req.body.title,
        genre : await getGenreById(req.body.genreId),
        numberInStock : req.body.numberInStock,
        dailyRentalRate : req.body.dailyRentalRate
    });

    await movie.save();
    res.send(movie);

});



router.put('/:id', async (req, res) => {

    const {error} = validate(req.body);

    if (error) {
        res.status(404).send(error.details[0].message);
        return ;
    }
    const movie = await Movie.findOne({_id : req.params.id});

    if (!movie) {
        res.status(400).send('resource not find....');
        return ;
    }

    movie.title = req.body.title;
    movie.genre = await getGenreById(req.body.genreId);
    movie.numberInStock = req.body.numberInStock;
    movie.dailyRentalRate = req.body.dailyRentalRate;

    res.send(await movie.save());
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findOneAndDelete({_id : req.params.id});
    if (!movie) {
        res.status(400).send('resource not find');
        return ;
    }
     res.send(movie);
});

async function getGenreById(id)
{
    const genre = await Genre.findOne( {_id : id});

    return {
        _id : genre._id,
        name : genre.name,
    }
}

module.exports = router;
