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
        this._initActions();

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

    _initActions() {
        this._actions = {
            onError: this._createActionByOption("onError"),
            onSelectedItemOpened: this._createActionByOption("onSelectedItemOpened"),
            onContextMenuItemClick: this._createActionByOption("onContextMenuItemClick")
        };
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            selectionMode: "single",
            getItems: null,
            getItemThumbnail: null,
            onError: null,
            onSelectedItemOpened: null,
            onContextMenuItemClick: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "selectionMode":
            case "getItems":
            case "getItemThumbnail":
                this.repaint();
                break;
            case "onError":
            case "onSelectedItemOpened":
            case "onContextMenuItemClick":
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

    _getItems() {
        const itemsGetter = this.option("getItems");
        return itemsGetter ? itemsGetter() : [];
    }

    _raiseOnError(error) {
        this._actions.onError({ error });
    }

    _raiseSelectedItemOpened(item) {
        this._actions.onSelectedItemOpened({ item });
    }

    _raiseOnContextMenuItemClick({ itemData: { name, fileItem } }) {
        this._actions.onContextMenuItemClick({ name, fileItem });
    }

    _getItemThumbnail(item) {
        const itemThumbnailGetter = this.option("getItemThumbnail");
        return itemThumbnailGetter ? itemThumbnailGetter(item) : "";
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
