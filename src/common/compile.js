/**
* @Author: fiyc
* @Date : 2018-12-04 15:21
* @FileName : compile.js
* @Description : 
    - 模板编译生成模块
*/

let fs = require('fs');
let path = require('path');
let h = require('handlebars');
let fileUtil = require('./file-util');

let compile = function(tempalteFilePath, param){
    let templateContent = fs.readFileSync(tempalteFilePath, 'utf-8').toString(); 
    let result = h.compile(templateContent)(param);
    return result;
}

let compileAndSave = function(tempalteFilePath, param, savePath){
    try{
        let content = compile(tempalteFilePath, param);
        let targetParentPath = path.parse(savePath).dir;
        fileUtil.createDir(targetParentPath);
        fs.writeFileSync(savePath, content);
        console.log(`编译生成文件 ${savePath}`);
    }catch(err){
        console.error(`编译模板 ${tempalteFilePath} 失败, 错误信息: ${err.message}`);
    }
}

module.exports = compileAndSave;