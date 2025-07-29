// Popup JavaScript
document.addEventListener("DOMContentLoaded", function () {
    console.log("Popup loaded");

    // Initialize popup
    initializePopup();
    setupEventListeners();
    loadCurrentState();
});

// Initialize popup functionality
function initializePopup() {
    // Update current tab info
    getCurrentTabInfo();
}

// Setup all event listeners
function setupEventListeners() {
    // Toggle switch
    const enableToggle = document.getElementById("enableToggle");
    enableToggle.addEventListener("change", handleToggleChange);

    // Feature buttons
    document
        .getElementById("pageInfoBtn")
        .addEventListener("click", showPageInfo);
    document
        .getElementById("highlightBtn")
        .addEventListener("click", showHighlightDialog);
    document
        .getElementById("screenshotBtn")
        .addEventListener("click", takeScreenshot);
    document
        .getElementById("settingsBtn")
        .addEventListener("click", openSettings);

    // Action buttons
    document
        .getElementById("analyzeBtn")
        .addEventListener("click", analyzePage);
    document.getElementById("exportBtn").addEventListener("click", exportData);

    // Footer links
    document.getElementById("helpLink").addEventListener("click", openHelp);
    document
        .getElementById("feedbackLink")
        .addEventListener("click", openFeedback);
}

// Load current extension state
function loadCurrentState() {
    chrome.storage.sync.get(["enabled"], (result) => {
        const enableToggle = document.getElementById("enableToggle");
        const statusDot = document.querySelector(".status-dot");
        const statusText = document.querySelector(".status-text");

        const isEnabled = result.enabled !== false;
        enableToggle.checked = isEnabled;

        if (isEnabled) {
            statusDot.classList.add("active");
            statusText.textContent = "运行中";
        } else {
            statusDot.classList.remove("active");
            statusText.textContent = "已禁用";
        }
    });
}

// Handle toggle switch change
function handleToggleChange(event) {
    const isEnabled = event.target.checked;
    showLoading(true);

    chrome.storage.sync.set({ enabled: isEnabled }, () => {
        // Update status
        const statusDot = document.querySelector(".status-dot");
        const statusText = document.querySelector(".status-text");

        if (isEnabled) {
            statusDot.classList.add("active");
            statusText.textContent = "运行中";
        } else {
            statusDot.classList.remove("active");
            statusText.textContent = "已禁用";
        }

        showLoading(false);
        showNotification(isEnabled ? "扩展已启用" : "扩展已禁用");
    });
}

// Get current tab information
function getCurrentTabInfo() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            const currentTab = tabs[0];
            console.log("Current tab:", currentTab.url);

            // Send message to content script to get page info
            chrome.tabs.sendMessage(
                currentTab.id,
                { action: "getPageInfo" },
                (response) => {
                    if (response && response.success) {
                        console.log("Page info:", response.data);
                    }
                }
            );
        }
    });
}

// Feature button handlers
function showPageInfo() {
    showLoading(true);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "getPageInfo" },
                (response) => {
                    showLoading(false);

                    if (response && response.success) {
                        const info = response.data;
                        const message =
                            `页面标题: ${info.title}\n` +
                            `域名: ${info.domain}\n` +
                            `图片数量: ${info.images}\n` +
                            `链接数量: ${info.links}`;
                        alert(message);
                    } else {
                        alert("无法获取页面信息");
                    }
                }
            );
        }
    });
}

function showHighlightDialog() {
    const text = prompt("请输入要高亮显示的文本:");
    if (text) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]) {
                chrome.tabs.sendMessage(
                    tabs[0].id,
                    {
                        action: "highlightText",
                        text: text
                    },
                    (response) => {
                        if (response && response.success) {
                            showNotification("文本高亮成功");
                        } else {
                            showNotification("高亮失败");
                        }
                    }
                );
            }
        });
    }
}

function takeScreenshot() {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
        if (dataUrl) {
            // Create download link
            const link = document.createElement("a");
            link.href = dataUrl;
            link.download = `screenshot-${Date.now()}.png`;
            link.click();
            showNotification("截图已保存");
        } else {
            showNotification("截图失败");
        }
    });
}

function openSettings() {
    chrome.runtime.openOptionsPage();
}

// Action button handlers
function analyzePage() {
    showLoading(true);

    // Simulate analysis
    setTimeout(() => {
        showLoading(false);
        showNotification("页面分析完成");
    }, 2000);
}

function exportData() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                { action: "getPageInfo" },
                (response) => {
                    if (response && response.success) {
                        const data = JSON.stringify(response.data, null, 2);
                        const blob = new Blob([data], {
                            type: "application/json"
                        });
                        const url = URL.createObjectURL(blob);

                        const link = document.createElement("a");
                        link.href = url;
                        link.download = `page-data-${Date.now()}.json`;
                        link.click();

                        URL.revokeObjectURL(url);
                        showNotification("数据已导出");
                    }
                }
            );
        }
    });
}

// Footer link handlers
function openHelp() {
    chrome.tabs.create({ url: "https://github.com/your-repo/help" });
}

function openFeedback() {
    chrome.tabs.create({ url: "https://github.com/your-repo/issues" });
}

// Utility functions
function showLoading(show) {
    const overlay = document.getElementById("loadingOverlay");
    if (show) {
        overlay.classList.add("show");
    } else {
        overlay.classList.remove("show");
    }
}

function showNotification(message) {
    // Simple notification - you can enhance this
    const notification = document.createElement("div");
    notification.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: #4f46e5;
    color: white;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 12px;
    z-index: 1000;
    animation: fadeInOut 3s ease-in-out;
  `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        document.body.removeChild(notification);
    }, 3000);
}

// Add CSS for notification animation
const style = document.createElement("style");
style.textContent = `
  @keyframes fadeInOut {
    0% { opacity: 0; transform: translateX(100%); }
    15%, 85% { opacity: 1; transform: translateX(0); }
    100% { opacity: 0; transform: translateX(100%); }
  }
`;
document.head.appendChild(style);
