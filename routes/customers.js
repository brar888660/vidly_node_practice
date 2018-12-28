const {Customer,validate} = require('../models/customer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');




router.get('/', async(req, res) => {
    const customers = await Customer.find();
    res.send(customers);
});


router.get('/:id', async(req, res) => {

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
        res.status(400).send('can\'t find resource');
        return ;
    }
    res.send(customer);
 });


router.post('/', async(req, res) => {

    const {error} = validate(req.body);
    if (error) {
        res.status(404).send(error.details[0].message);
        return ;
    }

    let customer = new Customer({
        isGold : req.body.isGold,
        name : req.body.name,
        phone : req.body.phone
    });
    customer = await customer.save();

    res.send(customer);
});


router.put('/:id', async(req, res) => {

    const {error} = validate(req.body);
    if (error) {
        res.status(404).send(error.details[0].message);
        return ;
    }

    const customer =  await Customer.findByIdAndUpdate(req.params.id, req.body, {new : true});

    if (!customer) {
        res.status(400).send('can\'t find resource.');
        return ;
    }

    res.send(customer);

});

router.delete('/:id', async(req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
        res.status(400).send('can\'t find resource.');
        return ;
    }
    res.send(customer);
});




module.exports = router;

