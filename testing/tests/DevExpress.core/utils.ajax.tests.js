var $ = require('jquery');
var ajax = require('core/utils/ajax');
var compareVersion = require('core/utils/version').compare;

QUnit.module('sendRequest', {
    beforeEach: function() {
        this.xhr = sinon.useFakeXMLHttpRequest();
        var requests = this.requests = [];

        this.xhr.onCreate = function(xhr) {
            requests.push(xhr);
        };
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.xhr.restore();
        this.clock.restore();
    }
});

QUnit.test('cache=false for dataType=json (cross domain)', function(assert) {
    var json = { foo: 'bar' };
    var crossDomainResult;

    ajax.sendRequest({
        url: 'http://example.com/json-url',
        dataType: 'json',
        cache: false
    }).done(function(data) {
        crossDomainResult = data;
    });

    var xhr = this.requests[0];
    xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(json));

    assert.deepEqual(crossDomainResult, json);
});

QUnit.test('Get JSON', function(assert) {
    var json = { foo: 'bar' };
    var result;

    ajax.sendRequest({
        url: '/json-url',
        dataType: 'json'
    }).done(function(data) {
        result = data;
    });

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];
    xhr.respond(200, { 'Content-Type': 'application/json' }, JSON.stringify(json));


    assert.equal(xhr.method, 'GET');
    assert.equal(xhr.url, '/json-url');
    assert.deepEqual(result, json);
});

QUnit.test('responseType arraybuffer', function(assert) {
    var buffer = new ArrayBuffer(8);
    var result;

    ajax.sendRequest({
        url: '/binary-url',
        responseType: 'arraybuffer'
    }).done(function(data) {
        result = data;
    });

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];

    assert.equal(xhr.method, 'GET');
    assert.equal(xhr.url, '/binary-url');
    assert.equal(xhr.responseType, 'arraybuffer');

    xhr.response = buffer;
    xhr.respond();

    assert.equal(result, buffer);
});

QUnit.test('upload events', function(assert) {
    var progressCallback = sinon.spy();
    var loadStartCallback = sinon.spy();
    var abortCallback = sinon.spy();
    var doneCallback = sinon.spy();

    ajax.sendRequest({
        url: '/file-url',
        method: 'POST',
        upload: {
            'onprogress': progressCallback,
            'onloadstart': loadStartCallback,
            'onabort': abortCallback
        }
    }).done(doneCallback);

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];

    assert.equal(xhr.method, 'POST');
    assert.equal(xhr.url, '/file-url');

    var e = {};

    xhr.upload['onprogress'](e);
    assert.equal(progressCallback.callCount, 1);
    assert.equal(progressCallback.getCall(0).args[0], e);

    xhr.upload['onloadstart'](e);
    assert.equal(loadStartCallback.callCount, 1);
    assert.equal(loadStartCallback.getCall(0).args[0], e);

    xhr.upload['onabort'](e);
    assert.equal(abortCallback.callCount, 1);
    assert.equal(abortCallback.getCall(0).args[0], e);

    xhr.respond();

    assert.equal(doneCallback.callCount, 1);
});

QUnit.test('upload fail', function(assert) {
    var failCallback = sinon.spy();
    var doneCallback = sinon.spy();

    ajax.sendRequest({
        url: '/fail-url',
        method: 'POST',
        upload: { }
    }).fail(failCallback).done(doneCallback);

    var xhr = this.requests[0];
    xhr.respond(404);

    assert.equal(failCallback.callCount, 1);
    assert.strictEqual(failCallback.getCall(0).args[0], xhr);
    assert.equal(doneCallback.callCount, 0);
});

QUnit.test('Set request header', function(assert) {
    ajax.sendRequest({
        url: '/some-url',
        headers: { 'Content-Type': 'text/html', 'Accept': 'application/xml' },
        method: 'GET'
    });

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];

    assert.equal(xhr.method, 'GET');
    assert.equal(xhr.url, '/some-url');
    assert.equal(xhr.requestHeaders['Content-Type'], 'text/html');
    assert.equal(xhr.requestHeaders['Accept'], 'application/xml');
    assert.equal(xhr.requestHeaders['X-Requested-With'], 'XMLHttpRequest');
});

