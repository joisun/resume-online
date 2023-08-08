# 使用 Node.js 官方镜像作为基础镜像
FROM node:18

# 安装 PM2
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com/
RUN npm install -g pm2

# 设置工作目录
WORKDIR /app

# 复制应用程序代码到工作目录
COPY . .

# 安装依赖
RUN npm install


# 设置环境变量
ENV NODE_ENV=production
ENV DB_HOST=mysql-db
ENV DB_PORT=3392
ENV DB_USER=root
ENV DB_PASSWORD=123456
ENV DB_NAME=online_resume


EXPOSE 4000


# 启动应用
CMD ["pm2-runtime", "start", "ecosystem.config.js","tail -f"]