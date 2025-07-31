<template>
    <div class="popup_wrapper">
        <Login v-if="showPage == 'login'" ref="logoRef" @submit="onLogin" />
        <WorkFlow v-if="showPage == 'workflow'" @submit="onStartWork" />
        <Permission v-if="showPage == 'permission'" @submit="onTwitter" />
        <WorkLog v-if="showPage == 'worklog'" :workflowId="workflowId"/>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Ref } from "vue";
import { onMounted } from "vue";

// Declare chrome for TypeScript
declare const chrome: any;

import Login from "../components/Login.vue";
import WorkFlow from "../components/WorkFlow.vue";
import Permission from "../components/Permission.vue";
import WorkLog from "../components/WorkLog.vue";

import type { ComponentPublicInstance } from "vue";
import { userApi } from "../api/api.js";
import { ElMessage } from "element-plus";
onMounted(() => {
    //判断应该展示哪个页面
    chrome.storage.sync.get(["token", "page"], (result) => {
        showPage.value = result.page || "";
        loginToken.value = result.token || "";
        if (!loginToken.value) {
            showPage.value = "login";
        }
        loading.value = false;
    });
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // 监听推特是否登录
        if (request.action === "getLoginStatus") {
            let {value, login} = request.data
            if (value === 'twitter' && login) {
                showPage.value = "worklog";
            }
        }
    });
});
const loading = ref(true);
const loginToken = ref("");
const userData = ref(null);
const showPage = ref(""); // 控制显示的页面
const workflowId = ref("");
// Use the correct type for the Login component instance
const logoRef = ref<ComponentPublicInstance<{
    clearInputs: () => void;
}> | null>(null);
const onLogin = (name, pass) => {
    // Handle login logic here
    console.log(name, pass);
    console.log("Login submitted");
    loading.value = true;
    userApi
        .login(name, pass)
        .then((response) => {
            console.log("Login successful");
            ElMessage({
                message: "登录成功",
                type: "success"
            });
            localStorage.setItem("token", response.data.token);
            showPage.value = "workflow";
            chrome.storage.sync.set(
                { token: response.data.token, page: "workflow" },
                () => {
                    //跳转工作流选择页面
                    loading.value = false;
                }
            );
            userData.value = response.data;
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: "error"
            });
            console.error("Error during login:", error);
            loading.value = false;
        })
        .finally(() => {
            // Optionally, you can reset the form or perform other actions
            logoRef.value?.clearInputs();
        });
};
const sendTwitterData = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs.id, { 
            action: "sendTwitter", 
            data: {url: 'xxxx'} 
        }, (response) => {
            console.log("Twitter回复:", response);
        });
    });
}
const onStartWork = (id) => {
    console.log(id);
    showPage.value = "worklog";
    workflowId.value = id;
    // chrome.storage.sync.set(
    //     { page: "worklog" },
    // );
};

const onTwitter = () => {
    chrome.runtime.sendMessage({ action: "loginTwitter" });
};
</script>

<style scoped lang="scss">
.popup_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 505px;
    // height: 700px;
    height: 600px;
    background: linear-gradient(136deg, #fefafb 0%, #e7f9fd 100%);
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.15);
    border-radius: 12px 12px 12px 12px;
}
</style>

<style>
body {
    margin: 0;
    padding: 0;
    width: 505px;
    height: 600px;
    overflow: hidden;
}
</style>
