const Joi = require('joi');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');


const userSchema = mongoose.Schema({
    name : {
        type : String,
        maxlength : 255,
        minlength : 5,
        required :true
    },
    email : {
        type :String,
        maxlength : 255,
        minlength : 5,
        required :true ,
        unique : true
    },

    password : {
        type : String,
        maxlength : 1024,
        minlength : 5,
        required :true
    },
    isAdmin : {
        type : Boolean,
        default : false
    }
});

userSchema.methods.generateAuthToken = function(){
    return jwt.sign({_id : this._id, isAdmin : this.isAdmin}, config.get('jwtPrivateKey'));
}

const User = mongoose.model('User', userSchema);

function validateUser(user)
{
    const schema = {
        name : Joi.string().max(255).min(5).required(),
        email : Joi.string().max(255).min(5).required().email(),
        password : Joi.string().max(255).min(5).required()
    }

    return Joi.validate(user, schema);
}

module.exports.User = User;
module.exports.validate = validateUser;

