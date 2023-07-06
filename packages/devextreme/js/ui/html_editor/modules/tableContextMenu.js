import Quill from 'devextreme-quill';
import $ from '../../../core/renderer';
import BaseModule from './base';
import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';
import ContextMenu from '../../context_menu';
import localizationMessage from '../../../localization/message';
import { getTableFormats } from '../utils/table_helper';
import { getFormatHandlers, getDefaultClickHandler, ICON_MAP } from '../utils/toolbar_helper';
import { each } from '../../../core/utils/iterator';
import { isString, isObject } from '../../../core/utils/type';
import { titleize, camelize } from '../../../core/utils/inflector';
import { extend } from '../../../core/utils/extend';

const MODULE_NAMESPACE = 'dxHtmlEditorTableContextMenu';

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
            this._contextMenu?.dispose();
            this._contextMenu = this._createContextMenu(items);

            this._attachEvents();
        }

        _attachEvents() {
            eventsEngine.on(this.editorInstance._getContent(), CONTEXT_MENU_EVENT, this._prepareContextMenuHandler());
        }

        _detachEvents() {
            eventsEngine.off(this.editorInstance._getContent(), CONTEXT_MENU_EVENT);
        }

        _createContextMenu(items) {
            const $container = $('<div>').appendTo(this.editorInstance.$element());
            const menuConfig = this._getMenuConfig(items);

            return this.editorInstance._createComponent($container, ContextMenu, menuConfig);
        }

        showPropertiesForm(type = 'cell') {
            const $element = $(this._targetElement).closest(type === 'cell' ? 'th, td' : 'table');
            this._contextMenu.hide();
            this._formatHandlers[`${type}Properties`]($element);
            this._targetElement = null;
        }

        _isAcceptableItem(widget, acceptableWidgetName) {
            return !widget || widget === acceptableWidgetName;
        }

        _handleObjectItem(item) {
            if(item.name && this._isAcceptableItem(item.widget, 'dxButton')) {
                const defaultButtonItemConfig = this._prepareMenuItemConfig(item.name);
                const buttonItemConfig = extend(true, defaultButtonItemConfig, item);

                return buttonItemConfig;
            } else if(item.items) {
                item.items = this._prepareMenuItems(item.items);
                return item;
            } else {
                return item;
            }
        }

        _prepareMenuItemConfig(name) {
            const iconName = ICON_MAP[name] ?? name;
            const buttonText = titleize(name);

            return {
                text: localize(buttonText),
                icon: iconName.toLowerCase(),
                onClick: this._formatHandlers[name] ?? getDefaultClickHandler(this, name)
            };
        }

        _prepareMenuItems(items) {
            const resultItems = [];
            each(items, (_, item) => {
                let newItem;
                if(isObject(item)) {
                    newItem = this._handleObjectItem(item);
                } else if(isString(item)) {
                    newItem = this._prepareMenuItemConfig(item);
                }
                if(newItem) {
                    resultItems.push(newItem);
                }
            });

            return resultItems;
        }

        _getMenuConfig(items) {
            const defaultItems = [
                { text: localize('insert'), items: [
                    'insertHeaderRow',
                    'insertRowAbove',
                    'insertRowBelow',
                    extend(this._prepareMenuItemConfig('insertColumnLeft'), { beginGroup: true }),
                    'insertColumnRight'
                ] },
                {
                    text: localize('delete'),
                    items: [
                        'deleteColumn',
                        'deleteRow',
                        'deleteTable'
                    ]
                },
                extend(this._prepareMenuItemConfig('cellProperties'), { onClick: (e) => { this.showPropertiesForm('cell'); } }),
                extend(this._prepareMenuItemConfig('tableProperties'), { onClick: (e) => { this.showPropertiesForm('table'); } })
            ];

            const customItems = this._prepareMenuItems(items?.length ? items : defaultItems);

            return {
                target: this._quillContainer,
                showEvent: null,
                hideOnParentScroll: false,
                items: customItems
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
                    collision: 'fit fit',
                    offset: { x: event.clientX - startPosition.left, y: event.clientY - startPosition.top }
                }
            });
        }

        _isTableTarget(targetElement) {
            return !!$(targetElement).closest('.dx-htmleditor-content td, .dx-htmleditor-content th').length;
        }

        clean() {
            this._detachEvents();
        }

        option(option, value) {
            if(option === 'tableContextMenu') {
                this.handleOptionChangeValue(value);
                return;
            }

            if(option === 'enabled') {
                this.enabled = value;
                value ? this._enableContextMenu() : this.clean();
            } else if(option === 'items') {
                this._contextMenu?.dispose();
                this._contextMenu = this._createContextMenu(value);
            }
        }

        prepareCleanCallback() {
            return () => {
                this.clean();
            };
        }
    };
}

export default TableContextMenuModule;
