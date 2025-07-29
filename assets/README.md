# 静态资源目录

此目录用于存放扩展的静态资源文件。

## 文件类型

可以在此目录中放置：

-   图片文件（.png, .jpg, .svg）
-   音频文件（.mp3, .wav）
-   数据文件（.json, .xml）
-   字体文件（.woff, .woff2, .ttf）
-   其他静态资源

## 访问方式

在扩展中可以通过以下方式访问资源：

```javascript
// 获取资源URL
const resourceUrl = chrome.runtime.getURL("assets/image.png");

// 在content script中使用
const img = document.createElement("img");
img.src = chrome.runtime.getURL("assets/logo.png");
```

## 配置说明

资源文件已在 `manifest.json` 中配置为 `web_accessible_resources`，
可以被网页内容访问。

## 示例文件

可以添加以下类型的文件：

-   `logo.png` - 扩展 logo
-   `sounds/notification.mp3` - 通知音效
-   `data/config.json` - 配置数据
-   `fonts/custom.woff2` - 自定义字体
