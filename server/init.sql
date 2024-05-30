CREATE TABLE online_resume.main (
	content LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL,
	created_time DATETIME NULL,
	update_time DATETIME NULL
)

CREATE TABLE online_resume.visitors (
	created_time DATETIME NULL,
	country varchar(100) NULL,
	province varchar(100) NULL,
	city varchar(100) NULL,
	isp varchar(100) NULL,
	ip varchar(100) NULL
)


ENGINE=InnoDB
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci;
