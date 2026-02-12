import { name as click } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointer from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import TextEditorButton from '@ts/ui/text_box/texteditor_button_collection/button';

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
      .append($('<span>')
        .addClass(TEXTEDITOR_ICON_CLASS)
        .addClass(TEXTEDITOR_CLEAR_ICON_CLASS));

    this._addToContainer($element);
    this.update(true);

    return {
      instance: $element,
      $element,
    };
  }

  _isVisible(): boolean {
    const { editor } = this;

    return !!editor?._isClearButtonVisible();
  }

  _attachEvents(instance: dxElementWrapper, $button: dxElementWrapper): void {
    const editorName = this.editor?.NAME ?? '';

    eventsEngine.on(
      $button,
      addNamespace(pointerDown, editorName),
      (e) => {
        e.preventDefault();
        if (e.pointerType !== 'mouse') {
          this.editor?._clearValueHandler(e);
        }
      },
    );

    eventsEngine.on(
      $button,
      addNamespace(click, editorName),
      (e) => this.editor?._clearValueHandler(e),
    );
  }

  // TODO: get rid of it

  _legacyRender($editor: dxElementWrapper, isVisible: boolean): void {
    $editor.toggleClass(TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS, isVisible);
  }

  update(rendered = false): boolean {
    if (!rendered) {
      super.update();
    }

    const { editor, instance } = this;

    if (!editor) {
      return false;
    }

    const $editor = editor.$element();
    const isVisible = this._isVisible();

    if (instance) {
      // @ts-expect-error instance is dxElementWrapper
      instance.toggleClass(STATE_INVISIBLE_CLASS, !isVisible);
    }

    this._legacyRender($editor, isVisible);

    return isVisible;
  }
}
