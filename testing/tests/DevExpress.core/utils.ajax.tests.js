"use strict";

var ajax = require("core/utils/ajax");
var browser = require("core/utils/browser");

QUnit.module("sendRequest", {
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

QUnit.test("Get JSON", function(assert) {
    var json = { foo: "bar" };
    var result;

    ajax.sendRequest({
        url: "/json-url",
        dataType: "json"
    }).done(function(data) {
        result = data;
    });

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];
    xhr.respond(200, { "Content-Type": "application/json" }, JSON.stringify(json));


    assert.equal(xhr.method, "GET");
    assert.equal(xhr.url, "/json-url");
    assert.deepEqual(result, json);
});

QUnit.test("responseType arraybuffer", function(assert) {
    if(browser.msie && parseInt(browser.version) < 10) {
        assert.expect(0);
        return;
    }

    var buffer = new ArrayBuffer(8);
    var result;

    ajax.sendRequest({
        url: "/binary-url",
        responseType: "arraybuffer"
    }).done(function(data) {
        result = data;
    });

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];

    assert.equal(xhr.method, "GET");
    assert.equal(xhr.url, "/binary-url");
    assert.equal(xhr.responseType, "arraybuffer");

    xhr.response = buffer;
    xhr.respond();

    assert.equal(result, buffer);
});

QUnit.test("upload events", function(assert) {
    var progressCallback = sinon.spy();
    var loadStartCallback = sinon.spy();
    var abortCallback = sinon.spy();
    var doneCallback = sinon.spy();

    ajax.sendRequest({
        url: "/file-url",
        method: "POST",
        upload: {
            "onprogress": progressCallback,
            "onloadstart": loadStartCallback,
            "onabort": abortCallback
        }
    }).done(doneCallback);

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];

    assert.equal(xhr.method, "POST");
    assert.equal(xhr.url, "/file-url");

    var e = {};

    xhr.upload["onprogress"](e);
    assert.equal(progressCallback.callCount, 1);
    assert.equal(progressCallback.getCall(0).args[0], e);

    xhr.upload["onloadstart"](e);
    assert.equal(loadStartCallback.callCount, 1);
    assert.equal(loadStartCallback.getCall(0).args[0], e);

    xhr.upload["onabort"](e);
    assert.equal(abortCallback.callCount, 1);
    assert.equal(abortCallback.getCall(0).args[0], e);

    xhr.respond();

    assert.equal(doneCallback.callCount, 1);
});

QUnit.test("upload fail", function(assert) {
    var failCallback = sinon.spy();
    var doneCallback = sinon.spy();

    ajax.sendRequest({
        url: "/fail-url",
        method: "POST",
        upload: { }
    }).fail(failCallback).done(doneCallback);

    var xhr = this.requests[0];
    xhr.respond(404);

    assert.equal(failCallback.callCount, 1);
    assert.strictEqual(failCallback.getCall(0).args[0], xhr);
    assert.equal(doneCallback.callCount, 0);
});

QUnit.test("Set request header", function(assert) {
    ajax.sendRequest({
        url: "/some-url",
        headers: { "Content-Type": "text/html", "Accept": "application/xml" },
        method: "GET"
    });

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];

    assert.equal(xhr.method, "GET");
    assert.equal(xhr.url, "/some-url");
    assert.equal(xhr.requestHeaders["Content-Type"], "text/html");
    assert.equal(xhr.requestHeaders["Accept"], "application/xml");
});

QUnit.test("Set request header and content-type", function(assert) {
    ajax.sendRequest({
        url: "/some-url",
        contentType: "multipart/form-data",
        headers: { "Content-Type": "text/html" },
        method: "GET"
    });

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];

    assert.equal(xhr.method, "GET");
    assert.equal(xhr.url, "/some-url");
    assert.equal(xhr.requestHeaders["Content-Type"], "multipart/form-data,text/html");
    assert.equal(xhr.requestHeaders["Accept"], "*/*");
});

QUnit.test("abort request", function(assert) {
    var failCallback = sinon.spy();

    var request = ajax.sendRequest({
        url: "/heavy-url",
        method: "GET"
    });

    request.fail(failCallback);

    request.abort();

    assert.equal(failCallback.callCount, 1);
});

QUnit.test("beforeSend called properly with an xhr object as an argument", function(assert) {
    var beforeSendCallback = sinon.spy();
    var request = ajax.sendRequest({
        url: "/some-url",
        method: "GET",
        beforeSend: beforeSendCallback
    });

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];

    assert.equal(beforeSendCallback.callCount, 1);
    assert.strictEqual(beforeSendCallback.getCall(0).args[0], xhr);

    request.abort();
});

