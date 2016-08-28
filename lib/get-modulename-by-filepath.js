var uPath = require('upath');
function fileNameToModuleName(fileName,config){
    var moduleName = fileName.substring(0,fileName.lastIndexOf("."));
    var hasPath = false;
    
    for(var i in config.reversionPath){
        if(moduleName.indexOf(i)==0){
            moduleName = moduleName.replace(i, config.reversionPath[i]);
            hasPath = true;
            break;
        }
    }
    if(!hasPath) {
        moduleName = uPath.relative(config.basePath, fileName);
        moduleName = moduleName.substring(0, moduleName.lastIndexOf("."));
    }
    return moduleName;
}
module.exports = fileNameToModuleName;