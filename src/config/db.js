const mysql = require("mysql2/promise");
const env = require("dotenv").config();

const connection = mysql.createPool({
    connectionLimit : 10,
    host : process.env.MYSQL_HOST,
    user : process.env.MYSQL_USER,
    password : process.env.MYSQL_ROOT_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    debug : false
});

module.exports = { connection };
