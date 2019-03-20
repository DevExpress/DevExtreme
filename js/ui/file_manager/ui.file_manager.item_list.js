import { extend } from "../../core/utils/extend";

import Widget from "../widget/ui.widget";

const FILE_MANAGER_FILES_VIEW_CLASS = "dx-filemanager-files-view";

var FileManagerItemListBase = Widget.inherit({

    _initMarkup: function() {
        this.$element().addClass(FILE_MANAGER_FILES_VIEW_CLASS);
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            selectionMode: "single",
            onGetItems: null,
            onError: null,
            onSelectedItemOpened: null,
            getItemThumbnail: null
        });
    },

    _getItems: function() {
        var getItemsMethod = this.option("onGetItems");
        return getItemsMethod();
    },

    _raiseOnError: function(error) {
        this._raiseEvent("Error", error);
    },

    _raiseSelectedItemOpened: function(item) {
        this._raiseEvent("SelectedItemOpened", item);
    },

    _raiseEvent: function(eventName, arg) {
        var fullEventName = "on" + eventName;
        var handler = this.option(fullEventName);
        handler(arg);
    },

    _getItemThumbnail: function(item) {
        var getItemThumbnailFunction = this.option("getItemThumbnail");
        return getItemThumbnailFunction(item);
    },

    refreshData: function() {

    },

    getSelectedItems: function() {

    }

});

module.exports = FileManagerItemListBase;
