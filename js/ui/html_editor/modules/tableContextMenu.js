import Quill from 'devextreme-quill';
import $ from '../../../core/renderer';
import BaseModule from './base';
import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';
import ContextMenu from '../../context_menu';
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

        _getMenuConfig(options) {
            return {
                target: this._quillContainer,
                showEvent: null,
                dataSource: [
                    { text: 'Insert', items: [
                        { text: 'Insert Header Row', icon: 'header', onClick: getTableOperationHandler(this.quill, 'insertHeaderRow') },
                        { text: 'Insert Row Above', icon: 'insertrowabove', onClick: getTableOperationHandler(this.quill, 'insertRowAbove') },
                        { text: 'Insert Row Below', icon: 'insertrowbelow', onClick: getTableOperationHandler(this.quill, 'insertRowBelow') },
                        { text: 'Insert Column Left', icon: 'insertcolumnleft', beginGroup: true, onClick: getTableOperationHandler(this.quill, 'insertColumnLeft') },
                        { text: 'Insert Column Right', icon: 'insertcolumnright', onClick: getTableOperationHandler(this.quill, 'insertColumnRight') },
                    ] },
                    {
                        text: 'Delete',
                        items: [
                            { text: 'Delete Column', icon: 'deletecolumn', onClick: getTableOperationHandler(this.quill, 'deleteColumn') },
                            { text: 'Delete Row', icon: 'deleterow', onClick: getTableOperationHandler(this.quill, 'deleteRow') },
                            { text: 'Delete Table', icon: 'deletetable', onClick: getTableOperationHandler(this.quill, 'deleteTable') }
                        ]
                    }
                ],
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
                    offset: { x: event.clientX - startPosition.x, y: event.clientY - startPosition.y }
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
            return () => { this._detachEvents(); };
        }
    };
}

export default TableContextMenuModule;
