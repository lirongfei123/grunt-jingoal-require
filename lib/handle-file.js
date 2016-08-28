var getModules = require("./get-modules");
var nodejsPath = require("upath");
var fs = require("fs");
var crypto = require('crypto');

var getFilePathByModuleName = require("./get-filepath-bymodulename");
var getParsedFile = require("./get-parsed-filecontent");
var removeRepeatModule = require("./remove-repeat-module");
var judgeIstoMerge = require("./judge-isto-merge");
var utils = require("./utils");

function handleFile(fileName, sourcefile, config) {
    //获取所有模块
    var depModules = getModules(fileName, config);
    
    // 首先获取本身文件以及所有依赖的文件是否需要转移，这样有利于处理文件内容是，决定是否转移，已经引入路径的修改
    depModules.syncModules.forEach(function (value) {
        //获取依赖文件的真是路径
        var depfilepath = getFilePathByModuleName(nodejsPath.dirname(fileName), value, config);
        
        if (!judgeIstoMerge(depfilepath, fileName, config)) {
            utils.judgeToMerge[depfilepath] = false;
        } else {
            utils.judgeToMerge[depfilepath] = true;
        }
    });

    if (!judgeIstoMerge(fileName, sourcefile, config)) {
        utils.judgeToMerge[fileName] = false;
    } else {
        utils.judgeToMerge[fileName] = true;
    }

    //获取添加模块名的文件内容
    var moduleContent = getParsedFile(fileName, config, depModules),
        depContent;//依赖的内容,如果是通过分析依赖递归调用这个文件的话

    //只把需要同步的模块合并过来
    depModules.syncModules.forEach(function (value) {
        //获取依赖文件的真是路径
        var depfilepath = getFilePathByModuleName(nodejsPath.dirname(fileName), value, config);
        moduleContent += ";" + handleFile(depfilepath, sourcefile, config).depContent;
    });
    /*
    depModules.ayncModules.forEach(function(value){//对于异步加载模块，只需要移动就好了
        handleFile(getFilePathByModuleName(nodejsPath.dirname(fileName),value),{type:"requireAync"});
    });
    */
    depContent = moduleContent;
    //如果是入口文件，就直接返回

    if (!utils.judgeToMerge[fileName]) {
        depContent = "";
    }
    
    moduleContent = removeRepeatModule(moduleContent);
    return {
        moduleContent: moduleContent,
        depContent: depContent
    };
}
module.exports = handleFile;