import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import Toolbar from "../toolbar";
import DiagramCommands from "./ui.diagram.commands";
import { getDiagram } from "./diagram_importer";
import { extend } from "../../core/utils/extend";

const ACTIVE_FORMAT_CLASS = "dx-format-active";
const TOOLBAR_CLASS = "dx-diagram-toolbar";

class DiagramToolbar extends Widget {
    _init() {
        this.bar = new DiagramBar(this);
        this._toolbarWidgets = {};
        super._init();
    }
    _initMarkup() {
        super._initMarkup();
        const $toolbar = $("<div>")
            .addClass(TOOLBAR_CLASS)
            .appendTo(this._$element);
        this._renderToolbar($toolbar);
    }
    _renderToolbar($toolbar) {
        this._toolbarInstance = this._createComponent($toolbar, Toolbar, {
            dataSource: this._prepareToolbarItems()
        });
    }
    _prepareToolbarItems() {
        return this._getButtons().map(item => {
            return extend(true, {
                widget: item.widget || "dxButton",
                location: "before",
                locateInMenu: "auto",
                options: {
                    text: item.text,
                    hint: item.hint,
                    icon: item.icon,
                    onInitialized: (e) => this._onToolbarItemInitialized(e.component, item.name)
                }
            }, this._createWidgetActionOptions(item), this._createWidgetOptions(item));
        });
    }
    _onToolbarItemInitialized(widget, name) {
        this._toolbarWidgets[name] = widget;
    }
    _createWidgetOptions({ widget, items }) {
        if(widget === "dxSelectBox") {
            return {
                options: { items }
            };
        }
    }
    _createWidgetActionOptions(item) {
        switch(item.widget) {
            case "dxSelectBox":
            case "dxColorBox":
                return {
                    options: {
                        onValueChanged: (e) => this.bar._raiseBarCommandExecuted(item.name, e.component.option("value"))
                    }
                };
            default:
                return {
                    options: {
                        onClick: this._onButtonClick.bind(this, item.name)
                    }
                };
        }
    }
    _getButtons() {
        return DiagramCommands.load();
    }
    _onButtonClick(itemName) {
        this.bar._raiseBarCommandExecuted(itemName);
    }

    _setItemEnabled(name, enabled) {
        if(name in this._toolbarWidgets) {
            this._toolbarWidgets[name].option("disabled", !enabled);
        }
    }
    _setEnabled(enabled) {
        this._toolbarInstance.option("disabled", !enabled);
    }
    _setItemValue(name, value) {
        let widget = this._toolbarWidgets[name];
        if(!widget) {
            return;
        } else if("value" in widget.option()) {
            widget.option("value", value);
        } else {
            widget.$element().toggleClass(ACTIVE_FORMAT_CLASS, value);
        }
    }
}

class DiagramBar {
    constructor(widget) {
        const EventDispatcher = getDiagram().EventDispatcher;
        this.onChanged = new EventDispatcher(); /* implementation of IBar */
        this._widget = widget;
    }
    _raiseBarCommandExecuted(key, parameter) {
        this.onChanged.raise("NotifyBarCommandExecuted", parseInt(key), parameter);
    }

    /* implementation of IBar */
    getCommandKeys() {
        return DiagramCommands.load().map(c => c.name);
    }
    setItemValue(key, value) {
        this._widget._setItemValue(key, value);
    }
    setItemEnabled(key, enabled) {
        this._widget._setItemEnabled(key, enabled);
    }
    setItemVisible(key, enabled) {
    }
    setEnabled(enabled) {
        this._widget._setEnabled(enabled);
    }
    isVisible() {
        return true;
    }
}

export default DiagramToolbar;
