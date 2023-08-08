let mysql = require('mysql2')

exports.base = (sql, data, callback) => {
    let connection = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        charset: 'utf8mb4'
    });
    connection.connect();
    connection.query(sql, data, function (error, results, fields) {
        if (error) throw error;
        callback && callback(results)
    });
    connection.end();
}