import ajax from 'core/utils/ajax';
import { extend } from 'core/utils/extend';
import * as typeUtils from 'core/utils/type';
const $ = window.$;

const originSendRequest = ajax.sendRequest;
let urlMap = {};
const timers = [];

function findUrlOptions(requestUrl) {
    const result = urlMap[requestUrl] || urlMap['*'];

    if(result) {
        return result;
    }

    for(const url in urlMap) {
        if(url.endsWith('*') && requestUrl.startsWith(url.slice(0, -1))) {
            return urlMap[url];
        }
    }
}

function setup(options) {
    urlMap[options.url] = options;

    ajax.sendRequest = function(request) {
        const deferred = $.Deferred();
        const response = extend({}, request);
        const mockOptions = findUrlOptions(request.url);
        const jQueryTextStatus = mockOptions?.jQueryTextStatus;

        response.status = typeUtils.isDefined(mockOptions?.status) ? mockOptions.status : 200;
        response.statusText = mockOptions?.statusText || '200 OK';
        response.responseText = mockOptions?.responseText;

        if(typeof mockOptions?.callback === 'function') {
            mockOptions.callback.call(response, request);
        }

        timers.push(setTimeout(() => {
            if(
                response.status === 0 ||
                response.status === 404 ||
                jQueryTextStatus === 'parsererror'
            ) {
                response.error = jQueryTextStatus ? {} : { message: response.statusText };
                deferred.rejectWith(response, [response, jQueryTextStatus || 'error', mockOptions]);
            } else {
                deferred.resolveWith(response, [response.responseText, 'success']);
            }
        }));

        return deferred.promise();
    };
}

function clear() {
    ajax.sendRequest = originSendRequest;
    urlMap = {};
    timers.forEach(timerId => clearTimeout(timerId));
    timers.length = 0;
}

export { setup, clear };
