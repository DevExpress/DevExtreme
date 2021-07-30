import Quill from 'devextreme-quill';

import BaseModule from './base';
import PopupModule from './popup';
import eventsEngine from '../../../events/core/events_engine';
// import ContextMenu from '../../context_menu';
import { addNamespace } from '../../../events/utils/index';

const MODULE_NAMESPACE = 'dxHtmlTableContextMenu';

const CONTEXT_MENU_EVENT = addNamespace('dxcontextmenu', MODULE_NAMESPACE);

let TableContextMenuModule = BaseModule;

if(Quill) {
    TableContextMenuModule = class MentionModule extends PopupModule {
        constructor(quill, options) {

            super(quill, options);

            this.enabled = !!options.enabled;

            if(this.enabled) {
                // this._createContentMenu();
                this._attachEvents();
            }
        }

        _attachEvents() {
            eventsEngine.on(this.editorInstance._getContent(), CONTEXT_MENU_EVENT, this._openTableContextMenu.bind(this));
        }

        _detachEvents() {
            eventsEngine.off(this.editorInstance._getContent(), MODULE_NAMESPACE);
        }

        // _getContextMenuItems() {
        //     return [
        //         { text: 'Download' },
        //         { text: 'Comment' },
        //         { text: 'Favorite' }
        //     ];
        // }

        // _createContentMenu() {
        //     this._contextMenu = this.editorInstance._createComponent(this.editorInstance._getContent(), ContextMenu, {
        //         dataSource: this._getContextMenuItems(),
        //         width: 200,
        //         target: "table",
        //         displayExpr: 'text'
        //     });
        // }

        _getListConfig(options) {
            return {
                dataSource: [
                    { text: 'Insert Row Above', onClick: () => { this._tableAction('insertRowAbove'); } },
                    { text: 'Insert Row Below', onClick: () => { this._tableAction('insertRowBelow'); } },
                    { text: 'Insert Column Left', onClick: () => { this._tableAction('insertColumnLeft'); } },
                    { text: 'Insert Column Right', onClick: () => { this._tableAction('insertColumnRight'); } },
                    { text: 'Delete Column', onClick: () => { this._tableAction('deleteColumn'); } },
                    { text: 'Delete Row', onClick: () => { this._tableAction('deleteRow'); } },
                    { text: 'Delete Table', onClick: () => { this._tableAction('deleteTable'); } }
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

        _tableAction(action) {
            this._getTableOperationHandler(action)();
            this._popup && this._popup.hide();
        }

        _openTableContextMenu(event) {
            if(this._isTableTarget(event)) {
                this.showPopup();

                event.preventDefault();
            }

        }

        _isTableTarget() {
            return true;
        }

        // _findTables() {
        //     return $(this._quillContainer).find('table');
        // }

        clean() {
            this._detachEvents();
        }
    };
}

export default TableContextMenuModule;
