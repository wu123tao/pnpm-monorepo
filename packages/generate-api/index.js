#!/usr/bin/env node

/**
 * #!/usr/bin/env node
 * 意思是 让系统自己去找node的执行程序。
 */
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const files = require('./lib/file');

clear();

console.log(chalk.yellow(figlet.textSync('Generate API', { horizontalLayout: 'full' })));

async function run() {
    await files.createPermission();
}
run();
