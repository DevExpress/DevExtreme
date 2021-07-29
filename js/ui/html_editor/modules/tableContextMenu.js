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

        _isTableTarget() {

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
                    { text: 'Download' },
                    { text: 'Comment' },
                    { text: 'Favorite' }
                ],

            };
        }

        _openTableContextMenu(event) {
            this.showPopup();

            event.preventDefault();
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
