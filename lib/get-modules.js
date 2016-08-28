var fs = require("fs");
var vm = require("vm");
var nodejsPath = require("upath");

var utils = require("./utils");
var md5HashManager = require('./utils').md5Hash;
var parseConfig = require("./parse-config.js");
var getFilePathByModuleName = require("./get-filepath-bymodulename");

function getModules(fileName, config){
    var fileContent = utils.getFileContent(fileName);
    // 保存md5
    md5HashManager.set(fileName);
    //获取同步 require模块
    var requireReg = /require\s*\(\[([^\)\]]*)\]\s*,\s*function\s*\(/g,
        defineReg = /define\s*\(\[([^\)\]]*)\]\s*,\s*function\s*\(/g,
        ayncRequireReg = new RegExp(config.asncRequire + "\\s*\\(\\[([^\\)\\]]*)\\]\\s*,\\s*function\\s*\\(","g"),
        result,
        syncModules = [],
        defineModules = [],
        ayncModules = [];
    //获取同步模块
    syncModules = getModulesByReg(requireReg, fileContent);
    defineModules = getModulesByReg(defineReg, fileContent);
    syncModules= syncModules.concat(defineModules);
    //获取异步模块
    ayncModules = getModulesByReg(ayncRequireReg, fileContent);
    syncModules.forEach(function(value){
        saveHash(fileName, value, config);
    });

    ayncModules.forEach(function(value){
        saveHash(fileName, value, config);
    });

    // 保存文件的的md5
    function saveHash(fileName, value, config){
        var depfilepath = getFilePathByModuleName(nodejsPath.dirname(fileName), value, config);
        // 保存md5
        md5HashManager.set(depfilepath);

        // 保存条件path的md5
        if(config.ifPath) {
            for(var i in config.ifPath) {
                if(new RegExp("^" + i +"/").test(value)) {
                    var newConfig = JSON.parse(JSON.stringify(config));
                    newConfig.modulePath[i] = newConfig.modulePath[config.ifPath[i].path];
                    newConfig = parseConfig(newConfig);
                    value = value.replace(new RegExp("^" + i), config.modulePath[config.ifPath[i].path]);
                    var newDepfilepath = getFilePathByModuleName(nodejsPath.dirname(fileName), value, newConfig);
                    // 保存md5
                    md5HashManager.set(newDepfilepath);
                    utils.ifPath[depfilepath] = {
                        code:config.ifPath[i].code,
                        hidePath:newDepfilepath
                    }
                }
            }
        }
    }
    return {
        syncModules:syncModules,
        ayncModules:ayncModules
    };

    //获取define模块
}

function getModulesByReg(reg, fileContent){
    var requireReg = /require\s*\(\[([^\)\]]*)\]\s*,\s*function\s*\(/g,
        result,
        modules = [],
        ayncModules = [];
    while(reg.lastIndex < fileContent.length){
        result = reg.exec(fileContent);
        if(!result){
            break;
        }else{
            modules = modules.concat(vm.runInNewContext("[" + result[1] + "]"));
        }
    }
    var appendModules = [];
    modules = modules.map(function(value){
        if(value.indexOf("!")>0){
            var temp = value.split("!");
            if(!/(?:css|tpl)$/.test(nodejsPath.extname(temp[1]))){
                if(temp[0].indexOf("ltpl")>-1){
                    temp[1] = temp[1] + ".tpl";
                }
                if(temp[0].indexOf("lcss")>-1){
                    temp[1] = temp[1] + ".css";
                }
            }
            appendModules.push(temp[1]);
            return temp[0];
        }
        if(value=="module"){
            return false;
        }
        // 如果在条件path里面的话
        return value;
    });
    modules = modules.filter(function(value){
        return value !== false;
    });
    modules = modules.concat(appendModules);
    return modules;
}
module.exports = getModules;