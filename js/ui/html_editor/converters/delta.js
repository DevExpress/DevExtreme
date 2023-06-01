import ConverterController from '../converterController';

class DeltaConverter {

    setQuillInstance(quillInstance) {
        this.quillInstance = quillInstance;
    }

    toHtml() {
        if(!this.quillInstance) {
            return;
        }

        return this._isQuillEmpty() ?
            '' :
            this.quillInstance.getSemanticHTML(0, this.quillInstance.getLength() + 1);
    }

    _isQuillEmpty() {
        const delta = this.quillInstance.getContents();

        return delta.length() === 1 && this._isDeltaEmpty(delta);
    }

    _isDeltaEmpty(delta) {
        return delta.reduce((__, { insert }) => insert.indexOf('\n') !== -1);
    }
}

ConverterController.addConverter('delta', DeltaConverter);

export default DeltaConverter;
