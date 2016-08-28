# 在打包目录下面文件里面的相对引用路径， 不能超出打包目录

```
paths: {
    loader: '自定义路径'
}
加载css loader/lcss
加载tpl loader/ltpl
```
## config

### example
参考example里面的文件
```
var config = {
    debug: false,
    rootPath: rootPath,
    basePath: basePath + "/js",
    mainJsReplace: {
        replaceString: "data-main=\"load",
        replaceFilePath: "account.html",
        mainJSPath: "static/js/load.js"
    },
    asncRequire: "requireAync",
    noMergePath: ["public", "static/css"],
    minifyExclude: ["angular/*", "ckeditor/*"],
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
        },
    }
};

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
```
* rootPath
项目的根目录 比如：D:\code\projectA
* basePath
就是requireJs的baseUrl
* mainJsReplace
入口文件的md5 需要自动替换的文件 以及需要替换的字符串
* asncRequire
异步引入的关键词
* noMergePath
不需要合并到入口文件的目录
* minifyExclude
需要压缩工具忽略的文件，用正则进行匹配
* modulePath
就是requirejs的paths配置，照抄过来就可以了，也只能照抄
* ifPath
就是需要动态设置的paths路径
### 项目中requirejs的配置
```
var requireJsConfig = {
    appDebug: appDebug,
    baseUrl: appDebug ? "static/js" : "dist/static/js",
    paths: {
        loader: '../../public/requirejs/',
        angular: browser.ieVersion <= 8 ? '../../public/angular/lowie' : '../../public/angular',
        tpl: '../tpl',
        public: "../../public"
    },
    urlFilter: function (url, config) {
        return url;
    }
}
```
