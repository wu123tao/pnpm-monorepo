const inquirer = require('inquirer');
// const files = require('./file');

module.exports = {
    getInputInfo: () => {
        const prompt = inquirer.createPromptModule();

        const questions = [
            {
                name: 'template',
                type: 'list',
                message: '生成模版:',
                choices: ['generate-api', 'generate-permission'],
                default: 'generate-api',
            },
            {
                name: 'url',
                type: 'input',
                message: '后端JSON地址:',
                validate: (value) => {
                    if (value.length) {
                        return true;
                    } else {
                        return '请输入后端JSON地址';
                    }
                },
            },
            {
                name: 'directoryName',
                type: 'input',
                message: '接口文件夹名称:',
                validate: (value) => {
                    if (value.length) {
                        return true;
                    } else {
                        return '请输入接口文件夹名称';
                    }
                },
            },
        ];

        return prompt(questions);
    },
};
