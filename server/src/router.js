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
router.get("/getPasswd", services.getPasswd)
router.get("/getSettings", services.getSettings)
router.get("/getRootSettings", services.getRootSettings)
router.post("/updateSettings", services.updateSettings)
router.get(
    "/getVisitors",
    services.getVisitors
);
router.post(
    "/userLeaved",
    services.userLeaved
);


module.exports = router;