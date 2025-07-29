<template>
    <div class="popup_wrapper">
        <Login v-if="showPage == 'login'" ref="logoRef" @submit="onLogin" />
        <WorkFlow v-if="showPage == 'workflow'" @submit="onStartWork" />
        <Permission v-if="showPage == 'permission'" @submit="onTwitter" />
        <WorkLog v-if="showPage == 'worklog'" />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Ref } from "vue";
import { onMounted } from "vue";

import Login from "../components/Login.vue";
import WorkFlow from "../components/WorkFlow.vue";
import Permission from "../components/Permission.vue";
import WorkLog from "../components/WorkLog.vue";

import type { ComponentPublicInstance } from "vue";
import { userApi } from "../api/api.js";
import { ElMessage } from "element-plus";
onMounted(() => {});
const userData = ref(null);
const showPage = ref("login"); // 控制显示的页面
// Use the correct type for the Login component instance
const logoRef = ref<ComponentPublicInstance<{
    clearInputs: () => void;
}> | null>(null);
const onLogin = (name, pass) => {
    // Handle login logic here
    console.log(name, pass);
    console.log("Login submitted");
    userApi
        .login(name, pass)
        .then((response) => {
            console.log("Login successful");
            ElMessage({
                message: "登录成功",
                type: "success"
            });
            localStorage.setItem("token", response.data.token);
            userData.value = response.data;
            //跳转工作流选择页面
            showPage.value = "workflow";
        })
        .catch((error) => {
            ElMessage({
                message: error.message,
                type: "error"
            });
            console.error("Error during login:", error);
        })
        .finally(() => {
            // Optionally, you can reset the form or perform other actions
            logoRef.value?.clearInputs();
        });
};

const onStartWork = (id) => {
    console.log(id);
};

const onTwitter = () => {};
</script>

<style scoped lang="scss">
.popup_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 505px;
    height: 700px;
    background: linear-gradient(136deg, #fefafb 0%, #e7f9fd 100%);
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.15);
    border-radius: 12px 12px 12px 12px;
}
</style>
