import type { LabelMode } from '@js/common';
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

export interface TextEditorLabelProperties {
  $editor: dxElementWrapper;
  text?: string;
  mark?: string;
  mode?: LabelMode;
  rtlEnabled?: boolean;
  containsButtonsBefore?: boolean;
  beforeWidth?: number;
  containerWidth?: number;
  getContainerWidth: () => number;
  getBeforeWidth: () => number;
  onClickHandler: () => void;
  onHoverHandler: (e: MouseEvent | PointerEvent) => void;
  onActiveHandler: (e: MouseEvent | PointerEvent) => void;
}

export class TextEditorLabel {
  public NAME: string;

  _props: TextEditorLabelProperties;

  _id: string;

  _$before?: dxElementWrapper;

  _$labelSpan!: dxElementWrapper;

  _$label!: dxElementWrapper;

  _$after?: dxElementWrapper;

  _$root!: dxElementWrapper;

  constructor(props: TextEditorLabelProperties) {
    this.NAME = 'dxLabel';
    this._props = props;

    this._id = `${TEXTEDITOR_LABEL_CLASS}-${new Guid()}`;

    this._render();
    this._toggleMarkupVisibility();
  }

  _isVisible(): boolean {
    return !!this._props.text && this._props.mode !== 'hidden';
  }

  _render(): void {
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

  _toggleMarkupVisibility(): void {
    const visible = this._isVisible();

    this._updateEditorBeforeButtonsClass(visible);
    this._updateEditorLabelClass(visible);

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    visible
      ? this._$root.appendTo(this._props.$editor)
      : this._$root.detach();

    this._attachEvents();
  }

  _attachEvents(): void {
    const clickEventName = addNamespace(click, this.NAME);
    const hoverStartEventName = addNamespace(hoverStart, this.NAME);
    const activeEventName = addNamespace(active, this.NAME);

    eventsEngine.off(this._$labelSpan, clickEventName);
    eventsEngine.off(this._$labelSpan, hoverStartEventName);
    eventsEngine.off(this._$labelSpan, activeEventName);

    if (this._isVisible() && this._isOutsideMode()) {
      eventsEngine.on(this._$labelSpan, clickEventName, (e: MouseEvent) => {
        const selectedText = getWindow()?.getSelection()?.toString();

        if (selectedText === '') {
          this._props.onClickHandler();
          e.preventDefault();
        }
      });
      eventsEngine.on(this._$labelSpan, hoverStartEventName, (e: MouseEvent) => {
        this._props.onHoverHandler(e);
      });
      eventsEngine.on(this._$labelSpan, activeEventName, (e: MouseEvent) => {
        this._props.onActiveHandler(e);
      });
    }
  }

  _updateEditorLabelClass(visible: boolean): void {
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

  _isOutsideMode(): boolean {
    return this._props.mode === 'outside';
  }

  _updateEditorBeforeButtonsClass(visible = this._isVisible()): void {
    this._props.$editor
      .removeClass(TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS);

    if (visible) {
      const beforeButtonsClass = this._props.containsButtonsBefore ? TEXTEDITOR_WITH_BEFORE_BUTTONS_CLASS : '';

      this._props.$editor.addClass(beforeButtonsClass);
    }
  }

  _updateMark(): void {
    this._$labelSpan.attr('data-mark', this._props.mark ?? null);
  }

  _updateText(): void {
    this._$labelSpan.text(this._props.text ?? '');
  }

  _updateBeforeWidth(): void {
    if (this._isVisible()) {
      const width = this._props.beforeWidth ?? this._props.getBeforeWidth();

      this._$before?.css({ width });

      this._updateLabelTransform();
    }
  }

  _updateLabelTransform(offset = 0): void {
    this._$labelSpan.css('transform', '');

    if (this._isVisible() && this._isOutsideMode()) {
      const sign = this._props.rtlEnabled ? 1 : -1;

      const labelTranslateX = sign * (getWidth(this._$before) + offset);

      this._$labelSpan.css('transform', `translateX(${labelTranslateX}px)`);
    }
  }

  _updateMaxWidth(): void {
    if (this._isVisible() && !this._isOutsideMode()) {
      const maxWidth = this._props.containerWidth ?? this._props.getContainerWidth();
      this._$label.css({ maxWidth });
    }
  }

  $element(): dxElementWrapper {
    return this._$root;
  }

  isVisible(): boolean {
    return this._isVisible();
  }

  getId(): string | undefined {
    if (this._isVisible()) {
      return this._id;
    }

    return undefined;
  }

  updateMode(mode: LabelMode): void {
    this._props.mode = mode;
    this._toggleMarkupVisibility();
    this._updateBeforeWidth();
    this._updateMaxWidth();
  }

  updateText(text: string): void {
    this._props.text = text;
    this._updateText();
    this._toggleMarkupVisibility();
    this._updateBeforeWidth();
    this._updateMaxWidth();
  }

  updateMark(mark: string): void {
    this._props.mark = mark;
    this._updateMark();
  }

  updateContainsButtonsBefore(containsButtonsBefore: boolean): void {
    this._props.containsButtonsBefore = containsButtonsBefore;
    this._updateEditorBeforeButtonsClass();
  }

  updateBeforeWidth(beforeWidth: number): void {
    this._props.beforeWidth = beforeWidth;
    this._updateBeforeWidth();
  }

  updateMaxWidth(containerWidth: number): void {
    this._props.containerWidth = containerWidth;
    this._updateMaxWidth();
  }
}
