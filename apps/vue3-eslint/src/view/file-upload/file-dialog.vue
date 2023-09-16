<template>
    <el-drawer v-model="visible" title="文件上传" destroy-on-close size="70%" @close="doClose">
        <div>
            <el-upload :show-file-list="false" :http-request="handleChange" drag multiple>
                <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                <div class="el-upload__text">拖拽文件到此处 或 <em>点击上传</em></div>
            </el-upload>

            <div style="margin: 20px 0">
                <el-button :disabled="!fileList.length" type="primary" @click="doUpload">
                    点击上传
                </el-button>
            </div>

            <el-table :data="fileList" border>
                <el-table-column label="文件名" align="center" prop="name"></el-table-column>
                <el-table-column label="文件类型" align="center" prop="type"></el-table-column>
                <el-table-column label="文件大小(MB)" align="center">
                    <template #default="{ row }">
                        {{ Math.round((row.size / (1024 * 1024)) * 100) / 100 }}
                    </template>
                </el-table-column>
                <el-table-column label="上传进度" align="center">
                    <template #default="{ $index }">
                        <el-progress
                            :percentage="percentage[$index]"
                            :color="customColorMethod($index)"
                        />
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" :width="100">
                    <template #default="{ $index }">
                        <el-button type="danger" text @click="doDelete($index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </el-drawer>
</template>

<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus';
import { UploadFilled } from '@element-plus/icons-vue';
import { v4 as uuid } from 'uuid';
import { post } from '@/api';
import type { HttpResponse } from '@pnpm-monorepo/utils';

defineOptions({
    name: 'FileUploadDialog',
});

const props = withDefaults(
    defineProps<{
        modelValue: boolean;
    }>(),
    {
        modelValue: false,
    }
);

const emit = defineEmits<{
    'update:modelValue': [value: boolean];
    close: [];
}>();

const visible = computed({
    get: () => props.modelValue,
    set: (newValue) => {
        emit('update:modelValue', newValue);
    },
});

const percentage = ref<number[]>([]);

function customColorMethod(fileIndex: number) {
    if (percentage.value[fileIndex] < 25) {
        return '#f56c6c';
    }
    if (percentage.value[fileIndex] < 50) {
        return '#e6a23c';
    }
    if (percentage.value[fileIndex] < 100) {
        return '#409eff';
    }
    return '#67c23a';
}

const chunkSize = ref<number>(1024 * 100);

const fileList = ref<File[]>([]);

const fileData = ref<any>({});

async function handleChange(uploadRequestOptions: UploadRequestOptions) {
    const { file } = uploadRequestOptions;
    console.log(file);

    fileList.value.push(file);
}

// 删除文件
function doDelete(index: number) {
    fileList.value.splice(index, 1);
}

async function doUpload() {
    percentage.value = new Array(fileList.value.length);

    for (let i = 0; i < fileList.value.length; i++) {
        percentage.value[i] = 0;
        const file = fileList.value[i];
        await uploadFile(file, i);
    }
}

async function uploadFile(file: File, fileIndex: number) {
    const nameList = file.name.split('.');
    fileData.value.name = file.name;
    fileData.value.size = file.size;
    fileData.value.uuid = uuid();
    fileData.value.suffix = nameList[nameList.length - 1];

    percentage.value[fileIndex] = 0;
    const chunkCount = Math.ceil(fileData.value.size / chunkSize.value);
    console.log(chunkCount, '切片数量');

    for (let chunkIndex = 0; chunkIndex < chunkCount; chunkIndex++) {
        const res = await uploadChunkFile(chunkIndex, file, fileIndex);
        console.log(res);
    }

    const res = await post('files/mergeFile', {
        fileName: `${fileData.value.uuid}-${fileData.value.name}`,
        suffix: fileData.value.suffix,
        uuid: fileData.value.uuid,
    });
    console.log(res);
}

async function uploadChunkFile(
    chunkIndex: number,
    file: File,
    fileIndex: number
): Promise<HttpResponse<{ data: string }>> {
    const start = chunkIndex * chunkSize.value;
    const end = Math.min(fileData.value.size as number, start + chunkSize.value);

    const chunkFile = file.slice(start, end);

    const formData = new FormData();
    formData.append('fileName', `${fileData.value.name}@@${chunkIndex}`);
    formData.append('file', chunkFile);
    formData.append('uuid', fileData.value.uuid);

    return await post('files/chunkUpload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
            percentage.value[fileIndex] = Number(
                (
                    (Math.min(fileData.value.size, start + evt.loaded) / fileData.value.size) *
                    100
                ).toFixed(2)
            );
        },
    });
}

function doClose() {
    init();
    emit('close');
}
function init() {
    fileList.value = [];
    percentage.value = [];
    fileData.value = {};
}
</script>
<style scoped>
.el-progress--line {
    margin-bottom: 15px;
    width: 100%;
}
</style>
