<template>
    <div>
        首页
        <el-input v-model="value" placeholder="请输入" @blur="handleBlur"></el-input>
        <el-button type="primary" @click="handleClose">连接socket</el-button>

        <el-button type="primary" @click="handleClose">关闭socket</el-button>
    </div>
</template>
<script lang="ts" setup>
import { socket, state } from '@/utils/socket';
const value = ref<string>('');

function handleBlur(e: Event) {
    socket.emit('test', (e.target as any).value, (e: any) => {
        console.log('输入', e);
    });
}

function handleClose() {
    console.log(state.connected, '连接状态');

    if (state.connected) {
        socket.disconnect();
        return;
    }
    if (!state.connected) {
        socket.connect();
        return;
    }
}

onBeforeMount(() => {
    socket.connect();
});
</script>

<style></style>
