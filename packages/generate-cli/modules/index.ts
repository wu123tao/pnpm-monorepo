#! /usr/bin/env node

import chalk from 'chalk';
import clear from 'clear';
import { questions } from './question.js';
import { generateType } from './base.js';

clear();

console.log(chalk.blue('Hello Word'));

const answers = await questions();

generateType[answers.type](answers);
