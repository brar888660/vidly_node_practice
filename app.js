const express = require('express');
const winston = require('winston');

const app = express();
require('./startup/logging')();
require('./startup/routes')(app);
//require('./startup/database')();
// const db = require('./db');
// db.connect();

require('./startup/config')();
require('./startup/validation')();

module.exports = app;


