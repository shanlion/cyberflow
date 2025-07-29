# 图标文件放置说明

请将以下尺寸的图标文件放置在此目录中：

-   `icon16.png` - 16x16 像素，用于工具栏和页面操作
-   `icon32.png` - 32x32 像素，用于扩展管理页面
-   `icon48.png` - 48x48 像素，用于扩展管理页面
-   `icon128.png` - 128x128 像素，用于 Chrome Web Store

## 图标设计建议

-   使用简洁、易识别的设计
-   确保在小尺寸下清晰可见
-   使用适合品牌的颜色方案
-   保持透明背景（PNG 格式）
-   考虑深色和浅色主题的兼容性

## 生成图标

可以使用以下工具生成不同尺寸的图标：

1. **在线工具**：

    - [Favicon Generator](https://favicon.io/)
    - [Icon Generator](https://www.iconfinder.com/)

2. **设计软件**：

    - Adobe Illustrator
    - Sketch
    - Figma
    - GIMP (免费)

3. **命令行工具**：
    ```bash
    # 使用ImageMagick调整图标尺寸
    convert icon.png -resize 16x16 icon16.png
    convert icon.png -resize 32x32 icon32.png
    convert icon.png -resize 48x48 icon48.png
    convert icon.png -resize 128x128 icon128.png
    ```

暂时可以使用占位符图标，项目运行时 Chrome 会显示默认图标。
