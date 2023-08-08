const inquirer = require('inquirer');

const prompt = inquirer.createPromptModule();

const directoryQuestionMessage = {
    'generate-api': '接口文件夹名称',
    'generate-permission': '权限文件夹名称',
};

const questionType = {
    'generate-project': [
        {
            name: 'projectName',
            type: 'imput',
            message: '项目名称:',
            default: 'demo',
        },
    ],
    'generate-template': [
        {
            name: 'template',
            type: 'list',
            message: '生成类型:',
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
    ],
};

async function getInputInfo() {
    const questions = [
        {
            name: 'type',
            type: 'list',
            message: '生成模版:',
            choices: ['generate-project', 'generate-template'],
            default: 'generate-project',
        },
    ];

    const answers = await prompt(questions);

    return generateType(answers);
}

async function generateType(typeAnswers) {
    const answers = await prompt(questionType[typeAnswers.type]);

    return chooseDirectoryType(Object.assign(typeAnswers, answers));
}

async function chooseDirectoryType(answers) {
    // console.log(answers);
    if (!answers.template) {
        return answers;
    }
    const directoryQuestions = [
        {
            name: 'directoryName',
            type: 'input',
            message: `${directoryQuestionMessage[answers.template]}`,
            validate: (value) => {
                if (value.length) {
                    return true;
                } else {
                    return `请输入${directoryQuestionMessage[answers.template]}`;
                }
            },
        },
    ];

    const directoryAnswers = await prompt(directoryQuestions);

    return Object.assign(answers, directoryAnswers);
}

module.exports = {
    getInputInfo,
};
