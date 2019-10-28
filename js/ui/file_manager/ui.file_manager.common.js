import { when, Deferred } from "../../core/utils/deferred";
import { noop } from "../../core/utils/common";
import typeUtils from "../../core/utils/type";

const ErrorCode = {
    NoAccess: 0,
    FileExists: 1,
    FileNotFound: 2,
    DirectoryExists: 3,
    DirectoryNotFound: 4,
    WrongFileExtension: 5,
    MaxFileSizeExceeded: 6,
    InvalidSymbols: 7,
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
                result => {
                    typeUtils.isFunction(onSuccess) && onSuccess({ item, index, result });
                    return result;
                },
                error => {
                    if(!error) {
                        error = { };
                    }
                    error.index = index;
                    typeUtils.isFunction(onError) && onError(error);
                    return new Deferred().resolve().promise();
                });
    });

    return when.apply(null, deferreds);
};

module.exports = whenSome;
module.exports.ErrorCode = ErrorCode;
