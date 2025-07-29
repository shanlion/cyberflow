import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
    // 构建配置
    build: {
        // 输出目录
        outDir: "dist",
        // 清空输出目录
        emptyOutDir: true,
        // 生成 sourcemap
        sourcemap: process.env.NODE_ENV === "development",
        // 禁用代码分割，扩展需要独立的文件
        rollupOptions: {
            input: {
                // 定义多个入口点
                background: resolve(__dirname, "background.js"),
                content: resolve(__dirname, "content.js"),
                popup: resolve(__dirname, "popup/popup.html"),
                options: resolve(__dirname, "options/options.html")
            },
            output: {
                // 保持原始文件名
                entryFileNames: (chunkInfo) => {
                    const facadeModuleId = chunkInfo.facadeModuleId;
                    if (facadeModuleId.includes("background.js")) {
                        return "background.js";
                    }
                    if (facadeModuleId.includes("content.js")) {
                        return "content.js";
                    }
                    return "[name].js";
                },
                chunkFileNames: "[name].js",
                assetFileNames: (assetInfo) => {
                    // CSS文件保持在对应目录
                    if (assetInfo.name.endsWith(".css")) {
                        if (assetInfo.name.includes("popup")) {
                            return "popup/[name][extname]";
                        }
                        if (assetInfo.name.includes("options")) {
                            return "options/[name][extname]";
                        }
                        if (assetInfo.name.includes("content")) {
                            return "styles/[name][extname]";
                        }
                    }
                    // 其他资源文件
                    return "assets/[name][extname]";
                }
            }
        },
        // 优化配置
        minify: process.env.NODE_ENV === "production",
        target: "chrome88" // Chrome扩展最低支持版本
    },

    // 开发服务器配置
    server: {
        port: 3000,
        host: true,
        // 开发时不需要启动服务器，扩展直接加载文件
        open: false,
        proxy: {
            "/api": "http://testkolabc.cyberflow.info/cyberinfo"
        }
    },

    // 路径解析
    resolve: {
        alias: {
            "@": resolve(__dirname, "."),
            "@popup": resolve(__dirname, "popup"),
            "@options": resolve(__dirname, "options"),
            "@styles": resolve(__dirname, "styles"),
            "@assets": resolve(__dirname, "assets"),
            "@icons": resolve(__dirname, "icons")
        }
    },

    // 插件配置
    plugins: [
        // 自定义插件：处理Chrome扩展特殊需求
        vue(),

        {
            name: "chrome-extension",
            buildStart() {
                console.log("🚀 Building Chrome Extension...");
            },
            generateBundle() {
                // 确保输出目录存在
                const dirs = [
                    "dist/popup",
                    "dist/options",
                    "dist/styles",
                    "dist/icons",
                    "dist/assets"
                ];
                dirs.forEach((dir) => {
                    if (!existsSync(dir)) {
                        mkdirSync(dir, { recursive: true });
                    }
                });
            },
            writeBundle() {
                console.log("📋 Copying manifest and static files...");

                // 复制 manifest.json
                if (existsSync("manifest.json")) {
                    copyFileSync("manifest.json", "dist/manifest.json");
                }

                // 复制图标文件
                const iconFiles = [
                    "icon16.png",
                    "icon32.png",
                    "icon48.png",
                    "icon128.png"
                ];
                iconFiles.forEach((icon) => {
                    const iconPath = `icons/${icon}`;
                    if (existsSync(iconPath)) {
                        copyFileSync(iconPath, `dist/icons/${icon}`);
                    }
                });

                // 复制 assets 目录下的文件
                try {
                    const fs = require("fs");
                    const path = require("path");

                    function copyDir(src, dest) {
                        if (!fs.existsSync(src)) return;

                        if (!fs.existsSync(dest)) {
                            fs.mkdirSync(dest, { recursive: true });
                        }

                        const files = fs.readdirSync(src);
                        files.forEach((file) => {
                            const srcPath = path.join(src, file);
                            const destPath = path.join(dest, file);

                            if (fs.statSync(srcPath).isDirectory()) {
                                copyDir(srcPath, destPath);
                            } else if (!file.endsWith(".md")) {
                                fs.copyFileSync(srcPath, destPath);
                            }
                        });
                    }

                    copyDir("assets", "dist/assets");
                } catch (error) {
                    console.warn(
                        "⚠️ Could not copy assets directory:",
                        error.message
                    );
                }

                console.log("✅ Chrome Extension build completed!");
            }
        }
    ],

    // 环境变量
    define: {
        __DEV__: process.env.NODE_ENV === "development",
        __PROD__: process.env.NODE_ENV === "production"
    },

    // 依赖优化
    optimizeDeps: {
        // Chrome扩展通常不需要依赖预构建
        include: [],
        exclude: ["chrome"]
    },

    // 公共路径配置
    base: "./",

    // 实验性功能
    experimental: {
        // 构建时显示更多信息
        renderBuiltUrl(filename) {
            return filename;
        }
    }
});
