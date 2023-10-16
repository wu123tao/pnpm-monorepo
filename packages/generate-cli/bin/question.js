import inquirer from 'inquirer';
import { readFileSync, readdirSync } from 'fs';
async function questions() {
    const configs = getEnvironment();
    const urlList = configs
        .filter((item) => item.ENV_NAME && item.VITE_API_URL)
        .map((item) => ({
            name: item.ENV_NAME,
            value: item.VITE_API_URL,
        }));
    console.log(urlList);
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'url',
            message: '选择环境',
            choices: urlList,
            default: urlList[0],
        },
        {
            type: 'list',
            name: 'type',
            message: '生成类型',
            choices: [
                { name: '权限', value: 1 },
                { name: '接口', value: 2 },
            ],
        },
    ]);
    return answers;
}
/**
 * 获取环境配置
 */
function getEnvironment() {
    const currentDir = process.cwd();
    const apiConfigFiles = readdirSync(currentDir).filter((item) => item.includes('.env'));
    // 将每个环境配置中的配置获取出来(排除「#」的)
    const configs = apiConfigFiles.map((item) => {
        const itemConfigList = readFileSync(`${currentDir}/${item}`, 'utf-8')
            .split(/\n+/)
            .filter((str) => str)
            .filter((str) => !str.includes('#'));
        const obj = {};
        // 根据每个配置文件中的配置按照「=」进行处理，处理成对象的形式并返回出去
        itemConfigList.forEach((config) => {
            const arr = config.split('=').map((item) => item.replace(/\s*/g, ''));
            obj[arr[0]] = arr[1];
        });
        return obj;
    });
    return configs;
}
export { questions };