QUnit.test('Set request header and content-type', function(assert) {
    ajax.sendRequest({
        url: '/some-url',
        contentType: 'multipart/form-data',
        headers: { 'Content-Type': 'text/html' },
        method: 'GET'
    });

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];

    assert.equal(xhr.method, 'GET');
    assert.equal(xhr.url, '/some-url');
    assert.equal(xhr.requestHeaders['Content-Type'], 'text/html');
    assert.equal(xhr.requestHeaders['Accept'], '*/*');
});

QUnit.test('Set request header for upload', function(assert) {

    ajax.sendRequest({
        url: '/some-url',
        method: 'POST',
        upload: {}
    });

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];

    assert.equal(xhr.method, 'POST');
    assert.equal(xhr.url, '/some-url');
    assert.equal(xhr.requestHeaders['Content-Type'], 'text/plain;charset=utf-8');
    assert.equal(xhr.requestHeaders['Accept'], '*/*');
});

QUnit.test('Default Content-Type', function(assert) {
    ajax.sendRequest({
        url: '/some-url'
    });
    ajax.sendRequest({
        url: '/some-url',
        data: { q: 1 }
    });
    ajax.sendRequest({
        url: '/some-url',
        data: { q: 1 },
        method: 'post'
    });

    assert.equal(this.requests.length, 3);

    var xhr1 = this.requests[0],
        xhr2 = this.requests[1],
        xhr3 = this.requests[2];

    assert.equal(xhr1.method, 'GET');
    assert.equal(xhr1.url, '/some-url');
    assert.equal(xhr1.requestHeaders['Content-Type'], undefined);
    assert.equal(xhr1.requestHeaders['Accept'], '*/*');

    assert.equal(xhr2.requestHeaders['Content-Type'], undefined);

    assert.equal(xhr3.method, 'POST');
    assert.equal(xhr3.requestHeaders['Content-Type'], 'application/x-www-form-urlencoded;charset=utf-8');
});

QUnit.test('abort request', function(assert) {
    var failCallback = sinon.spy();

    var request = ajax.sendRequest({
        url: '/heavy-url',
        method: 'GET'
    });

    request.fail(failCallback);

    request.abort();

    assert.equal(failCallback.callCount, 1);
});

QUnit.test('beforeSend called properly with an xhr object as an argument', function(assert) {
    var beforeSendCallback = sinon.spy(),
        xhr;
    var request = ajax.sendRequest({
        url: '/some-url',
        method: 'GET',
        beforeSend: beforeSendCallback
    }).done(function(data, status, jqXhr) {
        xhr = jqXhr;
    });

    this.requests[0].respond(200, { 'Content-Type': 'text/html' }, 'data');
    assert.equal(this.requests.length, 1);

    xhr = xhr || this.requests[0]; // jquery || no-jquery

    assert.equal(beforeSendCallback.callCount, 1);
    assert.strictEqual(beforeSendCallback.getCall(0).args[0], xhr);

    request.abort();
});

QUnit.test('Jsonp request (same domain)', function(assert) {

    var result,
        expectedUrlStart = '/json-url?callback1=callbackName&_=';

    ajax.sendRequest({
        url: '/json-url',
        dataType: 'jsonp',
        jsonp: 'callback1',
        jsonpCallback: 'callbackName'
    }).done(function(data) {
        result = data;
    });

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];
    xhr.respond(200, { 'Content-Type': 'application/json' }, 'callbackName(1)');
    assert.ok(xhr.url.indexOf(expectedUrlStart) === 0, 'url: ' + xhr.url);

    var noCache = xhr.url.substring(expectedUrlStart.length);
    assert.ok(noCache.length > 0);

    assert.equal(result, 1);

});

