const { spawn } = require('child_process');
const { directoryExists, removeDir } = require('./directory-util');
const chalk = require('chalk');

async function generateProject(answers) {
    const gitUrl = 'http://192.168.3.38:9803/wutao/test.git';
    const { projectName } = answers;

    const isCreate = directoryExists(projectName);
    if (!isCreate) {
        return;
    }

    const git = spawn('git', ['clone', '--progress', gitUrl, projectName]);

    git.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    git.stderr.on('data', (data) => {
        console.log(data.toString());
    });

    git.on('close', (code) => {
        if (code !== 0) {
            console.log(`拉取代码失败! close: ${code}`);
        } else {
            removeDir(`${projectName}/.git`);
            console.log(
                chalk.green(`
拉取代码成功! code: ${code}

Done. Now run:

    cd ${projectName}
    pnpm install
    pnpm run dev
            `)
            );
        }
    });
}

module.exports = { generateProject };
