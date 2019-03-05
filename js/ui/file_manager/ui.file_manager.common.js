import { when } from "../../core/utils/deferred";

var whenSome = function(arg, onSuccess, onError) {
    var createResult = function(result, success, canceled, error) {
        return {
            result: result,
            success: success,
            canceled: canceled || false,
            error: error || null
        };
    };

    var createErrorInfo = function(index, error) {
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

    var deferreds = arg.map((item, index) => {
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
            var resArray = [].slice.call(arguments);
            if(resArray.some(res => res.success)) {
                onSuccess();
            }
            return resArray;
        });
};

module.exports = whenSome;
