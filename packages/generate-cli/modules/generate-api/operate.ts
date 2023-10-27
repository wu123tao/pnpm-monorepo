import axios from 'axios';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import ora from 'ora';

/**
 * 创建json文件
 */
export async function createJson(params: any) {
    const spinner = ora({
        text: '正在获取api数据',
        spinner: 'aesthetic',
        color: 'yellow',
    }).start();

    const swaggerResource = await axios.get(`${params.url}/swagger-resources`);
    const apiConfig = await axios.get(`${params.url}${swaggerResource.data[0].url}`);

    const res2 = JSON.stringify(apiConfig.data).replace(/\«|»|\s+/g, '_');

    const apiObj = JSON.parse(res2);

    for (const key in apiObj.paths) {
        const funName = key
            .split('/')
            .filter((item) => item && item !== 'api' && item !== 'v1')
            .map((item, index) => {
                if (index === 0) {
                    return item;
                } else {
                    return `${item[0].toUpperCase()}${item.slice(1)}`;
                }
            })
            .join('');

        const method = Object.keys(apiObj.paths[key])[0];

        apiObj.paths[key][method].operationId = `${funName}${method.toUpperCase()}`;
    }

    if (!existsSync(`${process.cwd()}/json`)) {
        console.log('文件夹不存在');

        mkdirSync(`${process.cwd()}/json`);
    }

    writeFileSync(`${process.cwd()}/json/api.json`, JSON.stringify(apiObj));

    spinner.stopAndPersist({ text: '加载完成' });
}

export function generateOpenApi() {
    generateIgnore();
}

function generateIgnore() {
    if (!existsSync(`${process.cwd()}/generate-api`)) {
        mkdirSync(`${process.cwd()}/generate-api`);
    }
    writeFileSync(
        `${process.cwd()}/generate-api/.openapi-generator-ignore`,
        `common.ts
configuration.ts
git_push.sh
.npmignore
.gitignore`
    );
}
