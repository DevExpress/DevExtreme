import Quill from 'devextreme-quill';

import $ from '../../../core/renderer';

import BaseModule from './base';

import Toolbar from '../../toolbar';
import '../../select_box';
import '../../color_box/color_view';
import '../../number_box';
import errors from '../../widget/ui.errors';

import WidgetCollector from './widget_collector';
import { each } from '../../../core/utils/iterator';
import { isString, isObject, isDefined, isEmptyObject } from '../../../core/utils/type';
import { extend } from '../../../core/utils/extend';
import localizationMessage from '../../../localization/message';
import { titleize, camelize } from '../../../core/utils/inflector';

import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';

import { getTableFormats, TABLE_OPERATIONS } from '../utils/table_helper';
import { getFormatHandlers, getDefaultClickHandler, ICON_MAP, applyFormat } from '../utils/toolbar_helper';

let ToolbarModule = BaseModule;

if(Quill) {
    const TOOLBAR_WRAPPER_CLASS = 'dx-htmleditor-toolbar-wrapper';
    const TOOLBAR_CLASS = 'dx-htmleditor-toolbar';
    const TOOLBAR_FORMAT_WIDGET_CLASS = 'dx-htmleditor-toolbar-format';
    const TOOLBAR_SEPARATOR_CLASS = 'dx-htmleditor-toolbar-separator';
    const TOOLBAR_MENU_SEPARATOR_CLASS = 'dx-htmleditor-toolbar-menu-separator';
    const ACTIVE_FORMAT_CLASS = 'dx-format-active';

    const ICON_CLASS = 'dx-icon';

    const SELECTION_CHANGE_EVENT = 'selection-change';

    const USER_ACTION = 'user';
    const SILENT_ACTION = 'silent';

    const FORMAT_HOTKEYS = {
        66: 'bold',
        73: 'italic',
        85: 'underline'
    };

    const KEY_CODES = {
        b: 66,
        i: 73,
        u: 85
    };

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

    ToolbarModule = class ToolbarModule extends BaseModule {
        constructor(quill, options) {
            super(quill, options);

            this._toolbarWidgets = new WidgetCollector();
            this._formatHandlers = getFormatHandlers(this);
            this._tableFormats = getTableFormats(quill);

            if(isDefined(options.items)) {
                this._addCallbacks();
                this._renderToolbar();

                this.quill.on('editor-change', (eventName, newValue, oldValue, eventSource) => {
                    const isSilentMode = eventSource === SILENT_ACTION && isEmptyObject(this.quill.getFormat());

                    if(!isSilentMode) {
                        const isSelectionChanged = eventName === SELECTION_CHANGE_EVENT;

                        this._updateToolbar(isSelectionChanged);
                    }
                });
            }
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

        _renderToolbar() {
            const container = this.options.container || this._getContainer();

            this._$toolbar = $('<div>')
                .addClass(TOOLBAR_CLASS)
                .appendTo(container);
            this._$toolbarContainer = $(container).addClass(TOOLBAR_WRAPPER_CLASS);

            eventsEngine.on(this._$toolbarContainer, addNamespace('mousedown', this.editorInstance.NAME), (e) => {
                e.preventDefault();
            });

            this._subscribeFormatHotKeys();

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

        _subscribeFormatHotKeys() {
            this.quill.keyboard.addBinding({
                which: KEY_CODES.b,
                shortKey: true,
            }, this._handleFormatHotKey.bind(this));

            this.quill.keyboard.addBinding({
                which: KEY_CODES.i,
                shortKey: true,
            }, this._handleFormatHotKey.bind(this));

            this.quill.keyboard.addBinding({
                which: KEY_CODES.u,
                shortKey: true,
            }, this._handleFormatHotKey.bind(this));
        }

        _handleFormatHotKey(range, context, { which }) {
            const formatName = FORMAT_HOTKEYS[which];

            this._updateButtonState(formatName);
        }

        _updateButtonState(formatName) {
            const formatWidget = this._toolbarWidgets.getByName(formatName);
            const currentFormat = this.quill.getFormat();
            const formatValue = currentFormat[formatName];

            if(formatValue) {
                this._markActiveFormatWidget(formatName, formatWidget, currentFormat);
            } else {
                this._resetFormatWidget(formatName, formatWidget);
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
            const iconName = ICON_MAP[name] ?? name;
            const buttonText = titleize(name);

            return {
                widget: 'dxButton',
                name,
                options: {
                    hint: localize(buttonText),
                    text: localize(buttonText),
                    icon: iconName.toLowerCase(),
                    onClick: this._formatHandlers[name] || getDefaultClickHandler(this, name),
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
                            this._hideAdaptiveMenu();
                            applyFormat(this, [name, e.value, USER_ACTION], e.event);
                            this._setValueSilent(e.component, e.value);
                        }
                    }
                }
            }, item);
        }

        _hideAdaptiveMenu() {
            if(this.toolbarInstance.option('overflowMenuVisible')) {
                this.toolbarInstance.option('overflowMenuVisible', false);
            }
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
                insertHeaderRow: {
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
                cellProperties: {
                    options: {
                        disabled: true
                    }
                },
                tableProperties: {
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
            const formats = selection && this.quill.getFormat(selection) || {};
            const isTableOperationsEnabled = this._tableFormats.some(format => Boolean(formats[format]));
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
