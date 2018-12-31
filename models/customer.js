const Joi = require('joi');
const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
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
    },
});

const Customer = new mongoose.model('Customer', customerSchema);


function validateCustomer(customer)
{
    const schema = {
        isGold : Joi.boolean().required(),
        name : Joi.string().required().min(2).max(50),
        phone : Joi.string().required().min(2).max(50)
    }

    return Joi.validate(customer, schema);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
exports.customerSchema = customerSchema;
