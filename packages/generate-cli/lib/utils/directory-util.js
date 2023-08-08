const fs = require('fs');
const path = require('path');

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

module.exports = {
    getCurrentDirectory,
    directoryExists,
};
