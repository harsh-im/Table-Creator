const mysql = require('mysql2')

const db = mysql.createConnection({
    host: process.env.hostname || 'localhost',
    user: process.env.user || 'root',
    database:process.env.database || 'tablecreator',
    password:process.env.password || '',
    multipleStatements: true
});

 

module.exports = db;

