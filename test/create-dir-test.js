/**
* @Author: fiyc
* @Date : 2018-12-05 09:33
* @FileName : create-dir-test.js
* @Description : 
    - 递归创建文件夹测试
*/
let fileUtil = require('../src/common/file-util');
let path = require('path');

console.log(process.cwd());
let targetPath = path.join(__dirname, 'ccc', 'fff', 'ddd');
fileUtil.createDir(targetPath);