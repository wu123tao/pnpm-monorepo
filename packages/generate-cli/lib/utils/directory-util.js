const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

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
        return true;
    } else {
        // removeDir(filePath);
        // fs.mkdirSync(filePath);
        console.log(chalk.yellow('文件夹已存在，请重试'));
        return false;
    }
}

function removeDir(path) {
    const data = fs.readdirSync(path);
    for (let i = 0; i < data.length; i++) {
        //用循环判断数组中的元素是文件还是文件夹，是文件就删除，是文件夹就继续查找
        const url = path + '/' + data[i];
        const stat = fs.statSync(url); //用fs.stat获取文件或文件夹的详细信息
        if (stat.isDirectory()) {
            //用isDirectory判断元素是不是文件夹，是的话继续查找
            removeDir(url);
        } else {
            //不是文件夹的话，就是文件，删除文件
            fs.unlinkSync(url);
        }
    }
    fs.rmdirSync(path);
}

module.exports = {
    getCurrentDirectory,
    directoryExists,
    removeDir,
};
