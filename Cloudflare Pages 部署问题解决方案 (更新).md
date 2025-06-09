# Cloudflare Pages 部署问题解决方案 (更新)

## 问题描述
在部署到 Cloudflare Pages 时遇到构建错误：`[vite:build-html] Failed to resolve /src/main.jsx from /opt/buildhome/repo/index.html`

## 问题原因
Vite 在 Cloudflare Pages 的构建环境中，可能无法正确解析 `index.html` 中使用绝对路径 `/src/main.jsx` 引用的入口文件。即使本地构建成功，部署环境的路径解析机制可能不同。

## 解决方案

### 1. 修改 `index.html` 中的入口文件引用路径
将 `index.html` 中 `<script type="module" src="/src/main.jsx"></script>` 修改为相对路径：

```html
<script type="module" src="./src/main.jsx"></script>
```

### 2. 确保依赖兼容性 (已在之前步骤完成)
- `date-fns`: 降级到 `^3.6.0`
- `react`: 降级到 `^18.3.1`
- `react-dom`: 降级到 `^18.3.1`
- 在项目根目录创建 `.npmrc` 文件，内容为 `legacy-peer-deps=true`

### 3. 清理并重新安装依赖 (如果之前未执行或遇到问题)
```bash
# 删除旧的依赖文件
rm -rf node_modules package-lock.json pnpm-lock.yaml

# 使用 legacy-peer-deps 安装依赖
npm install --legacy-peer-deps
```

### 4. 本地测试构建
```bash
npm run build
```

### 5. Cloudflare Pages 配置
- **框架预设**: React (Vite)
- **构建命令**: `npm run build`
- **构建输出目录**: `dist`
- **Node.js 版本**: 18.x 或更高
- **重要提示：** 确保 **“根目录 (Root directory)”** 字段为空或设置为 `/`，而不是 `gaokao-countdown`。如果您的项目代码直接位于仓库的根目录，则此设置至关重要。

## 验证部署
部署成功后，访问生成的 URL 确认所有功能正常工作。

## 最新部署地址
[https://uzfvtfph.manus.space](https://uzfvtfph.manus.space)

