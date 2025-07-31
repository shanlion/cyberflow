<template>
    <div class="popup_wrapper">
        <Login v-if="showPage == 'login'" ref="logoRef" @submit="onLogin" />
        <WorkFlow
            v-if="showPage == 'workflow'"
            @submit="onStartWork"
            @changePage="onChangePage"
        />
        <Permission v-if="showPage == 'permission'" @submit="onTwitter" />
        <WorkLog
            v-if="showPage == 'worklog'"
            @change-workflow="onChangeWorkflow"
            @logout="onLogout"
        />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Ref, watch } from "vue";
import { onMounted } from "vue";
import { getXAccountInfo } from "../../x";
// Declare chrome for TypeScript
declare const chrome: any;

import Login from "../components/Login.vue";
import WorkFlow from "../components/WorkFlow.vue";
import Permission from "../components/Permission.vue";
import WorkLog from "../components/WorkLog.vue";

import type { ComponentPublicInstance } from "vue";
import { userApi } from "../api/api";
import { ElMessage } from "element-plus";
import { selfLocalStorage } from "./storage.js";
onMounted(() => {
    //判断应该展示哪个页面
    selfLocalStorage.getItem("token").then((token) => {
        if (!token) {
            showPage.value = "login";
            loading.value = false;
        } else {
            selfLocalStorage.getItem("page").then((page) => {
                showPage.value = page || "workflow";
                loading.value = false;
            });
        }
    });
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        // 监听推特是否登录
        if (request.action === "getLoginStatus") {
            let { value, login } = request.data;
            if (value === "twitter" && login) {
                showPage.value = "worklog";
            }
        }
    });
});
const loading = ref(true);
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
            selfLocalStorage.setItem("token", response.data.token).then(() => {
                console.log("Token saved to local storage");
                showPage.value = "workflow";
                loading.value = false;
            });

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

const onLogout = () => {
    userApi
        .logout()
        .then(() => {
            console.log("Logout successful");
            ElMessage({
                message: "登出成功",
                type: "success"
            });
            selfLocalStorage.removeItem("token").then(() => {
                console.log("Token removed from local storage");
                showPage.value = "login";
            });
        })
        .catch((error) => {
            console.error("Error during logout:", error);
            ElMessage({
                message: "登出失败",
                type: "error"
            });
        });
};

const onChangeWorkflow = () => {
    showPage.value = "workflow";
    // 清除工作流数据
    selfLocalStorage.removeItem("workflow").then(() => {
        console.log("Workflow removed from local storage");
    });
};
const onStartWork = (workflow) => {
    console.log(workflow);
    selfLocalStorage.setItem("workflow", JSON.stringify(workflow)).then(() => {
        console.log("Workflow saved to local storage");
    });
    //接口检测是否登录的推特账号正确
    checkTwitterLogin(workflow);
};
const checkTwitterLogin = async (workflow) => {
    loading.value = true;
    let currentTwitterInfo = await getXAccountInfo();
    console.log("当前推特账号信息:", currentTwitterInfo);
    if (currentTwitterInfo?.accountId == workflow.accountName || true) {
        showPage.value = "worklog";
    } else {
        showPage.value = "permission";
    }
    loading.value = false;
    return true; // 假设检查通过
};
const onTwitter = async () => {
    let workflow = await selfLocalStorage.getItem("workflow");
    checkTwitterLogin(JSON.parse(workflow));
    if (showPage.value == "permission") {
        ElMessage({
            message: `请在浏览器页面登录您的Twitter账号“${
                JSON.parse(workflow).accountName
            }”，然后点击一键授权即可。`,
            type: "warning"
        });
    }
};

const onChangePage = (page: string) => {
    showPage.value = page;
    if (page === "login") {
        selfLocalStorage.removeItem("workflow");
        selfLocalStorage.removeItem("token");
    }
};

watch(showPage, (newPage) => {
    console.log("当前页面:", newPage);
    selfLocalStorage.setItem("page", newPage);
});
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
