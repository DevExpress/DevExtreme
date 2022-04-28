import BaseMaskStrategy from './ui.text_editor.mask.strategy.base';

const DELETE_INPUT_TYPE = 'deleteContentBackward';

class InputEventsMaskStrategy extends BaseMaskStrategy {
    _getStrategyName() {
        return 'inputEvents';
    }

    getHandleEventNames() {
        return [...super.getHandleEventNames(), 'beforeInput'];
    }

    _beforeInputHandler() {
        this._prevCaret = this.editorCaret();
    }

    _inputHandler({ originalEvent }) {
        if(!originalEvent) {
            return;
        }

        const { inputType, data } = originalEvent;
        const currentCaret = this.editorCaret();

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

            this._autoFillHandler(originalEvent);

            this.editorCaret(currentCaret);

            const length = this._prevCaret?.end - this._prevCaret?.start;
            const newData = data + (length ? this._getEmptyString(length - data.length) : '');

            this.editor.setForwardDirection();
            const hasValidChars = this._updateEditorMask({
                start: this._prevCaret?.start,
                length: length || newData.length,
                text: newData
            });

            if(!hasValidChars) {
                this.editorCaret(this._prevCaret);
            }
        }
    }

    _getEmptyString(length) {
        return Array(length + 1).join(' ');
    }

    _updateEditorMask(args) {
        const textLength = args.text.length;
        const updatedCharsCount = this.editor._handleChain(args);

        if(this.editor.isForwardDirection()) {
            const { start, end } = this.editorCaret();
            const correction = updatedCharsCount - textLength;

            if(start <= updatedCharsCount && updatedCharsCount > 1) {
                this.editorCaret({ start: start + correction, end: end + correction });
            }

            this.editor.isForwardDirection() && this.editor._adjustCaret();
        }
        this.editor._displayMask();

        return !!updatedCharsCount;
    }
}

export default InputEventsMaskStrategy;
