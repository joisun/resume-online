CREATE TABLE online_resume.main (
	content LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
	created_time DATETIME NULL,
	update_time DATETIME NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE online_resume.visitors (
	leave_time DATETIME NULL,
	created_time DATETIME NULL,
	country varchar(100) NULL,
	province varchar(100) NULL,
	city varchar(100) NULL,
	isp varchar(100) NULL,
	ip varchar(100) NULL,
	id varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE online_resume.root (
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	ADMIN_PASSWD varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'admin' NOT NULL COMMENT 'admin页面的密码, 简历编辑页面的密码',
	PASSWD varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '简历首页访问的密码， 可缺省， 如果缺省或者设定为空字符串则会视作没有访问密码',
	PASSINPUTPAGE_BG varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'circuit-board' NULL COMMENT '密码输入页面的背景图， 可选择值：food | circuit-board | wave | foliage | square',
	PASSWD_INPUT_LABEL varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '请输入密码' NULL COMMENT '提示密码输入的 <input> 框 label 值',
	SUCCESS_TITLE varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '成功' NULL COMMENT '密码正确时的提示 title',
	SUCCESS_CONTENT varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '密码正确！' NULL COMMENT '密码正确时的提示 content',
	ERROR_TITLE varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '错误！' NULL COMMENT '密码错误时的提示 title',
	ERROR_CONTENT varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '请验证密码输入！' NULL COMMENT '密码错误时的提示 content',
	FONT_FAMILY varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'font-sans' NULL COMMENT '字体类型， 可选择值：font-mono | font-sans | font-serif',
	FONT_WEIGHT varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'font-normal' NULL COMMENT '字体粗细， 可选择值：font-thin | font-normal | font-medium | font-semibold | font-bold',
	THEME varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'default' NULL COMMENT '主题类型， 默认值为 default',
	DISABLE_TRANSITION tinyint(1) DEFAULT 0 NULL COMMENT '禁用过渡动画， 0 表示不禁用， 1 表示禁用'
)
ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci
COMMENT='';


INSERT INTO online_resume.root
(created_at, updated_at, ADMIN_PASSWD, PASSWD, PASSINPUTPAGE_BG, PASSWD_INPUT_LABEL, SUCCESS_TITLE, SUCCESS_CONTENT, ERROR_TITLE, ERROR_CONTENT, FONT_FAMILY, FONT_WEIGHT, THEME, DISABLE_TRANSITION)
VALUES(CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin', '', 'circuit-board', '请输入密码', '成功', '密码正确！', '错误！', '请验证密码输入！', 'font-sans', 'font-normal', 'default', 0);
