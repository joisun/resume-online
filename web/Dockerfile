# 使用 Node.js 官方镜像作为基础镜像
FROM node:18 AS builder

# 安装 PM2
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com/

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json 到工作目录
COPY ./package*.json ./

# 安装依赖
RUN npm install pnpm -g
RUN pnpm install

# 复制应用程序代码到工作目录
COPY . .

# 设置环境变量
ARG VITE_ADMIN_PASSWD
ENV VITE_ADMIN_PASSWD=$VITE_ADMIN_PASSWD

# 设置环境变量
ENV NODE_ENV=production
RUN pnpm run build



FROM nginx AS server

COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf


EXPOSE 80


# 启动应用
CMD ["nginx", "-g", "daemon off;"]
