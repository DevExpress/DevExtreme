var ko = require('knockout'),
    variableWrapper = require('../../core/utils/variable_wrapper');

variableWrapper.inject({
    isWrapped: ko.isObservable,
    isWritableWrapped: ko.isWritableObservable,
    wrap: ko.observable,
    unwrap: function(value) {
        if(ko.isObservable(value)) {
            return ko.utils.unwrapObservable(value);
        }
        return this.callBase(value);
    },
    assign: function(variable, value) {
        if(ko.isObservable(variable)) {
            variable(value);
        } else {
            this.callBase(variable, value);
        }
    }
});
