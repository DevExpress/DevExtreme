import { name as click } from '@js/common/core/events/click';
import eventsEngine from '@js/common/core/events/core/events_engine';
import pointer from '@js/common/core/events/pointer';
import { addNamespace } from '@js/common/core/events/utils/index';
import $ from '@js/core/renderer';
import TextEditorButton from '@ts/ui/text_box/texteditor_button_collection/m_button';

const pointerDown = pointer.down;

const STATE_INVISIBLE_CLASS = 'dx-state-invisible';
const TEXTEDITOR_CLEAR_BUTTON_CLASS = 'dx-clear-button-area';
const TEXTEDITOR_CLEAR_ICON_CLASS = 'dx-icon-clear';
const TEXTEDITOR_ICON_CLASS = 'dx-icon';
const TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS = 'dx-show-clear-button';

export default class ClearButton extends TextEditorButton {
  _create() {
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

  _isVisible() {
    const { editor } = this;

    return editor._isClearButtonVisible();
  }

  _attachEvents(instance, $button) {
    const { editor } = this;
    const editorName = editor.NAME;

    eventsEngine.on(
      $button,
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
      addNamespace(click, editorName),
      (e) => editor._clearValueHandler(e),
    );
  }

  // TODO: get rid of it
  _legacyRender($editor, isVisible) {
    $editor.toggleClass(TEXTEDITOR_SHOW_CLEAR_BUTTON_CLASS, isVisible);
  }

  // @ts-expect-error
  update(rendered = false) {
    !rendered && super.update();

    const { editor, instance } = this;
    const $editor = editor.$element();
    const isVisible = this._isVisible();

    instance && instance.toggleClass(STATE_INVISIBLE_CLASS, !isVisible);
    this._legacyRender($editor, isVisible);
  }
}
