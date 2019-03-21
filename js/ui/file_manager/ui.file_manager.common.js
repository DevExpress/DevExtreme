import { when } from "../../core/utils/deferred";

const whenSome = function(arg, onSuccess, onError) {
    const createResult = function(result, success, canceled, error) {
        return {
            result: result,
            success: success,
            canceled: canceled || false,
            error: error || null
        };
    };

    const createErrorInfo = function(index, error) {
        return {
            index: index,
            error: error
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
