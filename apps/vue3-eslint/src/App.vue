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
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { routes } from '@/router';

const activeIndex = ref<string>(routes[0].path);
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
</style>
