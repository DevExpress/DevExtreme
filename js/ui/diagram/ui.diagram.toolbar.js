import $ from "../../core/renderer";

import Widget from "../widget/ui.widget";
import Toolbar from "../toolbar";
import DiagramCommands from "./ui.diagram.commands";
import { getDiagram } from "./diagram_importer";
import { extend } from "../../core/utils/extend";
import "../select_box";
import "../color_box";
import "../check_box";

const ACTIVE_FORMAT_CLASS = "dx-format-active";
const TOOLBAR_CLASS = "dx-diagram-toolbar";

const UI_ITEMS = [
    {
        name: "options",
        icon: "preferences",
        hint: "Show Page Properties"
    }
];

class DiagramToolbar extends Widget {
    _init() {
        this.bar = new DiagramBar(this);
        this._toolbarWidgets = {};
        this._createOnUIItemToggle();
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
            dataSource: this._prepareCommandItems().concat(this._prepareUIItems())
        });
    }
    _prepareUIItems() {
        return UI_ITEMS.map(item => extend(true,
            this._createItem(item, "after"),
            {
                options: {
                    onClick: (e) => this._onUIItemToggleAction({ name: item.name })
                }
            })
        );
    }
    _prepareCommandItems() {
        return this._getButtons().map(item => extend(true,
            this._createItem(item, "before"),
            this._createWidgetActionOptions(item),
            this._createWidgetOptions(item))
        );
    }
    _onToolbarItemInitialized(widget, name) {
        this._toolbarWidgets[name] = widget;
    }
    _createItem(item, location) {
        return {
            widget: item.widget || "dxButton",
            location: location,
            locateInMenu: "auto",
            options: {
                text: item.text,
                hint: item.hint,
                icon: item.icon,
                onInitialized: (e) => this._onToolbarItemInitialized(e.component, item.name)
            }
        };
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
        return DiagramCommands.getToolbar();
    }
    _onButtonClick(itemName) {
        this.bar._raiseBarCommandExecuted(itemName);
    }
    _createOnUIItemToggle() {
        this._onUIItemToggleAction = this._createActionByOption("onUIItemToggle");
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
        } else if(value !== undefined) {
            widget.$element().toggleClass(ACTIVE_FORMAT_CLASS, value);
        }
    }
    _optionChanged(args) {
        switch(args.name) {
            case "onUIItemToggle":
                this._createOnUIItemToggle();
                break;
            default:
                this.callBase(args);
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
        return DiagramCommands.getToolbar().map(c => c.name);
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

module.exports = DiagramToolbar;
