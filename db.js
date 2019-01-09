const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');

module.exports =  {
    mongoose,

    connect : () =>{
        const db = config.get('db');
        mongoose.connect(db, { useNewUrlParser: true })
         .then(() => {
            winston.info(`connecting to ${db}....`);
        });
    },

    disconnect : (done) => {
        mongoose.disconnect(done);
    }

}

