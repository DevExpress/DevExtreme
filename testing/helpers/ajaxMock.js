var ajax = require('core/utils/ajax');
var extend = require('core/utils/extend').extend;
var typeUtils = require('core/utils/type');
var $ = require('jquery');
var originSendRequest = ajax.sendRequest;
var urlMap = {};
var timers = [];

var findUrlOptions = function(requestUrl) {
    var result = urlMap[requestUrl] || urlMap['*'];

    if(result) {
        return result;
    }

    for(var url in urlMap) {
        if(url[url.length - 1] === '*' && requestUrl.indexOf(url.substr(0, url.length - 1)) === 0) {
            return urlMap[url];
        }
    }
};

exports.setup = function(options) {
    urlMap[options.url] = options;

    ajax.sendRequest = function(request) {
        var deferred = $.Deferred();
        var response = extend({ }, request);
        var mockOptions = findUrlOptions(request.url);
        var jQueryTextStatus = mockOptions.jQueryTextStatus;

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
