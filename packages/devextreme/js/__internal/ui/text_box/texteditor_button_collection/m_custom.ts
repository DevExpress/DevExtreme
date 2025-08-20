import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { end, start } from '@js/common/core/events/hover';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';

import type TextEditorBase from '../m_text_editor.base';
import TextEditorButton from './m_button';

const CUSTOM_BUTTON_HOVERED_CLASS = 'dx-custom-button-hovered';

export default class CustomButton extends TextEditorButton {
  _attachEvents(
    instance: unknown,
    $element: dxElementWrapper,
  ): void {
    const { editor } = this;

    eventsEngine.on($element, start, () => {
      editor.$element().addClass(CUSTOM_BUTTON_HOVERED_CLASS);
    });
    eventsEngine.on($element, end, () => {
      editor.$element().removeClass(CUSTOM_BUTTON_HOVERED_CLASS);
    });
    eventsEngine.on($element, clickEventName, (e) => {
      e.stopPropagation();
    });
  }

  _create(): {
    $element: dxElementWrapper;
    instance: Button;
  } {
    const { editor } = this;
    const $element = $('<div>');

    this._addToContainer($element);

    const instance = editor._createComponent<Button, ButtonProperties>($element, Button, {
      ...this.options,
      // @ts-expect-error
      ignoreParentReadOnly: true,
      disabled: this._isDisabled(),
      integrationOptions: this._prepareIntegrationOptions(editor),
    });

    return {
      $element,
      instance,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  _prepareIntegrationOptions(editor: TextEditorBase): Record<string, unknown> {
    return {
      ...editor.option('integrationOptions'),
      skipTemplates: ['content'],
    };
  }

  update(): boolean {
    const isUpdated = super.update();

    if (this.instance) {
      this.instance.option('disabled', this._isDisabled());
    }

    return isUpdated;
  }

  _isVisible(): boolean {
    const { visible } = this.editor.option();

    return !!visible;
  }

  _isDisabled(): boolean | undefined {
    const isDefinedByUser = this.options.disabled !== undefined;
    if (isDefinedByUser) {
      if (this.instance) {
        return this.instance.option('disabled');
      }

      return this.options.disabled;
    }
    const { readOnly } = this.editor.option();

    return readOnly;
  }
}
