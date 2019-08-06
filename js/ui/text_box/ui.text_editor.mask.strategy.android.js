import BaseMaskStrategy from "./ui.text_editor.mask.strategy.base";

const DELETE_INPUT_TYPE = "deleteContentBackward";

class AndroidMaskStrategy extends BaseMaskStrategy {
    getHandleEventNames() {
        return [...super.getHandleEventNames(), "beforeInput"];
    }

    _beforeInputHandler(e) {
        this._prevCaret = this.editor._caret();
    }

    _keyDownHandler() {
        this._keyPressHandled = false;
    }

    _inputHandler({ originalEvent }) {
        if(!originalEvent) {
            return;
        }

        const { inputType, data } = originalEvent;
        const currentCaret = this.editor._caret();

        if(inputType === DELETE_INPUT_TYPE) {
            const length = (this._prevCaret.end - this._prevCaret.start) || 1;
            this.editor.setBackwardDirection();
            this._updateEditorMask({
                start: currentCaret.start,
                length,
                text: this._getEmptyString(length)
            });
        } else {
            if(!currentCaret.end) {
                return;
            }

            this.editor._caret(currentCaret);

            const length = this._prevCaret.end - this._prevCaret.start;
            const newData = data + (length ? this._getEmptyString(length - data.length) : "");

            this.editor.setForwardDirection();
            const hasValidChars = this._updateEditorMask({
                start: this._prevCaret.start,
                length: length || newData.length,
                text: newData
            });

            if(!hasValidChars) {
                this.editor._caret(this._prevCaret);
            }
        }
    }

    _getEmptyString(length) {
        return Array(length + 1).join(" ");
    }

    _updateEditorMask(args) {
        const textLength = args.text.length;
        const updatedCharsCount = this.editor._handleChain(args);

        const { start, end } = this.editor._caret();
        if(start <= updatedCharsCount && updatedCharsCount > 1) {
            this.editor._caret({ start: start + updatedCharsCount - textLength, end: end + updatedCharsCount - textLength });
        }

        this.editor._adjustCaret();
        this.editor._displayMask();

        return !!updatedCharsCount;
    }
}

export default AndroidMaskStrategy;
