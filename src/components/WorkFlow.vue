<template>
    <div class="workflow_wrapper" v-loading="loading">
        <LogoHead class="logo_head" />
        <div class="title">选择工作流</div>
        <div class="raidos_wrap">
            <el-radio-group v-model="workSelectId">
                <el-radio
                    v-for="workflow in workflows"
                    :key="workflow.id"
                    :value="workflow.id?.toString()"
                    size="large"
                >
                    {{ `${workflow.workflowName} ${workflow.accountName}` }}
                </el-radio>
            </el-radio-group>
        </div>

        <div class="submit_btn" @click="handleSubmit">
            <div class="submit_text">一键启动工作流</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, type Ref, defineEmits } from "vue";
import LogoHead from "./LogoHead.vue";
import type { WorkFlowData } from "../types/workflow";
import { workflowApi } from "../api/api.js";
onMounted(() => {
    loading.value = true;
    workflowApi
        .getWorkflows()
        .then((response) => {
            workflows.value = response.data || [];
        })
        .catch((error) => {
            console.error("Error fetching workflows:", error);
        })
        .finally(() => {
            loading.value = false;
        });
});
const workflows = ref<WorkFlowData[]>([
    {
        id: 1,
        workflowName: "工作流1",
        accountName: "账号1"
    },
    {
        id: 2,
        workflowName:
            "工作流2工作流2工作流2工作流2工作流2工作流2工作流2工作流2工作流2工作流2工作流2工作流2",
        accountName: "账号2"
    }
]);
const workSelectId: Ref<string> = ref("1");
const emit = defineEmits(["submit"]);
// 处理提交事件
const handleSubmit = () => {
    emit("submit", workSelectId.value);
};
const loading = ref(false);
</script>

<style scoped lang="scss">
.workflow_wrapper {
    border-radius: 12px 12px 12px 12px;
    border-radius: 12px 12px 12px 12px;
    .logo_head {
        margin-block: 40px;
        margin-top: 80px;
        width: 100%;
    }
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: start;
    padding-inline: 74px;
    width: calc(100% - 148px);
    height: 100%;
    .title {
        height: 34px;
        font-family: PingFang SC, PingFang SC;
        font-weight: 500;
        font-size: 24px;
        color: #000000;
        text-align: center;
        font-style: normal;
        text-transform: none;
        margin-bottom: 40px;
    }
    .raidos_wrap {
        min-height: 148px;
        max-height: 248px;
        overflow: auto;
    }

    .submit_btn {
        width: 246px;
        height: 40px;
        background: #9e40ff;
        border-radius: 8px 8px 8px 8px;

        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 68px;
        cursor: pointer;
        .submit_text {
            height: 28px;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            font-size: 18px;
            color: #ffffff;
            line-height: 28px;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }
    }
    .disabled {
        background: #d8b3ff;
    }
}

::v-deep .raidos_wrap .el-radio-group {
    display: flex;
    flex-direction: column;
    align-items: start;
    .el-radio {
        margin: 0;
        max-width: 400px;
        overflow: hidden;
        white-space: normal;
        height: unset;
        margin-bottom: 20px;

        .el-radio__label {
            font-family: PingFang SC, PingFang SC;
            font-weight: 400;
            font-size: 16px;
            color: #262626;
            text-align: left;
            font-style: normal;
            text-transform: none;
        }
    }
}
</style>
