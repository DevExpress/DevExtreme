import Class from "../../core/class";
import Promise from "../../core/polyfills/promise";
import ajax from "../../core/utils/ajax";

var FileProvider = Class.inherit({
    getItems: function() {
        return new Promise(function(resolve) {
            ajax.sendRequest({
                url: "",
                dataType: "script"
            });
        });
    }


    // _loadMapScript: function() {
    //     return new Promise(function(resolve) {
    //         var key = this._keyOption("google");

    //         window[GOOGLE_MAP_READY] = resolve;
    //         ajax.sendRequest({
    //             url: GOOGLE_URL + (key ? ("&key=" + key) : ""),
    //             dataType: "script"
    //         });
    //     }.bind(this)).then(function() {
    //         try {
    //             delete window[GOOGLE_MAP_READY];
    //         } catch(e) {
    //             window[GOOGLE_MAP_READY] = undefined;
    //         }
    //     });
    // },
});

module.exports = FileProvider;
