require('express-async-errors');
const winston = require('winston');

module.exports = () => {

    winston.add(new winston.transports.File({filename : 'logfile.log'}));



    winston.exceptions.handle(
        new winston.transports.Console(),
        new winston.transports.File({filename : 'uncaughtException.log'})
    );


    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
}
