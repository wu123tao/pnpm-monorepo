<template>
    <div>
        <el-card shadow="hover">
            <pro-description
                title="测试"
                :columns="descColumns"
                :detail="descData"
                :column="3"
                border
                align="center"
                empty-value="暂无数据"
                size="large"
            >
                <template #title>123</template>
                <template #extra>123</template>
            </pro-description>
        </el-card>

        <edit-table ref="tableRef" v-model="tableData" :columns="columns" @delete="doDelete">
            <template #operation="{ checkedRows }">
                <el-button type="primary" @click="exportByXlSX">使用xlsx导出</el-button>
                <el-button type="primary" @click="exportByExcelJS">使用exceljs导出</el-button>
                <el-button type="primary" @click="exportDocx(checkedRows)">导出Word</el-button>
            </template>
        </edit-table>
    </div>
</template>
<script lang="ts" setup>
import { get } from '@/api';
import EditTable from '@/components/edit-table/edit-table.vue';
import type { EditTableColumn, EditTableRef } from '@/components/edit-table/interface';
import { cloneDeep } from 'lodash-es';
import * as xlsx from 'xlsx';
import Excel from 'exceljs';
import saveAs from 'file-saver';
import PizZipUtils from 'pizzip/utils';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { ProDescription, type DescriptionColumn } from '@/components/description';
import { ElTag } from 'element-plus';

onMounted(async () => {
    await getTableData();
});

interface Desc {
    Username: string;
    Telephone: string;
    Place: string | undefined;
    Remarks: string;
    Address: string;
    age: string;
}

const descColumns: DescriptionColumn<Desc>[] = [
    { prop: 'Username', label: '用户名' },
    { prop: 'Telephone', label: '手机号' },
    { prop: 'Place', label: '接收地址' },
    { prop: 'Remarks', label: '备注' },
    { prop: 'Address', label: '联系地址' },
    {
        prop: 'age',
        label: '年龄',
        render: (detail) => h(ElTag, { type: 'danger' }, { default: () => detail.age }),
    },
];

const descData: Desc = {
    Username: 'kooriookami',
    Telephone: '18100000000',
    Place: undefined,
    Remarks: 'School',
    Address: 'No.1188',
    age: '22',
};

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
    const res = await get('/m1/2773621-0-default/getList', { baseURL: 'http://127.0.0.1:4523' });
    tableData.value = cloneDeep(res.data);
}

function doDelete(row: any) {
    console.log(row);
    console.log(tableData.value);
    tableRef.value?.clearSelection();
}

/**
 * 使用xlsx导出
 */
function exportByXlSX() {
    const descHeadLabel = descColumns.map((item) => item.label);
    const descHeaderProp = descColumns.map((item) => item.prop);
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

/**
 * 使用exceljs导出
 */
function exportByExcelJS() {
    const descHeadLabel = descColumns.map((item) => item.label);
    const descHeaderProp = descColumns.map((item) => item.prop);
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

    worksheet.insertRow(1, descHeadLabel).eachCell((cell: Excel.Cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E52DB6BB' },
        };
    });
    worksheet.insertRow(2, descContent);

    worksheet.insertRow(4, tableHeadLabel).eachCell((cell: Excel.Cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'E52DB6BB' },
        };
    });
    worksheet.insertRows(5, tableContent);

    worksheet.getCell('A1').note = 'hello Exceljs';

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

/**
 * 导出word
 */
async function exportDocx(rows: FileVo[]) {
    const fileData = {
        first_name: 'John',
        last_name: 'Doe',
        phone: '0652455478',
        description: 'New Website',
        data: rows.length ? rows : tableData.value,
    };

    const fileInfo = await loadFile('./tag-example.docx');
    if (!fileInfo) {
        return;
    }

    renderFile(fileInfo as string, fileData, 'output.docx');
}

/**
 * 读取文件信息
 */
function loadFile(url: string) {
    return new Promise<boolean | string>((resolve) => {
        PizZipUtils.getBinaryContent(url, (err: Error, data: string) => {
            if (err) {
                resolve(false);
            }
            resolve(data);
        });
    });
}

/**
 * 渲染文件
 */
function renderFile(file: string, fileData: any, fileName: string) {
    const zip = new PizZip(file);
    const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
    });

    doc.setData(fileData);

    try {
        doc.render();
    } catch (error: any) {
        throw error;
    }
    const out = doc.getZip().generate({
        type: 'blob',
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    saveAs(out, fileName);
}
</script>
