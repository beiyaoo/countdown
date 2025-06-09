# 高考倒计时网页部署教程

本教程将指导您如何将高考倒计时网页部署到自己的服务器或GitHub Pages。

## 项目概述

这是一个响应式高考倒计时及祝福留言网页，包含以下功能：
- 实时倒计时显示（天、时、分、秒）
- 可自定义目标日期时间
- 支持正计时/倒计时模式切换
- 明暗主题切换功能
- 祝福留言功能（支持公开/私密留言）
- 管理员密钥验证系统（默认密钥：`admin2025`）
- 本地存储数据持久化
- 响应式设计，适配手机、平板和桌面端
- 底部介绍链接支持HTML语法

## 部署到服务器

如果您有自己的Web服务器（如Nginx, Apache），可以通过以下步骤部署：

### 1. 构建项目

首先，您需要将React项目构建成静态文件。在项目根目录下运行以下命令：

```bash
cd /home/ubuntu/gaokao-countdown
npm install
npm run build
```

这将在项目根目录下生成一个名为`dist`的文件夹，其中包含了所有用于部署的静态文件（HTML, CSS, JavaScript等）。

### 2. 配置Web服务器

将`dist`文件夹中的所有内容上传到您的Web服务器的根目录（或您希望部署的子目录）。

**Nginx 配置示例：**

```nginx
server {
    listen 80;
    server_name yourdomain.com; # 替换为您的域名

    root /path/to/your/gaokao-countdown/dist; # 替换为dist文件夹的实际路径
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache 配置示例：**

在您的Apache配置文件中（通常是`httpd.conf`或虚拟主机配置文件），确保文档根目录指向`dist`文件夹，并配置`mod_rewrite`以处理单页应用路由：

```apache
<VirtualHost *:80>
    ServerName yourdomain.com # 替换为您的域名
    DocumentRoot /path/to/your/gaokao-countdown/dist # 替换为dist文件夹的实际路径

    <Directory /path/to/your/gaokao-countdown/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    <IfModule mod_rewrite.c>
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </IfModule>
</VirtualHost>
```

配置完成后，重启您的Web服务器。

## 部署到GitHub Pages

GitHub Pages是一个免费的静态网站托管服务，非常适合部署此类项目。

### 1. 准备工作

确保您的项目是一个Git仓库，并且已经推送到GitHub。

### 2. 安装`gh-pages`包

在项目根目录下安装`gh-pages`包：

```bash
npm install --save-dev gh-pages
```

### 3. 修改`package.json`

在`package.json`文件中添加`homepage`字段和`deploy`脚本。`homepage`应设置为您的GitHub Pages URL，格式为`https://<USERNAME>.github.io/<REPO_NAME>`。

```json
{
  "name": "gaokao-countdown",
  "version": "0.0.0",
  "private": true,
  "homepage": "https://<您的GitHub用户名>.github.io/<您的仓库名>",
  "type": "module",
  "scripts": {
    "dev": "vite --host",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist" # 添加这一行
  },
  "dependencies": {
    "lucide-react": "^0.378.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.19",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.1",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.6",
    "gh-pages": "^6.1.1", # 添加这一行
    "postcss": "^8.4.38",
    "tailwindcss": "^3.4.3",
    "vite": "^5.2.0"
  }
}
```

### 4. 部署

运行以下命令进行部署：

```bash
npm run build
npm run deploy
```

`npm run deploy`命令会将`dist`文件夹的内容推送到您仓库的`gh-pages`分支。如果该分支不存在，它会自动创建。

### 5. 启用GitHub Pages

1. 访问您的GitHub仓库页面。
2. 点击`Settings`（设置）。
3. 在左侧导航栏中选择`Pages`。
4. 在`Branch`部分，选择`gh-pages`分支作为部署来源，然后点击`Save`。

稍等片刻，您的网站就会在`https://<您的GitHub用户名>.github.io/<您的仓库名>`上线。

## 访问已部署的网页

您可以通过以下链接访问我为您部署的网页：

[高考倒计时网页](https://lqkcstho.manus.space)

如果您在部署过程中遇到任何问题，请随时向我提问。

