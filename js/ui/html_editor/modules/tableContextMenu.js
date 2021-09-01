import Quill from 'devextreme-quill';
import $ from '../../../core/renderer';
import BaseModule from './base';
import eventsEngine from '../../../events/core/events_engine';
import { addNamespace } from '../../../events/utils/index';
import ContextMenu from '../../context_menu';
import { getTableOperationHandler } from './tableOperations';


const MODULE_NAMESPACE = 'dxHtmlTableContextMenu';

const CONTEXT_MENU_EVENT = addNamespace('dxcontextmenu', MODULE_NAMESPACE);

let TableContextMenuModule = BaseModule;

if(Quill) {
    TableContextMenuModule = class TableContextMenuModule extends BaseModule {
        constructor(quill, options) {
            super(quill, options);
            this.enabled = !!options.enabled;
            this._quillContainer = this.editorInstance._getQuillContainer();

            if(this.enabled) {
                this._contextMenu = this._createContextMenu();
                this._attachEvents();
            }
        }

        _attachEvents() {
            eventsEngine.on(this.editorInstance._getContent(), CONTEXT_MENU_EVENT, this._openTableContextMenu.bind(this));
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
                showEvent: '',
                dataSource: [
                    { text: 'Insert', items: [
                        { text: 'Insert Row Above', onClick: getTableOperationHandler(this.quill, 'insertRowAbove') },
                        { text: 'Insert Row Below', onClick: getTableOperationHandler(this.quill, 'insertRowBelow') },
                        { text: 'Insert Column Left', onClick: getTableOperationHandler(this.quill, 'insertColumnLeft') },
                        { text: 'Insert Column Right', onClick: getTableOperationHandler(this.quill, 'insertColumnRight') },
                    ] },
                    {
                        text: 'Delete',
                        items: [
                            { text: 'Delete Column', onClick: getTableOperationHandler(this.quill, 'deleteColumn') },
                            { text: 'Delete Row', onClick: getTableOperationHandler(this.quill, 'deleteRow') },
                            { text: 'Delete Table', onClick: getTableOperationHandler(this.quill, 'deleteTable') }
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

        _openTableContextMenu(event) {
            if(this._isTableTarget(event.target)) {
                this._setContextMenuPosition(event);
                this._contextMenu.show();
                event.preventDefault();
            }

        }

        _setContextMenuPosition(event) {
            const startPosition = this._quillContainer.get(0).getBoundingClientRect();
            this?._contextMenu.option({
                position: {
                    my: 'left top',
                    at: 'left top',
                    collision: 'fit flip',
                    offset: { x: event.clientX - startPosition.x, y: event.clientY - startPosition.y }
                }
            });
        }

        _isTableTarget(targetElement) {
            return targetElement.tagName.toUpperCase() === 'TD' || targetElement.tagName.toUpperCase() === 'TH';
        }

        option(option, value) {

            if(option === 'enabled') {
                this.enabled = value;
                value ? this._attachEvents(true) : this.clean();
            }
        }

        clean() {
            this._detachEvents();
        }
    };
}

export default TableContextMenuModule;
