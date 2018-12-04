/**
* @Author: fiyc
* @Date : 2018-12-04 11:17
* @FileName : file-util.js
* @Description : 
    - 文件操作模块
*/
const fs = require('fs');
const path = require('path');
const constant = require('./constants');
const exec = require('child_process').execSync;

let util = {
    /**
     * 创建一个目录, 如果已存在同名目录, 则不执行`
     */
    createDir: function (targetPath) {
        if (fs.existsSync(targetPath)) {
            let targetPathStat = fs.statSync(targetPath);
            if (!targetPathStat.isDirectory()) {
                console.error(`已存在文件: ${targetPath}. 无法创建项目目录`);
                return false;
            }

            return true;
        }

        fs.mkdirSync(targetPath);
        return true;
    },

    /**
     * 拷贝文件
     */
    copyFile: function (source, dest) {
        fs.copyFileSync(source, dest);
    },

    /**
    *  拷贝目录
    * @param {*} src 源文件路径
    * @param {*} target 目标文件路径
    */
    copyFloder: function (src, target) {
        if (!fs.existsSync(target)) {
            fs.mkdirSync(target);
        }

        let files = fs.readdirSync(src);
        files.forEach(item => {
            let srcPath = path.join(src, item);
            let targetPath = path.join(target, item);
            let stats = fs.statSync(srcPath);

            if (stats.isDirectory()) {
                util.copyFloder(srcPath, targetPath);
            } else {
                util.copyFile(srcPath, targetPath);
            }
        });
    },

    /**
     * 删除文件
     */
    deleteFile: function (targetPath) {
        if (!fs.existsSync(targetPath)) {
            return;
        }

        let targetStat = fs.statSync(targetPath);
        if (!targetStat.isDirectory()) {
            fs.unlinkSync(targetPath);
            return;
        }

        let files = fs.readdirSync(targetPath);
        for (let subFile of files) {
            let subFilePath = path.join(targetPath, subFile);
            util.deleteFile(subFilePath);
        }

        fs.rmdirSync(targetPath);
    },

    /**
     * 加载项目模板文件
     */
    cloneProject: function (gitPath, targetPath) {
        // let tempPath = path.join(process.cwd(), constant.TEMP_FLODER);
        // util.deleteFile(tempPath);
        // exec(`git clone ${constant.TEMPLATE_PATH} ${constant.TEMP_FLODER}`);
        util.deleteFile(targetPath);
        exec(`git clone ${gitPath} ${targetPath}`);
    }
};

module.exports = util;