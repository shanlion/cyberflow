/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_API_BASE_URL: string;
    readonly VITE_APP_ENV: string;
    readonly VITE_APP_TITLE: string;
    readonly VITE_APP_VERSION: string;
    readonly VITE_APP_DESCRIPTION: string;
    readonly VITE_APP_AUTHOR: string;
    readonly VITE_API_TIMEOUT: string;
    readonly VITE_ENABLE_MOCK: string;
    readonly VITE_ENABLE_DEVTOOLS: string;
    readonly VITE_DEBUG_MODE: string;
    // 根据需要添加更多环境变量
    readonly [key: string]: any;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

// Chrome 扩展 API 类型声明
declare namespace chrome {
    namespace storage {
        namespace local {
            function get(keys?: string | string[] | null): Promise<any>;
            function set(items: any): Promise<void>;
            function remove(keys: string | string[]): Promise<void>;
            function clear(): Promise<void>;
        }
    }

    namespace tabs {
        interface Tab {
            id?: number;
            url?: string;
            title?: string;
            active?: boolean;
            // 添加更多 Tab 相关属性
        }

        function query(queryInfo: any): Promise<Tab[]>;
        function create(createProperties: any): Promise<Tab>;
        function update(tabId: number, updateProperties: any): Promise<Tab>;
        function remove(tabIds: number | number[]): Promise<void>;
    }

    namespace runtime {
        function sendMessage(message: any): Promise<any>;
        const onMessage: {
            addListener(
                callback: (message: any, sender: any, sendResponse: any) => void
            ): void;
        };
    }

    namespace action {
        function setBadgeText(details: {
            text: string;
            tabId?: number;
        }): Promise<void>;
        function setBadgeBackgroundColor(details: {
            color: string;
            tabId?: number;
        }): Promise<void>;
    }
}

// 声明全局类型
declare global {
    interface Window {
        chrome: typeof chrome;
    }
}

export {};
