#!/bin/bash

# Chrome Extension Quick Start Script
# 快速启动开发环境的脚本

echo "🚀 Cyberflow Extension - Quick Start"
echo "=================================="

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# 清理之前的构建
echo "🧹 Cleaning previous builds..."
npm run clean

# 开始开发构建
echo "🔨 Starting development build..."
npm run dev &

# 获取构建进程ID
BUILD_PID=$!

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "Next steps:"
echo "1. Open Chrome and go to chrome://extensions/"
echo "2. Enable 'Developer mode' in the top right"
echo "3. Click 'Load unpacked' and select the 'dist' folder"
echo "4. Start developing! The extension will auto-rebuild on file changes."
echo ""
echo "Commands:"
echo "- Press Ctrl+C to stop the development server"
echo "- Run 'npm run build' for production build"
echo "- Run 'npm run package' to create a ZIP file for distribution"
echo ""

# 等待用户中断
wait $BUILD_PID
