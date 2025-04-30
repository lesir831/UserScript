# UserScript 仓库

这个仓库包含了一系列用户脚本（UserScripts），用于增强浏览器功能和改善网页体验。这些脚本可以通过Tampermonkey等浏览器扩展来安装和使用。

## 脚本列表

### LeetCode Copy Cleaner
- **功能**: 复制LeetCode代码时，自动移除末尾附加的作者信息和题目链接
- **适用网站**: leetcode.com, leetcode.cn
- **文件**: `js/LeetCopyCleaner.js`
- **一键安装**: [点击安装](https://www.tampermonkey.net/install.php?src=https://raw.githubusercontent.com/lesir831/UserScript/main/js/LeetCopyCleaner.js)

### 强制本页打开链接
- **功能**: 将指定域名下原本设置为在新标签页打开的链接强制在当前页面打开
- **适用网站**: 可配置的任意网站
- **文件**: `js/ForceOpenLinksInCurrentPage.js`
- **一键安装**: [点击安装](https://www.tampermonkey.net/install.php?src=https://raw.githubusercontent.com/lesir831/UserScript/main/js/ForceOpenLinksInCurrentPage.js)


## 使用说明

### LeetCode Copy Cleaner
- 安装脚本后访问 LeetCode 网站
- 点击代码块旁的复制按钮即可复制干净的代码，不会包含末尾的作者信息和链接

### 强制本页打开链接
- 安装脚本后，在需要启用的网站上点击Tampermonkey图标
- 选择「✅ 启用当前域名」菜单项
- 刷新页面后生效，此时所有新标签页链接将在当前页面打开
- 可随时通过「❌ 禁用当前域名」菜单项关闭功能
- 使用「📜 查看已启用域名」查看当前配置

## 贡献指南

欢迎贡献新的用户脚本或改进现有脚本：

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 开发说明

如需修改或扩展这些脚本，直接编辑对应的JS文件即可。所有脚本使用JavaScript编写，并遵守Tampermonkey格式标准。
