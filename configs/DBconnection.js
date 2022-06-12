const mysql = require('mysql2')

const db = mysql.createConnection({
    host: process.env.hostname,
    user: process.env.user,
    database:process.env.database,
    password:process.env.password,
    multipleStatements: true
});

 

module.exports = db;