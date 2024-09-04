const database = require('./database.js');
const { encryptData, decryptData } = require('./utils/index.js');
var fs = require('fs');
var IP2Region = require('ip2region').default;
const crypto = require('crypto');


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
exports.updateSettings = async function (req, res) {
    // 更新 SQL 语句，包括新字段
    let sql = `
        UPDATE root 
        SET 
            updated_at=?, 
            ADMIN_PASSWD=?, 
            PASSWD=?, 
            PASSINPUTPAGE_BG=?, 
            PASSWD_INPUT_LABEL=?, 
            SUCCESS_TITLE=?, 
            SUCCESS_CONTENT=?, 
            ERROR_TITLE=?, 
            ERROR_CONTENT=?, 
            FONT_FAMILY=?, 
            FONT_WEIGHT=?, 
            THEME=?, 
            DISABLE_TRANSITION=?,
            HIDE_ACCESS_PASSWD=?
    `;

    const timestamp = new Date();

    // 从请求体中提取数据
    const {
        ADMIN_PASSWD,
        PASSWD,
        PASSINPUTPAGE_BG,
        PASSWD_INPUT_LABEL,
        SUCCESS_TITLE,
        SUCCESS_CONTENT,
        ERROR_TITLE,
        ERROR_CONTENT,
        FONT_FAMILY,
        FONT_WEIGHT,
        THEME,
        DISABLE_TRANSITION,
        HIDE_ACCESS_PASSWD
    } = req.body;

    // 更新参数列表，包含新字段
    let sql_params = [
        timestamp,
        decryptData(ADMIN_PASSWD),
        decryptData(PASSWD),
        PASSINPUTPAGE_BG,
        PASSWD_INPUT_LABEL,
        SUCCESS_TITLE,
        SUCCESS_CONTENT,
        ERROR_TITLE,
        ERROR_CONTENT,
        FONT_FAMILY,
        FONT_WEIGHT,
        THEME,
        DISABLE_TRANSITION,
        HIDE_ACCESS_PASSWD
    ];

    try {
        // 执行 SQL 查询
        await database.base(sql, sql_params, (result) => {
            res.status(200).end();
        });
    } catch (error) {
        // 错误处理
        console.error('Update Settings Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}


exports.getPasswd = async function (req, res) {
    let sql = "SELECT ADMIN_PASSWD FROM online_resume.root;"
    let sql_params = [];
    await database.base(sql, sql_params, (result) => {
        let response = JSON.parse(JSON.stringify(result));
        res.send({ ADMIN_PASSWD: encryptData(response[0].ADMIN_PASSWD) })
    });
}
exports.getSettings = async function (req, res) {
    let sql = "SELECT PASSWD, PASSINPUTPAGE_BG, PASSWD_INPUT_LABEL, SUCCESS_TITLE, SUCCESS_CONTENT, ERROR_TITLE, ERROR_CONTENT, FONT_FAMILY, FONT_WEIGHT, THEME, DISABLE_TRANSITION, HIDE_ACCESS_PASSWD FROM online_resume.root;"
    let sql_params = [];
    await database.base(sql, sql_params, (result) => {
        let response = JSON.parse(JSON.stringify(result));
        res.send({ ...response[0], PASSWD: encryptData(response[0].PASSWD) })
    });
}
exports.getRootSettings = async function (req, res) {
    let sql = "SELECT created_at, updated_at, ADMIN_PASSWD, PASSWD, PASSINPUTPAGE_BG, PASSWD_INPUT_LABEL, SUCCESS_TITLE, SUCCESS_CONTENT, ERROR_TITLE, ERROR_CONTENT, FONT_FAMILY, FONT_WEIGHT, THEME, DISABLE_TRANSITION, HIDE_ACCESS_PASSWD FROM online_resume.root;";
    let sql_params = [];
    await database.base(sql, sql_params, (result) => {
        let response = JSON.parse(JSON.stringify(result));
        res.send({
            ...response[0],
            ADMIN_PASSWD: encryptData(response[0].ADMIN_PASSWD),
            PASSWD: encryptData(response[0].PASSWD)
        })
    });
}


exports.userLeaved = async (req, res) => {

    let sql = "UPDATE visitors SET leave_time = ? WHERE id = ?";
    const timestamp = new Date();

    let sql_params = [timestamp, req.query.id];
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
        res.send({ ...response[0], uuid });
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
        console.log("来自：", ip, "的访问.")
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


