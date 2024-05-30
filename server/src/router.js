const express = require("express");
const router = express.Router();
const services = require("./services.js");

// 登录功能
// 获取所用应用服务列表
router.post(
    "/save",
    services.save
);
router.get(
    "/get",
    services.get
);
router.get(
    "/getVisitors",
    services.getVisitors
);

module.exports = router;