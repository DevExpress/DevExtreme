import Quill from 'devextreme-quill';
import $ from '../../../core/renderer';
import BaseModule from './base';
import PopupModule from './popup';
import eventsEngine from '../../../events/core/events_engine';
// import ContextMenu from '../../context_menu';
import { addNamespace } from '../../../events/utils/index';
// import { extend } from '../../../core/utils/extend';
import Popup from '../../popup';
import Form from '../../form';

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
                this._formPopup = this._renderFormPopup();
                this._attachEvents();
            }
        }

        _attachEvents() {
            eventsEngine.on(this.editorInstance._getContent(), CONTEXT_MENU_EVENT, this._openTableContextMenu.bind(this));
        }

        _detachEvents() {
            eventsEngine.off(this.editorInstance._getContent(), MODULE_NAMESPACE);
        }

        // _createContentMenu() {
        //     this._contextMenu = this.editorInstance._createComponent(this.editorInstance._getContent(), ContextMenu, {
        //         dataSource: this._getContextMenuItems(),
        //         width: 200,
        //         target: 'table',
        //         displayExpr: 'text'
        //     });
        // }

        // _getPopupConfig() {
        //     debugger;
        //     const baseConfig = super._getPopupConfig();

        //     const position = {
        //         my: 'left top',
        //         at: 'left top',
        //         collision
        //     };

        //     return extend(baseConfig, position);
        // }

        _getFormPopupConfig() {

        }

        _renderFormPopup() {
            const that = this;
            const editorInstance = this.options.editorInstance;
            const $container = $('<div>').appendTo(editorInstance.$element());
            const popupConfig = {
                showTitle: false,
                shading: false,
                closeOnTargetScroll: true,
                closeOnOutsideClick: true,
                width: 600,
                height: 300,
                toolbarItems: [{
                    widget: 'dxButton',
                    toolbar: 'bottom',
                    location: 'after',
                    options: {
                        text: 'Apply',
                        onClick: function(e) { /* console.log('Apply'); */ that._formPopup?.hide(); }
                    }
                }, {
                    widget: 'dxButton',
                    toolbar: 'bottom',
                    location: 'after',
                    options: {
                        text: 'Cancel',
                        onClick: function(e) { /* console.log('Cancel'); */ that._formPopup?.hide(); }
                    }
                }]
            };
            // type === 'cell' ? this._getCellFormPopupConfig($container) : this._getTableFormPopupConfig($container);

            return editorInstance._createComponent($container, Popup, popupConfig);
        }

        _showCellProperties() {
            const formOptions = {
                formData: {
                    width: 100,
                    height: 100
                },
                items: [{
                    itemType: 'group',
                    caption: 'Dimentions',
                    colCount: 2,
                    items: [ 'width', 'height' ]
                }],
                // showColonAfterLabel: true,
                labelLocation: 'top',
                minColWidth: 300,

            };

            this._formPopup.option('contentTemplate', () => {
                const $form = $('<div>');
                // .addClass(SUGGESTION_LIST_CLASS)
                // .appendTo($container);
                this._tablePropertiesForm = this.options.editorInstance._createComponent($form, Form, formOptions);

                return $form;
            });

            this._popup.hide();
            this._formPopup.show();

        }

        _showTableProperties() {
            const formOptions = {
                formData: {
                    width: 100,
                    height: 100
                },
                items: [{
                    itemType: 'group',
                    caption: 'Dimentions',
                    colCount: 2,
                    items: [ 'width', 'height' ]
                }],
                // showColonAfterLabel: true,
                labelLocation: 'top',
                minColWidth: 300,

            };

            this._formPopup.option('contentTemplate', () => {
                const $form = $('<div>');
                // .addClass(SUGGESTION_LIST_CLASS)
                // .appendTo($container);
                this._tablePropertiesForm = this.options.editorInstance._createComponent($form, Form, formOptions);

                return $form;
            });

            this._popup.hide();
            this._formPopup.show();
        }

        // _getCellFormPopupConfig($container) {
        //     const formOptions = {
        //         formData: {
        //             width: 100,
        //             height: 100
        //         },
        //         showColonAfterLabel: true,
        //         labelLocation: 'top',
        //         minColWidth: 300,
        //         colCount: 2
        //     };

        //     const that = this;

        //     return {
        //         showTitle: false,
        //         shading: false,
        //         closeOnTargetScroll: true,
        //         closeOnOutsideClick: true,
        //         contentTemplate: () => {
        //             const $form = $('<div>')
        //             // .addClass(SUGGESTION_LIST_CLASS)
        //                 .appendTo($container);
        //             this._tablePropertiesForm = that.options.editorInstance._createComponent($form, Form, formOptions);
        //         }
        //     };
        // }

        // _getTableFormPopupConfig() {
        //     return {
        //         showTitle: false,
        //         shading: false,
        //         closeOnTargetScroll: true,
        //         closeOnOutsideClick: true,
        //         contentTemplate: () => {

        //         }
        //     };
        // }

        // _getPopupConfig(type = 'list') {
        //     let contentTemplate;
        //     const baseConfig = super._getPopupConfig();

        //     if(type === 'form') {
        //         contentTemplate = () => {

        //         }
        //     } else {
        //         contentTemplate = baseConfig.contentTemplate;
        //     }

        //     return extend(baseConfig, { contentTemplate });
        // }

        _getListConfig(options) {
            return {
                dataSource: [
                    { text: 'Cell Properties', onClick: this._showCellProperties.bind(this) },
                    { text: 'Table Properties', onClick: this._showTableProperties.bind(this) },
                    { text: 'Insert Row Above', onClick: this._getTableOperationHandler('insertRowAbove') },
                    { text: 'Insert Row Below', onClick: this._getTableOperationHandler('insertRowBelow') },
                    { text: 'Insert Column Left', onClick: this._getTableOperationHandler('insertColumnLeft') },
                    { text: 'Insert Column Right', onClick: this._getTableOperationHandler('insertColumnRight') },
                    { text: 'Delete Column', onClick: this._getTableOperationHandler('deleteColumn') },
                    { text: 'Delete Row', onClick: this._getTableOperationHandler('deleteRow') },
                    { text: 'Delete Table', onClick: this._getTableOperationHandler('deleteTable') }
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
                this._popup && this._popup.hide();
                return table[operationName](...rest);
            };
        }

        // _tableAction(action) {
        //     this._getTableOperationHandler(action)();

        // }

        _openTableContextMenu(event) {
            if(this._isTableTarget(event)) {
                this._setPopupPosition(event);

                this.showPopup();

                event.preventDefault();
            }

        }

        _setPopupPosition(event) {
            this?._popup.option({
                position: {
                    my: 'left top',
                    at: 'left top',
                    collision: 'fit flip',
                    // of: event.currentTarget,
                    offset: { x: event.clientX, y: event.clientY }
                }
            });
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
