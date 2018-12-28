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
        res.status(400).sned('resource not find');
        return ;
    }
    res.send(movie);
});


router.post('/', async (req, res) => {
    const {errors} = validate(req.body);
    if (errors) {
        res.status(404).send(error.details[0].message);
        return ;
    }

    let movie = new Movie({
        title : req.body.title,
        genre : await getGenreById(req.body.genreId),
        numberInStock : req.body.numberInStock,
        dailyRentalRate : req.body.dailyRentalRate
    });

    movie = await movie.save();
    res.send(movie);

});



router.put('/:id', async (req, res) => {

    const {errors} = validate(req.body);
    if (errors) {
        res.status(404).send(error.details[0].message);
        return ;
    }

    const movie = await Movie.findOneAndUpdate({
        _id : req.params.id},
        {
            title : req.body.title,
            genre : await getGenreById(req.body.genreId),
            numberInStock : req.body.numberInStock,
            dailyRentalRate : req.body.dailyRentalRate
        },
        {new:true}
        );

    if (!movie) {
        res.status(400).sned('resource not find');
        return ;
    }
     res.send(movie);
});

router.delete('/:id', async (req, res) => {
    const movie = await Movie.findOneAndDelete({_id : req.params.id});

    if (!movie) {
        res.status(400).sned('resource not find');
        return ;
    }
     res.send(movie);
});

async function getGenreById(id)
{
    return await Genre.findOne( {_id : id});
}

module.exports = router;
