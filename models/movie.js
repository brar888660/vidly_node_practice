const Joi = require('joi');
const mongoose = require('mongoose');
const genreSchma = require('./genre');


const movieSchema = new mongoose.Schema({
    "title" : {
        "type" : String,
        "maxlength" : 255,
        "minlength" : 5,
        "required" : true
    },
    genre : {
        type : genreSchema,
        required :true
    },
    numberInStock : {
        type : Number,

        min : 0,
        required : true
    },
    dailyRentalRate : {
        type :Number,
        min : 0,
        required :true
    }
});

const Movie = mongoose.model('Movie', movieSchema);


function validateMovie(movie)
{
    const schema = {
        'title' : Joi.string().required().min(5).max(255),
        'genreId' : Joi.string().required(),
        'numberInStock' : Joi.number().min(0),
        'dailyRentalRate' : Joi.number().min(0)
    };

    return Joi.validate(movie, movie);
}




exports.Movie = Movie;
exports.validate = validateMovie;
