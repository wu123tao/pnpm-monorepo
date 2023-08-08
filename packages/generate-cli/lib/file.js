const inquirer = require('./inquirer');
const permissions = require('./utils/permission-util');
const directoryUtils = require('./utils/directory-util');
const projectUtils = require('./utils/project-util');

async function createCli() {
    const questions = await inquirer.getInputInfo();

    // 生成权限
    if (questions.type === 'generate-template' && questions.template === 'generate-permission') {
        directoryUtils.directoryExists(`src/${questions.directoryName}`);
        await permissions.writeFile(questions.url, questions.directoryName);
    } else if (questions.type === 'generate-project') {
        // 生成项目
        projectUtils.generateProject(questions);
    }
}

module.exports = { createCli };
