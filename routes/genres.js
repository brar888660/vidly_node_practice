const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const asyncMiddleware = require('../middleware/async');

const mongoose = require('mongoose');

const {Genre, validate} = require('../models/genre');

router.get('/', asyncMiddleware(async (req, res, next) => {
    const genres = await Genre.find().sort('name');
    res.send(genres);
}));

router.get('/:id', async (req, res) => {

    const genre = await Genre.findById(req.params.id);

    if (!genre) {
        return res.status(400).send('souce not find');
    }
    return res.send(genre);
});

router.post('/', auth, async (req, res) => {


    const {error} = validate(req.body);
    if (error) {
        res.status(404).send(error.details[0].message);
        return;
    }

    let genre = new Genre({
        name : req.body.name
    });
    genre = await genre.save();

    return res.send(genre);

});

router.put('/:id', auth, async (req, res) =>{

    const {error} = validate(req.body);
    if (error) {
        res.status(404).send(error.details[0].message);
        return ;
    }

    let genre = await Genre.findOneAndUpdate({_id : req.params.id},{name : req.body.name}, {new : true});
    if (!genre) {
        return res.status(400).send('souce not find');
        return ;
    }

    res.send(genre);
});


router.delete('/:id', [auth, admin], async (req, res)=>{

    const genre = await Genre.findOneAndDelete({_id : req.params.id});
    if (!genre) {
        return res.status(400).send('souce not find');
    }
    res.send(genre);
});



module.exports = router;
