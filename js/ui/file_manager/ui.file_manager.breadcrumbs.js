import $ from "../../core/renderer";
import { extend } from "../../core/utils/extend";
import eventsEngine from "../../events/core/events_engine";
import { addNamespace } from "../../events/utils";

import Widget from "../widget/ui.widget";
import Menu from "../menu/ui.menu";

const FILE_MANAGER_BREADCRUMBS_CLASS = "dx-filemanager-breadcrumbs";
const FILE_MANAGER_BREADCRUMBS_PARENT_FOLDER_ITEM_CLASS = FILE_MANAGER_BREADCRUMBS_CLASS + "-parent-folder-item";
const FILE_MANAGER_BREADCRUMBS_SEPARATOR_ITEM_CLASS = FILE_MANAGER_BREADCRUMBS_CLASS + "-separator-item";
const FILE_MANAGER_BREADCRUMBS_PATH_SEPARATOR_ITEM_CLASS = FILE_MANAGER_BREADCRUMBS_CLASS + "-path-separator-item";
const MENU_ITEMS_CONTAINER_CLASS = "dx-menu-items-container";

const FILE_MANAGER_BREADCRUMBS_EVENT_NAMESPACE = "dxFileManager_breadcrubms";

class FileManagerBreadcrumbs extends Widget {

    _init() {
        super._init();
        this._currentDirectory = null;
    }

    _initMarkup() {
        super._initMarkup();

        this._initActions();

        if(this._currentDirectory) {
            this._renderMenu();
        }

        this.$element().addClass(FILE_MANAGER_BREADCRUMBS_CLASS);
    }

    setCurrentDirectory(directory) {
        if(!this._areDirsEqual(this._currentDirectory, directory)) {
            this._currentDirectory = directory;
            this.repaint();
        }
    }

    _renderMenu() {
        const $menu = $("<div>").appendTo(this.$element());
        this._menu = this._createComponent($menu, Menu, {
            dataSource: this._getMenuItems(),
            onItemClick: this._onItemClick.bind(this),
            onItemRendered: this._onItemRendered.bind(this)
        });

        const clickEvent = addNamespace("click", FILE_MANAGER_BREADCRUMBS_EVENT_NAMESPACE);
        eventsEngine.on($menu, clickEvent, this._onClick.bind(this));
    }

    _getMenuItems() {
        const dirLine = this._getParentDirsLine();

        const result = [
            {
                icon: "arrowup",
                directory: this._currentDirectory.parentDirectory,
                isPathItem: true,
                cssClass: FILE_MANAGER_BREADCRUMBS_PARENT_FOLDER_ITEM_CLASS
            },
            {
                cssClass: FILE_MANAGER_BREADCRUMBS_SEPARATOR_ITEM_CLASS
            }
        ];

        dirLine.forEach((dir, index) => {
            result.push({
                text: dir.fileItem.name,
                directory: dir,
                isPathItem: true
            });

            if(index !== dirLine.length - 1) {
                result.push({
                    icon: "spinnext",
                    cssClass: FILE_MANAGER_BREADCRUMBS_PATH_SEPARATOR_ITEM_CLASS
                });
            }
        });

        return result;
    }

    _onItemClick({ itemData }) {
        if(!itemData.isPathItem) {
            return;
        }

        const newDir = itemData.directory;
        if(!this._areDirsEqual(newDir, this._currentDirectory)) {
            this._raiseCurrentDirectoryChanged(newDir);
        }
    }

    _onClick({ target }) {
        const $item = $(target).closest(`.${MENU_ITEMS_CONTAINER_CLASS}`);
        if($item.length === 0) {
            this._raiseOutsideClick();
        }
    }

    _onItemRendered({ itemElement, itemData }) {
        if(itemData.cssClass) {
            $(itemElement).addClass(itemData.cssClass);
        }
    }

    _getParentDirsLine() {
        let currentDirectory = this._currentDirectory;
        const result = [];

        while(currentDirectory) {
            result.unshift(currentDirectory);
            currentDirectory = currentDirectory.parentDirectory;
        }

        return result;
    }

    _areDirsEqual(dir1, dir2) {
        return dir1 && dir2 && dir1 === dir2 && dir1.fileItem.key === dir2.fileItem.key;
    }

    _initActions() {
        this._actions = {
            onCurrentDirectoryChanged: this._createActionByOption("onCurrentDirectoryChanged"),
            onOutsideClick: this._createActionByOption("onOutsideClick")
        };
    }

    _raiseCurrentDirectoryChanged(currentDirectory) {
        this._actions.onCurrentDirectoryChanged({ currentDirectory });
    }

    _raiseOutsideClick() {
        this._actions.onOutsideClick();
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            rootFolderDisplayName: "Files",
            onCurrentDirectoryChanged: null,
            onOutsideClick: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "rootFolderDisplayName":
                this.repaint();
                break;
            case "onCurrentDirectoryChanged":
            case "onOutsideClick":
                this._actions[name] = this._createActionByOption(name);
                break;
            default:
                super._optionChanged(args);
        }
    }

}

module.exports = FileManagerBreadcrumbs;
