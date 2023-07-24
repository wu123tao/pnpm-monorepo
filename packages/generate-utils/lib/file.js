const fs = require('fs');
const path = require('path');
const inquirer = require('./inquirer');
const axios = require('axios');
const shell = require('shelljs');
const { createEntries, getAPIJson } = require('./utils');
const os = require('os');

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

async function createQuestion() {
    const questions = await inquirer.getInputInfo();
    directoryExists(`src/${questions.directoryName}`);
    if (questions.template === 'generate-permission') {
        await writePermission(questions.url, questions.directoryName);
    } else if (questions.template === 'generate-api') {
        await writeApi(questions.url, questions.directoryName);
    }
}

async function writePermission(url, directoryName) {
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
 * 通过Node.js中的os模块 调用os.tmpdir()方法获取系统临时文件夹的目录
 * 把文件写入临时文件夹中
 * 目前mac电脑把文件写入临时文件中，重启后写入的文件会消失
 * windows电脑目前重启后文件没有消失
 * fs.writeFileSync(`${os.tmpdir()}/hello.txt`, 'hello word');
 */
async function writeApi(url, directoryName) {
    // http://192.168.3.42:8002/v3/api-docs?group=%E7%B3%BB%E7%BB%9F%E6%9C%8D%E5%8A%A1
    console.log(os.tmpdir());
    console.log(`${process.cwd()}/src/${directoryName}`);

    const res = await getAPIJson(url);
    fs.writeFileSync(`src/${directoryName}/api.json`, JSON.stringify(res));
    shell.exec(`npx prettier src/${directoryName}/api.json --write`);
}

module.exports = { getCurrentDirectory, directoryExists, createQuestion };
