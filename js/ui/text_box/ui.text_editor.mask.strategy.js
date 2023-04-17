import EventsEngine from '../../events/core/events_engine';
import { addNamespace } from '../../events/utils/index';
import browser from '../../core/utils/browser';
import { clipboardText as getClipboardText } from '../../core/utils/dom';

const MASK_EVENT_NAMESPACE = 'dxMask';
const BLUR_EVENT = 'blur beforedeactivate';
const EMPTY_CHAR = ' ';
const DELETE_INPUT_TYPES = ['deleteContentBackward', 'deleteSoftLineBackward', 'deleteContent', 'deleteHardLineBackward'];
const HISTORY_INPUT_TYPES = ['historyUndo', 'historyRedo'];
const EVENT_NAMES = ['focusIn', 'focusOut', 'keyDown', 'input', 'paste', 'cut', 'drop', 'beforeInput'];

function getEmptyString(length) {
    return ' '.repeat(length);
}

export default class BaseMaskStrategy {
    constructor(editor) {
        this.editor = editor;
    }

    _editorOption() {
        return this.editor.option(...arguments);
    }

    _editorInput() {
        return this.editor._input();
    }

    _editorCaret(newCaret) {
        if(!newCaret) {
            return this.editor._caret();
        }

        this.editor._caret(newCaret);
    }

    _attachChangeEventHandlers() {
        if(!this._editorOption('valueChangeEvent').split(' ').includes('change')) {
            return;
        }

        const $input = this._editorInput();
        const namespace = addNamespace(BLUR_EVENT, MASK_EVENT_NAMESPACE);
        EventsEngine.on($input, namespace, (e) => {
            this.editor._changeHandler(e);
        });
    }

    _beforeInputHandler() {
        this._previousText = this.editorOption('text');
        this._prevCaret = this._editorCaret();
    }

    _inputHandler(event) {
        const { originalEvent } = event;
        if(!originalEvent) {
            return;
        }

        const { inputType, data } = originalEvent;
        const currentCaret = this._editorCaret();

        if(HISTORY_INPUT_TYPES.includes(inputType)) {
            this._updateEditorMask({
                start: currentCaret.start,
                length: currentCaret.end - currentCaret.start,
                text: ''
            });
            this._editorCaret(this._prevCaret);
        } else if(DELETE_INPUT_TYPES.includes(inputType)) {
            const length = (this._prevCaret.end - this._prevCaret.start) || 1;
            this.editor.setBackwardDirection();
            this._updateEditorMask({
                start: currentCaret.start,
                length,
                text: getEmptyString(length)
            });

            const beforeAdjustCaret = this._editorCaret();
            this.editor.setForwardDirection();
            this.editor._adjustCaret();
            const adjustedForwardCaret = this._editorCaret();
            if(adjustedForwardCaret.start !== beforeAdjustCaret.start) {
                this.editor.setBackwardDirection();
                this.editor._adjustCaret();
            }
        } else {
            if(!currentCaret.end) {
                return;
            }

            const length = (this._prevCaret?.end - this._prevCaret?.start) || 1;
            if(length > 1) {
                this.editor.setBackwardDirection();
                this._updateEditorMask({
                    start: currentCaret.start,
                    length,
                    text: getEmptyString(length)
                });
            }

            this._autoFillHandler(originalEvent);

            this._editorCaret(currentCaret);

            this.editor.setForwardDirection();
            const text = data ?? '';
            const hasValidChars = this._updateEditorMask({
                start: this._prevCaret?.start,
                length: text.length || 1,
                text
            });

            if(!hasValidChars) {
                this._editorCaret(this._prevCaret);
            }
        }

        if(this.editorOption('text') === this._previousText) {
            event.stopImmediatePropagation();
        }
    }

    _updateEditorMask(args) {
        const textLength = args.text.length;
        const updatedCharsCount = this.editor._handleChain(args);

        this.editor._displayMask();

        if(this.editor.isForwardDirection()) {
            const { start, end } = this._editorCaret();
            const correction = updatedCharsCount - textLength;

            if(updatedCharsCount > 1 && textLength === 1) {
                this._editorCaret({ start: start + correction, end: end + correction });
            }

            this.editor._adjustCaret();
        }

        return !!updatedCharsCount;
    }