QUnit.test("jsonp", function(assert) {
    var result;

    ajax.sendRequest({
        url: "/json-url",
        dataType: "jsonp",
        jsonp: "callback1"
    }).done(function(data) {
        result = data;
    });

    assert.equal(this.requests.length, 1);

    var xhr = this.requests[0];
    xhr.respond(200, { "Content-Type": "application/json" }, "callback1(1)");

    assert.deepEqual(result, 1);

});

QUnit.test("send data with request", function(assert) {
    this.clock.tick(123456789);
    ajax.sendRequest({
        url: "/some-url",
        data: { top: 20, skip: 5, filter: "%any value%" }
    });

    ajax.sendRequest({
        method: "post",
        url: "/some-url",
        data: { top: 20, skip: 5, filter: "%any value%" }
    });

    ajax.sendRequest({
        url: "/some-url?top=20",
        data: { skip: 5, filter: "%any value%" }
    });

    ajax.sendRequest({
        url: "/some-url",
        dataType: "jsonp",
        data: { skip: 5, filter: "%any value%" }
    });

    ajax.sendRequest({
        url: "/some-url",
        dataType: "jsonp",
        jsonp: "callback",
        data: { skip: 5, filter: "%any value%" }
    });

    ajax.sendRequest({
        url: "/some-url",
        jsonp: "callback",
        data: { skip: 5, filter: "%any value%" }
    });

    ajax.sendRequest({
        method: "put",
        url: "/some-url",
        data: { top: 20, skip: 5, filter: "%any value%" }
    });

    assert.equal(this.requests.length, 7);
    assert.equal(this.requests[0].url, "/some-url?top=20&skip=5&filter=%25any%20value%25");
    assert.equal(this.requests[0].requestBody, null);
    assert.equal(this.requests[1].url, "/some-url");
    assert.equal(this.requests[1].requestBody, "top=20&skip=5&filter=%25any%20value%25");
    assert.equal(this.requests[2].url, "/some-url?top=20&skip=5&filter=%25any%20value%25");
    assert.equal(this.requests[3].url, "/some-url?skip=5&filter=%25any%20value%25&%24format=json&%24callback=callback123456789&_=123456789");
    assert.equal(this.requests[4].url, "/some-url?skip=5&filter=%25any%20value%25&%24format=json&%24callback=callback&_=123456789");
    assert.equal(this.requests[5].url, "/some-url?skip=5&filter=%25any%20value%25&%24format=json&%24callback=callback&_=123456789");
    assert.equal(this.requests[6].url, "/some-url");
    assert.equal(this.requests[6].requestBody, "top=20&skip=5&filter=%25any%20value%25");
    assert.equal(this.requests[6].method, "put");
});

QUnit.test("headers for different dataTypes", function(assert) {
    var dataTypes = [
            { type: "", header: "*/*" },
            { type: "someType", header: "*/*" },
            { type: undefined, header: "*/*" },
            { type: null, header: "*/*" },
            { type: "*", header: "*/*" },
            { type: "text", header: "text/plain, */*; q=0.01" },
            { type: "html", header: "text/html, */*; q=0.01" },
            { type: "json", header: "application/json, text/javascript, */*; q=0.01" },
            { type: "xml", header: "application/xml, text/xml, */*; q=0.01" },
            { type: "jsonp", header: "*/*" }];

    for(var i in dataTypes) {
        ajax.sendRequest({
            url: "/some-url",
            dataType: dataTypes[i].type
        });
    }

    assert.equal(this.requests.length, dataTypes.length);

    for(var index in dataTypes) {
        assert.equal(this.requests[index].requestHeaders["Accept"], dataTypes[index].header);
    }

});

QUnit.test("post process of data with different dataType", function(assert) {
    var result = [],
        dataTypes = [
            { type: "json", response: "{ 'value': 1234 }", result: undefined },
            { type: "json", response: '{ "value": 1234 }', result: { "value": 1234 } },
            { type: "script", response: "var variable = 10;", result: undefined },
            { type: "text", response: "text text", result: "text text" }],
        error;
    var setResult = function(data) {
        result[i] = data;
    };

    var setError = function(e) {
        error = e;
    };

    for(var i in dataTypes) {
        ajax.sendRequest({
            url: "/json-url",
            dataType: dataTypes[i].type
        }).done(setResult).fail(setError);

        this.requests[i].respond(200, { "Content-Type": "application/json" }, dataTypes[i].response);
        assert.deepEqual(result[i], dataTypes[i].result);
    }

    assert.equal(this.requests.length, 4);
    /* global variable */
    assert.equal(variable, 10);
    assert.equal(error.message, "Unexpected token ' in JSON at position 2");

});
