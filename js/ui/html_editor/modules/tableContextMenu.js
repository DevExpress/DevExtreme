import Quill from 'devextreme-quill';
import $ from '../../../core/renderer';
import BaseModule from './base';
import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';
import ContextMenu from '../../context_menu';
import { showCellPropertiesForm, showTablePropertiesForm } from '../ui/tableForms';
import localizationMessage from '../../../localization/message';
import { getTableOperationHandler, getTableFormats } from '../utils/table_helper';
import { getFormatHandlers, getDefaultClickHandler, ICON_MAP } from '../utils/toolbar_helper';
import { each } from '../../../core/utils/iterator';
import { isString, isObject } from '../../../core/utils/type';
import { titleize, camelize } from '../../../core/utils/inflector';
import { extend } from '../../../core/utils/extend';

const MODULE_NAMESPACE = 'dxHtmlTableContextMenu';

const CONTEXT_MENU_EVENT = addNamespace('dxcontextmenu', MODULE_NAMESPACE);

let TableContextMenuModule = BaseModule;

const localize = (name) => {
    return localizationMessage.format(`dxHtmlEditor-${camelize(name)}`);
};

if(Quill) {
    TableContextMenuModule = class TableContextMenuModule extends BaseModule {
        constructor(quill, options) {
            super(quill, options);
            this.enabled = !!options.enabled;
            this._quillContainer = this.editorInstance._getQuillContainer();
            this.addCleanCallback(this.prepareCleanCallback());
            this._formatHandlers = getFormatHandlers(this);
            this._tableFormats = getTableFormats(quill);

            if(this.enabled) {
                this._enableContextMenu(options.items);
            }
        }

        _enableContextMenu(items) {
            if(!this._contextMenu) {
                this._contextMenu = this._createContextMenu(items);
            }
            this._attachEvents();
        }

        _attachEvents() {
            eventsEngine.on(this.editorInstance._getContent(), CONTEXT_MENU_EVENT, this._prepareContextMenuHandler());
        }

        _detachEvents() {
            eventsEngine.off(this.editorInstance._getContent(), MODULE_NAMESPACE);
        }

        _createContextMenu(items) {
            const $container = $('<div>').appendTo(this.editorInstance.$element());
            const menuConfig = this._getMenuConfig(items);

            return this.editorInstance._createComponent($container, ContextMenu, menuConfig);
        }

        showTableProperties(e) {
            const $table = $(this._targetElement).closest('table');
            this._contextMenu.hide();
            this._popupForm = showTablePropertiesForm(this.editorInstance, $table);
            this._targetElement = null;
        }

        showCellProperties(e) {
            const $cell = $(this._targetElement).closest('th, td');
            this._contextMenu.hide();
            this._popupForm = showCellPropertiesForm(this.editorInstance, $cell);
            this._targetElement = null;
        }

        _isAcceptableItem(widget, acceptableWidgetName) {
            return !widget || widget === acceptableWidgetName;
        }

        _handleObjectItem(item) {
            if(item.name && this._isAcceptableItem(item.widget, 'dxButton')) {
                const defaultButtonItemConfig = this._prepareButtonItemConfig(item.name);
                const buttonItemConfig = extend(true, defaultButtonItemConfig, item);

                return buttonItemConfig;
            } else if(item.items) {
                item.items = this._prepareMenuItems(item.items);
                return item;
            } else {
                return item;
            }
        }

        _prepareButtonItemConfig(name) {
            const iconName = ICON_MAP[name] ?? name;
            const buttonText = titleize(name);

            return {
                text: localize(buttonText),
                icon: iconName.toLowerCase(),
                onClick: this._formatHandlers[name] || getDefaultClickHandler(name, this)
            };
        }

        _prepareMenuItems(items) {
            const resultItems = [];
            each(items, (_, item) => {
                let newItem;
                if(isObject(item)) {
                    newItem = this._handleObjectItem(item);
                } else if(isString(item)) {
                    const buttonItemConfig = this._prepareButtonItemConfig(item);
                    newItem = buttonItemConfig;
                }
                if(newItem) {
                    resultItems.push(newItem);
                }
            });

            return resultItems;
        }

        _getMenuConfig(items) {
            const defaultConfig = [
                { text: 'Insert', items: [
                    { text: localizationMessage.format('dxHtmlEditor-insertHeaderRow'), icon: 'header', onClick: getTableOperationHandler(this.quill, 'insertHeaderRow') },
                    { text: localizationMessage.format('dxHtmlEditor-insertRowAbove'), icon: 'insertrowabove', onClick: getTableOperationHandler(this.quill, 'insertRowAbove') },
                    { text: localizationMessage.format('dxHtmlEditor-insertRowBelow'), icon: 'insertrowbelow', onClick: getTableOperationHandler(this.quill, 'insertRowBelow') },
                    { text: localizationMessage.format('dxHtmlEditor-insertColumnLeft'), icon: 'insertcolumnleft', beginGroup: true, onClick: getTableOperationHandler(this.quill, 'insertColumnLeft') },
                    { text: localizationMessage.format('dxHtmlEditor-insertColumnRight'), icon: 'insertcolumnright', onClick: getTableOperationHandler(this.quill, 'insertColumnRight') },
                ] },
                {
                    text: 'Delete',
                    items: [
                        { text: localizationMessage.format('dxHtmlEditor-deleteColumn'), icon: 'deletecolumn', onClick: getTableOperationHandler(this.quill, 'deleteColumn') },
                        { text: localizationMessage.format('dxHtmlEditor-deleteRow'), icon: 'deleterow', onClick: getTableOperationHandler(this.quill, 'deleteRow') },
                        { text: localizationMessage.format('dxHtmlEditor-deleteTable'), icon: 'deletetable', onClick: getTableOperationHandler(this.quill, 'deleteTable') }
                    ]
                },
                { text: localizationMessage.format('dxHtmlEditor-cellProperties'), icon: 'cellproperties', onClick: (e) => { this.showCellProperties(e); } },
                { text: localizationMessage.format('dxHtmlEditor-tableProperties'), icon: 'tableproperties', onClick: (e) => { this.showTableProperties(e); } }
            ];

            let customItems;

            if(items && items.length) {
                customItems = this._prepareMenuItems(items);
            }

            // console.log(customItems);

            return {
                target: this._quillContainer,
                showEvent: null,
                items: customItems || defaultConfig
            };
        }

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

        _prepareContextMenuHandler() {
            return (event) => {
                if(this._isTableTarget(event.target)) {
                    this._targetElement = event.target;
                    this._setContextMenuPosition(event);
                    this._contextMenu.show();
                    event.preventDefault();
                }
            };
        }

        _setContextMenuPosition(event) {
            const startPosition = this._quillContainer.get(0).getBoundingClientRect();
            this._contextMenu.option({
                position: {
                    my: 'left top',
                    at: 'left top',
                    collision: 'fit flip',
                    offset: { x: event.clientX - startPosition.left, y: event.clientY - startPosition.top }
                }
            });
        }

        _isTableTarget(targetElement) {
            return !!$(targetElement).closest('.dx-htmleditor-content td, .dx-htmleditor-content th').length;
            // return ['TD', 'TH'].indexOf(targetElement.tagName) !== -1;
        }

        option(option, value) {
            if(option === 'enabled') {
                this.enabled = value;
                value ? this._enableContextMenu() : this._detachEvents();
            }
        }

        prepareCleanCallback() {
            return () => {
                this._detachEvents();
                this._popupForm?.dispose();
            };
        }
    };
}

export default TableContextMenuModule;
