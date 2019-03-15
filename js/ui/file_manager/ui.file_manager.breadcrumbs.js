import { extend } from "../../core/utils/extend";

import Widget from "../widget/ui.widget";
import Menu from "../menu/ui.menu";

const PATH_SEPARATOR = "/";
const FILE_MANAGER_BREADCRUMBS_CLASS = "dx-filemanager-breadcrumbs";

var FileManagerBreadcrumbs = Widget.inherit({

    _initMarkup: function() {
        this._menu = this._createComponent(this.$element(), Menu, {
            dataSource: this._getMenuItems(),
            onItemClick: this._onItemClick.bind(this)
        });

        this.$element().addClass(FILE_MANAGER_BREADCRUMBS_CLASS);
    },

    _getMenuItems: function() {
        var path = this.option("path");

        var result = [
            {
                icon: "arrowup",
                isParentItem: true
            },
            {

            }
        ];

        if(path) {
            var parts = path.split(PATH_SEPARATOR);
            for(var i = 0; i < parts.length; i++) {
                var part = parts[i];

                var item = {
                    value: part,
                    text: part,
                    isPartItem: true
                };
                result.push(item);

                if(i !== parts.length - 1) {
                    var itemSeparator = {
                        icon: "spinnext"
                    };
                    result.push(itemSeparator);
                }
            }
        }

        return result;
    },

    _onItemClick: function(e) {
        var newPath = "";
        if(e.itemData.isParentItem) {
            newPath = this._getParentPath();
        } else if(e.itemData.isPartItem) {
            newPath = this._getPathByMenuItemIndex(e.itemIndex);
        } else {
            return;
        }

        var path = this.option("path");
        if(newPath !== path) {
            var handler = this.option("onPathChanged");
            handler(newPath);
        }
    },

    _getParentPath: function() {
        var path = this.option("path");
        if(!path) return path;

        var index = path.lastIndexOf(PATH_SEPARATOR);
        return index !== -1 ? path.substr(0, index) : "";
    },

    _getPathByMenuItemIndex: function(index) {
        var result = "";

        var items = this._menu.option("items");
        for(var i = 0; i <= index; i++) {
            var item = items[i];
            if(!item.isPartItem) continue;

            var part = item.value;
            result += result ? PATH_SEPARATOR + part : part;
        }

        return result;
    },

    _getDefaultOptions: function() {
        return extend(this.callBase(), {
            path: "",
            onPathChanged: null
        });
    },

    _optionChanged: function(args) {
        var name = args.name;

        switch(name) {
            case "path":
                this.repaint();
                break;
            default:
                this.callBase(args);
        }
    }

});

module.exports = FileManagerBreadcrumbs;
