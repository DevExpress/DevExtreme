import BaseMaskStrategy from "./ui.text_editor.mask.strategy.base";
import { getChar } from "../../events/utils";
import Promise from "../../core/polyfills/promise";

const BACKSPACE_INPUT_TYPE = "deleteContentBackward";
const EMPTY_CHAR = " ";

class DefaultMaskStrategy extends BaseMaskStrategy {
    _getStrategyName() {
        return "default";
    }

    getHandleEventNames() {
        return [...super.getHandleEventNames(), "keyPress"];
    }

    _keyPressHandler(event) {
        if(this._keyPressHandled) {
            return;
        }

        this._keyPressHandled = true;

        if(this.editor._isControlKeyFired(event)) {
            return;
        }

        const { editor } = this;

        editor._maskKeyHandler(event, () => editor._handleKey(getChar(event)));
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

            this._maskKeyHandler(event, () => this._handleKey(char));
        }).bind(this.editor));
    }

    _backspaceHandler(event) {
        const { editor } = this;
        this._keyPressHandled = true;

        const afterBackspaceHandler = (needAdjustCaret, callBack) => {
            if(needAdjustCaret) {
                editor._direction(this.DIRECTION.FORWARD);
                editor._adjustCaret();
            }
            const currentCaret = this.editorCaret();

            return new Promise((resolve) => {
                clearTimeout(this._backspaceHandlerTimeout);
                this._backspaceHandlerTimeout = setTimeout(function() {
                    callBack(currentCaret);
                    resolve();
                });
            });
        };

        editor._maskKeyHandler(event, () => {
            if(editor._hasSelection()) {
                return afterBackspaceHandler(true, (currentCaret) => {
                    editor._displayMask(currentCaret);
                    editor._maskRulesChain.reset();
                });
            }

            if(editor._tryMoveCaretBackward()) {
                return afterBackspaceHandler(false, (currentCaret) => {
                    this.editorCaret(currentCaret);
                });
            }

            editor._handleKey(EMPTY_CHAR, this.DIRECTION.BACKWARD);

            return afterBackspaceHandler(true, (currentCaret) => {
                editor._displayMask(currentCaret);
                editor._maskRulesChain.reset();
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
