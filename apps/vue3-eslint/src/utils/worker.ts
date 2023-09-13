import SparkMD5 from 'spark-md5';

self.onmessage = async (e) => {
    const proms = [];

    const { file, chunkSize, startIndex, endIndex } = e.data;

    // console.log(startIndex, endIndex);

    for (let i = startIndex; i < endIndex; i++) {
        proms.push(createChunk(file, i, chunkSize));
    }
    const chunks = await Promise.all(proms);
    self.postMessage(chunks);
};

function createChunk(file: File, index: number, chunkSize: number) {
    return new Promise((resolve) => {
        const start = index * chunkSize;
        const end = start + chunkSize;

        console.log(start, end, '-------');

        const sparkMD5 = new SparkMD5();
        const reader = new FileReader();

        reader.onload = (e) => {
            sparkMD5.append(e.target?.result as string);
            resolve({ start, end, index, hash: sparkMD5.end() });
        };
        reader.readAsArrayBuffer(file.slice(start, end));
    });
}
