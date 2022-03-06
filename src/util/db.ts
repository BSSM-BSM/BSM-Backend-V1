import mysql from "mysql2/promise"

const pool = mysql.createPool({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PW,
    database:process.env.DB_DB,
    dateStrings:true,
    waitForConnections:true,
    connectionLimit:5,
    queueLimit:0
});
module.exports = pool;