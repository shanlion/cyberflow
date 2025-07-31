<template>
    <div class="logs_wrapper">
        <div class="title_head">
            <div class="title">
                当前工作流：{{ workflowName }}
                <span class="change_wrap">切换工作流</span>
            </div>
            <div class="logout_btn">登出</div>
        </div>
        <el-table
            class="log_table"
            :data="tableData"
            height="552"
            style="background: unset; border-radius: 8px 8px 0 0"
        >
            <el-table-column prop="date" label="发Twitter账号" width="110">
            </el-table-column>
            <el-table-column prop="article" label="发Twitter内容" width="187">
                <template #default="scope">
                    <el-tooltip
                        class="box-item"
                        effect="dark"
                        :content="scope.row.article"
                        placement="top-start"
                    >
                        {{ scope.row.article }}
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="时间" width="100">
            </el-table-column>
            <el-table-column prop="status" label="状态" width="60">
                <template #default="scope">
                    <el-tag :type="stateType(scope.row.status)">{{
                        stateText(scope.row.status)
                    }}</el-tag>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="prev, pager, next" :total="1000" />
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Ref } from "vue";
import { onMounted } from "vue";
import { missionApi } from "../api/api.js";
const loading = ref(true);
const tableData = ref([]);
const props = defineProps({
    workflowId: String,
});
onMounted(() => {
    missionApi
        .getMissionPage({workflowId: props.workflowId })
        .then((response) => {
            console.log(response);
            tableData.value = response.data.rows || [];
        })
        .catch((error) => {
            console.error("Error fetching missions:", error);
        })
        .finally(() => {
            loading.value = false;
        });
});
const workflowName: Ref<string> = ref("工作流1");
const stateText = (val: string | number) => {
    switch (val) {
        case 0:
            return "失败";
        default:
            return "成功";
    }
};

const stateType = (val: string | number) => {
    switch (val) {
        case 0:
            return "danger";
        default:
            return "success";
    }
};

const timeText = (val: string | number) => {
    const date = new Date(val);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};
</script>

<style scoped lang="scss">
.logs_wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: start;
    width: 100%;

    .title_head {
        width: calc(100% - 48px);
        margin: 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .title {
            font-family: PingFang SC, PingFang SC;
            font-weight: 600;
            font-size: 16px;
            color: rgba(0, 0, 0, 0.85);
            text-align: left;
            font-style: normal;
            text-transform: none;

            .change_wrap {
                margin-left: 12px;
                font-family: PingFang SC, PingFang SC;
                font-weight: 400;
                font-size: 14px;
                color: #9e40ff;
                text-align: left;
                font-style: normal;
                text-transform: none;
                cursor: pointer;
            }
        }

        .logout_btn {
            width: 80px;
            height: 34px;
            background: #9e40ff;
            border-radius: 8px 8px 8px 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: PingFang SC, PingFang SC;
            font-weight: 500;
            font-size: 16px;
            color: #ffffff;
            text-align: left;
            font-style: normal;
            text-transform: none;
            cursor: pointer;
        }
    }

    .log_table {
        width: calc(100% - 48px);
        margin: 0 24px;
        margin-bottom: 12px;
    }
}

::v-deep .el-table .el-table__cell {
    padding: 0;
    background: unset;
}

::v-deep .el-table tr {
    background: unset;
}

::v-deep .el-table thead {
    border-radius: 0px 8px 0px 0px;
    background: #f3f1fe;
    font-family: PingFang SC, PingFang SC;
    font-weight: 600;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    line-height: 22px;
    text-align: left;
    font-style: normal;
    text-transform: none;
}

::v-deep .el-table .cell {
    padding-block: 12px;
    padding-inline: 8px;
    font-family: PingFang SC, PingFang SC;
    font-weight: 400;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.9);
    line-height: 22px;
    text-align: left;
    font-style: normal;
    text-transform: none;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
