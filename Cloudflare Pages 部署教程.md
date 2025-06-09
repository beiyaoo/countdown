# Cloudflare Pages 部署教程

Cloudflare Pages 是一个免费的静态网站托管服务，提供全球CDN加速、自动HTTPS、无限带宽等优秀特性。本教程将详细指导您如何将高考倒计时网页部署到Cloudflare Pages。

## 为什么选择 Cloudflare Pages？

- **免费使用**：提供慷慨的免费额度
- **全球CDN**：自动分发到全球边缘节点，访问速度快
- **自动HTTPS**：免费SSL证书，自动配置HTTPS
- **Git集成**：支持GitHub、GitLab等代码仓库自动部署
- **自定义域名**：支持绑定自己的域名
- **无限带宽**：不限制流量使用

## 准备工作

### 1. 注册Cloudflare账号

访问 [Cloudflare官网](https://www.cloudflare.com/) 注册一个免费账号。

### 2. 准备代码仓库

确保您的项目代码已经上传到GitHub、GitLab或其他Git托管平台。如果还没有，请按以下步骤操作：

#### 创建GitHub仓库

1. 访问 [GitHub](https://github.com/) 并登录
2. 点击右上角的 "+" 号，选择 "New repository"
3. 填写仓库名称，如 `gaokao-countdown`
4. 选择 "Public"（公开）或 "Private"（私有）
5. 点击 "Create repository"

#### 上传代码到GitHub

在项目根目录下执行以下命令：

```bash
# 初始化Git仓库（如果还没有）
git init

# 添加所有文件
git add .

# 提交代码
git commit -m "Initial commit: 高考倒计时网页"

# 添加远程仓库（替换为您的GitHub仓库地址）
git remote add origin https://github.com/您的用户名/gaokao-countdown.git

# 推送代码到GitHub
git push -u origin main
```

## 部署到 Cloudflare Pages

### 方法一：通过Cloudflare Dashboard部署（推荐）

#### 1. 登录Cloudflare Dashboard

访问 [Cloudflare Dashboard](https://dash.cloudflare.com/) 并登录您的账号。

#### 2. 创建Pages项目

1. 在左侧导航栏中选择 "Pages"
2. 点击 "Create a project" 按钮
3. 选择 "Connect to Git"

#### 3. 连接Git仓库

1. 选择您的Git提供商（GitHub、GitLab等）
2. 授权Cloudflare访问您的仓库
3. 选择包含高考倒计时项目的仓库
4. 点击 "Begin setup"

#### 4. 配置构建设置

在项目设置页面，填写以下信息：

- **Project name**：项目名称，如 `gaokao-countdown`
- **Production branch**：生产分支，通常是 `main` 或 `master`
- **Framework preset**：选择 "React"
- **Build command**：`npm run build`
- **Build output directory**：`dist`

#### 5. 环境变量（可选）

如果您的项目需要环境变量，可以在 "Environment variables" 部分添加。对于这个高考倒计时项目，通常不需要额外的环境变量。

#### 6. 部署

点击 "Save and Deploy" 按钮开始部署。Cloudflare Pages会自动：

1. 克隆您的代码仓库
2. 安装依赖（`npm install`）
3. 执行构建命令（`npm run build`）
4. 部署生成的静态文件

部署过程通常需要1-3分钟。完成后，您会看到一个类似 `https://项目名.pages.dev` 的URL。

### 方法二：通过Wrangler CLI部署

Wrangler是Cloudflare的官方命令行工具，适合开发者使用。

#### 1. 安装Wrangler

```bash
npm install -g wrangler
```

#### 2. 登录Cloudflare

```bash
wrangler login
```

这会打开浏览器，要求您登录Cloudflare账号并授权。

#### 3. 创建Pages项目

在项目根目录下创建 `wrangler.toml` 配置文件：

```toml
name = "gaokao-countdown"
compatibility_date = "2024-01-01"

[env.production]
name = "gaokao-countdown"

[[env.production.routes]]
pattern = "yourdomain.com/*"
zone_name = "yourdomain.com"
```

#### 4. 构建项目

```bash
npm run build
```

#### 5. 部署到Pages

```bash
wrangler pages deploy dist --project-name gaokao-countdown
```

## 自定义域名配置

### 1. 添加自定义域名

1. 在Cloudflare Pages项目页面，点击 "Custom domains" 标签
2. 点击 "Set up a custom domain"
3. 输入您的域名，如 `countdown.yourdomain.com`
4. 点击 "Continue"

### 2. 配置DNS记录

根据Cloudflare的提示，在您的域名DNS设置中添加CNAME记录：

- **Type**: CNAME
- **Name**: countdown（或您选择的子域名）
- **Target**: 您的Pages项目域名（如 `gaokao-countdown.pages.dev`）

如果您的域名也托管在Cloudflare，DNS记录会自动添加。

### 3. 等待生效

DNS记录生效通常需要几分钟到几小时。生效后，您就可以通过自定义域名访问网站了。

## 自动部署设置

Cloudflare Pages支持Git集成，当您推送代码到仓库时会自动触发部署。

### 配置自动部署

1. 在Pages项目设置中，确保 "Automatic deployments" 已启用
2. 选择要监听的分支（通常是 `main`）
3. 每次向该分支推送代码时，Cloudflare Pages会自动重新部署

### 预览部署

对于非生产分支的推送，Cloudflare Pages会创建预览部署，您可以在合并到主分支前测试更改。

## 高级配置

### 1. 重定向规则

在项目根目录创建 `_redirects` 文件来配置重定向：

```
# 将所有路径重定向到index.html（适用于单页应用）
/*    /index.html   200

# 自定义重定向示例
/old-path    /new-path    301
```

### 2. 自定义Headers

创建 `_headers` 文件来设置自定义HTTP头：

```
/*
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
```

### 3. 函数功能（可选）

Cloudflare Pages支持边缘函数，可以在 `functions` 目录下创建服务端逻辑。对于静态网站通常不需要。

## 性能优化建议

### 1. 启用压缩

Cloudflare Pages默认启用Gzip和Brotli压缩，无需额外配置。

### 2. 缓存优化

静态资源会自动缓存到全球CDN节点，提供最佳性能。

### 3. 图片优化

考虑使用Cloudflare Images服务来自动优化图片。

## 监控和分析

### 1. 访问Analytics

在Cloudflare Dashboard的Pages项目页面，您可以查看：

- 页面访问量
- 带宽使用情况
- 错误率统计
- 地理分布数据

### 2. 设置告警

可以配置告警规则，当网站出现问题时及时通知。

## 故障排除

### 常见问题

1. **构建失败**
   - 检查 `package.json` 中的构建脚本
   - 确保所有依赖都在 `dependencies` 中
   - 查看构建日志中的错误信息

2. **404错误**
   - 确保构建输出目录设置正确（`dist`）
   - 检查是否需要添加重定向规则

3. **自定义域名不生效**
   - 检查DNS记录是否正确配置
   - 等待DNS传播完成（最多24小时）

### 获取帮助

- [Cloudflare Pages文档](https://developers.cloudflare.com/pages/)
- [Cloudflare社区论坛](https://community.cloudflare.com/)
- [GitHub Issues](https://github.com/cloudflare/pages-action/issues)

## 总结

Cloudflare Pages为静态网站提供了优秀的托管服务，具有以下优势：

- 免费且功能强大
- 全球CDN加速
- 自动HTTPS
- Git集成自动部署
- 支持自定义域名
- 丰富的配置选项

通过本教程，您应该能够成功将高考倒计时网页部署到Cloudflare Pages，并享受快速、稳定的访问体验。

## 示例项目

您可以访问我们已经部署的示例：[高考倒计时网页](https://vsqadrpi.manus.space)

这个示例展示了所有功能的完整实现，包括：
- 实时倒计时
- 主题切换
- 留言系统
- 管理员功能
- 响应式设计

如果在部署过程中遇到任何问题，请随时寻求帮助！

