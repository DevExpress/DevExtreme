import BaseMaskStrategy from "./ui.text_editor.mask.strategy.base";
import { getChar } from "../../events/utils";

const BACKSPACE_INPUT_TYPE = "deleteContentBackward";
const EMPTY_CHAR = " ";

class DefaultMaskStrategy extends BaseMaskStrategy {
    _getStrategyName() {
        return "default";
    }

    getHandleEventNames() {
        return [...super.getHandleEventNames(), "keyPress"];
    }

    _keyDownHandler() {
        this._keyPressHandled = false;
    }

    _keyPressHandler(event) {
        if(this._keyPressHandled) {
            return;
        }

        this._keyPressHandled = true;

        if(this.editor._isControlKeyFired(event)) {
            return;
        }

        this.editor._maskKeyHandler(event, function() {
            this._handleKey(getChar(event));
            return true;
        });
    }

    _inputHandler(event) {
        if(this._backspaceInputHandled(event.originalEvent && event.originalEvent.inputType)) {
            this._handleBackspaceInput(event);
        }

        if(this._keyPressHandled) {
            return;
        }

        this._keyPressHandled = true;

        const inputValue = this.editorInput().val();
        const caret = this.editorCaret();
        if(!caret.end) {
            return;
        }
        caret.start = caret.end - 1;
        const oldValue = inputValue.substring(0, caret.start) + inputValue.substring(caret.end);
        const char = inputValue[caret.start];

        this.editorInput().val(oldValue);

        // NOTE: WP8 can not to handle setCaret immediately after setting value
        this._inputHandlerTimer = setTimeout((function() {
            this._caret({ start: caret.start, end: caret.start });

            this._maskKeyHandler(event, function() {
                this._handleKey(char);
                return true;
            });
        }).bind(this.editor));
    }

    _backspaceHandler(event) {
        this._keyPressHandled = true;

        const afterBackspaceHandler = (needAdjustCaret, callBack) => {
            if(needAdjustCaret) {
                this.editor._direction(this.DIRECTION.FORWARD);
                this.editor._adjustCaret();
            }
            const currentCaret = this.editorCaret();
            clearTimeout(this._backspaceHandlerTimeout);
            this._backspaceHandlerTimeout = setTimeout(function() {
                callBack(currentCaret);
            });
        };

        this.editor._maskKeyHandler(event, () => {
            if(this.editor._hasSelection()) {
                afterBackspaceHandler(true, (currentCaret) => {
                    this.editor._displayMask(currentCaret);
                    this.editor._maskRulesChain.reset();
                });
                return;
            }

            if(this.editor._tryMoveCaretBackward()) {
                afterBackspaceHandler(false, (currentCaret) => {
                    this.editorCaret(currentCaret);
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

    _handleBackspaceInput(event) {
        const { start, end } = this.editorCaret();
        this.editorCaret({ start: start + 1, end: end + 1 });
        this._backspaceHandler(event);
    }

    clean() {
        super.clean();

        clearTimeout(this._inputHandlerTimer);
    }
}

export default DefaultMaskStrategy;
