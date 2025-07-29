// Options page JavaScript
document.addEventListener("DOMContentLoaded", function () {
    console.log("Options page loaded");

    initializeOptionsPage();
    setupEventListeners();
    loadSettings();
});

// Initialize options page
function initializeOptionsPage() {
    // Setup navigation
    setupNavigation();

    // Setup range slider
    setupRangeSlider();
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation buttons
    const navButtons = document.querySelectorAll(".nav-btn");
    navButtons.forEach((btn) => {
        btn.addEventListener("click", handleNavigation);
    });

    // Toggle switches
    const toggles = document.querySelectorAll(".toggle input");
    toggles.forEach((toggle) => {
        toggle.addEventListener("change", handleToggleChange);
    });

    // Select elements
    const selects = document.querySelectorAll(".setting-select");
    selects.forEach((select) => {
        select.addEventListener("change", handleSelectChange);
    });

    // Range slider
    const rangeSlider = document.getElementById("cacheSize");
    rangeSlider.addEventListener("input", handleRangeChange);

    // Danger buttons
    document
        .getElementById("clearDataBtn")
        .addEventListener("click", clearData);
    document
        .getElementById("resetBtn")
        .addEventListener("click", resetSettings);

    // About links
    document
        .getElementById("homepageLink")
        .addEventListener("click", () =>
            openLink("https://github.com/your-repo")
        );
    document
        .getElementById("documentationLink")
        .addEventListener("click", () =>
            openLink("https://github.com/your-repo/wiki")
        );
    document
        .getElementById("issuesLink")
        .addEventListener("click", () =>
            openLink("https://github.com/your-repo/issues")
        );
    document
        .getElementById("changelogLink")
        .addEventListener("click", () =>
            openLink("https://github.com/your-repo/releases")
        );
}

// Navigation handling
function setupNavigation() {
    const firstNavBtn = document.querySelector(".nav-btn");
    const firstSection = document.querySelector(".settings-section");

    if (firstNavBtn && firstSection) {
        firstNavBtn.classList.add("active");
        firstSection.classList.add("active");
    }
}

function handleNavigation(event) {
    const targetSection = event.currentTarget.dataset.section;

    // Update navigation
    document.querySelectorAll(".nav-btn").forEach((btn) => {
        btn.classList.remove("active");
    });
    event.currentTarget.classList.add("active");

    // Update sections
    document.querySelectorAll(".settings-section").forEach((section) => {
        section.classList.remove("active");
    });

    const targetSectionElement = document.getElementById(targetSection);
    if (targetSectionElement) {
        targetSectionElement.classList.add("active");
    }
}

// Settings handling
function loadSettings() {
    chrome.storage.sync.get(
        [
            "enabled",
            "autoUpdate",
            "notifications",
            "pageAnalysis",
            "textHighlight",
            "quickScreenshot",
            "dataExport",
            "theme",
            "language",
            "animations",
            "debugMode",
            "cacheSize"
        ],
        (result) => {
            // Load toggle states
            document.getElementById("globalEnable").checked =
                result.enabled !== false;
            document.getElementById("autoUpdate").checked =
                result.autoUpdate !== false;
            document.getElementById("notifications").checked =
                result.notifications !== false;
            document.getElementById("pageAnalysis").checked =
                result.pageAnalysis !== false;
            document.getElementById("textHighlight").checked =
                result.textHighlight !== false;
            document.getElementById("quickScreenshot").checked =
                result.quickScreenshot !== false;
            document.getElementById("dataExport").checked =
                result.dataExport !== false;
            document.getElementById("animations").checked =
                result.animations !== false;
            document.getElementById("debugMode").checked =
                result.debugMode === true;

            // Load select values
            document.getElementById("themeSelect").value =
                result.theme || "light";
            document.getElementById("languageSelect").value =
                result.language || "zh-CN";

            // Load range value
            const cacheSize = result.cacheSize || 50;
            document.getElementById("cacheSize").value = cacheSize;
            document.querySelector(
                ".range-value"
            ).textContent = `${cacheSize} MB`;
        }
    );
}

function handleToggleChange(event) {
    const settingName = event.target.id;
    const value = event.target.checked;

    // Convert ID to storage key
    const storageKey = settingName.replace(/([A-Z])/g, (match) =>
        match.toLowerCase()
    );

    chrome.storage.sync.set({ [storageKey]: value }, () => {
        console.log(`Setting ${storageKey} updated to:`, value);
        showSaveStatus();
    });
}

function handleSelectChange(event) {
    const settingName = event.target.id.replace("Select", "");
    const value = event.target.value;

    chrome.storage.sync.set({ [settingName]: value }, () => {
        console.log(`Setting ${settingName} updated to:`, value);
        showSaveStatus();

        // Apply theme immediately if theme changed
        if (settingName === "theme") {
            applyTheme(value);
        }
    });
}

function setupRangeSlider() {
    const rangeSlider = document.getElementById("cacheSize");
    const rangeValue = document.querySelector(".range-value");

    rangeSlider.addEventListener("input", (event) => {
        const value = event.target.value;
        rangeValue.textContent = `${value} MB`;
    });
}

function handleRangeChange(event) {
    const value = parseInt(event.target.value);

    chrome.storage.sync.set({ cacheSize: value }, () => {
        console.log("Cache size updated to:", value);
        showSaveStatus();
    });
}

// Action handlers
function clearData() {
    if (confirm("确定要清除所有扩展数据吗？此操作不可撤销。")) {
        chrome.storage.sync.clear(() => {
            chrome.storage.local.clear(() => {
                alert("所有数据已清除");
                loadSettings(); // Reload default settings
            });
        });
    }
}

function resetSettings() {
    if (confirm("确定要重置所有设置到默认值吗？")) {
        const defaultSettings = {
            enabled: true,
            autoUpdate: true,
            notifications: true,
            pageAnalysis: true,
            textHighlight: true,
            quickScreenshot: true,
            dataExport: true,
            theme: "light",
            language: "zh-CN",
            animations: true,
            debugMode: false,
            cacheSize: 50
        };

        chrome.storage.sync.set(defaultSettings, () => {
            alert("设置已重置为默认值");
            loadSettings();
        });
    }
}

function openLink(url) {
    chrome.tabs.create({ url: url });
}

// Theme handling
function applyTheme(theme) {
    const body = document.body;
    body.classList.remove("theme-light", "theme-dark", "theme-auto");

    if (theme === "auto") {
        // Use system preference
        const isDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches;
        body.classList.add(isDark ? "theme-dark" : "theme-light");
    } else {
        body.classList.add(`theme-${theme}`);
    }
}

// UI feedback
function showSaveStatus() {
    const saveStatus = document.getElementById("saveStatus");
    saveStatus.classList.add("show");

    setTimeout(() => {
        saveStatus.classList.remove("show");
    }, 2000);
}

// Initialize theme on load
chrome.storage.sync.get(["theme"], (result) => {
    applyTheme(result.theme || "light");
});

// Listen for system theme changes
window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
        chrome.storage.sync.get(["theme"], (result) => {
            if (result.theme === "auto") {
                applyTheme("auto");
            }
        });
    });
