const fs = require('fs');
const path = require('path');
const inquirer = require('./inquirer');
const axios = require('axios');
const shell = require('shelljs');

/**
 * 获取当前项目文件夹名
 */
function getCurrentDirectory() {
    return path.basename(process.cwd());
}

/**
 * 判断文件/文件夹是否存在
 */
function directoryExists(filePath) {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
}

async function createPermission() {
    const questions = await inquirer.getInputInfo();
    if (questions.template === 'generate-permission') {
        directoryExists(`src/${questions.directoryName}`);
        await writeFile(questions.url, questions.directoryName);
    }
}

async function writeFile(url, directoryName) {
    try {
        // http://192.168.3.200:8062/api/v1/user/permission/list?permissionType=1&roleId=2ed1af758cc1986e2f9e1ce7eda172e0
        const res = await axios.get(url);
        const allPermissions = res.data.data.systemPermissions;
        // 转换
        const transformData = Object.fromEntries(createEntries(allPermissions));

        fs.writeFileSync(`src/${directoryName}/permission.json`, JSON.stringify(transformData));
        shell.exec(`npx prettier src/${directoryName}/permission.json --write`);
    } catch (error) {
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

module.exports = { getCurrentDirectory, directoryExists, createPermission };
