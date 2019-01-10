const app = require('./app');
const winston = require('winston');
const db = require('./db');
db.connect();
const port = process.env.PORT || 3000;
app.listen(port, ()=>{winston.info(`listening port ${port}`)});