QUnit.test('Send data with request (jsonp)', function(assert) {

    var random = sinon.stub(Math, 'random', function() {
        return 0.5555555555;
    });

    function parseUrl(url) {
        var params = {},
            urlParts = url.split('?')[1].split('&');

        for(var i = 0; i < urlParts.length; i++) {
            var paramParts = urlParts[i].split('=');
            params[paramParts[0]] = paramParts[1];
        }

        return params;
    }

    function getCallbackName(url) {
        return parseUrl(url)['callback'];
    }

    function getHash(url) {
        return parseUrl(url)['_'];
    }

    ajax.sendRequest({
        url: '/some-url',
        data: { top: 20, skip: 5, filter: '%any value%' },
        jsonpCallback: 'callback',
        dataType: 'jsonp'
    });

    ajax.sendRequest({
        url: '/some-url',
        data: { top: 20, skip: 5, filter: '%any value%' },
        dataType: 'jsonp'
    });

    var callbackName = getCallbackName(this.requests[0].url);
    assert.ok(callbackName === 'callback', 'callback name: ' + callbackName);
    assert.ok(getHash(this.requests[0].url).length > 0);

    callbackName = getCallbackName(this.requests[1].url);
    assert.ok(callbackName.indexOf('jQuery') === 0 || callbackName.indexOf('dxCallback') === 0, 'callback name: ' + callbackName);
    assert.ok(getHash(this.requests[1].url).length > 0);

    random.restore();
});

QUnit.test('Send data with request (cached resources)', function(assert) {

    var testData = [
        {
            // sendRequest options

            // xhr object parameters
            url: '/some-url?top=20&skip=5&filter=%25any%20value%25', requestBody: null
        },
        {
            // sendRequest options
            method: 'post',
            // xhr object parameters
            url: '/some-url', requestBody: 'top=20&skip=5&filter=%25any+value%25'
        },
        {
            // sendRequest options
            optionUrl: '/some-url?filter=eq(20)',
            // xhr object parameters
            url: '/some-url?filter=eq(20)&top=20&skip=5&filter=%25any%20value%25', requestBody: null
        },
        {
            // sendRequest options
            jsonp: 'callback1', jsonpCallback: 'callbackName',
            // xhr object parameters
            url: '/some-url?top=20&skip=5&filter=%25any%20value%25', requestBody: null
        },
        {
            // sendRequest options
            method: 'put',
            // xhr object parameters
            url: '/some-url', requestBody: 'top=20&skip=5&filter=%25any+value%25'
        },
        {
            // sendRequest options
            method: 'post', contentType: 'text/html',
            // xhr object parameters
            url: '/some-url', requestBody: 'top=20&skip=5&filter=%25any%20value%25'
        },
        {
            // sendRequest options
            contentType: 'application/x-www-form-urlencoded',
            // xhr object parameters
            url: '/some-url?top=20&skip=5&filter=%25any%20value%25', requestBody: null
        }
    ];

    for(var i = 0; i < testData.length; i++) {
        ajax.sendRequest({
            url: testData[i].optionUrl || '/some-url',
            data: { top: 20, skip: 5, filter: '%any value%' },
            jsonp: testData[i].jsonp,
            jsonpCallback: testData[i].jsonpCallback,
            method: testData[i].method,
            dataType: testData[i].dataType,
            contentType: testData[i].contentType
        });
        // https://github.com/jquery/jquery/issues/2658
        if(compareVersion($.fn.jquery, [3], 1) < 0) {
            if(testData[i].requestBody) {
                testData[i].requestBody = testData[i].requestBody.replace('%20', '+');
            }
            testData[i].url = testData[i].url.replace('%20', '+');
        }
        assert.equal(this.requests[i].url, testData[i].url, 'url for element ' + i + ' from test data');
        assert.equal(this.requests[i].requestBody, testData[i].requestBody, 'requestBody for element ' + i + ' from test data');
    }

    assert.equal(this.requests.length, 7, 'Number of requests');
    assert.equal(this.requests[4].method, 'PUT', 'Check method name');
});

