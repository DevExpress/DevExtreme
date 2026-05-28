import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { end, start } from '@js/common/core/events/hover';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import type { Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';
import type TextEditorBase from '@ts/ui/text_box/text_editor.base';
import TextEditorButton, { isButtonInstance } from '@ts/ui/text_box/texteditor_button_collection/button';

const CUSTOM_BUTTON_HOVERED_CLASS = 'dx-custom-button-hovered';

export default class CustomButton extends TextEditorButton {
  _attachEvents(
    instance: Button,
    $element: dxElementWrapper,
  ): void {
    eventsEngine.on($element, start, () => {
      this.editor?.$element().addClass(CUSTOM_BUTTON_HOVERED_CLASS);
    });
    eventsEngine.on($element, end, () => {
      this.editor?.$element().removeClass(CUSTOM_BUTTON_HOVERED_CLASS);
    });
    eventsEngine.on($element, clickEventName, (e) => {
      e.stopPropagation();
    });
  }

  _create(): {
    instance: Button;
    $element: dxElementWrapper;
  } | undefined {
    const { editor } = this;

    if (!editor) {
      return undefined;
    }

    const $element = $('<div>');

    this._addToContainer($element);

    const instance = editor._createComponent<Button, ButtonProperties>(
      $element,
      Button,
      {
        ...this.options,
        // @ts-expect-error ignoreParentReadOnly is private
        ignoreParentReadOnly: true,
        disabled: this._isDisabled(),
        integrationOptions: this._prepareIntegrationOptions(editor),
      },
    );

    return {
      instance,
      $element,
    };
  }

  _prepareIntegrationOptions(editor: TextEditorBase): Record<string, unknown> {
    return {
      ...editor.option('integrationOptions'),
      skipTemplates: ['content'],
    };
  }

  update(): boolean {
    const isUpdated = super.update();

    if (isButtonInstance(this.instance)) {
      this.instance.option('disabled', this._isDisabled());
    }

    return isUpdated;
  }

  _isVisible(): boolean {
    const { visible } = this.editor?.option() ?? {};

    return !!visible;
  }

  _isDisabled(): boolean | undefined {
    const isDefinedByUser = this.options.disabled !== undefined;
    if (isDefinedByUser) {
      if (isButtonInstance(this.instance)) {
        return this.instance.option('disabled');
      }

      return this.options.disabled;
    }
    const { readOnly } = this.editor?.option() ?? {};

    return readOnly;
  }
}
