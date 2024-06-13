import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import Quill from 'devextreme-quill';

import Variable from '../formats/m_variable';
import BaseModule from './m_base';
import PopupModule from './m_popup';
// eslint-disable-next-line import/no-mutable-exports
let VariableModule = BaseModule;

if (Quill) {
  const VARIABLE_FORMAT_CLASS = 'dx-variable-format';
  const ACTIVE_FORMAT_CLASS = 'dx-format-active';
  const SELECTED_STATE_CLASS = 'dx-state-selected';

  Quill.register({ 'formats/variable': Variable }, true);
  // @ts-expect-error
  VariableModule = class VariableModule extends PopupModule {
    quill: any;

    _popup: any;

    options: any;

    constructor(quill, options) {
      // @ts-expect-error
      super(quill, options);

      const toolbar = quill.getModule('toolbar');
      if (toolbar) {
        toolbar.addClickHandler('variable', this.showPopup.bind(this));
      }

      quill.keyboard.addBinding({
        key: 'P',
        altKey: true,
      }, this.showPopup.bind(this));

      this._popup.on('shown', (e) => {
        const $ofElement = $(e.component.option('position').of);
        if ($ofElement.hasClass(VARIABLE_FORMAT_CLASS)) {
          $ofElement.addClass(ACTIVE_FORMAT_CLASS);
          $ofElement.addClass(SELECTED_STATE_CLASS);
        }
      });
    }

    _getDefaultOptions() {
      // @ts-expect-error
      const baseConfig = super._getDefaultOptions();

      return extend(baseConfig, {
        escapeChar: '',
      });
    }

    showPopup(event) {
      const selection = this.quill.getSelection(true);
      const position = selection ? selection.index : this.quill.getLength();
      // @ts-expect-error
      this.savePosition(position);

      this._resetPopupPosition(event, position);
      // @ts-expect-error
      super.showPopup();
    }

    _resetPopupPosition(event, position) {
      if (event && event.element) {
        this._popup.option('position', {
          of: event.element,
          offset: {
            h: 0,
            v: 0,
          },
          my: 'top center',
          at: 'bottom center',
          collision: 'fit',
        });
      } else {
        const mentionBounds = this.quill.getBounds(position);
        const rootRect = getBoundingRect(this.quill.root);

        this._popup.option('position', {
          of: this.quill.root,
          offset: {
            h: mentionBounds.left,
            v: mentionBounds.bottom - rootRect.height,
          },
          my: 'top center',
          at: 'bottom left',
          collision: 'fit flip',
        });
      }
    }

    insertEmbedContent(selectionChangedEvent) {
      // @ts-expect-error
      const caretPosition = this.getPosition();
      const selectedItem = selectionChangedEvent.component.option('selectedItem');
      const variableData = extend({}, {
        value: selectedItem,
        escapeChar: this.options.escapeChar,
      });

      setTimeout(() => {
        this.quill.insertEmbed(caretPosition, 'variable', variableData);
        this.quill.setSelection(caretPosition + 1);
      });
    }
  };
}

export default VariableModule;
