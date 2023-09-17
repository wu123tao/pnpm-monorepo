<template>
    <div>
        <edit-table ref="tableRef" v-model="tableData" :columns="columns" @delete="doDelete">
            <template #operation="{ checkedRows }">
                <el-button type="primary" @click="mutiDelete(checkedRows)">批量删除</el-button>
            </template>
        </edit-table>
    </div>
</template>
<script lang="ts" setup>
import { get } from '@/api';
import EditTable from '@/components/edit-table.vue';
import type { EditTableColumn, EditTableRef } from '@/components/interface';
import { cloneDeep } from 'lodash-es';

onMounted(async () => {
    await getTableData();
});

interface FileVo {
    fileName?: string;
    fileSize?: string;
    addTime?: string;
    url?: string;
}

const tableData = ref<FileVo[]>([]);

const tableRef = ref<EditTableRef>();

const columns: EditTableColumn[] = [
    {
        label: '文件名',
        prop: 'fileName',
        editable: true,
    },
    {
        label: '文件大小',
        prop: 'fileSize',
        editable: true,
        editComponent: 'el-input-number',
    },
    {
        label: '添加时间',
        prop: 'addTime',
    },
    {
        label: '路径',
        prop: 'url',
    },
];

async function getTableData() {
    const res = await get('/files/list');
    tableData.value = cloneDeep(res.data);
}

function doDelete(row: any) {
    console.log(row);
    console.log(tableData.value);
    tableRef.value?.clearSelection();
}

function mutiDelete(rows: FileVo[]) {
    console.log(rows);
}
</script>

<style></style>
