import EventsEngine from '../../events/core/events_engine';
import { addNamespace } from '../../events/utils/index';
import browser from '../../core/utils/browser';
import { clipboardText as getClipboardText } from '../../core/utils/dom';

const MASK_EVENT_NAMESPACE = 'dxMask';
const BLUR_EVENT = 'blur beforedeactivate';
const EMPTY_CHAR = ' ';

const DELETE_INPUT_TYPES = ['deleteContentBackward', 'deleteSoftLineBackward', 'deleteContent', 'deleteHardLineBackward'];
const HISTORY_INPUT_TYPES = ['historyUndo', 'historyRedo'];
export default class BaseMaskStrategy {
    constructor(editor) {
        this.editor = editor;
    }

    editorOption() {
        return this.editor.option(...arguments);
    }

    editorInput() {
        return this.editor._input();
    }

    editorCaret(newCaret) {
        if(!newCaret) {
            return this.editor._caret();
        }

        this.editor._caret(newCaret);
    }

    getHandler(handlerName) {
        const handler = this[`_${handlerName}Handler`] || function() {};
        return handler.bind(this);
    }

    attachEvents() {
        const $input = this.editorInput();

        this.getHandleEventNames().forEach((eventName) => {
            const subscriptionName = addNamespace(eventName.toLowerCase(), MASK_EVENT_NAMESPACE);

            EventsEngine.on($input, subscriptionName, this.getEventHandler(eventName));
        });

        this._attachChangeEventHandlers();
    }

    getHandleEventNames() {
        return ['focusIn', 'focusOut', 'keyDown', 'input', 'paste', 'cut', 'drop', 'beforeInput'];
    }

    getEventHandler(eventName) {
        return this[`_${eventName}Handler`].bind(this);
    }

    detachEvents() {
        EventsEngine.off(this.editorInput(), `.${MASK_EVENT_NAMESPACE}`);
    }

    _attachChangeEventHandlers() {
        if(!this.editorOption('valueChangeEvent').split(' ').includes('change')) {
            return;
        }

        EventsEngine.on(this.editorInput(), addNamespace(BLUR_EVENT, MASK_EVENT_NAMESPACE), (function(e) {
            // NOTE: input is focused on caret changing in IE(T304159)
            this._suppressCaretChanging(this._changeHandler, [e]);
            this._changeHandler(e);
        }).bind(this.editor));
    }

    _beforeInputHandler() {
        this._previousText = this.editor.option('text');
        this._prevCaret = this.editorCaret();
    }

    _inputHandler(event) {
        const { originalEvent } = event;
        if(!originalEvent) {
            return;
        }

        const { inputType, data } = originalEvent;
        const currentCaret = this.editorCaret();

        if(HISTORY_INPUT_TYPES.includes(inputType)) {
            this._updateEditorMask({
                start: currentCaret.start,
                length: currentCaret.end - currentCaret.start,
                text: ''
            });
            this.editorCaret(this._prevCaret);
        } else if(DELETE_INPUT_TYPES.includes(inputType)) {
            const length = (this._prevCaret.end - this._prevCaret.start) || 1;
            this.editor.setBackwardDirection();
            this._updateEditorMask({
                start: currentCaret.start,
                length,
                text: this._getEmptyString(length)
            });

            const beforeAdjustCaret = this.editorCaret();
            this.editor.setForwardDirection();
            this.editor._adjustCaret();
            const adjustedForwardCaret = this.editorCaret();
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
                    text: this._getEmptyString(length)
                });
            }

            this._autoFillHandler(originalEvent);

            this.editorCaret(currentCaret);

            this.editor.setForwardDirection();
            const text = data ?? '';
            const hasValidChars = this._updateEditorMask({
                start: this._prevCaret?.start,
                length: text.length || 1,
                text
            });

            if(!hasValidChars) {
                this.editorCaret(this._prevCaret);
            }
        }

        if(this.editor.option('text') === this._previousText) {
            event.stopImmediatePropagation();
        }
    }

    _getEmptyString(length) {
        return Array(length + 1).join(' ');
    }

    _updateEditorMask(args) {
        const textLength = args.text.length;
        const updatedCharsCount = this.editor._handleChain(args);

        this.editor._displayMask();

        if(this.editor.isForwardDirection()) {
            const { start, end } = this.editorCaret();
            const correction = updatedCharsCount - textLength;

            if(updatedCharsCount > 1 && textLength === 1) {
                this.editorCaret({ start: start + correction, end: end + correction });
            }

            this.editor._adjustCaret();
        }

        return !!updatedCharsCount;
    }

    _focusInHandler() {
        this.editor._showMaskPlaceholder();
        this.editor.setForwardDirection();

        if(!this.editor._isValueEmpty() && this.editorOption('isValid')) {
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

        if(this.editorOption('showMaskMode') === 'onFocus' && this.editor._isValueEmpty()) {
            this.editorOption('text', '');
            this.editor._renderDisplayText('');
        }
    }

    _cutHandler(event) {
        const caret = this.editorCaret();
        const selectedText = this.editorInput().val().substring(caret.start, caret.end);

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

        if(editor.option('disabled')) {
            return;
        }

        this._keyPressHandled = true;
        const caret = this.editorCaret();

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
        const inputVal = this.editorInput().val();
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

    runWithoutEventProcessing(action) {
        const keyPressHandled = this._keyPressHandled;

        this._keyPressHandled = true;
        action();
        this._keyPressHandled = keyPressHandled;
    }

    _backspaceHandler() { }

    _delHandler(event) {
        const { editor } = this;

        this._keyPressHandled = true;
        editor._maskKeyHandler(event, () =>
            !editor._hasSelection() && editor._handleKey(EMPTY_CHAR));
    }

    clean() {
        this._clearDragTimer();
        clearTimeout(this._backspaceHandlerTimeout);
        clearTimeout(this._caretTimeout);
        clearTimeout(this._inputHandlerTimer);
    }
}
