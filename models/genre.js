const Joi = require('joi');
const mongoose = require('mongoose');

genreSchema = new mongoose.Schema({
    name : {
        type : String,
        required :true,
        minlength : 5,
        maxlength :50
    }
});

const Genre = new mongoose.model('Genre', genreSchema);

function validateGenre(genre)
{
    const schema = {
        'name' : Joi.string().required().min(5).max(50)
    };
    return Joi.validate(genre, schema);
}
exports.Genre = Genre;
exports.validate = validateGenre;
exports.genreSchema;
