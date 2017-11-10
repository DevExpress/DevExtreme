"use strict";

module.exports = function(callback) {
    //NOTE: we can't use document.readyState === "interactive" because of ie9/ie10 support
    if(document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
        callback();
        return;
    }

    var loadedCallback = function() {
        callback();
        document.removeEventListener("DOMContentLoaded", loadedCallback);
    };
    document.addEventListener("DOMContentLoaded", loadedCallback);
};
