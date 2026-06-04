import EventsEngine from '@js/common/core/events/core/events_engine';
import { addNamespace } from '@js/common/core/events/utils/index';
import type { dxElementWrapper } from '@js/core/renderer';
import browser from '@js/core/utils/browser';
import { clipboardText as getClipboardText } from '@js/core/utils/dom';
import type { DxEvent } from '@js/events';
import type { TextEditorBaseProperties } from '@ts/ui/text_box/text_editor.base';
import type TextEditorMask from '@ts/ui/text_box/text_editor.mask';
import type { HandlingArgs } from '@ts/ui/text_box/text_editor.mask.rule';
import type { CaretRange } from '@ts/ui/text_box/utils.caret';

const MASK_EVENT_NAMESPACE = 'dxMask';
const BLUR_EVENT = 'blur beforedeactivate';
const EMPTY_CHAR = ' ';
const DELETE_INPUT_TYPES = ['deleteContentBackward', 'deleteSoftLineBackward', 'deleteContent', 'deleteHardLineBackward'];
const HISTORY_INPUT_TYPES = ['historyUndo', 'historyRedo'];
const EVENT_NAMES = ['focusIn', 'focusOut', 'input', 'paste', 'cut', 'drop', 'beforeInput'];

const getEmptyString = (length: number): string => EMPTY_CHAR.repeat(length);

export default class MaskStrategy {
  editor: TextEditorMask;

  _dragTimer?: ReturnType<typeof setTimeout>;

  _inputHandlerTimer?: ReturnType<typeof setTimeout>;

  _caretTimeout?: ReturnType<typeof setTimeout>;

  _prevCaret?: CaretRange;

  _previousText?: string;

  constructor(editor: TextEditorMask) {
    this.editor = editor;
  }

  _editorOption<K extends keyof TextEditorBaseProperties>(name: K): TextEditorBaseProperties[K];
  _editorOption<K extends keyof TextEditorBaseProperties>(
    name: K,
    value: TextEditorBaseProperties[K],
  ): void;
  _editorOption<K extends keyof TextEditorBaseProperties>(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    name: K,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    value?: TextEditorBaseProperties[K],
  ): TextEditorBaseProperties[K] | void {
    // eslint-disable-next-line prefer-rest-params
    return this.editor.option(...arguments);
  }

  _editorInput(): dxElementWrapper {
    return this.editor._input();
  }

  _editorCaret(): CaretRange;
  _editorCaret(newCaret: CaretRange | undefined): void;
  // eslint-disable-next-line consistent-return
  _editorCaret(newCaret?: CaretRange | undefined): CaretRange | void {
    if (!newCaret) {
      return this.editor._caret();
    }

    this.editor._caret(newCaret);
  }

  _attachChangeEventHandler(): void {
    const valueChangeEvent = this._editorOption('valueChangeEvent');

    if (!valueChangeEvent?.split(' ').includes('change')) {
      return;
    }

    const $input = this._editorInput();
    const namespace = addNamespace(BLUR_EVENT, MASK_EVENT_NAMESPACE);

    EventsEngine.on($input, namespace, (e) => {
      this.editor._changeHandler(e);
    });
  }

  _beforeInputHandler(): void {
    this._previousText = this._editorOption('text');
    this._prevCaret = this._editorCaret();
  }

  _inputHandler(event: DxEvent<InputEvent>): void {
    const { originalEvent } = event;

    if (!originalEvent) {
      return;
    }

    const { inputType } = originalEvent;

    if (HISTORY_INPUT_TYPES.includes(inputType)) {
      this._handleHistoryInputEvent();
    } else if (DELETE_INPUT_TYPES.includes(inputType)) {
      this._handleBackwardDeleteInputEvent();
    } else {
      const currentCaret = this._editorCaret();

      if (!currentCaret?.end) {
        return;
      }

      this._clearSelectedText();
      this._autoFillHandler(originalEvent);
      this._editorCaret(currentCaret);
      this._handleInsertTextInputEvent(originalEvent.data);
    }

    if (this._editorOption('text') === this._previousText) {
      event.stopImmediatePropagation();
    }
  }

  _handleHistoryInputEvent(): void {
    const caret = this._editorCaret();

    this._updateEditorMask({
      start: caret?.start,
      length: (caret?.end ?? 0) - (caret?.start ?? 0),
      text: '',
    });

    this._editorCaret(this._prevCaret);
  }

  _handleBackwardDeleteInputEvent(): void {
    this._clearSelectedText(true);

    const caret = this._editorCaret();

    this.editor.setForwardDirection();
    this.editor._adjustCaret();

    const adjustedForwardCaret = this._editorCaret();

    if (adjustedForwardCaret?.start !== caret?.start) {
      this.editor.setBackwardDirection();
      this.editor._adjustCaret();
    }
  }

  _clearSelectedText(isDeleteInputEvent?: boolean): void {
    const selectionLength = this._prevCaret
      && ((this._prevCaret.end ?? 0) - (this._prevCaret.start ?? 0));

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const length = selectionLength || Number(Boolean(isDeleteInputEvent));

    const caret = this._editorCaret();

    if (!this._isAutoFill()) {
      this.editor.setBackwardDirection();

      this._updateEditorMask({
        start: caret?.start,
        length,
        text: getEmptyString(length),
      });
    }
  }

