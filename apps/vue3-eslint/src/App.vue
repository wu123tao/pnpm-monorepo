<template>
    <el-upload :show-file-list="false" :http-request="upload">
        <el-button type="primary">Click to upload</el-button>

        <template v-if="fileData.name" #tip>
            <div>{{ fileData.name }}</div>
            <el-progress :percentage="percentage" />
        </template>
    </el-upload>
</template>

<script setup lang="ts">
import { post } from '@/api/index';
import type { HttpResponse } from '@pnpm-monorepo/utils';
import { nanoid } from 'nanoid';

interface FileData {
    name: string;
    size: number;
    uuid: string;
    suffix: string;
}

// const dialogVisible = ref<boolean>(false);
// const cancelUpload = ref<boolean>(false);

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

async function upload(uploadFile: { file: File }) {
    const nameList = uploadFile.file.name.split('.');

    fileData.value.name = uploadFile.file.name;
    fileData.value.size = uploadFile.file.size;
    fileData.value.uuid = nanoid(6);
    fileData.value.suffix = nameList[nameList.length - 1];

    percentage.value = 0;
    const chunkCount = Math.ceil(fileData.value.size / chunkSize);
    console.log(chunkCount, '切片数量');

    for (let i = 0; i < chunkCount; i++) {
        const res = await uploadChunkFile(i, uploadFile.file);
        console.log(res);
    }

    const res = await post('files/mergeFile', {
        fileName: `${nanoid(6)}-${fileData.value.name}`,
        suffix: fileData.value.suffix,
        uuid: fileData.value.uuid,
    });
    console.log(res);
}

async function uploadChunkFile(i: number, file: File): Promise<HttpResponse<{ data: string }>> {
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
 * onChange
 */
// async function handleChange(uploadFile: UploadUserFile) {
//     const formData = new FormData();
//     formData.append('file', uploadFile.raw as any);

//     const res = await post('files/upload', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//         onUploadProgress: (evt) => {
//             console.log(evt.loaded);
//         },
//     });
//     console.log(res);
// }
</script>
