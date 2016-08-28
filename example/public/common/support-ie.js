//先判断是否是ie，以及ie的版本
var browser = {};
(function() {
    var userAgent = navigator.userAgent;
    if (document.documentMode || /MSIE/.test(userAgent)) {
        browser.ie = true;
        if (document.documentMode) {
            browser.ieVersion = document.documentMode;
        } else {
            browser.ieVersion = 7;
        }
        var htmlclass = "ie ie" + browser.ieVersion + " ";
        if (browser.ieVersion <= 7) {
            htmlclass += "ielte7 ";
        }
        if (browser.ieVersion <= 8) {
            htmlclass += "ielte8 ";
        }
        if (browser.ieVersion <= 9) {
            htmlclass += "ielte9 ";
        }
        if (browser.ieVersion <= 10) {
            htmlclass += "ielte10 ";
        }
        if (browser.ieVersion <= 11) {
            htmlclass += "ielte11";
        }
    } else {
        browser.ie = false;
        var htmlclass = "ie0";
        if (/firefox/i.test(navigator.userAgent)) {
            browser.firefox = true;
        }
    }
    document.documentElement.className = htmlclass;
}());
if (browser.ie) {
    if (browser.ieVersion < 9) {
        var isLowerIe = true;
    }
    if (browser.ieVersion == 7) {
        var ie7 = true;
    }
    if (browser.ieVersion == 9) {
        var ie9 = true;
    }
}