QUnit.test('Accept headers for different dataTypes', function(assert) {
    var dataTypes = [
        { type: '', header: '*/*' },
        { type: 'someType', header: '*/*' },
        { type: undefined, header: '*/*' },
        { type: null, header: '*/*' },
        { type: '*', header: '*/*' },
        { type: 'text', header: 'text/plain, */*; q=0.01' },
        { type: 'html', header: 'text/html, */*; q=0.01' },
        { type: 'json', header: 'application/json, text/javascript, */*; q=0.01' },
        { type: 'xml', header: 'application/xml, text/xml, */*; q=0.01' },
        { type: 'script', header: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01' },
        { type: 'jsonp', header: 'text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01' }];

    for(var i = 0; i < dataTypes.length; i++) {
        ajax.sendRequest({
            url: '/some-url',
            dataType: dataTypes[i].type
        });
    }

    assert.equal(this.requests.length, dataTypes.length);

    for(var index = 0; index < dataTypes.length; index++) {
        assert.equal(this.requests[index].requestHeaders['Accept'], dataTypes[index].header);
    }

});

QUnit.test('OData accept header', function(assert) {
    ajax.sendRequest({
        url: '/some-url',
        dataType: 'json',
        contentType: 'application/json;odata=verbose',
        accepts: {
            json: ['application/json;odata=verbose', 'text/plain'].join()
        }
    });

    assert.equal(this.requests.length, 1);

    assert.equal(this.requests[0].requestHeaders['Accept'], 'application/json;odata=verbose,text/plain, */*; q=0.01');

});

QUnit.test('empty url', function(assert) {
    ajax.sendRequest({
        url: ''
    });

    assert.equal(this.requests.length, 1);
    assert.equal(this.requests[0].url, location.href);
});

QUnit.test('Post process of data with different dataType (same domain)', function(assert) {
    var result = [],
        dataTypes = [
            { type: 'json', response: '{ \'value\': 1234 }', result: undefined },
            { type: 'json', response: '{ "value": 1234 }', result: { 'value': 1234 } },
            { type: 'script', response: 'var variable = 10;', result: 'var variable = 10;' },
            { type: 'text', response: 'text text', result: 'text text' }
        ],
        error,
        status;
    var setResult = function(data) {
        result[i] = data;
    };

    var setError = function(xhr, statusText, e) {
        error = e;
        status = statusText;
    };

    for(var i = 0; i < dataTypes.length; i++) {
        ajax.sendRequest({
            url: '/json-url',
            dataType: dataTypes[i].type
        }).done(setResult).fail(setError);

        this.requests[i].respond(200, { 'Content-Type': 'application/json' }, dataTypes[i].response);
        assert.deepEqual(result[i], dataTypes[i].result);
    }

    assert.equal(this.requests.length, 4);
    /* global variable */
    assert.equal(variable, 10);
    assert.ok(error.message.length > 0);
    assert.equal(status, 'parsererror');

});

QUnit.test('Synchronous request', function(assert) {
    ajax.sendRequest({
        url: '/json-url',
        async: false,
        timeout: 1000 // is not valid for sync request
    });

    assert.equal(this.requests.length, 1);
    assert.equal(this.requests[0].async, false);
});

QUnit.test('xhrFields', function(assert) {
    ajax.sendRequest({
        url: '/json-url',
        xhrFields: { withCredentials: true }
    });

    assert.equal(this.requests.length, 1);
    assert.equal(this.requests[0].withCredentials, true);
});

QUnit.test('X-Requested-With headers (no cors)', function(assert) {

    var testData = [
        { url: './', crossDomain: false },
        { url: '/some-url', crossDomain: false },
        { url: location.origin + '/some-url', crossDomain: false }
    ];

    for(var i = 0; i < testData.length; i++) {
        ajax.sendRequest({
            url: testData[i].url
        });

        assert.equal(this.requests[i].requestHeaders['X-Requested-With'], 'XMLHttpRequest');
    }
});

QUnit.test('X-Requested-With headers (cors)', function(assert) {

    var testData = [
        { url: 'http://example.com:80', crossDomain: true },
        { url: 'http://example.com:80x', crossDomain: true }
    ];

    for(var i = 0; i < testData.length; i++) {
        ajax.sendRequest({
            url: testData[i].url
        });
        // jQuery checks cors support on start and doesn't create xhr object on $.ajax call
        assert.notOk(this.requests[i] && this.requests[i].requestHeaders['X-Requested-With']);
    }
});

QUnit.test('nocontent status check', function(assert) {

    var status;

    ajax.sendRequest({
        url: '/json-url'
    }).done(function(data, statusText) {
        status = statusText;
    });

    this.requests[0].respond(204, { 'Content-Type': 'application/json' }, '');
    assert.equal(status, 'nocontent');
});

QUnit.test('Handle timeout', function(assert) {

    var status;

    ajax.sendRequest({
        url: '',
        timeout: 1
    }).done(function(data, statusText) {
        status = statusText;
    }).fail(function(xhr, statusText) {
        status = statusText;
    });
    this.clock.tick(20);

    assert.equal(status, 'timeout');
});

QUnit.test('cache=false for dataType=json', function(assert) {
    ajax.sendRequest({
        url: 'any',
        dataType: 'json',
        cache: false
    });

    assert.ok(/_=\d+/.test(this.requests[0].url));
});

QUnit.test('cache=false, POST string', function(assert) {
    var options = {
        url: '/',
        dataType: 'json',
        cache: false
    };

    // customization (e.g. onBeforeSend in DevExtreme.AspNet.Data)
    options.method = 'POST';
    options.data = 'payload';

    ajax.sendRequest(options);

    var xhr = this.requests[0];
    assert.equal(xhr.url, '/');
    assert.equal(xhr.requestBody, 'payload');
});

QUnit.test('xhr is available in done', function(assert) {
    var xhrCount = 0;
    var requests = this.requests;

    function check(dataType, statusCode, responseText, options) {
        options = options || { };
        options.dataType = dataType;

        ajax.sendRequest(options).done(function(data, statusText, xhr) {
            if('getResponseHeader' in xhr) {
                xhrCount++;
            }
        });

        requests.pop().respond(statusCode, { }, responseText);
    }

    check('json', 200, '{}');
    check('jsonp', 200, 'cb({})', { jsonpCallback: 'cb' });
    check('script', 200, ';');
    check('text', 200, '');
    check(null, 204, null);

    assert.equal(xhrCount, 5);
});

QUnit.test('special values in data', function(assert) {
    ajax.sendRequest({
        url: 'any',
        data: {
            a: undefined,
            b: null,
            c: NaN
        }
    });

    var url = this.requests[0].url;

    // undefined values are excluded
    assert.ok(url.indexOf('a=') < 0);

    // null values included as empty strings
    assert.ok(url.indexOf('b=') > -1);
    assert.ok(url.indexOf('b=null') < 0);

    // NaN values are kept
    assert.ok(url.indexOf('c=NaN') > -1);
});

QUnit.test('empty data', function(assert) {
    ajax.sendRequest({
        url: 'any',
        data: {}
    });

    assert.equal(this.requests[0].url, 'any');
});

QUnit.module('sendRequest async tests');

QUnit.test('Handle error', function(assert) {

    var done = assert.async();

    ajax.sendRequest({
        url: 'http://devexpress.noresolve/'
    }).fail(function(xhr, statusText) {
        assert.equal(statusText, 'error');
        done();
    });
});

QUnit.test('Script request (cross domain)', function(assert) {

    if(!compareVersion($.fn.jquery, [1], 1)) {
        assert.expect(0);
        return;
    }

    var wrongRemoteUrl = 'http://somefakedomain1221.com/json-url',
        fail = assert.async(),

        appendChild = sinon.spy(document.head, 'appendChild'),
        removeChild = sinon.spy(document.head, 'removeChild'),
        createElement = sinon.spy(document, 'createElement');

    ajax.sendRequest({
        url: wrongRemoteUrl,
        dataType: 'script'
    }).fail(function(data, statusText) {
        assert.equal(statusText, 'error');

        assert.ok(createElement.calledWith('script'));
        assert.equal(appendChild.callCount, 1);
        assert.equal(removeChild.callCount, 1);

        var addedScript = appendChild.firstCall.args[0];

        assert.ok(addedScript.src.indexOf('http://somefakedomain1221.com/json-url?_=') === 0, 'url: ' + addedScript.src);

        appendChild.restore();
        createElement.restore();
        fail();
    });

});
