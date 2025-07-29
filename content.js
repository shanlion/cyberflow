// Content script - runs on web pages
console.log("Cyberflow Extension content script loaded");

// Initialize extension on page load
(function () {
    "use strict";

    // Configuration
    const CONFIG = {
        extensionId: "cyberflow-extension",
        className: "cyberflow-enhanced"
    };

    // Main initialization
    function init() {
        // Check if extension is enabled
        chrome.storage.sync.get(["enabled"], (result) => {
            if (result.enabled !== false) {
                setupExtension();
            }
        });
    }

    // Setup extension functionality
    function setupExtension() {
        // Add extension marker to body
        document.body.classList.add(CONFIG.className);

        // Listen for storage changes
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === "sync" && changes.enabled) {
                if (changes.enabled.newValue) {
                    document.body.classList.add(CONFIG.className);
                } else {
                    document.body.classList.remove(CONFIG.className);
                }
            }
        });

        // Setup feature modules
        setupPageEnhancements();
        setupMessageListener();
    }

    // Page enhancement features
    function setupPageEnhancements() {
        // Example: Add custom styling or functionality
        console.log("Setting up page enhancements");

        // You can add custom features here
        // For example: image optimization, text enhancement, etc.
    }

    // Message listener for communication with popup/background
    function setupMessageListener() {
        chrome.runtime.onMessage.addListener(
            (request, sender, sendResponse) => {
                console.log("Content script received message:", request);

                switch (request.action) {
                    case "getPageInfo":
                        sendResponse({
                            success: true,
                            data: {
                                title: document.title,
                                url: window.location.href,
                                domain: window.location.hostname,
                                images: document.images.length,
                                links: document.links.length
                            }
                        });
                        break;

                    case "highlightText":
                        highlightText(request.text);
                        sendResponse({ success: true });
                        break;

                    default:
                        sendResponse({
                            success: false,
                            error: "Unknown action"
                        });
                }
            }
        );
    }

    // Utility functions
    function highlightText(text) {
        if (!text) return;

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        const textNodes = [];
        let node;

        while ((node = walker.nextNode())) {
            if (node.textContent.toLowerCase().includes(text.toLowerCase())) {
                textNodes.push(node);
            }
        }

        textNodes.forEach((textNode) => {
            const parent = textNode.parentNode;
            const regex = new RegExp(`(${text})`, "gi");
            const html = textNode.textContent.replace(
                regex,
                '<mark class="cyberflow-highlight">$1</mark>'
            );

            const wrapper = document.createElement("span");
            wrapper.innerHTML = html;
            parent.replaceChild(wrapper, textNode);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
