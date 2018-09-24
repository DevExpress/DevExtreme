import { getQuill } from "../quill_importer";

import $ from "../../../core/renderer";
import Toolbar from "../../toolbar";
import { each } from "../../../core/utils/iterator";
import { isString, isObject, isDefined } from "../../../core/utils/type";
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
                if(eventName === 'selection-change') {
                    this.updateFormatWidgets();
                }
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
                if(item.items) {
                    newItem = this._getToolbarItem({
                        widget: "dxSelectBox",
                        format: item.format
                    });
                } else {
                    newItem = this._getToolbarItem(item);
                }
            } else if(isString(item)) {
                newItem = this._getToolbarItem({
                    widget: "dxButton",
                    format: item,
                    options: {
                        text: item,
                        onClick: (e) => {
                            if(item === "clear") {
                                this.quill.removeFormat(this.quill.getSelection());
                            } else {
                                const format = this.quill.getFormat(this.quill.getSelection());
                                const value = !format[item];

                                this.quill.format(item, value, "user");
                            }
                            this.updateFormatWidgets();
                        }
                    }
                });
            }
            if(newItem) {
                resultItems.push(newItem);
            }
        });

        return resultItems;
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

        return extend(true, this.getFormatItemConfig(item.format), { location: "before" }, item, baseItem);
    }

    getFormatItemConfig(format) {
        return {}; // ToolbarModule.DEFAULTS.formats[format]
    }

    updateFormatWidgets() {
        let hasFormat;
        this.toolbarInstance
            .$element()
            .find("." + ACTIVE_FORMAT_CLASS)
            .removeClass(ACTIVE_FORMAT_CLASS);

        const selection = this.quill.getSelection();
        if(!selection) {
            return;
        }

        const formats = this.quill.getFormat(selection);
        for(const format in formats) {
            hasFormat = true;

            const formatWidget = this._formats[format];
            if(formatWidget) {
                formatWidget.$element().addClass(ACTIVE_FORMAT_CLASS);
            }
        }

        if(this._formats.clear && hasFormat) {
            this._formats.clear.$element().addClass(ACTIVE_FORMAT_CLASS);
        }
    }
}

module.exports = ToolbarModule;
