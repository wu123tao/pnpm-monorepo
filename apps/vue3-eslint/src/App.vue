<template>
    <edit-table v-model="tableData" selectable :columns="columns">
        <template #operation>
            <el-button @click="handleClick">点击</el-button>
        </template>
    </edit-table>
</template>

<script setup lang="ts">
import type { EditTableColumn } from './components/config';
import editTable from './components/edit-table.vue';
import { sum } from '@pnpm-monorepo/utils';

console.log(sum(1, 2));

const columns: EditTableColumn[] = [
    {
        label: '日期',
        prop: 'date',
        // editable: true,
        editComponent: 'el-date-picker',
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        elFormItemProps: { rules: [{ required: true, message: '日期' }] },
    },
    {
        label: '姓名',
        prop: 'name',
    },
    {
        label: '地址',
        prop: 'address',
    },
];

const tableData = ref([
    {
        id: 1,
        date: '',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        id: 2,
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        id: 3,
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
    {
        id: 4,
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
    },
]);

function handleClick() {
    console.log(tableData.value);
}
</script>
