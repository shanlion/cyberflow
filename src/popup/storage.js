export const selfLocalStorage = {
    getItem(key) {
        return new Promise((resolve) => {
            if (chrome.storage) {
                chrome.storage.sync.get([key], (result) => {
                    resolve(result[key]);
                });
            } else {
                resolve(localStorage.getItem(key));
            }
        });
    },
    setItem(key, value) {
        return new Promise((resolve) => {
            if (chrome.storage) {
                chrome.storage.sync.set({ [key]: value }, () => {
                    resolve();
                });
            } else {
                localStorage.setItem(key, value);
                resolve();
            }
        });
    },
    removeItem(key) {
        return new Promise((resolve) => {
            if (chrome.storage) {
                chrome.storage.sync.remove([key], () => {
                    resolve();
                });
                return;
            } else {
                localStorage.removeItem(key);
                resolve();
            }
        });
    }
};
