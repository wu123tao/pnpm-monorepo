<template>
    <div>
        <div style="margin-bottom: 10px; text-align: right">
            <el-button type="primary" @click="openFileUploadDialog">上传文件</el-button>
        </div>
        <el-table :data="tableData" border>
            <el-table-column label="文件名" align="center" prop="fileName"></el-table-column>
            <el-table-column label="文件大小(MB)" align="center">
                <template #default="{ row }">
                    {{ Math.round((row.fileSize / (1024 * 1024)) * 100) / 100 }}
                </template>
            </el-table-column>
            <el-table-column label="添加时间" align="center" prop="addTime"> </el-table-column>
            <el-table-column label="路径" align="center">
                <template #default="{ row }">
                    <el-link :href="row.url">{{ row.fileName }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" :width="100">
                <template #default="{ row }">
                    <el-button type="danger" text @click="doDelete(row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <file-upload-dialog v-model="visible" @close="handleClose"></file-upload-dialog>
    </div>
</template>

<script setup lang="ts">
import { get, post } from '@/api';
import FileUploadDialog from './file-dialog.vue';

onMounted(async () => {
    await getTableData();
});

async function getTableData() {
    const res = await get('/files/list');
    console.log(res);
    tableData.value = res.data;
}

const tableData = ref<Record<string, any>[]>([]);

const visible = ref<boolean>(false);

function openFileUploadDialog() {
    visible.value = true;
}

async function doDelete(row: Record<string, any>) {
    const res = await post('/files/delete', { ids: [row.id] });
    console.log(res);
    await getTableData();
}

async function handleClose() {
    await getTableData();
}
</script>
