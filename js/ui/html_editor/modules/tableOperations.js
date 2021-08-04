import Quill from 'devextreme-quill';
import $ from '../../../core/renderer';
import BaseModule from './base';
import PopupModule from './popup';
import Form from '../../form';

let TableEditingFormsModule = BaseModule;

if(Quill) {
    TableEditingFormsModule = class TableEditingFormsModule extends PopupModule {

        constructor(quill, options) {

            super(quill, options);

            this.enabled = !!options.enabled;

            if(this.enabled) {
                // this._createContentMenu();
                this._formPopup = this._renderFormPopup();
                // this._attachEvents();
            }
        }


        showCellProperties() {
            if(!this._formPopup) {
                return;
            }

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
                this.options.editorInstance._createComponent($form, Form, formOptions);

                return $form;
            });

            this._popup.hide();
            this._formPopup.show();

        }

        showTableProperties() {
            if(!this._formPopup) {
                return;
            }

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
                this.options.editorInstance._createComponent($form, Form, formOptions);

                return $form;
            });

            this._popup.hide();
            this._formPopup.show();

        }

    };
}

export default TableEditingFormsModule;
