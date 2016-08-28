/**
加载模板
*/
define(['module'], function (module) {
    'use strict';
    var custom;
    function loadXhr(url, callback) {
        var source = document.createElement("link");
        source.rel = "stylesheet";
        source.type = "text/css";
        if (requireConfig.urlFilter) {
            url = requireConfig.urlFilter(url, requireConfig);
        }
        source.href = url;
        if ("onload" in source) {
            source.onload = function () {
                callback && callback();
            }
        } else {
            source.onreadstatechange = function (event) {
                if (/loaded|complete/.test(source.readyState)) {
                    callback && callback();
                }
            }
        }
        document.getElementsByTagName("head")[0].appendChild(source);
    }
    var alreadyLoad = {},
        requireConfig;
    custom = {
        load: function (name, req, onLoad, config) {
            if (!requireConfig) requireConfig = config;
            if (alreadyLoad[name]) onLoad({});
            var url = req.toUrl(name + ".css");

            loadXhr(url, function (text) {
                //分析模板，插入模板
                var style = document.createElement("style");
                style.type = "text/css";
                var rules = document.createTextNode(text);
                if (style.styleSheet) { // IE
                    style.styleSheet.cssText = rules.nodeValue;
                } else {
                    style.appendChild(rules);
                }
                document.getElementsByTagName("head")[0].appendChild(style);
                alreadyLoad[name] = true;
                onLoad({});
            });
        }
    };
    return custom;
});
