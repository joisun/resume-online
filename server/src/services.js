const database = require('./database.js');
var fs = require('fs');
var IP2Region = require('ip2region').default;
var crypto = require("crypto");


exports.save = async (req, res) => {
    let sql = "INSERT INTO main(content, created_time, update_time) VALUES(?,?,?)";
    const timestamp = new Date();
    let sql_params = [req.body.context, timestamp, timestamp];
    await database.base(sql, sql_params, (result) => {
        let response = JSON.parse(JSON.stringify(result));
        res.send(response[0])
    })
}
exports.getVisitors = async (req, res) => {
    // 查询visitors表最近100条所有的记录
    let sql = "SELECT * FROM visitors ORDER BY created_time DESC LIMIT 500";
    let sql_params = [];
    await database.base(sql, sql_params, (result) => {
        let response = JSON.parse(JSON.stringify(result));
        if (!response.length) {
            res.send([]);
            return; // 确保函数在这里返回，避免进一步执行
        }
        res.send(response);
    });

}

exports.userLeaved = async (req, res) => {

    let sql = "UPDATE visitors SET leave_time = ? WHERE id = ?";
    const timestamp = new Date();
    
    let sql_params = [timestamp,req.query.id];
    await database.base(sql, sql_params, (result) => {
        res.status(200).end()
    });

}

exports.get = async (req, res) => {
    // 写入 visitor
    let uuid = crypto.randomUUID();
    try {
        const info = getClientInfo(req)
        if (info) {
            let sql1 = "INSERT INTO visitors (created_time,country, province, city, isp, ip, id) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const timestamp = new Date();
            const { country, province, city, isp, ip } = info;
            let sql_params2 = [timestamp, country, province, city, isp, ip, uuid];
            await database.base(sql1, sql_params2, (result) => {
                let response = JSON.parse(JSON.stringify(result));
            })
        }
    } catch (err) { }


    // 查询main
    let sql = "SELECT content  FROM main ORDER BY update_time DESC LIMIT 1";
    let sql_params = [];
    await database.base(sql, sql_params, (result) => {
        let response = JSON.parse(JSON.stringify(result));
        if (!response.length) {
            res.send({});
            return; // 确保函数在这里返回，避免进一步执行
        }
        res.send({...response[0], uuid});
    })
}

/**
 * @method 获取客户端IP地址
 * @param {string} req 传入请求HttpRequest
 * 客户请求的IP地址存在于request对象当中
 * express框架可以直接通过 req.ip 获取
 */
function getClientIp(req) {
    return req.headers['x-forwarded-for'] ||
        req.ip ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress ||
        '';
}
function getClientInfo(req) {
    try {
        const ip = getClientIp(req)
        const query = new IP2Region();
        const info = query.search(ip);
        if (typeof info === 'object') {
            return { ...info, ip }
        } else {
            return null
        }
    } catch (err) {
        console.log("Error in getClientInfo Function:\n", err)
    }
}