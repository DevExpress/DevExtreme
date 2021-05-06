import Quill from 'devextreme-quill';

import $ from '../../../core/renderer';

import BaseHtmlEditorModule from './base';

import Toolbar from '../../toolbar';
import '../../select_box';
import '../../color_box/color_view';
import '../../number_box';
import errors from '../../widget/ui.errors';

import WidgetCollector from './widget_collector';
import { each } from '../../../core/utils/iterator';
import { isString, isObject, isDefined, isEmptyObject, isBoolean } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';
import localizationMessage from '../../../localization/message';
import { titleize, camelize } from '../../../core/utils/inflector';

import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';

let ToolbarModule = {};

if(Quill) {
    const TOOLBAR_WRAPPER_CLASS = 'dx-htmleditor-toolbar-wrapper';
    const TOOLBAR_CLASS = 'dx-htmleditor-toolbar';
    const TOOLBAR_FORMAT_WIDGET_CLASS = 'dx-htmleditor-toolbar-format';
    const TOOLBAR_SEPARATOR_CLASS = 'dx-htmleditor-toolbar-separator';
    const TOOLBAR_MENU_SEPARATOR_CLASS = 'dx-htmleditor-toolbar-menu-separator';
    const ACTIVE_FORMAT_CLASS = 'dx-format-active';
    const BOX_ITEM_CONTENT_CLASS = 'dx-box-item-content';

    const ICON_CLASS = 'dx-icon';

    const SELECTION_CHANGE_EVENT = 'selection-change';

    const DIALOG_COLOR_CAPTION = 'dxHtmlEditor-dialogColorCaption';
    const DIALOG_BACKGROUND_CAPTION = 'dxHtmlEditor-dialogBackgroundCaption';
    const DIALOG_LINK_CAPTION = 'dxHtmlEditor-dialogLinkCaption';
    const DIALOG_LINK_FIELD_URL = 'dxHtmlEditor-dialogLinkUrlField';
    const DIALOG_LINK_FIELD_TEXT = 'dxHtmlEditor-dialogLinkTextField';
    const DIALOG_LINK_FIELD_TARGET = 'dxHtmlEditor-dialogLinkTargetField';
    const DIALOG_LINK_FIELD_TARGET_CLASS = 'dx-formdialog-field-target';
    const DIALOG_IMAGE_CAPTION = 'dxHtmlEditor-dialogImageCaption';
    const DIALOG_IMAGE_FIELD_URL = 'dxHtmlEditor-dialogImageUrlField';
    const DIALOG_IMAGE_FIELD_ALT = 'dxHtmlEditor-dialogImageAltField';
    const DIALOG_IMAGE_FIELD_WIDTH = 'dxHtmlEditor-dialogImageWidthField';
    const DIALOG_IMAGE_FIELD_HEIGHT = 'dxHtmlEditor-dialogImageHeightField';
    const DIALOG_TABLE_FIELD_COLUMNS = 'dxHtmlEditor-dialogInsertTableRowsField';
    const DIALOG_TABLE_FIELD_ROWS = 'dxHtmlEditor-dialogInsertTableColumnsField';
    const DIALOG_TABLE_CAPTION = 'dxHtmlEditor-dialogInsertTableCaption';

    const TABLE_OPERATIONS = [
        'insertTable',
        'insertRowAbove',
        'insertRowBelow',
        'insertColumnLeft',
        'insertColumnRight',
        'deleteColumn',
        'deleteRow',
        'deleteTable'
    ];

    const USER_ACTION = 'user';
    const SILENT_ACTION = 'silent';

    const localize = (name) => {
        return localizationMessage.format(`dxHtmlEditor-${camelize(name)}`);
    };

    const localizeValue = (value, name) => {
        if(name === 'header') {
            const isHeaderValue = isDefined(value) && value !== false;
            return isHeaderValue ? `${localize('heading')} ${value}` : localize('normalText');
        }

        return localize(value) || value;
    };

    ToolbarModule = class ToolbarModule extends BaseHtmlEditorModule {
        constructor(quill, options) {
            super(quill, options);

            this._toolbarWidgets = new WidgetCollector();
            this._formatHandlers = this._getFormatHandlers();

            if(isDefined(options.items)) {
                this._addCallbacks();
                this._renderToolbar();

                this.quill.on('editor-change', (eventName) => {
                    const isSelectionChanged = eventName === SELECTION_CHANGE_EVENT;

                    this._updateToolbar(isSelectionChanged);
                });
            }
        }

        _applyFormat(formatArgs, event) {
            this.saveValueChangeEvent(event);
            this.quill.format(...formatArgs);
        }

        _addCallbacks() {
            this.addCleanCallback(this.clean.bind(this));
            this.editorInstance.addContentInitializedCallback(this.updateHistoryWidgets.bind(this));
        }

        _updateToolbar(isSelectionChanged) {
            this.updateFormatWidgets(isSelectionChanged);
            this.updateHistoryWidgets();
            this.updateTableWidgets();
        }

        _getDefaultClickHandler(name) {
            return ({ event }) => {
                const formats = this.quill.getFormat();
                const value = formats[name];
                const newValue = !(isBoolean(value) ? value : isDefined(value));

                this._applyFormat([name, newValue, USER_ACTION], event);

                this._updateFormatWidget(name, newValue, formats);
            };
        }

        _updateFormatWidget(name, isApplied, formats) {
            const widget = this._toolbarWidgets.getByName(name);

            if(!widget) {
                return;
            }

            if(isApplied) {
                this._markActiveFormatWidget(name, widget, formats);
            } else {
                this._resetFormatWidget(name, widget);
                if(Object.prototype.hasOwnProperty.call(name)) {
                    delete formats[name];
                }
            }

            this._toggleClearFormatting(isApplied || !isEmptyObject(formats));
        }

        _getFormatHandlers() {
            return {
                clear: ({ event }) => {
                    const range = this.quill.getSelection();
                    if(range) {
                        this.saveValueChangeEvent(event);
                        this.quill.removeFormat(range);
                        this.updateFormatWidgets();
                    }
                },
                link: this._prepareLinkHandler(),
                image: this._prepareImageHandler(),
                color: this._prepareColorClickHandler('color'),
                background: this._prepareColorClickHandler('background'),
                orderedList: this._prepareShortcutHandler('list', 'ordered'),
                bulletList: this._prepareShortcutHandler('list', 'bullet'),
                alignLeft: this._prepareShortcutHandler('align', 'left'),
                alignCenter: this._prepareShortcutHandler('align', 'center'),
                alignRight: this._prepareShortcutHandler('align', 'right'),
                alignJustify: this._prepareShortcutHandler('align', 'justify'),
                codeBlock: this._getDefaultClickHandler('code-block'),
                undo: ({ event }) => {
                    this.saveValueChangeEvent(event);
                    this.quill.history.undo();
                },
                redo: ({ event }) => {
                    this.saveValueChangeEvent(event);
                    this.quill.history.redo();
                },
                increaseIndent: ({ event }) => {
                    this._applyFormat(['indent', '+1', USER_ACTION], event);
                },
                decreaseIndent: ({ event }) => {
                    this._applyFormat(['indent', '-1', USER_ACTION], event);
                },
                superscript: this._prepareShortcutHandler('script', 'super'),
                subscript: this._prepareShortcutHandler('script', 'sub'),
                insertTable: this._prepareInsertTableHandler(),
                insertRowAbove: this._getTableOperationHandler('insertRowAbove'),
                insertRowBelow: this._getTableOperationHandler('insertRowBelow'),
                insertColumnLeft: this._getTableOperationHandler('insertColumnLeft'),
                insertColumnRight: this._getTableOperationHandler('insertColumnRight'),
                deleteColumn: this._getTableOperationHandler('deleteColumn'),
                deleteRow: this._getTableOperationHandler('deleteRow'),
                deleteTable: this._getTableOperationHandler('deleteTable')
            };
        }

        _prepareShortcutHandler(name, shortcutValue) {
            return ({ event }) => {
                const formats = this.quill.getFormat();
                const value = formats[name] === shortcutValue ? false : shortcutValue;

                this._applyFormat([name, value, USER_ACTION], event);
                this.updateFormatWidgets(true);
            };
        }

        _prepareLinkHandler() {
            return () => {
                this.quill.focus();

                const selection = this.quill.getSelection();
                const hasEmbedContent = this._hasEmbedContent(selection);
                const formats = selection ? this.quill.getFormat() : {};
                const formData = {
                    href: formats.link || '',
                    text: selection && !hasEmbedContent ? this.quill.getText(selection) : '',
                    target: Object.prototype.hasOwnProperty.call(formats, 'target') ? !!formats.target : true
                };
                this.editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_LINK_CAPTION));

                const promise = this.editorInstance.showFormDialog({
                    formData: formData,
                    items: this._getLinkFormItems(selection)
                });

                promise.done((formData, event) => {
                    if(selection && !hasEmbedContent) {
                        const text = formData.text || formData.href;
                        const { index, length } = selection;

                        formData.text = undefined;
                        this.saveValueChangeEvent(event);

                        length && this.quill.deleteText(index, length, SILENT_ACTION);
                        this.quill.insertText(index, text, 'link', formData, USER_ACTION);
                        this.quill.setSelection(index + text.length, 0, USER_ACTION);
                    } else {
                        formData.text = !selection && !formData.text ? formData.href : formData.text;
                        this._applyFormat(['link', formData, USER_ACTION], event);
                    }
                });

                promise.fail(() => {
                    this.quill.focus();
                });
            };
        }

        _hasEmbedContent(selection) {
            return !!selection && this.quill.getText(selection).trim().length < selection.length;
        }

        _getLinkFormItems(selection) {
            return [
                { dataField: 'href', label: { text: localizationMessage.format(DIALOG_LINK_FIELD_URL) } },
                {
                    dataField: 'text',
                    label: { text: localizationMessage.format(DIALOG_LINK_FIELD_TEXT) },
                    visible: !this._hasEmbedContent(selection)
                },
                {
                    dataField: 'target',
                    editorType: 'dxCheckBox',
                    editorOptions: {
                        text: localizationMessage.format(DIALOG_LINK_FIELD_TARGET)
                    },
                    cssClass: DIALOG_LINK_FIELD_TARGET_CLASS,
                    label: { visible: false }
                }
            ];
        }

        _prepareImageHandler() {
            return () => {
                const formData = this.quill.getFormat();
                const isUpdateDialog = Object.prototype.hasOwnProperty.call(formData, 'imageSrc');
                const defaultIndex = this._defaultPasteIndex;

                if(isUpdateDialog) {
                    const { imageSrc } = this.quill.getFormat(defaultIndex - 1, 1);

                    formData.src = formData.imageSrc;
                    delete formData.imageSrc;

                    if(!imageSrc || defaultIndex === 0) {
                        this.quill.setSelection(defaultIndex + 1, 0, SILENT_ACTION);
                    }
                }

                const formatIndex = this._embedFormatIndex;

                this.editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_IMAGE_CAPTION));

                const promise = this.editorInstance.showFormDialog({
                    formData: formData,
                    items: this._imageFormItems
                });

                promise
                    .done((formData, event) => {
                        let index = defaultIndex;

                        this._saveValueChangeEvent(event);

                        if(isUpdateDialog) {
                            index = formatIndex;
                            this.quill.deleteText(index, 1, SILENT_ACTION);
                        }

                        this.quill.insertEmbed(index, 'extendedImage', formData, USER_ACTION);
                        this.quill.setSelection(index + 1, 0, USER_ACTION);
                    })
                    .always(() => {
                        this.quill.focus();
                    });
            };
        }

        get _insertTableFormItems() {
            return [
                {
                    dataField: 'columns',
                    editorType: 'dxNumberBox',
                    editorOptions: {
                        min: 1
                    },
                    label: { text: localizationMessage.format(DIALOG_TABLE_FIELD_COLUMNS) }
                },
                {
                    dataField: 'rows',
                    editorType: 'dxNumberBox',
                    editorOptions: {
                        min: 1
                    },
                    label: { text: localizationMessage.format(DIALOG_TABLE_FIELD_ROWS) }
                }
            ];
        }

        _prepareInsertTableHandler() {
            return () => {
                const formats = this.quill.getFormat();
                const isTableFocused = Object.prototype.hasOwnProperty.call(formats, 'table');
                const formData = { rows: 1, columns: 1 };

                if(isTableFocused) {
                    this.quill.focus();
                    return;
                }

                this.editorInstance.formDialogOption('title', localizationMessage.format(DIALOG_TABLE_CAPTION));

                const promise = this.editorInstance.showFormDialog({
                    formData,
                    items: this._insertTableFormItems
                });

                promise
                    .done((formData, event) => {
                        this.quill.focus();

                        const table = this.quill.getModule('table');
                        if(table) {
                            this.saveValueChangeEvent(event);

                            const { columns, rows } = formData;
                            table.insertTable(columns, rows);
                        }
                    })
                    .always(() => {
                        this.quill.focus();
                    });
            };
        }

        // ToDo: extract it to the table module
        _getTableOperationHandler(operationName, ...rest) {
            return () => {
                const table = this.quill.getModule('table');

                if(!table) {
                    return;
                }
                this.quill.focus();
                return table[operationName](...rest);
            };
        }

        get _embedFormatIndex() {
            const selection = this.quill.getSelection();

            if(selection) {
                if(selection.length) {
                    return selection.index;
                } else {
                    return selection.index - 1;
                }
            } else {
                return this.quill.getLength();
            }
        }

        get _defaultPasteIndex() {
            const selection = this.quill.getSelection();
            return selection?.index ?? this.quill.getLength();
        }

        get _imageFormItems() {
            return [
                { dataField: 'src', label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_URL) } },
                { dataField: 'width', label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_WIDTH) } },
                { dataField: 'height', label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_HEIGHT) } },
                { dataField: 'alt', label: { text: localizationMessage.format(DIALOG_IMAGE_FIELD_ALT) } }
            ];
        }

        _renderToolbar() {
            const container = this.options.container || this._getContainer();

            this._$toolbar = $('<div>')
                .addClass(TOOLBAR_CLASS)
                .appendTo(container);
            this._$toolbarContainer = $(container).addClass(TOOLBAR_WRAPPER_CLASS);

            eventsEngine.on(this._$toolbarContainer, addNamespace('mousedown', this.editorInstance.NAME), (e) => {
                e.preventDefault();
            });

            this.toolbarInstance = this.editorInstance._createComponent(this._$toolbar, Toolbar, this.toolbarConfig);

            this.editorInstance.on('optionChanged', ({ name }) => {
                if(name === 'readOnly' || name === 'disabled') {
                    this.toolbarInstance.option('disabled', this.isInteractionDisabled);
                }
            });
        }

        get toolbarConfig() {
            return {
                dataSource: this._prepareToolbarItems(),
                disabled: this.isInteractionDisabled,
                menuContainer: this._$toolbarContainer,
                multiline: this.isMultilineMode()
            };
        }

        get isInteractionDisabled() {
            return this.editorInstance.option('readOnly') || this.editorInstance.option('disabled');
        }

        isMultilineMode() {
            return this.options.multiline ?? true;
        }

        clean() {
            this._toolbarWidgets.clear();

            if(this._$toolbarContainer) {
                this._$toolbarContainer
                    .empty()
                    .removeClass(TOOLBAR_WRAPPER_CLASS);
            }
        }

        repaint() {
            this.toolbarInstance && this.toolbarInstance.repaint();
        }

        _getContainer() {
            const $container = $('<div>');

            this.editorInstance.$element().prepend($container);

            return $container;
        }

        _detectRenamedOptions(item) {
            const optionsInfo = [{
                newName: 'name',
                oldName: 'formatName'
            }, {
                newName: 'acceptedValues',
                oldName: 'formatValues'
            }];

            if(isObject(item)) {
                each(optionsInfo, (index, optionName) => {
                    if(Object.prototype.hasOwnProperty.call(item, optionName.oldName)) {
                        errors.log('W1016', optionName.oldName, optionName.newName);
                    }
                });
            }
        }

        _prepareToolbarItems() {
            const resultItems = [];

            each(this.options.items, (index, item) => {
                let newItem;
                this._detectRenamedOptions(item);
                if(isObject(item)) {
                    newItem = this._handleObjectItem(item);
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

        _handleObjectItem(item) {
            if(item.name && item.acceptedValues && this._isAcceptableItem(item.widget, 'dxSelectBox')) {
                const selectItemConfig = this._prepareSelectItemConfig(item);

                return this._getToolbarItem(selectItemConfig);
            } else if(item.name && this._isAcceptableItem(item.widget, 'dxButton')) {
                const defaultButtonItemConfig = this._prepareButtonItemConfig(item.name);
                const buttonItemConfig = extend(true, defaultButtonItemConfig, item);

                return this._getToolbarItem(buttonItemConfig);
            } else {
                return this._getToolbarItem(item);
            }
        }

        _isAcceptableItem(widget, acceptableWidgetName) {
            return !widget || widget === acceptableWidgetName;
        }

        _prepareButtonItemConfig(name) {
            const iconName = name === 'clear' ? 'clearformat' : name;
            const buttonText = titleize(name);

            return {
                widget: 'dxButton',
                name,
                options: {
                    hint: localize(buttonText),
                    text: localize(buttonText),
                    icon: iconName.toLowerCase(),
                    onClick: this._formatHandlers[name] || this._getDefaultClickHandler(name),
                    stylingMode: 'text'
                },
                showText: 'inMenu'
            };
        }

        _prepareSelectItemConfig(item) {
            const { name, acceptedValues } = item;

            return extend(true, {
                widget: 'dxSelectBox',
                name,
                options: {
                    stylingMode: 'filled',
                    dataSource: acceptedValues,
                    displayExpr: (value) => {
                        return localizeValue(value, name);
                    },
                    placeholder: localize(name),
                    onValueChanged: (e) => {
                        if(!this._isReset) {
                            this._applyFormat([name, e.value, USER_ACTION], e.event);
                            this._setValueSilent(e.component, e.value);
                        }
                    }
                }
            }, item);
        }

        _prepareColorClickHandler(name) {
            return () => {
                const formData = this.quill.getFormat();
                const caption = name === 'color' ? DIALOG_COLOR_CAPTION : DIALOG_BACKGROUND_CAPTION;
                this.editorInstance.formDialogOption('title', localizationMessage.format(caption));
                const promise = this.editorInstance.showFormDialog({
                    formData: formData,
                    items: [{
                        dataField: name,
                        editorType: 'dxColorView',
                        editorOptions: {
                            onContentReady: (e) => {
                                $(e.element)
                                    .closest(`.${BOX_ITEM_CONTENT_CLASS}`)
                                    .css('flexBasis', 'auto'); // WA for the T590137
                            },
                            focusStateEnabled: false
                        },
                        label: { visible: false }
                    }]
                });

                promise.done((formData, event) => {
                    this._applyFormat([name, formData[name], USER_ACTION], event);
                });
                promise.fail(() => {
                    this.quill.focus();
                });
            };
        }

        _getToolbarItem(item) {
            const baseItem = {
                options: {
                    onInitialized: (e) => {
                        if(item.name) {
                            e.component.$element().addClass(TOOLBAR_FORMAT_WIDGET_CLASS);
                            e.component.$element().toggleClass(`dx-${item.name.toLowerCase()}-format`, !!item.name);
                            this._toolbarWidgets.add(item.name, e.component);
                        }
                    }
                }
            };

            const multilineItem = this.isMultilineMode() ? { location: 'before', locateInMenu: 'never' } : {};

            return extend(true, { location: 'before', locateInMenu: 'auto' }, this._getDefaultConfig(item.name), item, baseItem, multilineItem);
        }

        _getDefaultItemsConfig() {
            return {
                clear: {
                    options: {
                        disabled: true
                    }
                },
                undo: {
                    options: {
                        disabled: true
                    }
                },
                redo: {
                    options: {
                        disabled: true
                    }
                },
                // ToDo: move it to the table module
                insertRowAbove: {
                    options: {
                        disabled: true
                    }
                },
                insertRowBelow: {
                    options: {
                        disabled: true
                    }
                },
                insertColumnLeft: {
                    options: {
                        disabled: true
                    }
                },
                insertColumnRight: {
                    options: {
                        disabled: true
                    }
                },
                deleteRow: {
                    options: {
                        disabled: true
                    }
                },
                deleteColumn: {
                    options: {
                        disabled: true
                    }
                },
                deleteTable: {
                    options: {
                        disabled: true
                    }
                },
                separator: {
                    template: (data, index, element) => {
                        $(element).addClass(TOOLBAR_SEPARATOR_CLASS);
                    },
                    menuItemTemplate: (data, index, element) => {
                        $(element).addClass(TOOLBAR_MENU_SEPARATOR_CLASS);
                    }
                }
            };
        }

        _getDefaultConfig(name) {
            return this._getDefaultItemsConfig()[name];
        }

        updateHistoryWidgets() {
            const historyModule = this.quill.history;

            if(!historyModule) {
                return;
            }

            const {
                undo: undoOps,
                redo: redoOps
            } = historyModule.stack;

            this._updateManipulationWidget(this._toolbarWidgets.getByName('undo'), Boolean(undoOps.length));
            this._updateManipulationWidget(this._toolbarWidgets.getByName('redo'), Boolean(redoOps.length));
        }

        updateTableWidgets() {
            const table = this.quill.getModule('table');
            if(!table) {
                return;
            }

            const selection = this.quill.getSelection();
            const isTableOperationsEnabled = selection && Boolean(this.quill.getFormat(selection)?.table);
            TABLE_OPERATIONS.forEach((operationName) => {
                const isInsertTable = operationName === 'insertTable';
                const widget = this._toolbarWidgets.getByName(operationName);

                this._updateManipulationWidget(widget, isInsertTable ? !isTableOperationsEnabled : isTableOperationsEnabled);
            });
        }

        _updateManipulationWidget(widget, isOperationEnabled) {
            if(!widget) {
                return;
            }

            widget.option('disabled', !isOperationEnabled);
        }

        updateFormatWidgets(isResetRequired) {
            const selection = this.quill.getSelection();
            if(!selection) {
                return;
            }

            const formats = this.quill.getFormat(selection);
            const hasFormats = !isEmptyObject(formats);

            if(!hasFormats || isResetRequired) {
                this._resetFormatWidgets();
            }

            for(const formatName in formats) {
                const widgetName = this._getFormatWidgetName(formatName, formats);
                const formatWidget = this._toolbarWidgets.getByName(widgetName) || this._toolbarWidgets.getByName(formatName);

                if(!formatWidget) {
                    continue;
                }

                this._markActiveFormatWidget(formatName, formatWidget, formats);
            }

            this._toggleClearFormatting(hasFormats || selection.length > 1);
        }

        _markActiveFormatWidget(name, widget, formats) {
            if(this._isColorFormat(name)) {
                this._updateColorWidget(name, formats[name]);
            }

            if('value' in widget.option()) {
                this._setValueSilent(widget, formats[name]);
            } else {
                widget.$element().addClass(ACTIVE_FORMAT_CLASS);
            }
        }

        _toggleClearFormatting(hasFormats) {
            const clearWidget = this._toolbarWidgets.getByName('clear');
            if(clearWidget) {
                clearWidget.option('disabled', !hasFormats);
            }
        }

        _isColorFormat(name) {
            return name === 'color' || name === 'background';
        }

        _updateColorWidget(name, color) {
            const formatWidget = this._toolbarWidgets.getByName(name);
            if(!formatWidget) {
                return;
            }

            formatWidget
                .$element()
                .find(`.${ICON_CLASS}`)
                .css('borderBottomColor', color || 'transparent');
        }

        _getFormatWidgetName(name, formats) {
            let widgetName;
            switch(name) {
                case 'align':
                    widgetName = name + titleize(formats[name]);
                    break;
                case 'list':
                    widgetName = formats[name] + titleize(name);
                    break;
                case 'code-block':
                    widgetName = 'codeBlock';
                    break;
                case 'script':
                    widgetName = formats[name] + name;
                    break;
                case 'imageSrc':
                    widgetName = 'image';
                    break;
                default:
                    widgetName = name;
            }

            return widgetName;
        }

        _setValueSilent(widget, value) {
            this._isReset = true;
            widget.option('value', value);
            this._isReset = false;
        }

        _resetFormatWidgets() {
            this._toolbarWidgets.each((name, widget) => {
                this._resetFormatWidget(name, widget);
            });
        }

        _resetFormatWidget(name, widget) {
            widget.$element().removeClass(ACTIVE_FORMAT_CLASS);

            if(this._isColorFormat(name)) {
                this._updateColorWidget(name);
            }
            if(name === 'clear') {
                widget.option('disabled', true);
            }
            if(widget.NAME === 'dxSelectBox') {
                this._setValueSilent(widget, null);
            }
        }

        addClickHandler(name, handler) {
            this._formatHandlers[name] = handler;
            const formatWidget = this._toolbarWidgets.getByName(name);
            if(formatWidget && formatWidget.NAME === 'dxButton') {
                formatWidget.option('onClick', handler);
            }
        }
    };
}

export default ToolbarModule;
