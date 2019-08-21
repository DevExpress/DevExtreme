import Callbacks from "../../core/utils/callbacks";

class DefaultAdapter {
    constructor(editor, validator) {
        this.editor = editor;
        this.validator = validator;
        this.validationRequestsCallbacks = Callbacks();
        const handler = () => {
            this.validationRequestsCallbacks.fire();
        };
        editor.validationRequest.add(handler);
        editor.on("disposing", function() {
            editor.validationRequest.remove(handler);
        });
    }

    getValue() {
        return this.editor.option("value");
    }

    getCurrentValidationError() {
        return this.editor.option("validationError");
    }

    bypass() {
        return this.editor.option("disabled");
    }

    applyValidationResults(params) {
        this.editor.option({
            isValid: params.isValid,
            validationError: params.brokenRule,
            validationErrors: params.brokenRules,
            validationStatus: params.status
        });
    }

    reset() {
        this.editor.reset();
    }

    focus() {
        this.editor.focus();
    }
}

module.exports = DefaultAdapter;
