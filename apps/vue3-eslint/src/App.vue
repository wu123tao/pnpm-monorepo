<template>
    <div class="container">
        <a target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a target="_blank">
            <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
        <el-button type="primary" @click="handleClick">{{ num }}</el-button>
    </div>
</template>

<script setup lang="ts">
import { sum } from '@pnpm-monorepo/utils';
console.log(sum(1, 2));

const num = ref<number>(0);

function handleClick() {
    num.value = sum(num.value, 1);
    ElMessage.success('123');
}
</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
}
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
