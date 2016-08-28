/**
加载模板
*/

define(['module'], function (module) {
    'use strict';
    var custom;
    function loadXhr(url,callback){
        var xhr=new XMLHttpRequest();
        xhr.onreadystatechange=function(){
            if(xhr.readyState==4){
                if(xhr.status>=200&&xhr.status<300||xhr.status==304){
                    callback&&callback(xhr.responseText);
                }
            }
        }
        if(requireConfig.urlFilter){
            url = requireConfig.urlFilter(url, requireConfig);
        }
        xhr.open("get",url,false)
        xhr.send(null);
    }
    var alreadyLoad = {}, requireConfig = null;
    custom = {
        load: function (name, req, onLoad, config) {
            if(!requireConfig) requireConfig = config;
            if(alreadyLoad[name]) onLoad({});
            var url = req.toUrl(name+".tpl");
            loadXhr(url, function(text){
                //分析模板，插入模板
                var targets = text.split(/<!--\s?target/g);
                for(var i=0,len=targets.length;i<len;i++){
                    var target = targets[i];
                    var lastIndex = target.indexOf("-->");
                    if(lastIndex==-1||!/^\s*:/.test(target)){
                        continue;
                    }
                    var targetName = target.substring(0,lastIndex).replace(/^\s*|\s*$/g,"").substring(1),
                        tplString = target.substring(lastIndex+3);
                    var script = document.createElement("script");
                    script.type="text/ng-template";
                    script.id=targetName.replace(/^\s*|\s*$/g,"");
                    script.text  = tplString;
                    document.getElementsByTagName("head")[0].appendChild(script);
                }
                alreadyLoad[name] = true;
                onLoad({});
            });
        }
    };

    return custom;
});