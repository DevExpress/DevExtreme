import ajax from "../../core/utils/ajax";
import deferredUtils from "../../core/utils/deferred";

import FileManagerItem from "./ui.file_manager.items";
import FileProvider from "./ui.file_manager.file_provider";

const REQUIRED_ITEM_FIELDS = "id,name,folder,lastModifiedDateTime,size,parentReference";
const GET_ACCESS_TOKEN_URL = "http://kovalev-10:81/OneDrive/AccessToken";
const REST_API_URL = "https://graph.microsoft.com/";
const DRIVE_API_URL = REST_API_URL + "v1.0/drive";
const APP_ROOT_URL = DRIVE_API_URL + "/special/approot";

var OneDriveFileProvider = FileProvider.inherit({
    ctor: function() {
        this._accessToken = "";
        this.lastResult = null;
        this.lastItems = null;
    },

    getFolders: function(path) {
        return this._getItems(path, true);
    },
    _getItems: function(path, isFolder) {
        const deferred = new deferredUtils.Deferred();
        this._getAccessToken()
            .then(function() {
                return this._getItemsByPath(path);
            }.bind(this))
            .then(function() {
                deferred.resolve(this._convertResultToItems(path, isFolder));
            }.bind(this));
        return deferred;
    },

    _getAccessToken: function() {
        var deferred = new deferredUtils.Deferred();
        var that = this;
        if(this._accessToken) {
            deferred.resolve();
        } else {
            ajax.sendRequest({
                url: GET_ACCESS_TOKEN_URL,
                dataType: "text"
            }).done(function(response) {
                that._accessToken = response;
                deferred.resolve();
            });
        }

        return deferred.promise();
    },

    _getItemsByPath: function(path) {
        var queryString = "?$select=" + REQUIRED_ITEM_FIELDS + "&$expand=children($select=" + REQUIRED_ITEM_FIELDS + ")";
        var itemPath = this._prepareItemRelativePath(path);
        var url = APP_ROOT_URL + itemPath + queryString;

        var that = this;
        var deferred = new deferredUtils.Deferred();
        ajax.sendRequest({
            url: url,
            dataType: "json",
            headers: { "Authorization": "Bearer " + this._accessToken },
        }).done(function(response) {
            that.lastResult = response;
            deferred.resolve();
        });

        return deferred.promise();
    },
    _convertResultToItems: function(path, isFolder) {
        this.lastItems = [];
        for(var entry, i = 0; entry = this.lastResult.children[i]; i++) {
            if(entry.hasOwnProperty("folder") === isFolder) {
                var item = new FileManagerItem(path, entry.name);
                item.length = entry.size;
                item.lastWriteTime = entry.lastModifiedDateTime;
                this.lastItems.push(item);
            }
        }
        return this.lastItems;
    },

    _prepareItemRelativePath: function(path) {
        return path === "" ? "" : ":/" + path + ":";
    }
});


module.exports = OneDriveFileProvider;
