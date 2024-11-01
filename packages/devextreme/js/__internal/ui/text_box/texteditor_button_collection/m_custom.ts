import { name as clickEventName } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { end, start } from '@js/common/core/events/hover';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import Button from '@js/ui/button';

import TextEditorButton from './m_button';

const CUSTOM_BUTTON_HOVERED_CLASS = 'dx-custom-button-hovered';

export default class CustomButton extends TextEditorButton {
  _attachEvents(instance, $element) {
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

  _create() {
    const { editor } = this;
    const $element = $('<div>');

    this._addToContainer($element);

    const instance = editor._createComponent($element, Button, extend({}, this.options, {
      ignoreParentReadOnly: true,
      disabled: this._isDisabled(),
      integrationOptions: this._prepareIntegrationOptions(editor),
    }));

    return {
      $element,
      instance,
    };
  }

  _prepareIntegrationOptions(editor) {
    return extend({}, editor.option('integrationOptions'), { skipTemplates: ['content'] });
  }

  update() {
    const isUpdated = super.update();

    if (this.instance) {
      this.instance.option('disabled', this._isDisabled());
    }

    return isUpdated;
  }

  _isVisible() {
    const { editor } = this;

    return editor.option('visible');
  }

  _isDisabled() {
    const isDefinedByUser = this.options.disabled !== undefined;
    if (isDefinedByUser) {
      return this.instance ? this.instance.option('disabled') : this.options.disabled;
    }
    return this.editor.option('readOnly');
  }
}
