#!/bin/bash

echo "🔍 Verifying Chrome Extension Paths..."
echo "====================================="

# 检查文件是否存在
check_file() {
    if [ -f "$1" ]; then
        echo "✅ $1 exists"
        return 0
    else
        echo "❌ $1 missing"
        return 1
    fi
}

# 检查目录结构
echo ""
echo "📁 Directory Structure:"
echo "======================="
if [ -d "dist" ]; then
    find dist -type f -name "*.html" -o -name "*.js" -o -name "*.css" | head -20 | sort
else
    echo "❌ dist directory not found"
    exit 1
fi

echo ""
echo "🔗 Checking HTML File Paths:"
echo "============================"

# 检查popup.html路径
if [ -f "dist/popup/popup.html" ]; then
    echo "🔍 Checking popup.html..."
    
    # 检查JS路径
    if grep -q 'src="./popup.js"' dist/popup/popup.html; then
        echo "✅ popup.js path is correct (./popup.js)"
    else
        echo "❌ popup.js path is incorrect"
        grep 'src=' dist/popup/popup.html
    fi
    
    # 检查CSS路径
    if grep -q 'href="./popup.css"' dist/popup/popup.html; then
        echo "✅ popup.css path is correct (./popup.css)"
    else
        echo "❌ popup.css path is incorrect"
        grep 'href=' dist/popup/popup.html
    fi
    
    # 检查对应文件是否存在
    check_file "dist/popup/popup.js"
    check_file "dist/popup/popup.css"
fi

echo ""

# 检查options.html路径
if [ -f "dist/options/options.html" ]; then
    echo "🔍 Checking options.html..."
    
    # 检查JS路径
    if grep -q 'src="./options.js"' dist/options/options.html; then
        echo "✅ options.js path is correct (./options.js)"
    else
        echo "❌ options.js path is incorrect"
        grep 'src=' dist/options/options.html
    fi
    
    # 检查CSS路径
    if grep -q 'href="./options.css"' dist/options/options.html; then
        echo "✅ options.css path is correct (./options.css)"
    else
        echo "❌ options.css path is incorrect"
        grep 'href=' dist/options/options.html
    fi
    
    # 检查对应文件是否存在
    check_file "dist/options/options.js"
    check_file "dist/options/options.css"
fi

echo ""
echo "📋 Other Important Files:"
echo "========================="
check_file "dist/manifest.json"
check_file "dist/background.js"
check_file "dist/content.js"

echo ""
echo "🎉 Path verification completed!"
