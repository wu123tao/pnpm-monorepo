<template>
    <div>
        <el-alert title="传统上传" type="success" :closable="false" />
        <el-upload :show-file-list="false" :http-request="handleChange">
            <el-button type="primary">Click to upload</el-button>
        </el-upload>
    </div>
</template>

<script setup lang="ts">
import type { UploadRequestOptions } from 'element-plus';

const chunkSize = ref<number>(1024 * 50);
const threadCount = ref<number>(navigator.hardwareConcurrency | 4);

async function handleChange(uploadRequestOptions: UploadRequestOptions) {
    const { file } = uploadRequestOptions;

    const res = await cutFile(file);
    console.log(res);
}

async function cutFile(file: File) {
    return new Promise((resolve) => {
        const chunks: any = [];

        const chunkCount = Math.ceil(file.size / chunkSize.value);

        const workChunkCount = Math.ceil(chunkCount / threadCount.value);

        let finishCount = 0;

        for (let i = 0; i < threadCount.value; i++) {
            const chunkWorker = new Worker(new URL('../../utils/worker.ts', import.meta.url), {
                type: 'module',
            });
            const startIndex = i * workChunkCount;
            let endIndex = startIndex + workChunkCount;
            if (endIndex > chunkCount) {
                endIndex = chunkCount;
            }
            chunkWorker.postMessage({ file, chunkSize: chunkSize.value, startIndex, endIndex });

            chunkWorker.onmessage = (e) => {
                for (let i = startIndex; i < endIndex; i++) {
                    chunks[i] = e.data[i - startIndex];
                }
                chunkWorker.terminate();
                finishCount++;
                if (finishCount === threadCount.value) {
                    resolve(chunks);
                }
            };
        }
    });
}
</script>
