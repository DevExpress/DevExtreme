import { name as click } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointer from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import TextEditorButton from '@ts/ui/text_box/texteditor_button_collection/m_button';

const pointerDown = pointer.down;

const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
const TEXTEDITOR_CLEAR_BUTTON_CLASS = 'dx-clear-button-area';
const TEXTEDITOR_CLEAR_ICON_CLASS = 'dx-icon-clear';
const TEXTEDITOR_ICON_CLASS = 'dx-icon';
const TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS = 'dx-show-clear-button';

export default class ClearButton extends TextEditorButton {
  _create(): {
    instance: dxElementWrapper;
    $element: dxElementWrapper;
  } {
    const $element = $('<span>')
      .addClass(TEXTEDITOR_CLEAR_BUTTON_CLASS)
      .append($('<span>').addClass(TEXTEDITOR_ICON_CLASS).addClass(TEXTEDITOR_CLEAR_ICON_CLASS));

    this._addToContainer($element);
    this.update(true);

    return {
      instance: $element,
      $element,
    };
  }

  _isVisible(): boolean {
    const { editor } = this;

    return editor._isClearButtonVisible();
  }

  _attachEvents(instance, $button: dxElementWrapper): void {
    const { editor } = this;
    const editorName = editor.NAME;

    eventsEngine.on(
      $button,
      // @ts-expect-error ts-error
      addNamespace(pointerDown, editorName),
      (e) => {
        e.preventDefault();
        if (e.pointerType !== 'mouse') {
          editor._clearValueHandler(e);
        }
      },
    );

    eventsEngine.on(
      $button,
      // @ts-expect-error ts-error
      addNamespace(click, editorName),
      (e) => editor._clearValueHandler(e),
    );
  }

  // TODO: get rid of it
  // eslint-disable-next-line class-methods-use-this
  _legacyRender($editor: dxElementWrapper, isVisible: boolean): void {
    $editor.toggleClass(TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS, isVisible);
  }

  // @ts-expect-error ts-error
  update(rendered = false): void {
    if (!rendered) {
      super.update();
    }

    const { editor, instance } = this;
    const $editor = editor.$element();
    const isVisible = this._isVisible();

    if (instance) {
      // @ts-expect-error ts-error
      instance.toggleClass(STATE_INVISIBLE_CLASS, !isVisible);
    }
    this._legacyRender($editor, isVisible);
  }
}
