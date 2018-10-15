import { getQuill } from "../quill_importer";

import $ from "../../../core/renderer";

import Toolbar from "../../toolbar";
import "../../select_box";
import "../../color_box/color_view";

import { each } from "../../../core/utils/iterator";
import { isString, isObject, isDefined, isEmptyObject } from "../../../core/utils/type";
import { extend } from "../../../core/utils/extend";
import { format } from "../../../localization/message";

const BaseModule = getQuill().import("core/module");

const TOOLBAR_CLASS = "dx-htmleditor-toolbar";
const TOOLBAR_FORMAT_WIDGET_CLASS = "dx-htmleditor-toolbar-format";
const ACTIVE_FORMAT_CLASS = "dx-format-active";

const DIALOG_COLOR_CAPTION = "dxHtmlEditor-dialogColorCaption";
const DIALOG_BACKGROUND_CAPTION = "dxHtmlEditor-dialogBackgroundCaption";
const DIALOG_LINK_CAPTION = "dxHtmlEditor-dialogLinkCaption";
const DIALOG_LINK_FIELD_URL = "dxHtmlEditor-dialogLinkUrlField";
const DIALOG_LINK_FIELD_TEXT = "dxHtmlEditor-dialogLinkTextField";
const DIALOG_LINK_FIELD_HINT = "dxHtmlEditor-dialogLinkHintField";
const DIALOG_LINK_FIELD_TARGET = "dxHtmlEditor-dialogLinkTargetField";
const DIALOG_LINK_FIELD_TARGET_CLASS = "dx-formdialog-field-target";
const DIALOG_IMAGE_CAPTION = "dxHtmlEditor-dialogImageCaption";
const DIALOG_IMAGE_FIELD_URL = "dxHtmlEditor-dialogImageUrlField";
const DIALOG_IMAGE_FIELD_ALT = "dxHtmlEditor-dialogImageAltField";
const DIALOG_IMAGE_FIELD_WIDTH = "dxHtmlEditor-dialogImageWidthField";
const DIALOG_IMAGE_FIELD_HEIGHT = "dxHtmlEditor-dialogImageHeightField";

const USER_ACTION = "user";

class ToolbarModule extends BaseModule {
    constructor(quill, options) {
        super(quill, options);

        this._editorInstance = options.editorInstance;
        this._formats = {};
        this._formatHandlers = this._getFormatHandlers();

        if(isDefined(options.items)) {
            this._renderToolbar();

            this._editorInstance.on("focusOut", this._resetFormatWidgets.bind(this));
            this.quill.on('editor-change', (eventName) => {
                this.updateFormatWidgets();
            });
        }
    }

    _getDefaultClickHandler(formatName) {
        return (e) => {
            const format = this.quill.getFormat(this.quill.getSelection());
            const value = !format[formatName];

            this.quill.format(formatName, value, USER_ACTION);
            this.updateFormatWidgets();
        };
    }

    _getFormatHandlers() {
        return {
            clear: (e) => {
                this.quill.removeFormat(this.quill.getSelection());
                this.updateFormatWidgets();
            },
            link: this._prepareLinkHandler(),
            image: this._prepareImageHandler(),
            color: this._prepareColorClickHandler("color"),
            background: this._prepareColorClickHandler("background"),
            orderedList: () => {
                this.quill.format("list", "ordered", USER_ACTION);
            },
            bulletList: () => {
                this.quill.format("list", "bullet", USER_ACTION);
            },
            alignLeft: () => {
                this.quill.format("align", false, USER_ACTION);
            },
            alignCenter: () => {
                this.quill.format("align", "center", USER_ACTION);
            },
            alignRight: () => {
                this.quill.format("align", "right", USER_ACTION);
            },
            alignJustify: () => {
                this.quill.format("align", "justify", USER_ACTION);
            }
        };
    }

    _prepareLinkHandler() {
        return () => {
            const selection = this.quill.getSelection();
            const formats = this.quill.getFormat();
            const formData = formats.link || {
                text: selection ? this.quill.getText(selection) : "",
                target: true
            };
            this._editorInstance.formDialogOption("title", format(DIALOG_LINK_CAPTION));

            const promise = this._editorInstance.showFormDialog({
                formData: formData,
                items: this._getLinkFormItems()
            });

            promise.done((formData) => {
                let index;
                let length;

                if(selection && !formats.link) {
                    index = selection.index;
                    length = selection.length;
                    length && this.quill.deleteText(index, length);
                    this.quill.setSelection(index, 0, "silent");
                }

                this.quill.format("link", formData, USER_ACTION);
            });
        };
    }

    _getLinkFormItems() {
        return [
            { dataField: "href", label: { text: format(DIALOG_LINK_FIELD_URL) } },
            { dataField: "text", label: { text: format(DIALOG_LINK_FIELD_TEXT) } },
            { dataField: "title", label: { text: format(DIALOG_LINK_FIELD_HINT) } },
            {
                dataField: "target",
                editorType: "dxCheckBox",
                cssClass: DIALOG_LINK_FIELD_TARGET_CLASS,
                label: { text: format(DIALOG_LINK_FIELD_TARGET) }
            }
        ];
    }

