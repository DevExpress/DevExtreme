import { getQuill } from "../quill_importer";

import $ from "../../../core/renderer";
import Toolbar from "../../toolbar";
import { each } from "../../../core/utils/iterator";
import { isString, isObject, isDefined, isEmptyObject } from "../../../core/utils/type";
import { extend } from "../../../core/utils/extend";

const BaseModule = getQuill().import("core/module");

const TOOLBAR_CLASS = "dx-richtexteditor-toolbar";
const TOOLBAR_FORMAT_WIDGET_CLASS = "dx-richtexteditor-toolbar-format";
const ACTIVE_FORMAT_CLASS = "dx-format-active";

class ToolbarModule extends BaseModule {
    constructor(quill, options) {
        super(quill, options);

        this.editorInstance = options.editorInstance;
        this._formats = {};

        if(isDefined(options.items)) {
            this._renderToolbar();

            this.quill.on('editor-change', (eventName) => {
                this.updateFormatWidgets();
            });
        }
    }

    _renderToolbar() {
        const container = this.options.container || this.getContainer();
        const toolbarItems = this.prepareToolbarItems();

        $(container).addClass(TOOLBAR_CLASS);

        this.toolbarInstance = this.editorInstance._createComponent(container, Toolbar, { dataSource: toolbarItems });
    }

    getContainer() {
        const $container = $("<div>");

        this.editorInstance.$element().prepend($container);

        return $container;
    }

    prepareToolbarItems() {
        let resultItems = [];

        each(this.options.items, (index, item) => {
            let newItem;
            if(isObject(item)) {
                if(item.items && !item.widget) {
                    const selectItemConfig = this._prepareSelectItemConfig(item);
                    newItem = this._getToolbarItem(selectItemConfig);
                } else {
                    newItem = this._getToolbarItem(item);
                }
            } else if(isString(item)) {
                const buttonItemConfig = this._prepareButtonItemConfig(item);
                newItem = this._getToolbarItem(buttonItemConfig);
            }
            if(newItem) {
                resultItems.push(newItem);
            }
        });

        return resultItems;
    }

    _prepareButtonItemConfig(formatName) {
        return {
            widget: "dxButton",
            format: formatName,
            options: {
                text: formatName,
                onClick: (e) => {
                    if(formatName === "clear") {
                        this.quill.removeFormat(this.quill.getSelection());
                    } else {
                        const format = this.quill.getFormat(this.quill.getSelection());
                        const value = !format[formatName];

                        this.quill.format(formatName, value, "user");
                    }
                    this.updateFormatWidgets();
                }
            }
        };
    }

    _prepareSelectItemConfig(item) {
        return {
            widget: "dxSelectBox",
            format: item.format,
            options: {
                dataSource: item.items,
                onValueChanged: (e) => {
                    if(!this._isReset) {
                        this.quill.format(item.format, e.value, "user");
                    }
                }
            }
        };
    }

    _prepareColorItemConfig(format) {
        return {
            widget: "dxColorBox",
            format: format,
            options: {
                onValueChanged: (e) => {
                    if(!this._isReset) {
                        this.quill.format(format, e.value, "user");
                    }
                }
            }
        };
    }

    _getToolbarItem(item) {
        const baseItem = {
            options: {
                onInitialized: (e) => {
                    e.component.$element().addClass(TOOLBAR_FORMAT_WIDGET_CLASS);
                    this._formats[item.format] = e.component;
                }
            }
        };

        return extend(true, { location: "before" }, item, this.getDefaultConfig(item.format), baseItem);
    }

    getDefaultItemsConfig() {
        return {
            orderedList: {
                onClick: () => {
                    this.quill.format("list", "ordered", "user");
                }
            },
            bulletList: {
                onClick: () => {
                    this.quill.format("list", "bullet", "user");
                }
            },
            header: {
                options: {
                    displayExpr: (item) => {
                        if(isDefined(item) && item !== false) {
                            return "H" + item;
                        } else {
                            return "Normal";
                        }
                    }
                }
            },
            color: this._prepareColorItemConfig("color"),
            background: this._prepareColorItemConfig("background")
        };
    }

    getDefaultConfig(format) {
        return this.getDefaultItemsConfig()[format];
    }

    updateFormatWidgets() {
        this._resetFormatWidgets();

        const selection = this.quill.getSelection();
        if(!selection) {
            return;
        }

        const formats = this.quill.getFormat(selection);
        for(const format in formats) {
            const formatWidget = this._formats[format];

            if(!formatWidget) {
                continue;
            }

            if(formatWidget.option("value") === undefined) {
                formatWidget.$element().addClass(ACTIVE_FORMAT_CLASS);
            } else {
                this._isReset = true;
                formatWidget.option("value", formats[format]);
                this._isReset = false;
            }
        }

        if(this._formats.clear && !isEmptyObject(formats)) {
            this._formats.clear.$element().addClass(ACTIVE_FORMAT_CLASS);
        }
    }

    _resetFormatWidgets() {
        each(this._formats, (name, widget) => {
            widget.$element().removeClass(ACTIVE_FORMAT_CLASS);
            if(widget.NAME === "dxSelectBox" || widget.NAME === "dxColorBox") {
                this._isReset = true;
                widget.option("value", null);
                this._isReset = false;
            }
        });
    }
}

module.exports = ToolbarModule;
