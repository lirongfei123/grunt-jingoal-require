function customConfig(rootPath, basePath) {
    //格式化不需要合并的文件
    var config = {
        debug: false,
        rootPath: rootPath,
        basePath: basePath + "/js",
        mainJsReplace: {
            replaceString: "data-main=\"load",
            replaceFilePath: "index.html",
            mainJSPath: "static/js/load.js"
        },
        // asncRequire: "requireAync",
        noMergePath: ["public"],
        minifyExclude: ["angular/*"],
        modulePath: {
            loader: '../../public/requirejs',
            angularIf:'../../public/angular/lowie',
            angular:'../../public/angular',
            tpl: '../tpl',
            public: '../../public'
        },
        ifPath:{
            angular: {
                code:"browser.ieVersion <= 8",
                path:'angularIf'
            }
        }
    };
    return config;
}
var cwd = process.cwd();
var appPath = cwd+"/..";
module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jingoal_require: {
            public: {
                options: customConfig(appPath, 'static'),
                files: [{
                    expand: true,
                    cwd: '../public/',
                    src: ['**/*.*'],
                    dest: '../dist/public/',
                    ext: '$1'
                }]
            },
            static: {
                options: customConfig(appPath, 'static'),
                files: [{
                    expand: true,
                    cwd: '../static/',
                    src: ['**/*.*'],
                    dest: '../dist/static/',
                    ext: '$1'
                }]
            }
        }
    });
    grunt.registerTask('default', ['jingoal_require']);
};
