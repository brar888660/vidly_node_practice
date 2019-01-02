const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/vidly', { useNewUrlParser: true })
 .then(() => console.log('connecting to mongo db....'))
 .catch((error) => console.log('cou not  connect to mongo db....'));

const app = express();

app.use(express.json());
app.use('/api/genres', require('./routes/genres'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));

const port = process.env.PORT || 3000;


app.listen(port, ()=>{console.log(`listening port ${port}`)});


process.on('uncaughtException', function(err){
    console.error(err.stack);
    process.exit();
});
