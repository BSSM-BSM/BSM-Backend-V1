const mysql = require('mysql');

const conn = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PW,
    database:process.env.DB_DB,
    dateStrings:'date'
});
module.exports = conn;