const ajax = require('core/utils/ajax');
const extend = require('core/utils/extend').extend;
const typeUtils = require('core/utils/type');
const $ = require('jquery');
const originSendRequest = ajax.sendRequest;
let urlMap = {};
const timers = [];

const findUrlOptions = function(requestUrl) {
    const result = urlMap[requestUrl] || urlMap['*'];

    if(result) {
        return result;
    }

    for(const url in urlMap) {
        if(url[url.length - 1] === '*' && requestUrl.indexOf(url.substr(0, url.length - 1)) === 0) {
            return urlMap[url];
        }
    }
};

exports.setup = function(options) {
    urlMap[options.url] = options;

    ajax.sendRequest = function(request) {
        const deferred = $.Deferred();
        const response = extend({ }, request);
        const mockOptions = findUrlOptions(request.url);
        const jQueryTextStatus = mockOptions.jQueryTextStatus;

        response.status = typeUtils.isDefined(mockOptions.status) ? mockOptions.status : 200;
        response.statusText = mockOptions.statusText || '200 OK';
        response.responseText = mockOptions.responseText;

        if(typeof mockOptions.callback === 'function') {
            mockOptions.callback.call(response, request);
        }

        timers.push(setTimeout(function() {
            if(response.status === 0 || response.status === 404 || jQueryTextStatus === 'parsererror') {
                response.error = jQueryTextStatus ? {} : { message: response.statusText };
                deferred.rejectWith(response, [ response, jQueryTextStatus || 'error', mockOptions]);
            } else {
                deferred.resolveWith(response, [response.responseText, 'success']);
            }
        }));

        return deferred.promise();
    };
};

exports.clear = function() {
    ajax.sendRequest = originSendRequest;
    urlMap = {};
    timers.forEach(function(timerId) {
        clearTimeout(timerId);
    });
};
