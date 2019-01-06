
const config = require('config');
const winston = require('winston');

module.exports = () => {
    if (!config.get('jwtPrivateKey')) {
        throw new Error('Fatal error : jwtPrivateKey is not defined');
    }
}
