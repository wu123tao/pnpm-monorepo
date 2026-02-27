<template>
    <div class="h-screen">
        <el-container class="border-red-500 h-screen">
            <el-header class="p-0!">
                <div class="border-b border-b-[#dcdfe6] flex items-center">
                    <el-menu
                        :default-active="activeIndex"
                        mode="horizontal"
                        router
                        class="border-b-0! w-[95vw]"
                    >
                        <el-menu-item v-for="(item, i) in routes" :key="i" :index="item.path">
                            {{ item.meta?.title }}
                        </el-menu-item>
                    </el-menu>
                    <div class="w-[5vw]">
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
import { useRoute } from 'vue-router';

const route = useRoute();

const activeIndex = ref<string>('');

function languageSetting(language: 'en' | 'zh' | 'tw') {
    i18n.global.locale.value = language;
    localStorage.setItem('language', language);
}

onMounted(() => {
    console.log(route);
    activeIndex.value = route.path;
    console.log(activeIndex.value);
});
</script>

<style></style>
