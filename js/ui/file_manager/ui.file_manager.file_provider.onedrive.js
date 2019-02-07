import ajax from "../../core/utils/ajax";
import { Deferred } from "../../core/utils/deferred";

import FileManagerItem from "./ui.file_manager.items";
import FileProvider from "./ui.file_manager.file_provider";

const REQUIRED_ITEM_FIELDS = "id,name,folder,lastModifiedDateTime,size,parentReference";
const REST_API_URL = "https://graph.microsoft.com/";
const DRIVE_API_URL = REST_API_URL + "v1.0/drive";
const APP_ROOT_URL = DRIVE_API_URL + "/special/approot";

var OneDriveFileProvider = FileProvider.inherit({

    ctor: function(options) {
        options = options || {};
        this._getAccessTokenUrl = options.getAccessTokenUrl || "";

        this._accessToken = "";
        this._accessTokenPromise = null;
    },

    getFolders: function(path) {
        return this._getItems(path, true);
    },

    getFiles: function(path) {
        return this._getItems(path, false);
    },

    _getItems: function(path, isFolder) {
        return this._ensureAccessTokenAcquired()
            .then(function() {
                return this._getEntriesByPath(path);
            }.bind(this))
            .then(function(entries) {
                return this._convertEntriesToItems(entries, path, isFolder);
            }.bind(this));
    },

    _ensureAccessTokenAcquired: function() {
        if(this._accessTokenPromise) {
            return this._accessTokenPromise;
        }

        var deferred = new Deferred();

        if(this._accessToken) {
            deferred.resolve();
        } else {
            ajax.sendRequest({
                url: this._getAccessTokenUrl,
                dataType: "text"
            }).done(function(response) {
                this._accessToken = response;
                this._accessTokenPromise = null;
                deferred.resolve();
            }.bind(this));
        }

        this._accessTokenPromise = deferred.promise();
        return this._accessTokenPromise;
    },

    _getEntriesByPath: function(path) {
        var itemPath = this._prepareItemRelativePath(path);
        var queryString = "?$select=" + REQUIRED_ITEM_FIELDS + "&$expand=children($select=" + REQUIRED_ITEM_FIELDS + ")";
        var url = APP_ROOT_URL + itemPath + queryString;
        return ajax.sendRequest({
            url: url,
            dataType: "json",
            headers: { "Authorization": "Bearer " + this._accessToken }
        });
    },

    _convertEntriesToItems: function(entries, path, isFolder) {
        var result = [];
        for(var entry, i = 0; entry = entries.children[i]; i++) {
            if(entry.hasOwnProperty("folder") === isFolder) {
                var item = new FileManagerItem(path, entry.name);
                item.length = entry.size;
                item.lastWriteTime = entry.lastModifiedDateTime;
                result.push(item);
            }
        }
        return result;
    },

    _prepareItemRelativePath: function(path) {
        return path === "" ? "" : ":/" + path + ":";
    }
});

module.exports = OneDriveFileProvider;
