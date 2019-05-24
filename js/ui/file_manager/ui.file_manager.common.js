import { when } from "../../core/utils/deferred";
import { noop } from "../../core/utils/common";

const whenSome = function(arg, onSuccess, onError) {
    onSuccess = onSuccess || noop;
    onError = onError || noop;

    const createResult = function(result, success, canceled, error) {
        return {
            result: result,
            success: success,
            canceled: canceled || false,
            error: error || null
        };
    };

    const createErrorInfo = function(index, result) {
        return {
            index: index,
            errorId: result.errorId,
        };
    };

    if(!Array.isArray(arg)) {
        return when(arg)
            .then(onSuccess,
                error => {
                    if(error) {
                        onError(createErrorInfo(0, error));
                    }
                });
    }

    const deferreds = arg.map((item, index) => {
        return when(item)
            .then(result => createResult(result, true),
                error => {
                    if(error) {
                        onError(createErrorInfo(index, error));
                    }
                    return createResult(null, false, !error, error);
                });
    });

    return when.apply(null, deferreds)
        .then(function() {
            const resArray = [].slice.call(arguments);
            if(resArray.some(res => res.success)) {
                onSuccess();
            }
            return resArray;
        });
};

module.exports = whenSome;
