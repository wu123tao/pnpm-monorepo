<template>
    <div>
        <el-alert title="传统上传" type="success" :closable="false" />
        <el-upload :show-file-list="false" :http-request="handleChange">
            <el-button type="primary">Click to upload</el-button>
        </el-upload>
    </div>

    <div>
        <el-alert title="分片上传-（文件最终合并到本地服务上）" type="success" :closable="false" />
        <el-upload :show-file-list="false" :http-request="uploadLocalServer">
            <el-button type="primary">Click to upload</el-button>

            <template v-if="fileData.name" #tip>
                <div>{{ fileData.name }}</div>
                <el-progress :percentage="percentage" />
            </template>
        </el-upload>
    </div>
</template>

<script setup lang="ts">
import { post } from '@/api/index';
import type { HttpResponse } from '@pnpm-monorepo/utils';
import { v4 as uuid } from 'uuid';

interface FileData {
    name: string;
    size: number;
    uuid: string;
    suffix: string;
}

const chunkSize = 1 * 1024 * 1024; // 切片大小Mb
const percentage = ref<number>(0);
const fileData = ref<FileData>({
    name: '',
    size: 0,
    uuid: '',
    suffix: '',
});

watch(
    () => percentage.value,
    (value) => {
        console.log(value);
    }
);

/**
 * 文件上传到本地服务
 */
async function uploadLocalServer(uploadFile: { file: File }) {
    const nameList = uploadFile.file.name.split('.');

    fileData.value.name = uploadFile.file.name;
    fileData.value.size = uploadFile.file.size;
    fileData.value.uuid = uuid();
    fileData.value.suffix = nameList[nameList.length - 1];

    percentage.value = 0;
    const chunkCount = Math.ceil(fileData.value.size / chunkSize);
    console.log(chunkCount, '切片数量');

    for (let i = 0; i < chunkCount; i++) {
        const res = await uploadChunkFileLocalServer(i, uploadFile.file);
        console.log(res);
    }

    const res = await post('files/mergeFile', {
        fileName: `${fileData.value.uuid}-${fileData.value.name}`,
        suffix: fileData.value.suffix,
        uuid: fileData.value.uuid,
    });
    console.log(res);
}

async function uploadChunkFileLocalServer(
    i: number,
    file: File
): Promise<HttpResponse<{ data: string }>> {
    const start = i * chunkSize;
    const end = Math.min(fileData.value.size as number, start + chunkSize);

    const chunkFile = file.slice(start, end);

    const formData = new FormData();
    formData.append('fileName', `${fileData.value.name}@@${i}`);
    formData.append('file', chunkFile);
    formData.append('uuid', fileData.value.uuid);

    return await post('files/chunkUpload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
            percentage.value = Number(
                (
                    (Math.min(fileData.value.size, start + evt.loaded) / fileData.value.size) *
                    100
                ).toFixed(2)
            );
        },
    });
}

/**
 * 单文件上传
 */
async function handleChange(uploadFile: { file: File }) {
    const formData = new FormData();
    formData.append('file', uploadFile.file);

    const res = await post('files/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (evt) => {
            console.log(evt.loaded);
        },
    });
    console.log(res);
}
</script>
