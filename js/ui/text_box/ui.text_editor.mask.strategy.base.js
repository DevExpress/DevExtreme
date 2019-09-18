import EventsEngine from "../../events/core/events_engine";
import { addNamespace } from "../../events/utils";
import { inArray } from "../../core/utils/array";
import { clipboardText as getClipboardText } from "../../core/utils/dom";

const MASK_EVENT_NAMESPACE = "dxMask";
const BLUR_EVENT = "blur beforedeactivate";
const EMPTY_CHAR = " ";

export default class BaseMaskStrategy {
    constructor(editor) {
        this.editor = editor;
        this.DIRECTION = {
            FORWARD: "forward",
            BACKWARD: "backward"
        };
        this.NAME = this._getStrategyName();
    }

    _getStrategyName() {
        return "base";
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
        return ["focusIn", "focusOut", "keyDown", "input", "paste", "cut", "drop"];
    }

    getEventHandler(eventName) {
        return this[`_${eventName}Handler`].bind(this);
    }

    detachEvents() {
        EventsEngine.off(this.editorInput(), `.${MASK_EVENT_NAMESPACE}`);
    }

    _attachChangeEventHandlers() {
        if(inArray("change", this.editorOption("valueChangeEvent").split(" ")) === -1) {
            return;
        }

        EventsEngine.on(this.editorInput(), addNamespace(BLUR_EVENT, MASK_EVENT_NAMESPACE), (function(e) {
            // NOTE: input is focused on caret changing in IE(T304159)
            this._suppressCaretChanging(this._changeHandler, [e]);
            this._changeHandler(e);
        }).bind(this.editor));
    }

    _focusInHandler() {
        this.editor._showMaskPlaceholder();
        this.editor._direction(this.DIRECTION.FORWARD);

        if(!this.editor._isValueEmpty() && this.editorOption("isValid")) {
            this.editor._adjustCaret();
        } else {
            var caret = this.editor._maskRulesChain.first();
            this._caretTimeout = setTimeout(function() {
                this._caret({ start: caret, end: caret });
            }.bind(this.editor), 0);
        }
    }

    _focusOutHandler(event) {
        this.editor._changeHandler(event);

        if(this.editorOption("showMaskMode") === "onFocus" && this.editor._isValueEmpty()) {
            this.editorOption("text", "");
            this.editor._renderDisplayText("");
        }
    }

    _cutHandler(event) {
        var caret = this.editorCaret();
        var selectedText = this.editorInput().val().substring(caret.start, caret.end);

        this.editor._maskKeyHandler(event, () => getClipboardText(event, selectedText));
    }

    _dropHandler() {
        this._clearDragTimer();
        this._dragTimer = setTimeout((function() {
            this.option("value", this._convertToValue(this._input().val()));
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
        this._keyPressHandled = true;
        var caret = this.editorCaret();

        editor._maskKeyHandler(event, () => {
            var pastingText = getClipboardText(event);
            var restText = editor._maskRulesChain.text().substring(caret.end);
            var accepted = editor._handleChain({ text: pastingText, start: caret.start, length: pastingText.length });
            var newCaret = caret.start + accepted;

            editor._handleChain({ text: restText, start: newCaret, length: restText.length });
            editor._caret({ start: newCaret, end: newCaret });
        });
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
    }
}
