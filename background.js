// Background script for Chrome extension
// This is a service worker in Manifest V3

console.log("Cyberflow Extension background script loaded");

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    console.log("Extension installed:", details);

    // Set default settings
    chrome.storage.sync.set({
        enabled: true,
        theme: "light",
        notifications: true
    });
});

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Message received in background:", request);

    switch (request.action) {
        case "getTabInfo":
            handleGetTabInfo(sender.tab, sendResponse);
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

// Handle tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === "complete" && tab.url) {
        console.log("Tab updated:", tab.url);
        // Perform actions when page is fully loaded
    }
});

// Helper functions
function handleGetTabInfo(tab, sendResponse) {
    if (tab) {
        sendResponse({
            success: true,
            data: {
                url: tab.url,
                title: tab.title,
                id: tab.id
            }
        });
    } else {
        sendResponse({ success: false, error: "No tab information available" });
    }
}

function handleToggleFeature(data, sendResponse) {
    chrome.storage.sync.get(["enabled"], (result) => {
        const newState = !result.enabled;
        chrome.storage.sync.set({ enabled: newState }, () => {
            sendResponse({ success: true, enabled: newState });
        });
    });
}

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
