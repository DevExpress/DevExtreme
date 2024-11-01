import { name as click } from '@js/common/core/events/click';
import { active } from '@js/common/core/events/core/emitter.feedback';
import eventsEngine from '@js/common/core/events/core/events_engine';
import { start as hoverStart } from '@js/common/core/events/hover';
import { addNamespace } from '@js/common/core/events/utils/index';
import Guid from '@js/core/guid';
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { getWidth } from '@js/core/utils/size';
import { getWindow } from '@js/core/utils/window';

const TEXTEDITOR_LABEL_CLASS = 'dx-texteditor-label';
const TEXTEDITOR_WITH_LABEL_CLASS = 'dx-texteditor-with-label';
const TEXTEDITOR_LABEL_OUTSIDE_CLASS = 'dx-texteditor-label-outside';
const TEXTEDITOR_WITH_FLOATING_LABEL_CLASS = 'dx-texteditor-with-floating-label';
const TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS = 'dx-texteditor-with-before-buttons';

const LABEL_BEFORE_CLASS = 'dx-label-before';
const LABEL_CLASS = 'dx-label';
const LABEL_AFTER_CLASS = 'dx-label-after';

class TextEditorLabel {
  public NAME: string;

  _props: any;

  _id: string;

  _$before?: dxElementWrapper;

  _$labelSpan!: dxElementWrapper;

  _$label!: dxElementWrapper;

  _$after?: dxElementWrapper;

  _$root!: dxElementWrapper;

  constructor(props) {
    this.NAME = 'dxLabel';
    this._props = props;

    this._id = `${TEXTEDITOR_LABEL_CLASS}-${new Guid()}`;

    this._render();
    this._toggleMarkupVisibility();
  }

  _isVisible() {
    return !!this._props.text && this._props.mode !== 'hidden';
  }

  _render() {
    this._$before = $('<div>').addClass(LABEL_BEFORE_CLASS);

    this._$labelSpan = $('<span>');
    this._$label = $('<div>')
      .addClass(LABEL_CLASS)
      .append(this._$labelSpan);

    this._$after = $('<div>').addClass(LABEL_AFTER_CLASS);

    this._$root = $('<div>')
      .addClass(TEXTEDITOR_LABEL_CLASS)
      .attr('id', this._id)
      .append(this._$before)
      .append(this._$label)
      .append(this._$after);

    this._updateMark();
    this._updateText();
    this._updateBeforeWidth();
    this._updateMaxWidth();
  }

  _toggleMarkupVisibility() {
    const visible = this._isVisible();

    this._updateEditorBeforeButtonsClass(visible);
    this._updateEditorLabelClass(visible);

    visible
      ? this._$root.appendTo(this._props.$editor)
      : this._$root.detach();

    this._attachEvents();
  }

  _attachEvents() {
    const clickEventName = addNamespace(click, this.NAME);
    const hoverStartEventName = addNamespace(hoverStart, this.NAME);
    const activeEventName = addNamespace(active, this.NAME);

    eventsEngine.off(this._$labelSpan, clickEventName);
    eventsEngine.off(this._$labelSpan, hoverStartEventName);
    eventsEngine.off(this._$labelSpan, activeEventName);

    if (this._isVisible() && this._isOutsideMode()) {
      eventsEngine.on(this._$labelSpan, clickEventName, (e) => {
        // @ts-expect-error
        const selectedText = getWindow().getSelection().toString();

        if (selectedText === '') {
          this._props.onClickHandler();
          e.preventDefault();
        }
      });
      eventsEngine.on(this._$labelSpan, hoverStartEventName, (e) => {
        this._props.onHoverHandler(e);
      });
      eventsEngine.on(this._$labelSpan, activeEventName, (e) => {
        this._props.onActiveHandler(e);
      });
    }
  }

  _updateEditorLabelClass(visible) {
    this._props.$editor
      .removeClass(TEXTEDITOR_WITH_FLOATING_LABEL_CLASS)
      .removeClass(TEXTEDITOR_LABEL_OUTSIDE_CLASS)
      .removeClass(TEXTEDITOR_WITH_LABEL_CLASS);

    if (visible) {
      const labelClass = this._props.mode === 'floating'
        ? TEXTEDITOR_WITH_FLOATING_LABEL_CLASS
        : TEXTEDITOR_WITH_LABEL_CLASS;

      this._props.$editor.addClass(labelClass);

      if (this._isOutsideMode()) {
        this._props.$editor.addClass(TEXTEDITOR_LABEL_OUTSIDE_CLASS);
      }
    }
  }

  _isOutsideMode() {
    return this._props.mode === 'outside';
  }

  _updateEditorBeforeButtonsClass(visible = this._isVisible()) {
    this._props.$editor
      .removeClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS);

    if (visible) {
      const beforeButtonsClass = this._props.containsButtonsBefore ? TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS : '';

      this._props.$editor.addClass(beforeButtonsClass);
    }
  }

  _updateMark() {
    this._$labelSpan.attr('data-mark', this._props.mark);
  }

  _updateText() {
    this._$labelSpan.text(this._props.text);
  }

  _updateBeforeWidth() {
    if (this._isVisible()) {
      const width = this._props.beforeWidth ?? this._props.getBeforeWidth();
      // @ts-expect-error
      this._$before.css({ width });

      this._updateLabelTransform();
    }
  }

  _updateLabelTransform(offset = 0) {
    this._$labelSpan.css('transform', '');

    if (this._isVisible() && this._isOutsideMode()) {
      const sign = this._props.rtlEnabled ? 1 : -1;

      const labelTranslateX = sign * (getWidth(this._$before) + offset);

      this._$labelSpan.css('transform', `translateX(${labelTranslateX}px)`);
    }
  }

  _updateMaxWidth() {
    if (this._isVisible() && !this._isOutsideMode()) {
      const maxWidth = this._props.containerWidth ?? this._props.getContainerWidth();
      this._$label.css({ maxWidth });
    }
  }

  $element() {
    return this._$root;
  }

  isVisible() {
    return this._isVisible();
  }

  // @ts-expect-error
  getId() {
    if (this._isVisible()) return this._id;
  }

  updateMode(mode) {
    this._props.mode = mode;
    this._toggleMarkupVisibility();
    this._updateBeforeWidth();
    this._updateMaxWidth();
  }

  updateText(text) {
    this._props.text = text;
    this._updateText();
    this._toggleMarkupVisibility();
    this._updateBeforeWidth();
    this._updateMaxWidth();
  }

  updateMark(mark) {
    this._props.mark = mark;
    this._updateMark();
  }

  updateContainsButtonsBefore(containsButtonsBefore) {
    this._props.containsButtonsBefore = containsButtonsBefore;
    this._updateEditorBeforeButtonsClass();
  }

  updateBeforeWidth(beforeWidth) {
    this._props.beforeWidth = beforeWidth;
    this._updateBeforeWidth();
  }

  updateMaxWidth(containerWidth) {
    this._props.containerWidth = containerWidth;
    this._updateMaxWidth();
  }
}

export {
  TextEditorLabel,
};
