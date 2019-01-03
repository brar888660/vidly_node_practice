require('express-async-errors');
const winston = require('winston');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const config = require('config');
const error = require('./middleware/error');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
 .then(() => console.log('connecting to mongo db....'))
 .catch((error) => console.log('cou not  connect to mongo db....'));


winston.add(new winston.transports.File({filename : 'logfile.log'}));

const app = express();

app.use(express.json());
app.use('/api/genres', require('./routes/genres'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));


//error middle
app.use(error);

if (!config.get('jwtPrivateKey')) {
    console.error('Fatal error : jwtPrivateKey is not defined');
    process.exit(1);
}

const port = process.env.PORT || 3000;


app.listen(port, ()=>{console.log(`listening port ${port}`)});


process.on('uncaughtException', function(err){
    console.error(err.stack);
    process.exit();
});
