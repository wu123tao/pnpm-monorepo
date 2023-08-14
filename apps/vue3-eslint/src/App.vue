<template>
    <edit-table v-model="tableData" selectable :columns="columns">
        <template #operation>
            <el-button @click="handleClick">点击</el-button>
        </template>
    </edit-table>

    <component :is="RadioComponent" v-model="selected"></component>

    {{ selected }}
</template>

<script setup lang="ts">
import type { EditTableColumn } from './components/config';
import editTable from './components/edit-table.vue';
import { sum } from '@pnpm-monorepo/utils';
import RadioComponent from './components/components/radio-component.vue';
import { ElTag } from 'element-plus';
import axios from 'axios';

console.log(sum(1, 2));

const selected = ref<number>();

const options = [
    { label: '正常', value: 1 },
    { label: '异常', value: 2 },
];

const cities = [
    { label: '南京', value: 11 },
    { label: '常州', value: 22 },
    { label: '镇江', value: 33 },
];

enum STATUS_TYPE {
    正常 = 1,
    异常 = 2,
}

enum STATUS_TYPE_COLOR {
    success = STATUS_TYPE.正常,
    error = STATUS_TYPE.异常,
}

const columns: EditTableColumn[] = [
    {
        label: '状态',
        prop: 'status',
        editable: true,
        editComponent: 'x-radio',
        componentProps: {
            options: options,
        },
        elFormItemProps: { rules: [{ required: true, message: '状态' }] },
        formatter(row, column, cellValue) {
            const text = STATUS_TYPE[cellValue] ?? '未知';
            const type = STATUS_TYPE_COLOR[cellValue] ?? 'warning';
            return h(ElTag, { type: type }, text);
        },
    },
    {
        label: '城市',
        prop: 'cityName',
        // editable: true,
        // editComponent: 'el-select-v2',
        // componentProps: {
        //     options: cities,
        // },
    },
    {
        label: '日期',
        prop: 'date',
        editable: true,
        editComponent: 'el-date-picker',
        componentProps: {
            valueFormat: 'YYYY-MM-DD',
        },
        elFormItemProps: { rules: [{ required: true, message: '日期' }] },
    },
    {
        label: '姓名',
        prop: 'name',
        editable: true,
    },
    {
        label: '地址',
        prop: 'address',
    },
    {
        label: '数量',
        prop: 'number',
        editComponent: 'el-input-number',
        editable: true,
    },
];

const tableData = ref([
    {
        id: 1,
        status: null,
        city: 11,
        cityName: '南京',
        date: '',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        number: 1,
    },
    {
        id: 2,
        status: 2,
        city: 22,
        cityName: '常州',
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        number: 1,
    },
    {
        id: 3,
        status: 1,
        city: 33,
        cityName: '镇江',
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        number: 1,
    },
    {
        id: 4,
        status: 2,
        city: 22,
        cityName: '常州',
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
        number: null,
    },
]);

function handleClick() {
    console.log(tableData.value);
}
</script>
