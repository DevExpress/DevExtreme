import { getQuill } from "../quill_importer";

import $ from "../../../core/renderer";

import Toolbar from "../../toolbar";

import { each } from "../../../core/utils/iterator";
import { isString, isObject, isDefined, isEmptyObject } from "../../../core/utils/type";
import { extend } from "../../../core/utils/extend";

const BaseModule = getQuill().import("core/module");

const TOOLBAR_CLASS = "dx-htmleditor-toolbar";
const TOOLBAR_FORMAT_WIDGET_CLASS = "dx-htmleditor-toolbar-format";
const ACTIVE_FORMAT_CLASS = "dx-format-active";

class ToolbarModule extends BaseModule {
    constructor(quill, options) {
        super(quill, options);

        this._editorInstance = options.editorInstance;
        this._formats = {};
        this._formatHandlers = {
            clear: (e) => {
                this.quill.removeFormat(this.quill.getSelection());
                this.updateFormatWidgets();
            },
            link: () => {
                const formData = this.quill.getFormat() || {};
                const promise = this._editorInstance.showFormDialog({
                    formData: formData,
                    items: ["link"]
                });

                promise.done((formData) => {
                    this.quill.format("link", formData.link);
                });
            }
        };

        if(isDefined(options.items)) {
            this._renderToolbar();

            this.quill.on('editor-change', (eventName) => {
                this.updateFormatWidgets();
            });
        }
    }

    _getDefaultClickHandler(formatName) {
        return (e) => {
            const format = this.quill.getFormat(this.quill.getSelection());
            const value = !format[formatName];

            this.quill.format(formatName, value, "user");
            this.updateFormatWidgets();
        };
    }

    addClickHandler(formatName, handler) {
        this._formatHandlers[formatName] = handler;
        const formatWidget = this._formats[formatName];
        if(formatWidget && formatWidget.NAME === "dxButton") {
            formatWidget.option("onClick", handler);
        }
    }

    _renderToolbar() {
        const container = this.options.container || this.getContainer();
        const toolbarItems = this.prepareToolbarItems();

        $(container).addClass(TOOLBAR_CLASS);

        this.toolbarInstance = this._editorInstance._createComponent(container, Toolbar, { dataSource: toolbarItems });
    }

    getContainer() {
        const $container = $("<div>");

        this._editorInstance.$element().prepend($container);

        return $container;
    }

    prepareToolbarItems() {
        let resultItems = [];

        each(this.options.items, (index, item) => {
            let newItem;
            if(isObject(item)) {
                if(item.values && !item.widget) {
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
                onClick: this._formatHandlers[formatName] || this._getDefaultClickHandler(formatName)
            }
        };
    }

    _prepareSelectItemConfig(item) {
        return {
            widget: "dxSelectBox",
            format: item.format,
            options: {
                dataSource: item.values,
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
                    e.component.$element().addClass("dx-" + item.format + "-format");
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
                        const isHeaderValue = isDefined(item) && item !== false;
                        return isHeaderValue ? "H" + item : "Normal";
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
                this._setValueSilent(formatWidget, formats[format]);
            }
        }

        if(this._formats.clear && !isEmptyObject(formats)) {
            this._formats.clear.$element().addClass(ACTIVE_FORMAT_CLASS);
        }
    }

    _setValueSilent(widget, value) {
        this._isReset = true;
        widget.option("value", value);
        this._isReset = false;
    }

    _resetFormatWidgets() {
        each(this._formats, (name, widget) => {
            widget.$element().removeClass(ACTIVE_FORMAT_CLASS);
            if(widget.NAME === "dxSelectBox" || widget.NAME === "dxColorBox") {
                this._setValueSilent(widget, null);

            }
        });
    }
}

module.exports = ToolbarModule;
