import eventsEngine from '@js/common/core/events/core/events_engine';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';

import TextEditorButton from '../text_box/texteditor_button_collection/m_button';

const DROP_DOWN_EDITOR_BUTTON_CLASS = 'dx-dropdowneditor-button';
const DROP_DOWN_EDITOR_BUTTON_VISIBLE = 'dx-dropdowneditor-button-visible';

const BUTTON_MESSAGE = 'dxDropDownEditor-selectLabel';

export default class DropDownButton extends TextEditorButton {
  currentTemplate: any;

  constructor(name, editor, options) {
    super(name, editor, options);

    this.currentTemplate = null;
  }

  _attachEvents(instance): void {
    const { editor } = this;

    instance.option('onClick', (e) => {
      // @ts-expect-error
      if (editor._shouldCallOpenHandler?.()) {
        // @ts-expect-error
        editor._openHandler(e);
        return;
      }
      // @ts-expect-error
      !editor.option('openOnFieldClick') && editor._openHandler(e);
    });

    eventsEngine.on(instance.$element(), 'mousedown', (e) => {
      if (editor.$element().is('.dx-state-focused')) {
        e.preventDefault();
      }
    });
  }

  _create(): {
    $element: dxElementWrapper;
    instance: Button;
  } {
    const { editor } = this;
    const $element = $('<div>');
    const options = this._getOptions();

    this._addToContainer($element);

    const instance = editor._createComponent<Button, ButtonProperties>($element, Button, extend({}, options, { elementAttr: { 'aria-label': messageLocalization.format(BUTTON_MESSAGE) } }));

    this._legacyRender(editor.$element(), $element, options.visible);

    return {
      $element,
      instance,
    };
  }

  _getOptions() {
    const { editor } = this;
    const visible = this._isVisible();
    const isReadOnly = editor.option('readOnly');
    const options = {
      focusStateEnabled: false,
      hoverStateEnabled: false,
      activeStateEnabled: false,
      useInkRipple: false,
      disabled: isReadOnly,
      visible,
    };

    this._addTemplate(options);
    return options;
  }

  _isVisible(): boolean {
    const { editor } = this;
    // @ts-expect-error
    return super._isVisible() && editor.option('showDropDownButton');
  }

  // TODO: get rid of it
  _legacyRender($editor, $element, isVisible) {
    $editor.toggleClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE, isVisible);

    if ($element) {
      $element
        .removeClass('dx-button')
        .removeClass('dx-button-mode-contained')
        .addClass(DROP_DOWN_EDITOR_BUTTON_CLASS);
    }
  }

  _isSameTemplate() {
    return this.editor.option('dropDownButtonTemplate') === this.currentTemplate;
  }

  _addTemplate(options): void {
    if (!this._isSameTemplate()) {
      options.template = this.editor._getTemplateByOption('dropDownButtonTemplate');
      this.currentTemplate = this.editor.option('dropDownButtonTemplate');
    }
  }

  // @ts-expect-error
  update(): void {
    const shouldUpdate = super.update();

    if (shouldUpdate) {
      const { editor, instance } = this;
      const $editor = editor.$element();
      const options = this._getOptions();
      // @ts-expect-error
      instance?.option(options);
      this._legacyRender($editor, instance?.$element(), options.visible);
    }
  }
}
