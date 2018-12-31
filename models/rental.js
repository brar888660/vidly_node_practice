const Joi = require('joi');
const mongoose = require('mongoose');
const {movieSchema} = require('./movie');
const {customerSchema} = require('./customer');




const rentalSchema = mongoose.Schema({

    "dateReturnd" : {
        type : Date
    },

    "dateOut" : {
        type : Date,
        required : true,
        default : Date.now
    },


    "rentalFee" : {
        type : Number,
        min : 0
    },


    "customer" : {
        type : new mongoose.Schema({
            isGold : {
                type :Boolean,
                required : true
            },
            name : {
                type :String,
                required : true,
                maxlength : 50,
                minlength :2
            },
            phone : {
                type :String,
                required : true,
                maxlength : 50,
                minlength :2
            }
        }),
        required : true
    },


    "movie" : {
        type : new mongoose.Schema({
            title : {
                "type" : String,
                "maxlength" : 255,
                "minlength" : 5,
                "required" : true
            },
            dailyRentalRate : {
                type :Number,
                min : 0,
                required :true
            }
        }),

        required : true
    }
});


const Rental = mongoose.model('Rental', rentalSchema);


function rentalValidate(rental)
{
    const schema = {
        customerId : Joi.objectId().required(),
        movieId : Joi.objectId().required()
    };

    return Joi.validate(rental, schema);
}

module.exports.validate = rentalValidate;
module.exports.Rental = Rental;
