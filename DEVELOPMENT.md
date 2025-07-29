# Development Notes

## Chrome Extension Development

### Manifest V3 Migration

This extension uses Manifest V3, which is the latest standard for Chrome extensions. Key differences from V2:

-   Service Workers instead of background pages
-   Promises and async/await support
-   Enhanced security model
-   Updated permissions system

### Build System

This project uses **Vite** as the build tool for optimal development experience：

#### Development Mode

```bash
# 开发模式 - 监听文件变化自动构建
npm run dev

# 开发模式构建（不监听）
npm run build:dev
```

#### Production Build

```bash
# 生产环境构建
npm run build

# 构建并打包为ZIP文件
npm run package
```

#### Other Commands

```bash
# 清理构建目录
npm run clean

# 监听模式（持续构建）
npm run watch

# 预览构建结果
npm run preview
```

### File Structure

```
/
├── manifest.json       # Extension configuration
├── background.js       # Service worker (background script)
├── content.js         # Content script (injected into web pages)
├── popup/             # Extension popup interface
├── options/           # Settings/options page
├── styles/            # CSS files
│   └── variables.scss # SCSS variables (if using SCSS)
├── icons/             # Extension icons
├── assets/            # Static resources
├── dist/              # Build output directory
├── vite.config.js     # Vite configuration
├── .env.development   # Development environment variables
└── .env.production    # Production environment variables
```

### Development Workflow

1. **Install Dependencies**: `npm install`
2. **Start Development**: `npm run dev`
3. **Load Extension**: Go to `chrome://extensions/`, enable Developer mode, click "Load unpacked", select `dist` folder
4. **Make Changes**: Edit source files - Vite will auto-rebuild
5. **Reload Extension**: Click refresh button in extensions page
6. **Test**: Verify functionality works as expected

### Vite Configuration Features

-   **Multi-entry Build**: Separate builds for background, content, popup, and options
-   **Asset Handling**: Automatic copying of manifest, icons, and static assets
-   **Development Sourcemaps**: Enhanced debugging experience
-   **Production Optimization**: Minification and tree-shaking
-   **Hot Reload**: Fast development iteration

### Debugging

-   **Background Script**: Click "service worker" link in extensions page
-   **Content Script**: Use DevTools on any web page (F12)
-   **Popup**: Right-click extension icon → Inspect
-   **Options Page**: Use DevTools on options page (F12)

### Common Issues

-   **Permission Errors**: Check manifest.json permissions
-   **Script Injection**: Ensure content scripts are properly registered
-   **Storage Access**: Use chrome.storage API, not localStorage
-   **Cross-Origin**: Use host_permissions for external requests

### Testing Checklist

-   [ ] Extension loads without errors
-   [ ] Popup opens and functions correctly
-   [ ] Options page saves settings
-   [ ] Content script injects properly
-   [ ] Background script handles messages
-   [ ] Storage operations work
-   [ ] Icons display correctly

### Build and Package

```bash
# Create distribution package
npm run package

# This will create cyberflow-extension.zip
```

### Submission to Chrome Web Store

1. Create developer account at https://chrome.google.com/webstore/devconsole/
2. Pay one-time $5 registration fee
3. Upload ZIP package
4. Fill out store listing details
5. Submit for review

### Resources

-   [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
-   [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/intro/)
-   [Chrome Extension Samples](https://github.com/GoogleChrome/chrome-extensions-samples)
