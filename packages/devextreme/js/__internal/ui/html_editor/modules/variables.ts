import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { getBoundingRect } from '@js/core/utils/position';
import type { ClickEvent } from '@js/ui/button';
import type { dxHtmlEditorVariables } from '@js/ui/html_editor';
import type { SelectionChangedEvent } from '@js/ui/list';
import type { ShownEvent } from '@js/ui/popup';
import Quill from 'devextreme-quill';

import Variable from '../formats/variable';
import type { VariableData } from '../types';
import type {
  KeyboardModule,
  QuillInstance,
  RangeStatic,
} from '../types/quill';
import type { BaseModuleOptions } from './base';
import BaseModule from './base';
import PopupModule from './popup';

interface VariableModuleOptions extends BaseModuleOptions, dxHtmlEditorVariables {
  escapeChar: VariableData['escapeChar'];
}

interface VariableModuleDefaults {
  dataSource: null;
  escapeChar: string;
}

interface ToolbarModuleLike {
  addClickHandler: (name: string, handler: (e: ClickEvent) => void) => void;
}

type ShowPopupArgs = ClickEvent | RangeStatic;

// eslint-disable-next-line import/no-mutable-exports
let VariableModule = BaseModule;

if (Quill) {
  const VARIABLE_FORMAT_CLASS = 'dx-variable-format';
  const ACTIVE_FORMAT_CLASS = 'dx-format-active';
  const SELECTED_STATE_CLASS = 'dx-state-selected';

  Quill.register({ 'formats/variable': Variable }, true);
  VariableModule = class extends PopupModule {
    declare options: VariableModuleOptions;

    constructor(quill: QuillInstance, options: BaseModuleOptions & dxHtmlEditorVariables) {
      super(quill, options);

      const toolbar = quill.getModule<ToolbarModuleLike | undefined>('toolbar');
      if (toolbar) {
        toolbar.addClickHandler('variable', this.showPopup.bind(this));
      }

      const keyboardModule: KeyboardModule = quill.keyboard;
      keyboardModule.addBinding({
        key: 'P',
        altKey: true,
      }, this.showPopup.bind(this));

      this._popup.on('shown', (e: ShownEvent) => {
        // @ts-expect-error position is a union with string; the module always sets an object
        const $ofElement = $(e.component.option('position').of);
        if ($ofElement.hasClass(VARIABLE_FORMAT_CLASS)) {
          $ofElement.addClass(ACTIVE_FORMAT_CLASS);
          $ofElement.addClass(SELECTED_STATE_CLASS);
        }
      });
    }

    _getDefaultOptions(): VariableModuleDefaults {
      const baseConfig = super._getDefaultOptions();

      return extend(baseConfig, {
        escapeChar: '',
      });
    }

    showPopup(event?: ShowPopupArgs): void {
      const selection = this.quill.getSelection(true);
      const position = selection ? selection.index : this.quill.getLength();
      this.savePosition(position);

      this._resetPopupPosition(event, position);
      super.showPopup();
    }

    _resetPopupPosition(event: ShowPopupArgs | undefined, position: number): void {
      if (event && 'element' in event && event.element) {
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

    insertEmbedContent(selectionChangedEvent: SelectionChangedEvent): void {
      const caretPosition = this.getPosition();
      const selectedItem = selectionChangedEvent.component.option('selectedItem');
      const variableData: VariableData = extend({}, {
        value: selectedItem,
        escapeChar: this.options.escapeChar,
      });

      setTimeout(() => {
        // @ts-expect-error savePosition() runs before the popup is shown
        this.quill.insertEmbed(caretPosition, 'variable', variableData);
        // @ts-expect-error see above
        this.quill.setSelection(caretPosition + 1);
      });
    }
  };
}

export default VariableModule;
