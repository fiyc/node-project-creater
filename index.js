#!/usr/bin/env node

/**
* @Author: fiyc
* @Date : 2018-12-04 10:15
* @FileName : index.js
* @Description : 
    - 入口文件
    - 设置命令行指令
*/

const packageInfo = require('./package.json');
let programe = require('commander');
let control = require('./src/command-control');
let log = require('./src/common/log');

/**
 * 工具版本
 */
programe.version(packageInfo.version);

/**
 * 初始化项目目录
 * 如果无参数, 则为当前目录
 */
programe.command('init [dir]')
    .description('初始化项目目录')
    .action(dir => {
        control.init(dir);
    });

/**
 * 生产项目 
 */
programe.command('build [version]')
    .description('生成项目')
    .action(version => {
        control.build(version);
    });

programe.parse(process.argv);





