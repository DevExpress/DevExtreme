import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import eventsEngine from "../../events/core/events_engine";
import { addNamespace } from "../../events/utils";

import Widget from "../widget/ui.widget";
import Menu from "../menu/ui.menu";

import { getPathParts, getParentPath, pathCombine } from "./ui.file_manager.utils";

const FILE_MANAGER_BREADCRUMBS_CLASS = "dx-filemanager-breadcrumbs";
const FILE_MANAGER_BREADCRUMBS_PARENT_FOLDER_ITEM_CLASS = FILE_MANAGER_BREADCRUMBS_CLASS + "-parent-folder-item";
const FILE_MANAGER_BREADCRUMBS_SEPARATOR_ITEM_CLASS = FILE_MANAGER_BREADCRUMBS_CLASS + "-separator-item";
const FILE_MANAGER_BREADCRUMBS_PATH_SEPARATOR_ITEM_CLASS = FILE_MANAGER_BREADCRUMBS_CLASS + "-path-separator-item";
const MENU_ITEMS_CONTAINER_CLASS = "dx-menu-items-container";

const FILE_MANAGER_BREADCRUMBS_EVENT_NAMESPACE = "dxFileManager_breadcrubms";

class FileManagerBreadcrumbs extends Widget {

    _initMarkup() {
        super._initMarkup();

        this._initActions();

        const $menu = $("<div>").appendTo(this.$element());
        this._menu = this._createComponent($menu, Menu, {
            dataSource: this._getMenuItems(),
            onItemClick: this._onItemClick.bind(this),
            onItemRendered: this._onItemRendered.bind(this)
        });

        const clickEvent = addNamespace("click", FILE_MANAGER_BREADCRUMBS_EVENT_NAMESPACE);
        eventsEngine.on($menu, clickEvent, this._onClick.bind(this));

        this.$element().addClass(FILE_MANAGER_BREADCRUMBS_CLASS);
    }

    _getMenuItems() {
        const path = this.option("path");

        const result = [
            {
                icon: "arrowup",
                isParentItem: true
            },
            {
                isSeparator: true
            }
        ];

        if(path) {
            const parts = getPathParts(path);
            for(let i = 0; i < parts.length; i++) {
                const part = parts[i];

                const item = {
                    value: part,
                    text: part,
                    isPartItem: true
                };
                result.push(item);

                if(i !== parts.length - 1) {
                    const itemSeparator = {
                        icon: "spinnext",
                        isPathSeparator: true
                    };
                    result.push(itemSeparator);
                }
            }
        }

        return result;
    }

    _onItemClick(e) {
        const path = this.option("path");

        let newPath = "";
        if(e.itemData.isParentItem) {
            newPath = getParentPath(path);
        } else if(e.itemData.isPartItem) {
            newPath = this._getPathByMenuItemIndex(e.itemIndex);
        } else {
            return;
        }

        if(newPath !== path) {
            this._raisePathChanged(newPath);
        }
    }

    _getPathByMenuItemIndex(index) {
        let result = "";

        const items = this._menu.option("items");
        for(let i = 0; i <= index; i++) {
            const item = items[i];
            if(!item.isPartItem) {
                continue;
            }

            const part = item.value;
            result = pathCombine(result, part);
        }

        return result;
    }

    _onClick({ target }) {
        const $item = $(target).closest(`.${MENU_ITEMS_CONTAINER_CLASS}`);
        if($item.length === 0) {
            this._raiseOutsideClick();
        }
    }

    _onItemRendered({ itemElement, itemData }) {
        let cssClass = "";

        if(itemData.isParentItem) {
            cssClass = FILE_MANAGER_BREADCRUMBS_PARENT_FOLDER_ITEM_CLASS;
        } else if(itemData.isSeparator) {
            cssClass = FILE_MANAGER_BREADCRUMBS_SEPARATOR_ITEM_CLASS;
        } else if(itemData.isPathSeparator) {
            cssClass = FILE_MANAGER_BREADCRUMBS_PATH_SEPARATOR_ITEM_CLASS;
        }

        if(cssClass) {
            $(itemElement).addClass(cssClass);
        }
    }

    _initActions() {
        this._actions = {
            onPathChanged: this._createActionByOption("onPathChanged"),
            onOutsideClick: this._createActionByOption("onOutsideClick")
        };
    }

    _raisePathChanged(newPath) {
        this._actions.onPathChanged({ newPath });
    }

    _raiseOutsideClick() {
        this._actions.onOutsideClick();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            path: "",
            onPathChanged: null,
            onOutsideClick: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "path":
                this.repaint();
                break;
            case "onPathChanged":
            case "onOutsideClick":
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

}

module.exports = FileManagerBreadcrumbs;
