import { extend } from "../../core/utils/extend";

import ContextMenu from "../context_menu/ui.context_menu";
import Widget from "../widget/ui.widget";

const FILE_MANAGER_FILES_VIEW_CLASS = "dx-filemanager-files-view";

class FileManagerItemListBase extends Widget {

    _initMarkup() {
        this.$element().addClass(FILE_MANAGER_FILES_VIEW_CLASS);
    }

    _displayContextMenu(element, offsetX, offsetY) {
        this._contextMenu.option({
            "target": element,
            "position": {
                of: element,
                offset: offsetX + " " + offsetY
            }
        });
        this._contextMenu.show();
    }

    _ensureContextMenu() {
        if(this._contextMenu) {
            return;
        }

        this._contextMenu = this._createComponent("<div>", ContextMenu, {
            onItemClick: this._raiseOnContextMenuItemClick.bind(this)
        });
        this.$element().append(this._contextMenu.$element());
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            selectionMode: "single",
            onGetItems: null,
            onError: null,
            onSelectedItemOpened: null,
            onContextMenuItemClick: null,
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

    _raiseOnContextMenuItemClick(e) {
        const handler = this.option("onContextMenuItemClick");
        handler && handler(e.itemData.name, e.itemData.fileItem);
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

    selectItem() {

    }

}

module.exports = FileManagerItemListBase;