    _focusInHandler() {
        this.editor._showMaskPlaceholder();
        this.editor.setForwardDirection();

        if(!this.editor._isValueEmpty() && this._editorOption('isValid')) {
            this.editor._adjustCaret();
        } else {
            const caret = this.editor._maskRulesChain.first();
            this._caretTimeout = setTimeout(function() {
                this._caret({ start: caret, end: caret });
            }.bind(this.editor), 0);
        }
    }

    _focusOutHandler(event) {
        this.editor._changeHandler(event);

        if(this._editorOption('showMaskMode') === 'onFocus' && this.editor._isValueEmpty()) {
            this._editorOption('text', '');
            this.editor._renderDisplayText('');
        }
    }

    _cutHandler(event) {
        const caret = this._editorCaret();
        const selectedText = this._editorInput().val().substring(caret.start, caret.end);

        this.editor._maskKeyHandler(event, () => getClipboardText(event, selectedText));
    }

    _dropHandler() {
        this._clearDragTimer();
        this._dragTimer = setTimeout((function() {
            this.option('value', this._convertToValue(this._input().val()));
        }).bind(this.editor));
    }

    _clearDragTimer() {
        clearTimeout(this._dragTimer);
    }

    _keyDownHandler() {
        this._keyPressHandled = false;
    }

    _pasteHandler(event) {
        const { editor } = this;

        if(editor.editorOption('disabled')) {
            return;
        }

        this._keyPressHandled = true;
        const caret = this._editorCaret();

        editor._maskKeyHandler(event, () => {
            const pastedText = getClipboardText(event);
            const restText = editor._maskRulesChain.text().substring(caret.end);
            const accepted = editor._handleChain({ text: pastedText, start: caret.start, length: pastedText.length });
            const newCaret = caret.start + accepted;

            editor._handleChain({ text: restText, start: newCaret, length: restText.length });
            editor._caret({ start: newCaret, end: newCaret });
        });
    }

    _autoFillHandler(event) {
        const { editor } = this;
        const inputVal = this._editorInput().val();
        this._inputHandlerTimer = setTimeout(() => {
            this._keyPressHandled = true;

            if(this._isAutoFill()) {
                this._keyPressHandled = true;

                editor._maskKeyHandler(event, () => {
                    editor._handleChain({ text: inputVal, start: 0, length: inputVal.length });
                });
                editor._validateMask();
            }
        });
    }

    _isAutoFill() {
        const $input = this.editor._input();
        let result = false;

        if(browser.webkit) {
            const input = $input.get(0);
            result = input && input.matches(':-webkit-autofill');
        }

        return result;
    }

    _backspaceHandler() { }

    _delHandler(event) {
        const { editor } = this;

        this._keyPressHandled = true;
        editor._maskKeyHandler(event, () =>
            !editor._hasSelection() && editor._handleKey(EMPTY_CHAR));
    }

    getHandler(handlerName) {
        const handler = this[`_${handlerName}Handler`] || function() {};
        return handler.bind(this);
    }

    attachEvents() {
        const $input = this._editorInput();

        EVENT_NAMES.forEach((eventName) => {
            const subscriptionName = addNamespace(eventName.toLowerCase(), MASK_EVENT_NAMESPACE);

            EventsEngine.on($input, subscriptionName, this.getHandler(eventName));
        });

        this._attachChangeEventHandlers();
    }

    detachEvents() {
        EventsEngine.off(this._editorInput(), `.${MASK_EVENT_NAMESPACE}`);
    }

    runWithoutEventProcessing(action) {
        const keyPressHandled = this._keyPressHandled;

        this._keyPressHandled = true;
        action();
        this._keyPressHandled = keyPressHandled;
    }

    clean() {
        this._clearDragTimer();
        clearTimeout(this._backspaceHandlerTimeout);
        clearTimeout(this._caretTimeout);
        clearTimeout(this._inputHandlerTimer);
    }
}
