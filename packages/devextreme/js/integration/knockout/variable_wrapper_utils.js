// eslint-disable-next-line no-restricted-imports
import ko from 'knockout';
import variableWrapper from '../../core/utils/variable_wrapper';

if(ko) {
    variableWrapper.inject({
        isWrapped: ko.isObservable,
        isWritableWrapped: ko.isWritableObservable,
        wrap: ko.observable,
        unwrap: function(value) {
            if(ko.isObservable(value)) {
                return ko.utils.unwrapObservable(value);
            }
            // Recursively unwrap observable properties within objects
            if(value && typeof value === 'object' && !Array.isArray(value)) {
                const unwrapped = {};
                for(const key in value) {
                    if(value.hasOwnProperty(key)) {
                        const subValue = value[key];
                        if(ko.isObservable(subValue)) {
                            unwrapped[key] = ko.utils.unwrapObservable(subValue);
                        } else {
                            unwrapped[key] = subValue;
                        }
                    }
                }
                return unwrapped;
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
}
