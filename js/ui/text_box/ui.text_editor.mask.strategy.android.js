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
        const { inputType, data } = originalEvent;

        if(inputType === DELETE_INPUT_TYPE) {
            const length = this._prevCaret.end - this._prevCaret.start;
            this._updateEditorMask({
                start: this._prevCaret.start,
                length,
                text: this._getEmptyString(length)
            });
        } else {
            const caret = this.editor._caret();
            if(!caret.end) {
                return;
            }

            this.editor._caret({ start: caret.start, end: caret.start });
            const length = this._prevCaret.end - this._prevCaret.start;
            const newData = data + (length ? this._getEmptyString(length - data.length) : "");

            this._updateEditorMask({
                start: this._prevCaret.start,
                length: length || newData.length,
                text: newData
            });
        }
    }

    _getEmptyString(length) {
        return Array(length + 1).join(" ");
    }

    _updateEditorMask(args) {
        this.editor._handleChain(args);
        this.editor._adjustCaret();
        this.editor._displayMask();
    }
}

export default AndroidMaskStrategy;
