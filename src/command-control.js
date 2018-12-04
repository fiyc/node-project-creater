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
    let configPath = path.join(process.cwd(), constant.DB_CONFIG);
    if(!fs.existsSync(configPath)){
        console.error(`缺少${constant.DB_CONFIG}文件, 当前目录不是一个有效的项目目录.`);
        return;
    }

    /**
     * 下载模板
     */
    let tempPath = path.join(process.cwd(), constant.TEMP_FLODER);
    fileUtil.cloneProject(constant.TEMPLATE_GIT_PATH, tempPath);

    /**
     * 寻找目标模板
     */
    let targetTemplatePath = path.join(tempPath, version || 'V1');
    if(!fs.existsSync(targetTemplatePath)){
        console.error(`未找到目标模板.`);
        fileUtil.deleteFile(tempPath);
        return;
    }
}

module.exports = {
    init,
    build
};