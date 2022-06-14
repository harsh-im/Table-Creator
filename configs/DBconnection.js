const mysql = require('mysql2')
require('dotenv').config()
const db = mysql.createConnection({
    host: process.env.HOSTNAME || 'localhost',
    user: process.env.USER || 'root',
    database:process.env.DATABASE || 'tablecreator',
    password:process.env.PASSWORD || '',
    multipleStatements: true
});

 

module.exports = db;

