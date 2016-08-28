var utils = {
    loadTtpl:function(text){
        text = text.toString();
        var startIndex  = text.indexOf("/*loadText*"),
            endIndex  = text.indexOf("loadTextEnd*/");
        text = text.substring(startIndex+11,endIndex);
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
    },
    load_css:function(css_func){
        var text = css_func.toString();
        var startIndex  = text.indexOf("/*loadText*"),
            endIndex  = text.indexOf("loadTextEnd*/");
        text = text.substring(startIndex+11,endIndex);

        var style=document.createElement("style");
        style.type="text/css";
        if(style.styleSheet){
            style.styleSheet.cssText = text;
        }else{
            style.innerHTML = text;
        }
        document.getElementsByTagName('HEAD')[0].appendChild(style);
    }
   
}