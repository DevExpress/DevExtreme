import ConverterController from '../converterController';
import { getQuill } from '../quill_importer';

class DeltaConverter {

    constructor() {
        this.TextBlot = getQuill().import('blots/text');
        this.BreakBlot = getQuill().import('blots/break');
    }

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
