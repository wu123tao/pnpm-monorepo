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

interface FileData {
    name: string;
    size: number;
}

// const dialogVisible = ref<boolean>(false);
// const cancelUpload = ref<boolean>(false);

const chunkSize = 1 * 1024 * 1024; // 切片大小Mb
const percentage = ref<number>(0);
const fileData = ref<FileData>({
    name: '',
    size: 0,
});

watch(
    () => percentage.value,
    (value) => {
        console.log(value);
    }
);

async function upload(uploadFile: { file: File }) {
    console.log(uploadFile.file);

    fileData.value.name = uploadFile.file.name;
    fileData.value.size = uploadFile.file.size;

    percentage.value = 0;
    const chunkCount = Math.ceil(fileData.value.size / chunkSize);
    console.log(chunkCount, '切片数量');

    for (let i = 0; i < chunkCount; i++) {
        const res = await uploadChunkFile(i, uploadFile.file, chunkCount);
        console.log(res);
    }
}

async function uploadChunkFile(
    i: number,
    file: File,
    chunkCount: number
): Promise<HttpResponse<{ data: string }>> {
    const start = i * chunkSize;
    const end = Math.min(fileData.value.size as number, start + chunkSize);

    const fileName =
        i + 1 === chunkCount ? fileData.value.name : `${fileData.value.name}$$${i + 1}`;

    const chunkFile = file.slice(start, end);
    const formData = new FormData();
    formData.append('encrypt', 'true');
    // formData.append('fileName', fileData.value.name);
    formData.append('file', chunkFile, fileName);

    console.log(fileName);

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
