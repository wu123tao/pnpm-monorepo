const axios = require('axios');
const fs = require('fs');
const ora = require('ora');
const shell = require('shelljs');

async function writeFile(url, directoryName) {
    const spinner = ora({
        prefixText: '正在生成',
        spinner: 'soccerHeader',
    }).start();

    try {
        // http://192.168.3.201:8002/api/v1/user/permission/list?permissionType=1&roleId=4092e2abdc8ec0fca74892cd90f1f493
        const res = await axios.get(url);
        const allPermissions = res.data.data.systemPermissions;
        // 转换
        const transformData = Object.fromEntries(createEntries(allPermissions));

        fs.writeFileSync(`src/${directoryName}/permission.json`, JSON.stringify(transformData));

        console.log('\r');

        shell.exec(`npx prettier src/${directoryName}/permission.json --write`);

        spinner.prefixText = '生成完成';
        spinner.succeed();
    } catch (error) {
        spinner.prefixText = '生成失败';
        spinner.fail();
        console.log(error);
    }
}

/**
 * 根据权限创建key-value[]
 */
function createEntries(list) {
    const res = [];
    for (let index = 0; index < list.length; index++) {
        const item = list[index];
        let keyValue;
        const children = item.children;

        if (children) {
            keyValue = [item.label, Object.fromEntries(createEntries(children))];
        } else {
            keyValue = [item.label, item.id];
        }

        res.push(keyValue);
    }

    return res;
}

module.exports = { writeFile };
