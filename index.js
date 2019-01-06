
const express = require('express');
const winston = require('winston');

const app = express();
require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/database')();
require('./startup/config')();
require('./startup/validation')();




throw new Error('123');



const port = process.env.PORT || 3000;


app.listen(port, ()=>{winston.info(`listening port ${port}`)});

