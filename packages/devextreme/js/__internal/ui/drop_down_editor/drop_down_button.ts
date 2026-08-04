import eventsEngine from '@js/common/core/events/core/events_engine';
import messageLocalization from '@js/common/core/localization/message';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import type { DxEvent } from '@js/events';
import type { Properties as ButtonProperties } from '@js/ui/button';
import Button from '@js/ui/button';

import type Editor from '../editor/editor';
import TextEditorButton from '../text_box/texteditor_button_collection/button';
import type DropDownEditor from './drop_down_editor';
import type { DropDownEditorProperties } from './drop_down_editor';

const DROP_DOWN_EDITOR_BUTTON_CLASS = 'dx-dropdowneditor-button';
const DROP_DOWN_EDITOR_BUTTON_VISIBLE = 'dx-dropdowneditor-button-visible';
const STATE_FOCUSED_CLASS = 'dx-state-focused';
const BUTTON_CLASS = 'dx-button';
const BUTTON_MODE_CONTAINED_CLASS = 'dx-button-mode-contained';

const BUTTON_MESSAGE = 'dxDropDownEditor-selectLabel';

type DropDownButtonOptions = Pick<ButtonProperties, 'focusStateEnabled' | 'hoverStateEnabled' | 'activeStateEnabled' | 'disabled' | 'visible' | 'template'> & { useInkRipple: boolean };

// NOTE: the members an editor must provide to render a drop down button. They are
// declared here, next to the only consumer: opening is not an Editor concern.
interface EditorWithDropDown {
  // eslint-disable-next-line @typescript-eslint/method-signature-style
  _shouldCallOpenHandler?(): boolean;

  // eslint-disable-next-line @typescript-eslint/method-signature-style
  _openHandler?(): void;
}

export default class DropDownButton<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TComponent extends Editor<any> & EditorWithDropDown = DropDownEditor,
> extends TextEditorButton<TComponent> {
  declare instance: Button | null;

  currentTemplate: DropDownEditorProperties['dropDownButtonTemplate'] | null;

  constructor(name: string, editor: TComponent, options: ButtonProperties) {
    super(name, editor, options);

    this.currentTemplate = null;
  }

  _attachEvents(instance: Button): void {
    instance.option('onClick', () => {
      if (this.editor?._shouldCallOpenHandler?.()) {
        this.editor?._openHandler?.();

        return;
      }

      const { openOnFieldClick } = this.editor?.option() ?? {};

      if (!openOnFieldClick) {
        this.editor?._openHandler?.();
      }
    });

    eventsEngine.on(instance.$element(), 'mousedown', (e: DxEvent<MouseEvent>) => {
      if (this.editor?.$element().is(`.${STATE_FOCUSED_CLASS}`)) {
        e.preventDefault();
      }
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
    const options = this._getOptions();

    this._addToContainer($element);

    const instance: Button = editor._createComponent(
      $element,
      Button,
      extend(
        {},
        options,
        {
          elementAttr: {
            'aria-label': messageLocalization.format(BUTTON_MESSAGE),
          },
        },
      ),
    );

    this._legacyRender(editor.$element(), $element, options.visible);

    return {
      $element,
      instance,
    };
  }

  _getOptions(): DropDownButtonOptions {
    const { editor } = this;
    const visible = this._isVisible();
    const { readOnly } = editor?.option() ?? {};

    const options = {
      focusStateEnabled: false,
      hoverStateEnabled: false,
      activeStateEnabled: false,
      useInkRipple: false,
      disabled: readOnly,
      visible,
    };

    this._addTemplate(options);

    return options;
  }

  _isVisible(): boolean {
    const { editor } = this;
    const { showDropDownButton } = editor?.option() ?? {};

    return super._isVisible() && !!showDropDownButton;
  }

  // TODO: get rid of it
  _legacyRender(
    $editor?: dxElementWrapper,
    $element?: dxElementWrapper,
    isVisible?: boolean,
  ): void {
    $editor?.toggleClass(DROP_DOWN_EDITOR_BUTTON_VISIBLE, isVisible);

    if ($element) {
      $element
        .removeClass(BUTTON_CLASS)
        .removeClass(BUTTON_MODE_CONTAINED_CLASS)
        .addClass(DROP_DOWN_EDITOR_BUTTON_CLASS);
    }
  }

  _isSameTemplate(): boolean {
    const { editor } = this;
    const { dropDownButtonTemplate } = editor?.option() ?? {};

    return dropDownButtonTemplate === this.currentTemplate;
  }

  _addTemplate(options: DropDownButtonOptions): void {
    if (this._isSameTemplate()) {
      return;
    }

    const { editor } = this;
    const { dropDownButtonTemplate } = editor?.option() ?? {};

    options.template = this.editor?._getTemplateByOption('dropDownButtonTemplate');
    this.currentTemplate = dropDownButtonTemplate;
  }

  update(): boolean {
    const shouldUpdate = super.update();

    if (shouldUpdate) {
      const { editor, instance } = this;

      const $editor = editor?.$element();
      const options = this._getOptions();

      instance?.option(options);
      this._legacyRender($editor, instance?.$element(), options.visible);
    }

    return shouldUpdate;
  }
}
