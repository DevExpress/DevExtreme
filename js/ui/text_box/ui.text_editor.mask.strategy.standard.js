import BaseMaskStrategy from "./ui.text_editor.mask.strategy.base";
import { getChar } from "../../events/utils";
import domUtils from "../../core/utils/dom";

const BACKSPACE_INPUT_TYPE = "deleteContentBackward";

class StandardMaskStrategy extends BaseMaskStrategy {
    getHandleEventNames() {
        return [...super.getHandleEventNames(), "keyPress"];
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

    _focusOutHandler() {
        if(this.editorOption("showMaskMode") === "onFocus" && this.editor._isValueEmpty()) {
            this.editorOption("text", "");
            this.editor._renderDisplayText("");
        }
    }

    _keyDownHandler() {
        this._keyPressHandled = false;
    }

    _keyPressHandler(e) {
        if(this._keyPressHandled) {
            return;
        }

        this._keyPressHandled = true;

        if(this.editor._isControlKeyFired(e)) {
            return;
        }

        this.editor._maskKeyHandler(e, function() {
            this._handleKey(getChar(e));
            return true;
        });
    }

    _inputHandler(e) {
        if(this._backspaceInputHandled(e.originalEvent && e.originalEvent.inputType)) {
            this._handleBackspaceInput(e);
        }

        if(this._keyPressHandled) {
            return;
        }

        this._keyPressHandled = true;

        var inputValue = this.editorInput().val();
        var caret = this.editor._caret();
        if(!caret.end) {
            return;
        }
        caret.start = caret.end - 1;
        var oldValue = inputValue.substring(0, caret.start) + inputValue.substring(caret.end);
        var char = inputValue[caret.start];

        this.editorInput().val(oldValue);

        // NOTE: WP8 can not to handle setCaret immediately after setting value
        this._inputHandlerTimer = setTimeout((function() {
            this._caret({ start: caret.start, end: caret.start });

            this._maskKeyHandler(e, function() {
                this._handleKey(char);
                return true;
            });
        }).bind(this.editor));
    }

    _backspaceInputHandled(inputType) {
        return inputType === BACKSPACE_INPUT_TYPE && !this._keyPressHandled;
    }

    _handleBackspaceInput(e) {
        var caret = this.editor._caret();
        this.editor._caret({ start: caret.start + 1, end: caret.end + 1 });
        this._backspaceHandler(e);
    }

    _cutHandler(event) {
        var caret = this.editor._caret();
        var selectedText = this.editorInput().val().substring(caret.start, caret.end);

        this.editor._maskKeyHandler(event, function() {
            domUtils.clipboardText(event, selectedText);
            return true;
        });
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

    _pasteHandler(e) {
        this._keyPressHandled = true;
        var caret = this.editor._caret();

        this.editor._maskKeyHandler(e, function() {
            var pastingText = domUtils.clipboardText(e);
            var restText = this._maskRulesChain.text().substring(caret.end);

            var accepted = this._handleChain({ text: pastingText, start: caret.start, length: pastingText.length });
            var newCaret = caret.start + accepted;

            this._handleChain({ text: restText, start: newCaret, length: restText.length });

            this._caret({ start: newCaret, end: newCaret });

            return true;
        });
    }

    clean() {
        super.clean();

        this._clearDragTimer();
        clearTimeout(this._inputHandlerTimer);
        clearTimeout(this._backspaceHandlerTimeout);
        clearTimeout(this._caretTimeout);
    }
}

export default StandardMaskStrategy;
