<template>
    <div>
        <el-card shadow="hover">
            <el-descriptions title="User Info" border>
                <el-descriptions-item v-for="(item, i) in descProps" :key="i" :label="item.label">{{
                    descData[item.prop]
                }}</el-descriptions-item>
            </el-descriptions>
        </el-card>

        <edit-table ref="tableRef" v-model="tableData" :columns="columns" @delete="doDelete">
            <template #operation>
                <el-button type="primary" @click="exportByXlSX">使用xlsx导出</el-button>
                <el-button type="primary" @click="exportByExcelJS">使用exceljs导出</el-button>
            </template>
        </edit-table>
    </div>
</template>
<script lang="ts" setup>
import { get } from '@/api';
import EditTable from '@/components/edit-table.vue';
import type { EditTableColumn, EditTableRef } from '@/components/interface';
import { cloneDeep } from 'lodash-es';
import * as xlsx from 'xlsx';
import Excel from 'exceljs';

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
    { label: '文件名', prop: 'fileName' },
    { label: '文件大小', prop: 'fileSize' },
    { label: '添加时间', prop: 'addTime' },
    { label: '路径', prop: 'url' },
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

const descProps = [
    { prop: 'Username', label: '用户名' },
    { prop: 'Telephone', label: '手机号' },
    { prop: 'Place', label: '接收地址' },
    { prop: 'Remarks', label: '备注' },
    { prop: 'Address', label: '联系地址' },
];
const descData: any = {
    Username: 'kooriookami',
    Telephone: '18100000000',
    Place: 'Suzhou',
    Remarks: 'School',
    Address: 'No.1188',
};

function exportByXlSX() {
    const descHeadLabel = descProps.map((item) => item.label);
    const descHeaderProp = descProps.map((item) => item.prop);
    const descContent = descHeaderProp.map((item) => descData[item]);

    const tableHeadLabel = columns.map((col) => col.label);
    const tableHeadProp = columns.map((col) => col.prop);
    const tableContent = tableData.value.map((item: any) => {
        const obj: any = {};
        tableHeadProp.forEach((prop: any) => {
            obj[prop] = item[prop];
        });
        return Object.values(obj);
    });

    // 添加描述
    const worksheet = xlsx.utils.aoa_to_sheet([descHeadLabel, descContent]);

    const workbook = xlsx.utils.book_new();

    // 添加表格数据
    xlsx.utils.sheet_add_aoa(worksheet, [tableHeadLabel, ...tableContent], { origin: 'A4' });
    xlsx.utils.book_append_sheet(workbook, worksheet);

    xlsx.writeFile(workbook, 'test.xlsx');
}

function exportByExcelJS() {
    const descHeadLabel = descProps.map((item) => item.label);
    const descHeaderProp = descProps.map((item) => item.prop);
    const descContent = descHeaderProp.map((item) => descData[item]);

    const tableHeadLabel = columns.map((col) => col.label);
    const tableHeadProp = columns.map((col) => col.prop);
    const tableContent = tableData.value.map((item: any) => {
        const obj: any = {};
        tableHeadProp.forEach((prop: any) => {
            obj[prop] = item[prop];
        });
        return Object.values(obj);
    });

    const workbook = new Excel.Workbook();
    const worksheet = workbook.addWorksheet('sheet', {
        properties: { tabColor: { argb: 'E52DB6BB' } },
    });

    worksheet.insertRow(1, descHeadLabel);
    worksheet.insertRow(2, descContent);

    worksheet.insertRow(4, tableHeadLabel);
    tableContent.forEach((item, i) => {
        worksheet.insertRow(i + 5, item);
    });

    const descHeadRow = worksheet.getRow(1);
    const tableHeadRow = worksheet.getRow(4);
    descHeadRow.eachCell((cell: Excel.Cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E52DB6BB' },
        };
    });
    tableHeadRow.eachCell((cell: Excel.Cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E52DB6BB' },
        };
    });

    workbook.xlsx.writeBuffer().then((data) => {
        const blob = new Blob([data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '测试.xlsx';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(a.href);
    });
}
</script>

<style></style>
