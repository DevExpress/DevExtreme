import Quill from 'devextreme-quill';
import $ from '../../../core/renderer';
import BaseModule from './base';
import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';
import ContextMenu from '../../context_menu';
import { showCellPropertiesForm, showTablePropertiesForm } from '../ui/tableForms';
import localizationMessage from '../../../localization/message';
import { getTableOperationHandler } from '../utils/table_helper';

const MODULE_NAMESPACE = 'dxHtmlTableContextMenu';

const CONTEXT_MENU_EVENT = addNamespace('dxcontextmenu', MODULE_NAMESPACE);

let TableContextMenuModule = BaseModule;

if(Quill) {
    TableContextMenuModule = class TableContextMenuModule extends BaseModule {
        constructor(quill, options) {
            super(quill, options);
            this.enabled = !!options.enabled;
            this._quillContainer = this.editorInstance._getQuillContainer();
            this.addCleanCallback(this.prepareCleanCallback());

            if(this.enabled) {
                this._enableContextMenu();
            }
        }

        _enableContextMenu() {
            if(!this._contextMenu) {
                this._contextMenu = this._createContextMenu();
            }
            this._attachEvents();
        }

        _attachEvents() {
            eventsEngine.on(this.editorInstance._getContent(), CONTEXT_MENU_EVENT, this._prepareContextMenuHandler());
        }

        _detachEvents() {
            eventsEngine.off(this.editorInstance._getContent(), MODULE_NAMESPACE);
        }

        _createContextMenu() {
            const $container = $('<div>').appendTo(this.editorInstance.$element());
            const menuConfig = this._getMenuConfig();

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

        _getMenuConfig(options) {
            return {
                target: this._quillContainer,
                showEvent: null,
                dataSource: [
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
                ]
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
            return ['TD', 'TH'].indexOf(targetElement.tagName) !== -1;
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