    _prepareImageHandler() {
        return () => {
            const formData = this.quill.getFormat();
            const isUpdateDialog = formData.hasOwnProperty("src");
            const selection = this.quill.getSelection();
            const pasteIndex = selection && selection.index || this.quill.getLength();

            this._editorInstance.formDialogOption("title", format(DIALOG_IMAGE_CAPTION));

            const formItems = [
                { dataField: "src", label: { text: format(DIALOG_IMAGE_FIELD_URL) } },
                { dataField: "width", label: { text: format(DIALOG_IMAGE_FIELD_WIDTH) } },
                { dataField: "height", label: { text: format(DIALOG_IMAGE_FIELD_HEIGHT) } },
                { dataField: "alt", label: { text: format(DIALOG_IMAGE_FIELD_ALT) } },
            ];

            const promise = this._editorInstance.showFormDialog({
                formData: formData,
                items: formItems
            });

            promise.done((formData) => {
                if(isUpdateDialog) {
                    const formatIndex = selection && !selection.length && selection.index - 1 || pasteIndex;
                    this.quill.formatText(formatIndex, 1, {
                        width: formData.width,
                        height: formData.height,
                        alt: formData.alt
                    }, USER_ACTION);
                } else {
                    this.quill.insertEmbed(pasteIndex, "image", formData, USER_ACTION);
                }
            });
        };
    }

    _renderToolbar() {
        const container = this.options.container || this._getContainer();
        const toolbarItems = this._prepareToolbarItems();

        $(container).addClass(TOOLBAR_CLASS);

        this.toolbarInstance = this._editorInstance._createComponent(container, Toolbar, { dataSource: toolbarItems });
    }

    _getContainer() {
        const $container = $("<div>");

        this._editorInstance.$element().prepend($container);

        return $container;
    }

    _prepareToolbarItems() {
        let resultItems = [];

        each(this.options.items, (index, item) => {
            let newItem;
            if(isObject(item)) {
                if(item.formatValues && !item.widget) {
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
        const iconName = formatName === "clear" ? "clearformat" : formatName;
        return {
            widget: "dxButton",
            formatName: formatName,
            options: {
                icon: iconName.toLowerCase(),
                onClick: this._formatHandlers[formatName] || this._getDefaultClickHandler(formatName)
            }
        };
    }

    _prepareSelectItemConfig(item) {
        return {
            widget: "dxSelectBox",
            formatName: item.formatName,
            options: {
                dataSource: item.formatValues,
                onValueChanged: (e) => {
                    if(!this._isReset) {
                        this.quill.format(item.formatName, e.value, USER_ACTION);
                    }
                }
            }
        };
    }

    _prepareColorClickHandler(formatName) {
        return () => {
            const formData = this.quill.getFormat();
            const caption = formatName === "color" ? DIALOG_COLOR_CAPTION : DIALOG_BACKGROUND_CAPTION;
            this._editorInstance.formDialogOption("title", format(caption));
            const promise = this._editorInstance.showFormDialog({
                formData: formData,
                items: [{ dataField: formatName, editorType: "dxColorView", label: { visible: false } }]
            });

            promise.done((formData) => {
                this.quill.format(formatName, formData[formatName], USER_ACTION);
            });
        };
    }

    _getToolbarItem(item) {
        const baseItem = {
            options: {
                onInitialized: (e) => {
                    e.component.$element().addClass(TOOLBAR_FORMAT_WIDGET_CLASS);
                    e.component.$element().toggleClass(`dx-${item.formatName.toLowerCase()}-format`, !!item.formatName);
                    this._formats[item.formatName] = e.component;
                }
            }
        };

        return extend(true, { location: "before" }, this._getDefaultConfig(item.formatName), item, baseItem);
    }

    _getDefaultItemsConfig() {
        return {
            header: {
                options: {
                    displayExpr: (item) => {
                        const isHeaderValue = isDefined(item) && item !== false;
                        return isHeaderValue ? "H" + item : "Normal";
                    }
                }
            }
        };
    }

    _getDefaultConfig(formatName) {
        return this._getDefaultItemsConfig()[formatName];
    }

    updateFormatWidgets() {
        const selection = this.quill.getSelection();
        if(!selection) {
            return;
        }

        this._resetFormatWidgets();

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
            if(widget.NAME === "dxSelectBox") {
                this._setValueSilent(widget, null);

            }
        });
    }

    addClickHandler(formatName, handler) {
        this._formatHandlers[formatName] = handler;
        const formatWidget = this._formats[formatName];
        if(formatWidget && formatWidget.NAME === "dxButton") {
            formatWidget.option("onClick", handler);
        }
    }
}

module.exports = ToolbarModule;
