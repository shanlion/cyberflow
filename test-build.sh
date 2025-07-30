#!/bin/bash

echo "🔨 Testing Vite Build Configuration..."
echo "=================================="

# 清理之前的构建
echo "🧹 Cleaning previous builds..."
rm -rf dist

# 执行构建
echo "📦 Building extension..."
npm run build

# 检查构建结果
echo ""
echo "📋 Build Results:"
echo "=================="

if [ -d "dist" ]; then
    echo "✅ dist directory created"
    
    # 检查关键文件
    if [ -f "dist/manifest.json" ]; then
        echo "✅ manifest.json copied"
    else
        echo "❌ manifest.json missing"
    fi
    
    if [ -f "dist/background.js" ]; then
        echo "✅ background.js created"
    else
        echo "❌ background.js missing"
    fi
    
    if [ -f "dist/content.js" ]; then
        echo "✅ content.js created"
    else
        echo "❌ content.js missing"
    fi
    
    if [ -f "dist/popup/popup.js" ]; then
        echo "✅ popup/popup.js created in correct directory"
    else
        echo "❌ popup/popup.js missing or in wrong directory"
    fi
    
    if [ -f "dist/options/options.js" ]; then
        echo "✅ options/options.js created in correct directory"
    else
        echo "❌ options/options.js missing or in wrong directory"
    fi
    
    # 显示目录结构
    echo ""
    echo "📁 Directory Structure:"
    echo "======================="
    find dist -type f | sort
    
else
    echo "❌ Build failed - dist directory not found"
fi

echo ""
echo "🎉 Build test completed!"
