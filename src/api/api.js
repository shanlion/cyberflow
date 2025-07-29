import axios from "axios";

const baseURL = import.meta.env.VUE_APP_API_BASE_URL;
// 创建axios实例
const apiClient = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
});

// 请求拦截器
apiClient.interceptors.request.use(
    (config) => {
        // 在发送请求之前添加token
        const token =
            localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 添加时间戳防止缓存
        if (config.method === "get") {
            config.params = {
                ...config.params,
                _t: Date.now()
            };
        }

        console.log("Request sent:", config);
        return config;
    },
    (error) => {
        console.error("Request error:", error);
        return Promise.reject(error);
    }
);

// 响应拦截器
apiClient.interceptors.response.use(
    (response) => {
        console.log("Response received:", response);

        // 统一处理响应数据
        const { data, status } = response;

        if (status === 200) {
            // 根据后端约定的数据结构处理
            if (data.code === 0) {
                return data;
            } else {
                // 业务错误
                const error = new Error(data.message || data.msg || "请求失败");
                error.code = data.code;
                throw error;
            }
        }

        return response;
    },
    (error) => {
        console.error("Response error:", error);

        // 处理HTTP错误状态码
        if (error.response) {
            const { status, data } = error.response;

            switch (status) {
                case 401:
                    // 未授权，清除token并跳转登录
                    localStorage.removeItem("token");
                    sessionStorage.removeItem("token");
                    // 可以在这里添加跳转登录的逻辑
                    console.warn("未授权，请重新登录");
                    break;
                case 403:
                    console.warn("权限不足");
                    break;
                case 404:
                    console.warn("请求的资源不存在");
                    break;
                case 500:
                    console.error("服务器内部错误");
                    break;
                default:
                    console.error(`请求失败，状态码: ${status}`);
            }

            // 返回后端返回的错误信息
            const errorMessage = data?.message || `HTTP Error ${status}`;
            const customError = new Error(errorMessage);
            customError.status = status;
            customError.data = data;

            return Promise.reject(customError);
        } else if (error.request) {
            // 网络错误
            const networkError = new Error("网络错误，请检查网络连接");
            networkError.type = "network";
            return Promise.reject(networkError);
        } else {
            // 其他错误
            return Promise.reject(error);
        }
    }
);

/**
 * 通用API请求方法
 */
export const request = {
    /**
     * GET请求
     * @param {string} url - 请求URL
     * @param {object} params - 查询参数
     * @param {object} config - axios配置
     * @returns {Promise}
     */
    get: (url, params = {}, config = {}) => {
        return apiClient.get(url, { params, ...config });
    },

    /**
     * POST请求
     * @param {string} url - 请求URL
     * @param {object} data - 请求数据
     * @param {object} config - axios配置
     * @returns {Promise}
     */
    post: (url, data = {}, config = {}) => {
        return apiClient.post(url, data, config);
    },

    /**
     * PUT请求
     * @param {string} url - 请求URL
     * @param {object} data - 请求数据
     * @param {object} config - axios配置
     * @returns {Promise}
     */
    put: (url, data = {}, config = {}) => {
        return apiClient.put(url, data, config);
    },

    /**
     * DELETE请求
     * @param {string} url - 请求URL
     * @param {object} config - axios配置
     * @returns {Promise}
     */
    delete: (url, config = {}) => {
        return apiClient.delete(url, config);
    },

    /**
     * PATCH请求
     * @param {string} url - 请求URL
     * @param {object} data - 请求数据
     * @param {object} config - axios配置
     * @returns {Promise}
     */
    patch: (url, data = {}, config = {}) => {
        return apiClient.patch(url, data, config);
    },

    /**
     * 文件上传
     * @param {string} url - 上传URL
     * @param {FormData} formData - 文件数据
     * @param {function} onUploadProgress - 上传进度回调
     * @returns {Promise}
     */
    upload: (url, formData, onUploadProgress) => {
        return apiClient.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress
        });
    },

    /**
     * 下载文件
     * @param {string} url - 下载URL
     * @param {object} params - 查询参数
     * @returns {Promise}
     */
    download: (url, params = {}) => {
        return apiClient.get(url, {
            params,
            responseType: "blob"
        });
    }
};

/**
 * 工作流相关API
 */
export const workflowApi = {
    getWorkflows: () => {
        return request.get("/api/cyberflow/plugin/workflow/list");
    },

    /**
     * 启动工作流
     * @param {number} id - 工作流ID
     * @param {object} params - 启动参数
     * @returns {Promise}
     */
    startWorkflow: (id, params = {}) => {
        return request.post(`/workflows/${id}/start`, params);
    }
};

/**
 * 用户相关API
 */
export const userApi = {
    /**
     * 用户登录
     * @param {object} credentials - 登录凭据
     * @returns {Promise}
     */
    login: (name, password) => {
        return request.post("/api/login-by-email", {
            username: name,
            password: password,
            captchaCode: "",
            captchaCodeKey: ""
        });
    },

    /**
     * 用户登出
     * @returns {Promise}
     */
    logout: () => {
        return request.get("/api/logout");
    }
};

// 默认导出request对象
export default request;
