/*
 * grunt-jingoal-require
 * https://github.com/lirongfei123/grunt-jingoal-requirejs
 *
 * Copyright (c) 2016 lirongfei123
 * Licensed under the MIT license.
 */

'use strict';

var os = require('os');
var uPath = require('upath');
var async = require('async');

//格式化配置
var parseConfig = require("../lib/parse-config.js");
//处理文件
var handleFile = require("../lib/handle-file.js");
//格式化要合并的文件
//压缩文件
var UglifyJS = require("uglify-js");

var md5HashManager = require('../lib/utils').md5Hash;

module.exports = function(grunt) {

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('jingoal_require', 'The best Grunt plugin ever.', function() {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            debug: true,
            showLog: true,
            minifyExclude: [] // 正则数组
        });
        //获取配置
        var config = parseConfig(options);
        if (typeof config.rootPath == 'undefined' || typeof config.basePath == 'undefined') {
            console.error('必须指明详细的require配置文件')
            return;
        }

        var done = this.async();
        var series = [];
        // Iterate over all specified file groups.
        this.files.forEach(function(f) {
            series.push(function(callback) {
                var filePath = f.src[0];
                var extName = uPath.extname(filePath);

                if (!uPath.isAbsolute(filePath)) {
                    filePath = uPath.resolve(process.cwd(), filePath)
                }
                filePath = uPath.normalize(filePath);

                var destPath = f.dest;
                if (!uPath.isAbsolute(destPath)) {
                    destPath = uPath.resolve(process.cwd(), destPath)
                }
                destPath = uPath.normalize(destPath);

                switch (extName) {
                    case ".js":
                        {
                            console.log(filePath + "---" + "start");
                            var moduleContent = handleFile(filePath, filePath, config).moduleContent;
                            // 替换入口文件里面的入口js，加上md5
                            if (config.mainJsReplace && !config.debug) {
                                if (filePath == config.mainJsReplace.mainJSPath) {
                                    var replaceFilePath = config.mainJsReplace.replaceFilePath;
                                    var indexHtmlContent = grunt.file.read(replaceFilePath).toString();
                                    indexHtmlContent = indexHtmlContent.replace(
                                        config.mainJsReplace.replaceString,
                                        config.mainJsReplace.replaceString + "_" + md5HashManager.get(filePath)
                                    );
                                    grunt.file.write(replaceFilePath, indexHtmlContent);
                                }
                            }
                            if (!config.debug) {
                                var skip = false;
                                config.minifyExclude.forEach(function(excludePath) {
                                    if (new RegExp(excludePath).test(filePath)) {
                                        skip = true;
                                    }
                                });
                                if (!skip) {
                                    try {
                                        moduleContent = minify_js(moduleContent);
                                    } catch (e) {
                                        console.log("压缩文件" + filePath + "时出现错误，请检查错误，未能成功压缩", e.toString());
                                    }
                                }
                            }
                           
                            var reg = new RegExp(uPath.extname(destPath) + "$");

                            var destPath = destPath.replace(reg, "_" + md5HashManager.get(filePath) + uPath.extname(filePath));
                            grunt.file.write(destPath, moduleContent);
                            console.log(filePath + "---" + "ok");
                            break;
                        }
                    case ".css":
                        {
                            md5HashManager.set(filePath)

                            var reg = new RegExp(uPath.extname(destPath) + "$");
                            var destPath = destPath.replace(reg, "_" + md5HashManager.get(filePath) + uPath.extname(filePath));
                            
                            grunt.file.write(destPath, grunt.file.read(filePath).toString());

                            break;
                        }
                    default:
                        {
                            grunt.file.copy(f.src[0], f.dest);
                        }
                }
                callback();
            });
        });
        async.parallelLimit(series, os.cpus().length, done);
    });

};

function minify_js(content) {
    //对于通过注释进行加载文本文件的地方的进行特殊处理
    content = content.replace(/\(function\s*\(\s*\)\s*{\s*(\/\*loadText\*[\s\S]+?\*\/)\s*\}\)/g, function(base, r1) {
        return "(function(){eval(\"var a='a'\");" + r1 +
            "eval(\"var a='a'\");})"
    });
    content = UglifyJS.minify(content, {
        fromString: true,
        mangle: false,
        output: {
            comments: function(node, comments) {
                if (/loadText\*[\s\S]+/g.test(comments.value)) {
                    return true;
                }
                return false;
            }
        }
    }).code;
    return content;
}