/**
* @Author: fiyc
* @Date : 2018-12-04 11:00
* @FileName : command-control.js
* @Description : 
    - 指令控制模块
*/
const path = require('path');
const fs = require('fs');
const fileUtil = require('./common/file-util');
const constant = require('./common/constants');
const compile = require('./common/compile');



let init = function (dir) {
    let targetPath = path.join(process.cwd(), dir || '');
    let success = fileUtil.createDir(targetPath);

    if (success) {
        let dbConfigTemplatePath = path.join(__dirname, '..', 'assets', 'db-config-template.json');
        let dbConfigTargetPath = path.join(targetPath, constant.DB_CONFIG);
        fileUtil.copyFile(dbConfigTemplatePath, dbConfigTargetPath);
    }
}

let build = function (version) {
    /**
     * 校验目录有效性
     */
    let curretPath = process.cwd();
    let configPath = path.join(curretPath, constant.DB_CONFIG);
    if(!fs.existsSync(configPath)){
        console.error(`缺少${constant.DB_CONFIG}文件, 当前目录不是一个有效的项目目录.`);
        return;
    }

    /**
     * 下载模板
     */
    let tempPath = path.join(curretPath, constant.TEMP_FLODER);
    fileUtil.cloneProject(constant.TEMPLATE_GIT_PATH, tempPath);

    /**
     * 寻找目标模板
     */
    let targetTemplatePath = path.join(tempPath, version || 'v1');
    if(!fs.existsSync(targetTemplatePath)){
        console.error(`未找到目标模板.`);
        fileUtil.deleteFile(tempPath);
        return;
    }

    /**
     * 拷贝模板项目结构到当前项目
     */
    let structPath = path.join(targetTemplatePath, 'struct');
    fileUtil.copyFloder(structPath, curretPath);

    /**
     * 执行特殊代码编译任务
     */
    executeTask(targetTemplatePath);

    /**
     * 清除临时文件
     */
    console.log('清除临时文件.');
    fileUtil.deleteFile(tempPath);
    console.log('项目生成结束.');
}

let executeTask = function(templateRootPath){
    let tasksPath = path.join(templateRootPath, 'tasks');

    if(!fs.existsSync(tasksPath) || !fs.statSync(tasksPath).isDirectory()){
        console.log('无特殊编译任务.');
        return;
    }

    let configPath = path.join(curretPath, constant.DB_CONFIG);
    let dbInfo = require(configPath);
    let tasks = fs.readdirSync(tasksPath);
    for(let task of tasks){
        let eachTaskPath = path.join(tasksPath, task);

        if(!eachTaskPath.endsWith('.js')){
            continue;
        }

        let taskModule = require(eachTaskPath);
        if(!taskModule || typeof taskModule.run !== 'function'){
            continue;
        }

        let taskRes = taskModule.run(dbInfo);
        if(!taskRes || !taskRes.success || !taskRes.data){
            continue;
        }

        for(let item of taskRes.data){
            let templatePath = item.templatePath;
            let savePath = item.savePath;
            let param = item.param;

            compile(templatePath, param, savePath);
        }
    }
}



module.exports = {
    init,
    build
};