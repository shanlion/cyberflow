<template>
    <div class="logo_wrapper">
        <Logo class="logo_icon" />
        <div class="logo_title">CyberFlow</div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, type Ref } from "vue";
import { onMounted } from "vue";
import Logo from "./Logo.vue";

onMounted(() => {});
</script>

<style scoped lang="scss">
.logo_wrapper {
    display: flex;
    align-items: center;
    justify-content: start;
    .logo_icon {
        width: 40px !important;
        height: 40px !important;
        margin-right: 10px;
    }
    .logo_title {
        font-family: PingFang SC, PingFang SC;
        font-weight: 600;
        font-size: 18px;
        color: #000000;
        line-height: 28px;
        text-align: left;
        font-style: normal;
        text-transform: none;
    }
}
</style>
