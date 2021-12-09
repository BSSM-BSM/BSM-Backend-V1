import mysql from "mysql"

const conn = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PW,
    database:process.env.DB_DB,
    dateStrings:true
});
module.exports = conn;