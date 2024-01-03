<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <el-menu
                    :default-active="activeIndex"
                    class="el-menu-demo"
                    mode="horizontal"
                    router
                >
                    <el-menu-item v-for="(item, i) in routes" :key="i" :index="item.path">
                        {{ item.meta?.title }}
                    </el-menu-item>
                </el-menu>
            </el-header>
            <el-main>
                <router-view> </router-view>
            </el-main>
            <el-affix target=".common-layout" position="bottom" :offset="600">
                <el-button type="primary" :icon="Tools" @click="openSetting"></el-button>
            </el-affix>
        </el-container>

        <setting v-model="visible"></setting>
    </div>
</template>

<script setup lang="ts">
import { routes } from '@/router';
import { Tools } from '@element-plus/icons-vue';
import Setting from './view/setting.vue';

const activeIndex = ref<string>(routes.value[0].path);

const visible = ref<boolean>(false);

function openSetting() {
    visible.value = true;
}
</script>

<style>
.common-layout {
    height: 100%;
}
.el-container {
    height: 100%;
}
.el-header {
    padding: 0;
}
.el-affix--fixed {
    text-align: right;
    display: inline-block;
}
</style>
