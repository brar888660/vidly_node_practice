require('express-async-errors');
const winston = require('winston');

module.exports = () => {

    winston.add(new winston.transports.File({filename : 'logfile.log'}));
    winston.add(new winston.transports.Console({format: winston.format.simple()}));

    // winston.exceptions.handle(

    //     new winston.transports.File({filename : 'uncaughtException.log'})
    // );
    process.on('uncaughtException', (ex) => {
        winston.error(ex.message);
        console.log(ex);
    });

    process.on('unhandledRejection', (ex) => {
        throw ex;
    });
}
