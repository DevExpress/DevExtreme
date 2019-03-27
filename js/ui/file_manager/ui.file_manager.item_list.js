import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import { name as dblClickName } from "../../events/double_click";
import { addNamespace } from "../../events/utils";
import eventsEngine from "../../events/core/events_engine";

import ContextMenu from "../context_menu/ui.context_menu";
import Widget from "../widget/ui.widget";

const FILE_MANAGER_FILES_VIEW_CLASS = "dx-filemanager-files-view";
const FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE = "dxFileManager_open";

class FileManagerItemListBase extends Widget {

    _initMarkup() {
        this.$element().addClass(FILE_MANAGER_FILES_VIEW_CLASS);

        const dblClickEventName = addNamespace(dblClickName, FILE_MANAGER_ITEM_LIST_ITEM_OPEN_EVENT_NAMESPACE);
        eventsEngine.on(this.$element(), dblClickEventName, this._getItemSelector(), this._onItemDblClick.bind(this));

        super._initMarkup();
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

        const $menu = $("<div>").appendTo(this.$element());
        this._contextMenu = this._createComponent($menu, ContextMenu, {
            onItemClick: this._raiseOnContextMenuItemClick.bind(this)
        });
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

    _getItemSelector() {

    }

    _onItemDblClick(e) {

    }

    refreshData() {

    }

    getSelectedItems() {

    }

    selectItem() {

    }

}

module.exports = FileManagerItemListBase;
