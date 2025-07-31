// Background script for Chrome extension
// This is a service worker in Manifest V3

console.log("Cyberflow Extension background script loaded");

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
        case "getTabInfo":
            handleGetTabInfo(sender.tab, sendResponse);
            return true; // Keep message channel open for async response

        case "toggleFeature":
            handleToggleFeature(request.data, sendResponse);
            return true;

        default:
            console.log("Unknown action:", request.action);
    }
});

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
