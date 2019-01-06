const mongoose = require('mongoose');
const winston = require('winston');


module.exports = () => {
    mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
     .then(() => winston.info('connecting to mongo db....'));
}

