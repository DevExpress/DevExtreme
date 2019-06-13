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
        arg = [ arg ];
    }

    const deferreds = arg.map((item, index) => {
        return when(item)
            .then(
                result => {
                    const resultObj = createResult(result, true);
                    if(resultObj.error && onError) {
                        onError(createErrorInfo(index, resultObj.error));
                    }

                    if(resultObj.success && onSuccess) {
                        onSuccess();
                    }
                },
                error => {
                    if(error) {
                        onError(createErrorInfo(index, error));
                    }
                });
    });

    return when.apply(null, deferreds);
};

module.exports = whenSome;
