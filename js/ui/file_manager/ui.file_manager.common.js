import { when, Deferred } from '../../core/utils/deferred';
import { noop } from '../../core/utils/common';
import typeUtils from '../../core/utils/type';

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

const getDisplayFileSize = function(byteSize) {
    const sizesTitles = [ 'B', 'KB', 'MB', 'GB', 'TB' ];
    let index = 0;
    let displaySize = byteSize;
    while(displaySize >= 1024 && index <= sizesTitles.length - 1) {
        displaySize /= 1024;
        index++;
    }
    displaySize = Math.round(displaySize * 10) / 10;
    return `${displaySize} ${sizesTitles[index]}`;
};

module.exports = whenSome;
module.exports.getDisplayFileSize = getDisplayFileSize;
