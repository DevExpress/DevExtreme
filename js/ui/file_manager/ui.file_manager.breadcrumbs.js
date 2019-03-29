import { extend } from "../../core/utils/extend";

import Widget from "../widget/ui.widget";
import Menu from "../menu/ui.menu";

import { getPathParts, getParentPath, pathCombine } from "./ui.file_manager.utils";

const FILE_MANAGER_BREADCRUMBS_CLASS = "dx-filemanager-breadcrumbs";

class FileManagerBreadcrumbs extends Widget {

    _initMarkup() {
        this._createOnPathChangedAction();

        this._menu = this._createComponent(this.$element(), Menu, {
            dataSource: this._getMenuItems(),
            onItemClick: this._onItemClick.bind(this)
        });

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
                        icon: "spinnext"
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
            this._onPathChangedAction({ newPath });
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

    _createOnPathChangedAction() {
        this._onPathChangedAction = this._createActionByOption("onPathChanged");
    }

    _getDefaultOptions() {
        return extend(super._getDefaultOptions(), {
            path: "",
            onPathChanged: null
        });
    }

    _optionChanged(args) {
        const name = args.name;

        switch(name) {
            case "path":
                this.repaint();
                break;
            case "onPathChanged":
                this._createOnPathChangedAction();
                break;
            default:
                super._optionChanged(args);
        }
    }

}

module.exports = FileManagerBreadcrumbs;
