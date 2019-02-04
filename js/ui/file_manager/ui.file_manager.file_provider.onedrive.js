// import Promise from "../../core/polyfills/promise";
// import ajax from "../../core/utils/ajax";
import FileProvider from "./ui.file_manager.file_provider";

// const GET_ACCESS_TOKEN_URL = "http://kovalev-10:81/OneDrive/AccessTokenJson";

var OneDriveFileProvider = FileProvider.inherit({
    // ctor: function() {
    //     this._accessToken = "";
    // },

    // getItems: function() {
    //     this._getAccessToken()
    //         .then(this._getItemsByPath)
    //         .then(this._drawFileSystemItems);
    // },

    // _getAccessToken: function() {
    //     return new Promise(function(resolve) {
    //         if(this._accessToken) {
    //             return;
    //         }

    //         ajax.sendRequest({
    //             url: GET_ACCESS_TOKEN_URL,
    //             dataType: "jsonp"
    //         }).done(function(response) {
    //             this._accessToken = response;
    //         }).fail(function(e) {
    //         });

    //     }.bind(this));
    // },

    // _getItemsByPath: function(path) {
    //     var url = "";

    //     return new Promise(function(resolve) {
    //     });
    // },
    // _drawFileSystemItems: function(){
    // }
});


module.exports = OneDriveFileProvider;