  _handleInsertTextInputEvent(data: DxEvent<InputEvent>['data']): void {
    // NOTE: data has length > 1 when autosuggestion is applied.
    const text = data ?? '';

    this.editor.setForwardDirection();

    const hasValidChars = this._updateEditorMask({
      start: this._prevCaret?.start ?? 0,
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      length: text.length || 1,
      text,
    });

    if (!hasValidChars) {
      this._editorCaret(this._prevCaret);
    }
  }

  _updateEditorMask(args: HandlingArgs): boolean {
    const textLength = args.text?.length ?? 0;
    const processedCharsCount = this.editor._handleChain(args) ?? 0;

    this.editor._displayMask();

    if (this.editor.isForwardDirection()) {
      const { start = 0, end = 0 } = this._editorCaret() ?? {};

      const correction = processedCharsCount - textLength;
      const hasSkippedStub = processedCharsCount > 1;

      if (hasSkippedStub && textLength === 1) {
        this._editorCaret({
          start: start + correction,
          end: end + correction,
        });
      }

      this.editor._adjustCaret();
    }

    return Boolean(processedCharsCount);
  }

  _focusInHandler(): void {
    this.editor._showMaskPlaceholder();
    this.editor.setForwardDirection();

    if (!this.editor._isValueEmpty() && this._editorOption('isValid')) {
      this.editor._adjustCaret();
    } else {
      if (!this.editor._maskRulesChain) {
        return;
      }

      const caret = this.editor._maskRulesChain.first();

      // eslint-disable-next-line no-restricted-globals
      this._caretTimeout = setTimeout(() => {
        this._editorCaret({ start: caret, end: caret });
      }, 0);
    }
  }

  _focusOutHandler(event: DxEvent<FocusEvent>): void {
    this.editor._changeHandler(event);

    if (this._editorOption('showMaskMode') === 'onFocus' && this.editor._isValueEmpty()) {
      this._editorOption('text', '');
      this.editor._renderDisplayText('');
    }
  }

  _delHandler(event: DxEvent<KeyboardEvent>): void {
    this.editor._maskKeyHandler(event, () => {
      if (!this.editor._hasSelection()) {
        // @ts-expect-error bad editor type
        this.editor._handleKey(EMPTY_CHAR);
      }

      return undefined;
    });
  }

  _cutHandler(event: DxEvent<ClipboardEvent>): void {
    const caret = this._editorCaret();
    const inputVal = this._editorInput().val();

    // @ts-expect-error dxElementWrapper.val() should return string
    const selectedText = inputVal.substring(caret?.start, caret?.end);

    this.editor._maskKeyHandler(
      event,
      () => (getClipboardText(event, selectedText)) as Promise<string>,
    );
  }

  _dropHandler(): void {
    this._clearDragTimer();

    // eslint-disable-next-line no-restricted-globals
    this._dragTimer = setTimeout(() => {
      const value = this.editor._convertToValue(this._editorInput().val());

      this._editorOption('value', value);
    });
  }

  _pasteHandler(event: DxEvent<ClipboardEvent>): void {
    if (this._editorOption('disabled')) {
      return;
    }

    const caret = this._editorCaret();

    this.editor._maskKeyHandler(event, () => {
      const pastedText = getClipboardText(event);

      if (!pastedText) {
        return undefined;
      }

      const restText = this.editor._maskRulesChain?.text().substring(caret?.end ?? 0);
      const accepted = this.editor._handleChain({
        text: pastedText,
        start: caret?.start,
        length: pastedText.length,
      });
      const newCaret = (caret?.start ?? 0) + accepted;

      this.editor._handleChain({ text: restText, start: newCaret, length: restText?.length });
      this.editor._caret({ start: newCaret, end: newCaret });

      return undefined;
    });
  }

  _autoFillHandler(event: InputEvent): void {
    const inputVal = this._editorInput().val();

    // eslint-disable-next-line no-restricted-globals
    this._inputHandlerTimer = setTimeout(() => {
      if (this._isAutoFill()) {
        this.editor._maskKeyHandler(event, () => {
          this.editor._handleChain({
            text: inputVal,
            start: 0,
            length: inputVal.length,
          });

          return undefined;
        });

        this.editor._validateMask();
      }
    });
  }

  _isAutoFill(): boolean {
    const $input = this._editorInput();

    if (browser.webkit) {
      const input = $input.get(0);
      return input?.matches(':-webkit-autofill') ?? false;
    }

    return false;
  }

  _clearDragTimer(): void {
    clearTimeout(this._dragTimer);
  }

  _clearTimers(): void {
    this._clearDragTimer();
    clearTimeout(this._caretTimeout);
    clearTimeout(this._inputHandlerTimer);
  }

  getHandler(handlerName: string): (args: unknown) => void {
    return (args) => {
      this[`_${handlerName}Handler`]?.(args);
    };
  }

  attachEvents(): void {
    const $input = this._editorInput();

    EVENT_NAMES.forEach((eventName) => {
      const namespace = addNamespace(eventName.toLowerCase(), MASK_EVENT_NAMESPACE);
      EventsEngine.on($input, namespace, this.getHandler(eventName));
    });

    this._attachChangeEventHandler();
  }

  detachEvents(): void {
    this._clearTimers();

    EventsEngine.off(this._editorInput(), `.${MASK_EVENT_NAMESPACE}`);
  }

  clean(): void {
    this._clearTimers();
  }
}
