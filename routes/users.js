const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {validate, User} = require('../models/user');
const auth = require('../middleware/auth');


router.get('/me', auth, async (res, req) => {
    const user = await User.findOne({_id : res.user._id}).select('-password');
    req.send(user);
});

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }


    if (await User.findOne({email : req.body.email})) {
        return res.status(400).send('user already registered');
    }


    const user = new User(
        _.pick(req.body, ['name', 'email', 'password'])
    );

    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);

    await user.save();
    res.header('x-auth-token', user.generateAuthToken() ).send(
        _.pick(user, ['_id', 'name', 'email'])
    );

});

module.exports = router;
