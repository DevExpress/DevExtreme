import BaseMaskStrategy from "./ui.text_editor.mask.strategy.base";
import { getChar } from "../../events/utils";

const BACKSPACE_INPUT_TYPE = "deleteContentBackward";
const EMPTY_CHAR = " ";

class DefaultMaskStrategy extends BaseMaskStrategy {
    getHandleEventNames() {
        return [...super.getHandleEventNames(), "keyPress"];
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

    _backspaceHandler(e) {
        this._keyPressHandled = true;

        const afterBackspaceHandler = (needAdjustCaret, callBack) => {
            if(needAdjustCaret) {
                this.editor._direction(this.DIRECTION.FORWARD);
                this.editor._adjustCaret();
            }
            const currentCaret = this.editor._caret();
            clearTimeout(this._backspaceHandlerTimeout);
            this._backspaceHandlerTimeout = setTimeout(function() {
                callBack(currentCaret);
            });
        };

        this.editor._maskKeyHandler(e, () => {
            if(this.editor._hasSelection()) {
                afterBackspaceHandler(true, (currentCaret) => {
                    this.editor._displayMask(currentCaret);
                    this.editor._maskRulesChain.reset();
                });
                return;
            }

            if(this.editor._tryMoveCaretBackward()) {
                afterBackspaceHandler(false, (currentCaret) => {
                    this.editor._caret(currentCaret);
                });
                return;
            }

            this.editor._handleKey(EMPTY_CHAR, this.DIRECTION.BACKWARD);
            afterBackspaceHandler(true, (currentCaret) => {
                this.editor._displayMask(currentCaret);
                this.editor._maskRulesChain.reset();
            });
        });
    }

    _backspaceInputHandled(inputType) {
        return inputType === BACKSPACE_INPUT_TYPE && !this._keyPressHandled;
    }

    _handleBackspaceInput(e) {
        var caret = this.editor._caret();
        this.editor._caret({ start: caret.start + 1, end: caret.end + 1 });
        this._backspaceHandler(e);
    }

    clean() {
        super.clean();

        clearTimeout(this._inputHandlerTimer);
    }
}

export default DefaultMaskStrategy;
