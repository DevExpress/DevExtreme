import Callbacks from '../../core/utils/callbacks';
import Class from '../../core/class';

const DefaultAdapter = Class.inherit({
    ctor(editor, validator) {
        this.editor = editor;
        this.validator = validator;
        this.validationRequestsCallbacks = Callbacks();
        const handler = (args) => {
            this.validationRequestsCallbacks.fire(args);
        };
        editor.validationRequest.add(handler);
        editor.on('disposing', function() {
            editor.validationRequest.remove(handler);
        });
    },

    getValue() {
        return this.editor.option('value');
    },

    getCurrentValidationError() {
        return this.editor.option('validationError');
    },

    bypass() {
        return this.editor.option('disabled');
    },

    applyValidationResults(params) {
        this.editor.option({
            validationErrors: params.brokenRules,
            validationStatus: params.status
        });
    },

    reset() {
        this.editor.reset();
    },

    focus() {
        this.editor.focus();
    }
});

module.exports = DefaultAdapter;
