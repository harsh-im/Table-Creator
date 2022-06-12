const mysql = require('mysql2')

const db = mysql.createConnection({
    host: 'tablecreator.clet4bsaer2r.us-east-2.rds.amazonaws.com',
    user: 'root',
    database: 'tablecreator',
    password:'rootuser',
    multipleStatements: true
});

 

module.exports = db;