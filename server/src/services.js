const database = require('./database.js');
var fs = require('fs');

exports.save = async (req, res) => {
    let sql = "INSERT INTO main(content, created_time, update_time) VALUES(?,?,?)";
    const timestamp = new Date();
    let sql_params = [req.body.context, timestamp, timestamp];
    await database.base(sql, sql_params, (result) => {
        let response = JSON.parse(JSON.stringify(result));
        res.send(response[0])

    })
}

exports.get = async (req, res) => {
    console.log("trigger")
    let sql = "SELECT content  FROM main ORDER BY update_time DESC LIMIT 1";
    let sql_params = [];
    await database.base(sql, sql_params, (result) => {
        let response = JSON.parse(JSON.stringify(result));
        if(!response.length) res.send({})
        res.send(response[0])
    })
}