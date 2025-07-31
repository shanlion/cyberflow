// Background script for Chrome extension
// This is a service worker in Manifest V3
import { workflowApi } from "./src/api/api";
import { selfLocalStorage } from "./src/popup/storage";
console.log("Cyberflow Extension background script loaded");
let timer;
// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log("Extension installed:", details);

    // // Set default settings
    // chrome.storage.sync.set({
    //     enabled: true,
    //     theme: "light",
    //     notifications: true
    // });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in background:", request);

    switch (request.action) {
        case "startWork":
            startWork(sendResponse);
            return true; // Keep message channel open for async response
        case "toggleFeature":
            handleToggleFeature(request.data, sendResponse);
            return true;
        case "loginTwitter":
            handleLoginTwitter(sender, sendResponse);
            return true;
        default:
            console.log("Unknown action:", request.action);
    }
});
function startWork(sendResponse) {
    if (timer) {
        clearInterval(timer);
    }
    timer = setInterval(() => {
        handleWork();
    }, 10000); // 每10秒轮询一次
    sendResponse({ success: true, message: "启动轮训机制成功" });
}

async function handleWork() {
    //轮训任务接口并处理任务，任务处理成功后回调服务端并通知popup刷新
    let workflow = await selfLocalStorage.getItem("workflow");
    if (!workflow) {
        console.error("No workflow found in local storage");
        return;
    }
    let workflowObj = JSON.parse(workflow);
    workflowApi
        .getNeedPushList(workflowObj.id)
        .then((response) => {
            if (response.data && response.data.length > 0) {
                // 处理任务逻辑
                console.log("Received tasks:", response.data);
                console.log("Processing tasks...", response);
                //发布任务异步，成功后通知popup刷新
                // 这里可以添加处理任务的逻辑
            } else {
                console.log("No tasks to process");
            }
        })
        .catch((error) => {
            console.error("Error fetching tasks:", error);
        });
}

// // Helper functions
// function handleGetTabInfo(tab, sendResponse) {
//     if (tab) {
//         sendResponse({
//             success: true,
//             data: {
//                 url: tab.url,
//                 title: tab.title,
//                 id: tab.id
//             }
//         });
//     } else {
//         sendResponse({ success: false, error: "No tab information available" });
//     }
// }

// function handleToggleFeature(data, sendResponse) {
//     chrome.storage.sync.get(["enabled"], (result) => {
//         const newState = !result.enabled;
//         chrome.storage.sync.set({ enabled: newState }, () => {
//             sendResponse({ success: true, enabled: newState });
//         });
//     });
// }
function handleLoginTwitter(tab, sendResponse) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
            chrome.tabs.update(tabs[0].id, { url: "https://x.com/" });
        } else {
            chrome.tabs.create({ url: "https://x.com/" });
        }
    });
    sendResponse({ success: true });
}
// Handle extension context menu (if needed)
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//     console.log("Context menu clicked:", info);
// });
