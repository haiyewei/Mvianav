# Mvianav - 现代化的导航起始页

这是一个基于React开发的现代化导航起始页，提供了美观实用的搜索界面、个性化设置和云同步功能。

**项目地址：** [https://github.com/haiyewei/Mvianav](https://github.com/haiyewei/Mvianav)

## 功能列表

### 已完成功能
- ✅ 搜索框 - 支持多搜索引擎(必应、谷歌、百度、搜狗)切换
- ✅ 设置按钮 - 提供直观的设置界面
- ✅ 每日一图 - 支持必应每日壁纸，带淡入淡出效果
- ✅ 深浅模式 - 支持跟随系统、浅色和深色三种模式
- ✅ WebDAV连通 - 与云存储服务对接基础功能
- ✅ 项目Logo - 彩虹色互动Logo，支持点击变色

### 待完成功能
- ❌ 数据同步 - 通过WebDAV或浏览器同步设置和数据
- ❌ WebDAV文件获取与上传 - 完整的文件同步功能
- ❌ 书签展示 - 显示和管理用户书签
- ❌ 历史展示 - 访问历史记录功能
- ❌ 功能区展示 - 实用工具和快捷入口

## 开始使用

### `npm start`

在开发模式下运行应用。
打开 [http://localhost:3000](http://localhost:3000) 在浏览器中查看。

当你修改代码时，页面会自动重新加载。
你也可以在控制台中看到任何lint错误。

### `npm test`

启动交互式测试运行器。
查看[运行测试](https://facebook.github.io/create-react-app/docs/running-tests)章节获取更多信息。

### `npm run build`

将应用打包到`build`文件夹以用于生产环境。
它会在生产模式下正确打包React并优化构建以获得最佳性能。

构建后的文件经过压缩，文件名包含哈希值。
你的应用已经准备好部署了！

查看[部署](https://facebook.github.io/create-react-app/docs/deployment)章节获取更多信息。

## 项目架构

项目使用React和Material-UI构建，主要结构包括：

- 主搜索界面 - 提供多搜索引擎支持和视觉效果
- 设置菜单 - 管理应用首选项
- WebDAV集成 - 提供云存储连接
- 数据同步模块 - 管理设置和数据的同步

## 贡献指南

欢迎贡献代码或提出功能建议。请遵循以下步骤：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启Pull Request