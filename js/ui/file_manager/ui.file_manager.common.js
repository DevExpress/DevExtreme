import { when } from '../../core/utils/deferred';
import { noop } from '../../core/utils/common';
import typeUtils from '../../core/utils/type';

const ErrorCode = {
    NoAccess: 0,
    FileExists: 1,
    FileNotFound: 2,
    DirectoryExists: 3,
    Other: 32767
};

const whenSome = function(arg, onSuccess, onError) {
    onSuccess = onSuccess || noop;
    onError = onError || noop;

    if(!Array.isArray(arg)) {
        arg = [ arg ];
    }

    const deferreds = arg.map((item, index) => {
        return when(item)
            .then(
                () => {
                    typeUtils.isFunction(onSuccess) && onSuccess();
                },
                error => {
                    if(!error) {
                        error = { };
                    }
                    error.index = index;
                    typeUtils.isFunction(onError) && onError(error);
                });
    });

    return when.apply(null, deferreds);
};

module.exports = whenSome;
module.exports.ErrorCode = ErrorCode;
