import Quill from 'devextreme-quill';

import $ from '../../../core/renderer';
import { getBoundingRect } from '../../../core/utils/position';
import PopupModule from './popup';
import BaseModule from './base';
import Variable from '../formats/variable';

import { extend } from '../../../core/utils/extend';

let VariableModule = BaseModule;

if(Quill) {
    const VARIABLE_FORMAT_CLASS = 'dx-variable-format';
    const ACTIVE_FORMAT_CLASS = 'dx-format-active';

    Quill.register({ 'formats/variable': Variable }, true);

    VariableModule = class VariableModule extends PopupModule {
        _getDefaultOptions() {
            const baseConfig = super._getDefaultOptions();

            return extend(baseConfig, {
                escapeChar: ''
            });
        }

        constructor(quill, options) {
            super(quill, options);

            const toolbar = quill.getModule('toolbar');
            if(toolbar) {
                toolbar.addClickHandler('variable', this.showPopup.bind(this));
            }

            quill.keyboard.addBinding({
                key: 'P',
                altKey: true
            }, this.showPopup.bind(this));

            this._popup.on('shown', (e) => {
                const $ofElement = $(e.component.option('position').of);
                if($ofElement.hasClass(VARIABLE_FORMAT_CLASS)) {
                    $ofElement.addClass(ACTIVE_FORMAT_CLASS);
                }
            });
        }

        showPopup(event) {
            const selection = this.quill.getSelection();
            const position = selection ? selection.index : this.quill.getLength();

            this.savePosition(position);

            this._resetPopupPosition(event, position);
            super.showPopup();
        }

        _resetPopupPosition(event, position) {
            if(event && event.element) {
                this._popup.option('position', {
                    of: event.element,
                    offset: {
                        h: 0,
                        v: 0
                    },
                    my: 'top center',
                    at: 'bottom center',
                    collision: 'fit'
                });
            } else {
                const mentionBounds = this.quill.getBounds(position);
                const rootRect = getBoundingRect(this.quill.root);

                this._popup.option('position', {
                    of: this.quill.root,
                    offset: {
                        h: mentionBounds.left,
                        v: mentionBounds.bottom - rootRect.height
                    },
                    my: 'top center',
                    at: 'bottom left',
                    collision: 'fit flip'
                });
            }
        }


        insertEmbedContent(selectionChangedEvent) {
            const caretPosition = this.getPosition();
            const selectedItem = selectionChangedEvent.component.option('selectedItem');
            const variableData = extend({}, {
                value: selectedItem,
                escapeChar: this.options.escapeChar
            });

            setTimeout(function() {
                this.quill.insertEmbed(caretPosition, 'variable', variableData);
                this.quill.setSelection(caretPosition + 1);
            }.bind(this));
        }
    };
}

export default VariableModule;
