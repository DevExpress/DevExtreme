import { extend } from "../../core/utils/extend";

import Widget from "../widget/ui.widget";

const FILE_MANAGER_FILES_VIEW_CLASS = "dx-filemanager-files-view";

class FileManagerItemListBase extends Widget {

    _initMarkup() {
        this.$element().addClass(FILE_MANAGER_FILES_VIEW_CLASS);
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            selectionMode: "single",
            onGetItems: null,
            onError: null,
            onSelectedItemOpened: null,
            getItemThumbnail: null
        });
    }

    _getItems() {
        const getItemsMethod = this.option("onGetItems");
        return getItemsMethod();
    }

    _raiseOnError(error) {
        this._raiseEvent("Error", error);
    }

    _raiseSelectedItemOpened(item) {
        this._raiseEvent("SelectedItemOpened", item);
    }

    _raiseEvent(eventName, arg) {
        const fullEventName = "on" + eventName;
        const handler = this.option(fullEventName);
        handler(arg);
    }

    _getItemThumbnail(item) {
        const getItemThumbnailFunction = this.option("getItemThumbnail");
        return getItemThumbnailFunction(item);
    }

    refreshData() {

    }

    getSelectedItems() {

    }

}

module.exports = FileManagerItemListBase;
