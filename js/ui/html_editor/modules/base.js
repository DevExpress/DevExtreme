import Quill from 'devextreme-quill';

let BaseHtmlEditorModule = {};

if(Quill) {
    const BaseModule = Quill.import('core/module');

    BaseHtmlEditorModule = class BaseHtmlEditorModule extends BaseModule {
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
    };
}

export default BaseHtmlEditorModule;
