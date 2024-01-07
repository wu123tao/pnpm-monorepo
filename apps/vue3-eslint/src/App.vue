<template>
    <div class="common-layout">
        <el-container>
            <el-header>
                <div class="container">
                    <el-menu
                        :default-active="activeIndex"
                        class="el-menu-header"
                        mode="horizontal"
                        router
                    >
                        <el-menu-item v-for="(item, i) in routes" :key="i" :index="item.path">
                            {{ item.meta?.title }}
                        </el-menu-item>
                    </el-menu>
                    <div>
                        <el-dropdown @click="languageSetting">
                            <img src="/language.svg" alt="" width="25" />
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="languageSetting('zh')">
                                        {{ $t('setting.language.zh') }}
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="languageSetting('tw')">
                                        {{ $t('setting.language.tw') }}
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="languageSetting('en')">
                                        {{ $t('setting.language.en') }}
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </div>
            </el-header>
            <el-main>
                <router-view> </router-view>
            </el-main>
        </el-container>
    </div>
</template>

<script setup lang="ts">
import { routes } from '@/router';
import i18n from '@/lang';

const activeIndex = ref<string>(routes.value[0].path);

function languageSetting(language: 'en' | 'zh' | 'tw') {
    i18n.global.locale.value = language;
    localStorage.setItem('language', language);
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
.el-menu-header {
    border-bottom: unset !important;
    min-width: 80vw;
}
.el-header .container {
    display: flex;
    width: 100vw;
    align-items: center;
    justify-content: space-around;
    border-bottom: solid 1px var(--el-menu-border-color);
}
</style>
