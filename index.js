const Joi = require('joi');
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

const port = process.env.PORT || 3000;


app.listen(port, ()=>{console.log(`listening port ${port}`)});
