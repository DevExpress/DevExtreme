import Quill from 'devextreme-quill';
import EmptyModule from './empty';
import { isObject, isDefined } from '../../../core/utils/type';

let BaseModule = EmptyModule;

if(Quill) {
    const BaseQuillModule = Quill.import('core/module');

    BaseModule = class BaseHtmlEditorModule extends BaseQuillModule {
        constructor(quill, options) {
            super(quill, options);

            this.editorInstance = options.editorInstance;
        }

        saveValueChangeEvent(event) {
            this.editorInstance._saveValueChangeEvent(event);
        }

        addCleanCallback(callback) {
            this.editorInstance.addCleanCallback(callback);
        }

        handleOptionChangeValue(changes) {
            if(isObject(changes)) {
                Object.entries(changes).forEach(([name, value]) => this.option(name, value));
            } else if(!isDefined(changes)) {
                this?.clean();
            }
        }
    };
}

export default BaseModule;
