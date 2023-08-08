let mysql = require('mysql2')
const dotenv = require('dotenv');

if (process.env.NODE_ENV === 'development') {
    dotenv.config({ path: '.env.dev' });
} else if (process.env.NODE_ENV === 'production') {
    dotenv.config({ path: '.env.prod' });
}

console.log(process.env.DB_NAME)


exports.base = (sql, data, callback) => {
    let connection = mysql.createConnection({
        host: 'mysql-db',
        port: process.env.DB_PORT,
        user: 'root',
        password: '123456',
        database: process.env.DB_NAME,
        charset: 'utf8mb4'
        // host: process.env.DB_HOST,
        // port: process.env.DB_PORT,
        // user: process.env.DB_USER,
        // password: process.env.DB_PASSWORD,
        // database: process.env.DB_NAME,
        // charset: 'utf8mb4'
    });
    connection.connect();
    connection.query(sql, data, function (error, results, fields) {
        if (error) throw error;
        callback && callback(results)
    });
    connection.end();
}