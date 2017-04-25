"use strict";

var $ = require("jquery"),
    browser = require("core/utils/browser"),
    EdmLiteral = require("data/odata/utils").EdmLiteral,
    ODataStore = require("data/odata/store"),
    ODataContext = require("data/odata/context"),
    Guid = require("core/guid"),
    ErrorHandlingHelper = require("../../helpers/data.errorHandlingHelper.js");

require("../../../node_modules/jquery-mockjax/dist/jquery.mockjax.js");

var MUST_NOT_REACH_MESSAGE = "Shouldn't reach this point";

var moduleConfig = {
    beforeEach: function() {
        this.originalResponseTime = $.mockjaxSettings.responseTime;
        this.originalThrowUnmocked = $.mockjaxSettings.throwUnmocked;

        $.mockjaxSettings.responseTime = 0;
        $.mockjaxSettings.throwUnmocked = true;
    },

    afterEach: function() {
        $.mockjaxSettings.responseTime = this.originalResponseTime;
        $.mockjaxSettings.throwUnmocked = this.originalThrowUnmocked;

        $.mockjax.clear();
    }
};

QUnit.module("ctor");
QUnit.test("use second version by default", function(assert) {
    assert.expect(2);

    assert.equal(new ODataStore({ url: "odata.org/EntitySet/" }).version(), 2);
    assert.equal(new ODataContext({ url: "odata.org/EntitySet/" }).version(), 2);
});

// TODO: Publish `url` method
//QUnit.test("strips trailing slash", function(assert) {
//    assert.expect(1);
//    assert.equal(new ODataStore({ url: "odata.org/EntitySet/" }).url(), "odata.org/EntitySet");
//});

QUnit.module("load", moduleConfig);
QUnit.test("works", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata2.org",
        response: function(bag) { this.responseText = { d: { results: [bag] } }; }
    });

    $.mockjax({
        url: "odata4.org",
        response: function(bag) { this.responseText = { value: [bag] }; }
    });

    var promises = [
        new ODataStore({ url: "odata2.org" })
            .load()
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, [{
                    accepts: { "json": "application/json;odata=verbose,text/plain" },
                    async: true,
                    contentType: false,
                    crossDomain: false,
                    data: {},
                    dataType: "json",
                    headers: {},
                    timeout: 30000,
                    type: "get",
                    url: "odata2.org",
                    xhrFields: {}
                }]);
            }),

        new ODataStore({ version: 3, url: "odata2.org" })
            .load()
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, [{
                    accepts: { "json": "application/json;odata=verbose,text/plain" },
                    async: true,
                    contentType: false,
                    crossDomain: false,
                    data: {},
                    dataType: "json",
                    headers: {},
                    timeout: 30000,
                    type: "get",
                    url: "odata2.org",
                    xhrFields: {}
                }]);
            }),

        new ODataStore({ version: 4, url: "odata4.org" })
            .load()
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, [{
                    accepts: { "json": "application/json;odata=verbose,text/plain" },
                    async: true,
                    contentType: false,
                    crossDomain: false,
                    data: {},
                    dataType: "json",
                    headers: {},
                    timeout: 30000,
                    type: "get",
                    url: "odata4.org",
                    xhrFields: {}
                }]);
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("with params", function(assert) {
    assert.expect(6);

    var done = assert.async();

    $.mockjax({
        url: "odata2.org",
        response: function(bag) {
            this.responseText = { d: { results: [bag.data] } };
        }
    });

    $.mockjax({
        url: "odata4.org(e=4)",
        response: function(bag) {
            this.responseText = { value: [bag.data] };
        }
    });

    var options = {
        sort: {
            field: "a",
            desc: true
        },
        filter: ["b", 1],
        select: ["c", "d"],
        customQueryParams: { e: 4 }
    };

    var promises = [
        new ODataStore({ url: "odata2.org" })
            .load(options)
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, [{
                    "$orderby": "a desc",
                    "$filter": "b eq 1",
                    "$select": "c,d",
                    e: "4"
                }]);
            }),

        new ODataStore({ version: 3, url: "odata2.org" })
            .load(options)
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, [{
                    "$orderby": "a desc",
                    "$filter": "b eq 1",
                    "$select": "c,d",
                    e: "4"
                }]);
            }),

        new ODataStore({ version: 4, url: "odata4.org" })
            .load(options)
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, [{
                    "$orderby": "a desc",
                    "$filter": "b eq 1",
                    "$select": "c,d"
                }]);
            }),
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("with explicit expand", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        response: function(bag) {
            this.responseText = { d: { results: [bag.data["$expand"]] } };
        }
    });

    $.mockjax({
        url: "odata4.org",
        response: function(bag) {
            this.responseText = { value: [bag.data["$expand"]] };
        }
    });

    var options = { expand: ["a", "b.c"] };

    var promises = [
        new ODataStore({ url: "odata.org" })
            .load(options)
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, ["a,b/c"]);
            }),

        new ODataStore({ version: 4, url: "odata4.org" })
            .load(options)
            .done(function(r, extra) {
                assert.ok(!extra);
                assert.deepEqual(r, ["a,b($expand=c)"]);
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("with requireTotalCount", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        response: function(bag) {
            this.responseText = { d: { results: [bag.data["$inlinecount"]], "__count": 123 } };
        }
    });

    $.mockjax({
        url: "odata4.org",
        response: function(bag) {
            this.responseText = { value: [bag.data["$count"]], "@odata.count": 123 };
        }
    });

    var promises = [
        new ODataStore({ url: "odata.org" })
            .load({ requireTotalCount: true })
            .done(function(r, extra) {
                assert.deepEqual(r, ["allpages"]);
                assert.deepEqual(extra, {
                    totalCount: 123
                });
            }),

        new ODataStore({ version: 4, url: "odata4.org" })
            .load({ requireTotalCount: true })
            .done(function(r, extra) {
                assert.deepEqual(r, ["true"]);
                assert.deepEqual(extra, {
                    totalCount: 123
                });
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.module("totalCount", moduleConfig);
QUnit.test("works", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata2.org",
        responseText: { d: { "__count": 123 } }
    });

    $.mockjax({
        url: "odata4.org",
        responseText: { "@odata.count": 123 }
    });

    var assertFunc = function(count) { assert.equal(count, 123); };
    var promises = [
        new ODataStore({ url: "odata2.org" })
            .totalCount()
            .done(assertFunc),

        new ODataStore({ version: 3, url: "odata2.org" })
            .totalCount()
            .done(assertFunc),

        new ODataStore({ version: 4, url: "odata4.org" })
            .totalCount()
            .done(assertFunc)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});
QUnit.test("respects customQueryParams (T413790)", function(assert) {
    var done = assert.async(),
        capturedAjaxSettings;

    $.mockjax({
        url: "example.com",
        response: function(settings) {
            capturedAjaxSettings = settings;
            this.responseText = {
                d: { __count: 123 }
            };
        }
    });

    new ODataStore({ url: "example.com" })
        .totalCount({
            customQueryParams: {
                p1: 42
            }
        })
        .done(function(count) {
            assert.equal(count, 123);
            assert.equal(capturedAjaxSettings.data.p1, 42);
            done();
        });
});

QUnit.module("byKey", moduleConfig);
QUnit.test("works", function(assert) {
    assert.expect(3);

    var done = assert.async();

    $.mockjax({
        url: "odata2.org(42)",
        responseText: { d: { foo: "bar" } }
    });

    $.mockjax({
        url: "odata4.org(42)",
        responseText: { value: { foo: "bar" } }
    });

    var assertFunc = function(r) { assert.deepEqual(r, { foo: "bar" }); };
    var promises = [
        new ODataStore({ url: "odata2.org" })
            .byKey(42)
            .done(assertFunc),

        new ODataStore({ version: 3, url: "odata2.org" })
            .byKey(42)
            .done(assertFunc),

        new ODataStore({ version: 4, url: "odata4.org" })
            .byKey(42)
            .done(assertFunc)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("with expand", function(assert) {
    assert.expect(3);

    var done = assert.async();

    $.mockjax({
        url: "odata2.org(42)",
        response: function(bag) {
            this.responseText = { d: { expandClause: bag.data.$expand } };
        }
    });

    $.mockjax({
        url: "odata4.org(42)",
        response: function(bag) {
            this.responseText = { value: { expandClause: bag.data.$expand } };
        }
    });

    var assertFunc = function(r) {
        assert.deepEqual(r, { expandClause: "prop1/subprop,prop2" });
    };

    var promises = [
        new ODataStore({ url: "odata2.org" })
            .byKey(42, { expand: ["prop1.subprop", "prop2"] })
            .done(assertFunc),

        new ODataStore({ version: 3, url: "odata2.org" })
            .byKey(42, { expand: ["prop1.subprop", "prop2"] })
            .done(assertFunc),

        new ODataStore({ version: 4, url: "odata4.org" })
            .byKey(42, { expand: ["prop1.subprop", "prop2"] })
            .done(assertFunc)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("compound key", function(assert) {
    assert.expect(3);

    var done = assert.async();

    $.mockjax({
        url: "odata2.org*",
        response: function(bag) {
            this.responseText = { d: { url: bag.url } };
        }
    });

    $.mockjax({
        url: "odata4.org*",
        response: function(bag) {
            this.responseText = { value: { url: bag.url } };
        }
    });

    var assertFunc = function(r) {
        var url = decodeURIComponent(r.url);
        assert.equal(url.indexOf("(key1=42,key2='abc')"), 10);
    };

    var promises = [
        new ODataStore({ url: "odata2.org" })
            .byKey({ key1: 42, key2: "abc" })
            .done(assertFunc),

        new ODataStore({ version: 3, url: "odata2.org" })
            .byKey({ key1: 42, key2: "abc" })
            .done(assertFunc),

        new ODataStore({ version: 4, url: "odata4.org" })
            .byKey({ key1: 42, key2: "abc" })
            .done(assertFunc)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("original compound key value doesn't change", function(assert) {
    var done = assert.async();

    var key = { key1: 37, key2: 73 };

    $.mockjax({
        url: "*",
        response: function(bag) {
            this.responseText = { value: bag };
        }
    });

    new ODataStore({ version: 4, url: "odata.org", keyType: { key1: "Decimal", key2: "Single" } })
        .byKey(key)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.deepEqual(key, { key1: 37, key2: 73 });
        })
        .always(done);
});

QUnit.test("unknown key type throws", function(assert) {
    assert.throws(function() {
        new ODataStore({ keyType: "?" }).byKey(1);
    });
});

QUnit.test("Guid as key", function(assert) {
    var done = assert.async();

    var guid = "3f17117f-63b1-ee7d-2b64-a7f717177773";

    $.mockjax({
        url: "odata2.org*",
        response: function(bag) {
            this.responseText = { d: { url: bag.url } };
        }
    });

    $.mockjax({
        url: "odata4.org*",
        response: function(bag) {
            this.responseText = { value: { url: bag.url } };
        }
    });

    var promises = [
        new ODataStore({ url: "odata2.org" })
            .byKey(new Guid(guid))
            .done(function(r) {
                assert.ok(r.url.indexOf("(guid'" + guid + "')") > -1);
            }),

        new ODataStore({ version: 3, url: "odata2.org" })
            .byKey(new Guid(guid))
            .done(function(r) {
                assert.ok(r.url.indexOf("(guid'" + guid + "')") > -1);
            }),

        new ODataStore({ version: 4, url: "odata2.org" })
            .byKey(new Guid(guid))
            .done(function(r) {
                assert.ok(r.url.indexOf("(guid'" + guid + "')") === -1);
                assert.ok(r.url.indexOf(guid) > 1);
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("key type conversions", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org*",
        response: function(bag) {
            this.responseText = { d: { url: bag.url } };
        }
    });

    $.mockjax({
        url: "odata4.org*",
        response: function(bag) {
            this.responseText = { url: bag.url };
        }
    });

    var promises = [
        // v2 and v3
        new ODataStore({ url: "odata.org", keyType: "Int32" })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf("(42)") > -1);
            }),

        new ODataStore({ url: "odata.org", keyType: "Int64" })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf("(42L)") > -1);
            }),

        new ODataStore({ url: "odata.org", keyType: "Guid" })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf("(guid'42000000-0000-0000-0000-000000000000')") > -1);
            }),

        new ODataStore({ url: "odata.org", keyType: "String" })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf("('42')") > -1);
            }),

        // v4
        new ODataStore({ version: 4, url: "odata4.org", keyType: "Int32" })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf("(42)") > -1);
            }),

        new ODataStore({ version: 4, url: "odata4.org", keyType: "Int64" })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf("(42L)") > -1);
            }),

        new ODataStore({ version: 4, url: "odata4.org", keyType: "Guid" })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf("(42000000-0000-0000-0000-000000000000)") > -1);
            }),

        new ODataStore({ version: 4, url: "odata4.org", keyType: "String" })
            .byKey(42)
            .done(function(r) {
                assert.ok(decodeURIComponent(r.url).indexOf("('42')") > -1);
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("no double conversion for Int64", function(assert) {
    assert.expect(2);

    var done = assert.async();

    $.mockjax({
        url: "odata2.org*",
        response: function(bag) { this.responseText = { d: { url: bag.url } }; }
    });

    $.mockjax({
        url: "odata4.org*",
        response: function(bag) { this.responseText = { url: bag.url }; }
    });


    var assertFunc = function(r) { assert.ok(r.url.indexOf("(123L)") > -1); };
    var promises = [
        new ODataStore({ url: "odata2.org", keyType: "Int64" })
            .byKey(new EdmLiteral("123L"))
            .done(assertFunc),

        new ODataStore({ version: 4, url: "odata2.org", keyType: "Int64" })
            .byKey(new EdmLiteral("123L"))
            .done(assertFunc)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});


QUnit.module("insert", moduleConfig);
QUnit.test("requires key", function(assert) {
    assert.throws(function() {
        new ODataStore({ url: "odata.org" }).insert({});
    });
});

QUnit.test("works", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        type: "post",
        // NOTE:
        // A request returns 204 No Content if the requested resource has the null value, or if the service applies a return=minimal preference.
        // In this case, the response body MUST be empty.
        responseText: { id: 1, foo: "bar" }
    });

    var logger = [];
    var store = new ODataStore({
        key: "id",
        url: "odata.org",

        beforeSend: function(request) {
            assert.equal(request.url, "odata.org");
            assert.equal(request.method.toLowerCase(), "post");
        },

        onInserting: function(data) { logger.push(["onInserting", data]); },
        onInserted: function(data, key) { logger.push(["onInserted", data, key]); }
    });

    store.on("inserting", function(data) { logger.push(["inserting", data]); });
    store.on("inserted", function(data, key) { logger.push(["inserted", data, key]); });

    store.insert({ id: 1, foo: "bar" })
        .fail(function() { assert.fail(false, MUST_NOT_REACH_MESSAGE); })
        .done(function(data, key) { logger.push(["done", data, key]); })
        .done(function() {
            assert.deepEqual(logger, [
                ["onInserting", { id: 1, foo: "bar" }],
                ["inserting", { id: 1, foo: "bar" }],

                ["onInserted", { id: 1, foo: "bar" }, 1],
                ["inserted", { id: 1, foo: "bar" }, 1],

                ["done", { id: 1, foo: "bar" }, 1]
            ]);
        })
        .always(done);
});

QUnit.test("insert with compound key", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        type: "post",
        responseText: { id: { foo: "bar", bar: "foo" } }
    });

    var store = new ODataStore({
        url: "odata.org",
        key: "id"
    });

    store.insert({ id: { foo: "bar", bar: "foo" } })
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .done(function(data, key) {
            assert.deepEqual(key, { foo: "bar", bar: "foo" });
        })
        .always(done);
});

QUnit.test("with 201 status", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        type: "post",
        status: 201,
        // NOTE: From OData protocol:
        // ...returns 201 Created. In this case, the response body MUST contain the resource created.
        responseText: { id: 1 }
    });

    var store = new ODataStore({
        url: "odata.org",
        key: "id"
    });

    store.insert({ id: 1 })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(data, key) {
            assert.equal(key, 1);
        })
        .always(done);
});

QUnit.module("update", moduleConfig);

if(!browser.msie || parseInt(browser.version, 10) > 8) {
    // NOTE: The issue with IE8 is that XMLHttpRequest does not accept method MERGE
    QUnit.test("works", function(assert) {
        assert.expect(13);

        var done = assert.async();

        var log = [];
        var compileLoggerFor = function(eventName) {
            return function(key, values) {
                log.push([eventName, key, values]);
            };
        };

        $.mockjax({
            url: "odata.org/DataSet*",
            status: 204,
            responseText: {}
        });

        var promises = [
            new ODataStore({
                url: "odata.org/DataSet",

                beforeSend: function(request) {
                    assert.equal(request.url, "odata.org/DataSet(1)");
                    assert.equal(request.method.toLowerCase(), "merge");

                    assert.deepEqual(request.params, {});
                    assert.deepEqual(request.payload, { foo: "bar" });
                },

                onUpdating: compileLoggerFor("onUpdating"),
                onUpdated: compileLoggerFor("onUpdated")

            }).on("updating", compileLoggerFor("updating"))
                .on("updated", compileLoggerFor("updated"))
                .update(1, { foo: "bar" })
                .done(compileLoggerFor("done")),

            new ODataStore({
                version: 3,
                url: "odata.org/DataSet",

                beforeSend: function(request) {
                    assert.equal(request.url, "odata.org/DataSet(1)");
                    assert.equal(request.method.toLowerCase(), "patch");

                    assert.deepEqual(request.params, {});
                    assert.deepEqual(request.payload, { foo: "bar" });
                },

                onUpdating: compileLoggerFor("onUpdating"),
                onUpdated: compileLoggerFor("onUpdated")

            }).on("updating", compileLoggerFor("updating"))
                .on("updated", compileLoggerFor("updated"))
                .update(1, { foo: "bar" })
                .done(compileLoggerFor("done")),

            new ODataStore({
                version: 4,
                url: "odata.org/DataSet",

                beforeSend: function(request) {
                    assert.equal(request.url, "odata.org/DataSet(1)");
                    assert.equal(request.method.toLowerCase(), "patch");

                    assert.deepEqual(request.params, {});
                    assert.deepEqual(request.payload, { foo: "bar" });
                },

                onUpdating: compileLoggerFor("onUpdating"),
                onUpdated: compileLoggerFor("onUpdated")

            }).on("updating", compileLoggerFor("updating"))
                .on("updated", compileLoggerFor("updated"))
                .update(1, { foo: "bar" })
                .done(compileLoggerFor("done"))
        ];

        $.when.apply($, promises)
            .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
            .done(function() {
                assert.deepEqual(log, [
                    ["onUpdating", 1, { foo: "bar" }],
                    ["updating", 1, { foo: "bar" }],

                    ["onUpdating", 1, { foo: "bar" }],
                    ["updating", 1, { foo: "bar" }],

                    ["onUpdating", 1, { foo: "bar" }],
                    ["updating", 1, { foo: "bar" }],

                    ["onUpdated", 1, { foo: "bar" }],
                    ["updated", 1, { foo: "bar" }],
                    ["done", 1, { foo: "bar" }],

                    ["onUpdated", 1, { foo: "bar" }],
                    ["updated", 1, { foo: "bar" }],
                    ["done", 1, { foo: "bar" }],

                    ["onUpdated", 1, { foo: "bar" }],
                    ["updated", 1, { foo: "bar" }],
                    ["done", 1, { foo: "bar" }]
                ]);
            })
            .always(done);
    });
}

QUnit.module("remove", moduleConfig);
QUnit.test("works", function(assert) {
    var done = assert.async();

    var log = [];
    var compileHandlerFor = function(eventName) {
        return function(key) {
            log.push([eventName, key]);
        };
    };

    $.mockjax({
        url: "odata2.org/DataSet(1)",
        // NOTE: According to OData 2 protocol
        // If the operation executed successfully servers should return 200 (OK) with no response body.
        status: 200,
        type: "delete",
        responseText: {}
    });

    $.mockjax({
        url: "odata4.org/DataSet(1)",
        // NOTE: According to OData 4 protocol
        // On successful completion of the delete, the response MUST be 204 No Content and contain an empty body.
        status: 204,
        type: "delete",
        responseText: {}
    });

    var handleBeforeSend = function(request) {
        assert.ok(request.url.indexOf("DataSet(1)") === 11);
        assert.equal(request.method.toLowerCase(), "delete");
    };

    var promises = [
        new ODataStore({ url: "odata2.org/DataSet", beforeSend: handleBeforeSend, onRemoving: compileHandlerFor("onRemoving"), onRemoved: compileHandlerFor("onRemoved") })
            .on("removing", compileHandlerFor("removing"))
            .on("removed", compileHandlerFor("removed"))
            .remove(1)
            .done(compileHandlerFor("done")),

        new ODataStore({ version: 3, url: "odata2.org/DataSet", beforeSend: handleBeforeSend, onRemoving: compileHandlerFor("onRemoving"), onRemoved: compileHandlerFor("onRemoved") })
            .on("removing", compileHandlerFor("removing"))
            .on("removed", compileHandlerFor("removed"))
            .remove(1)
            .done(compileHandlerFor("done")),

        new ODataStore({ version: 4, url: "odata4.org/DataSet", beforeSend: handleBeforeSend, onRemoving: compileHandlerFor("onRemoving"), onRemoved: compileHandlerFor("onRemoved") })
            .on("removing", compileHandlerFor("removing"))
            .on("removed", compileHandlerFor("removed"))
            .remove(1)
            .done(compileHandlerFor("done"))
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(function() {
            assert.deepEqual(log, [
                ["onRemoving", 1],
                ["removing", 1],

                ["onRemoving", 1],
                ["removing", 1],

                ["onRemoving", 1],
                ["removing", 1],

                ["onRemoved", 1],
                ["removed", 1],
                ["done", 1],

                ["onRemoved", 1],
                ["removed", 1],
                ["done", 1],

                ["onRemoved", 1],
                ["removed", 1],
                ["done", 1]
            ]);
        })
        .always(done);
});

QUnit.module("Serialization", moduleConfig);
QUnit.test("Dates, on loading", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata2.org",
        status: 204,
        response: function(bag) {
            assert.equal(bag.data.$filter, "date eq datetime'1945-05-09T14:25:01.1'", "timezoneless iso8601 for second version");
        }
    });

    $.mockjax({
        url: "odata2.org/methodToGet",
        responseText: {},
        response: function(bag) {
            assert.equal(bag.data.date, "datetime'1945-05-09T14:25:01.1'", "timezoneless iso8601 for second version");
        }
    });

    $.mockjax({
        url: "odata2.org/methodToInvoke*",
        responseText: {},
        response: function(bag) {
            assert.equal(decodeURIComponent(bag.url), "odata2.org/methodToInvoke?date=datetime'1945-05-09T14:25:01.1'");
        }
    });

    $.mockjax({
        url: "odata3.org",
        status: 204,
        response: function(bag) {
            assert.equal(bag.data.$filter, "date eq datetime'1945-05-09T14:25:01.1'", "timezoneless iso8601 for third version");
        }
    });

    $.mockjax({
        url: "odata4.org",
        status: 204,
        response: function(bag) {
            assert.equal(bag.data.$filter, "date eq 1945-05-09T14:25:01.1Z", "timezoneful iso8601 for fourth version");
        }
    });

    $.mockjax({
        url: "odata4.org/function*",
        responseText: {},
        response: function(bag) {
            assert.equal(bag.url, "odata4.org/function(date=1945-05-09T14:25:01.1Z)", "timezoneful iso8601 for fourth version");
        }
    });

    $.mockjax({
        url: "odata4.org/action",
        responseText: {},
        response: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.1Z"}', "timezoneful iso8601 for fourth version");
        }
    });

    var promises = [
        // v2
        new ODataStore({ url: "odata2.org", key: "id" })
            .load({ filter: ["date", new Date(1945, 4, 9, 14, 25, 1, 1)] }),

        new ODataContext({ url: "odata2.org" })
            .get("methodToGet", { date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        new ODataContext({ url: "odata2.org" })
            .invoke("methodToInvoke", { date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        // v3
        new ODataStore({ version: 3, url: "odata3.org", key: "id" })
            .load({ filter: ["date", new Date(1945, 4, 9, 14, 25, 1, 1)] }),

        // v4
        new ODataStore({ version: 4, url: "odata4.org", key: "id" })
            .load({ filter: ["date", new Date(1945, 4, 9, 14, 25, 1, 1)] }),

        new ODataContext({ version: 4, url: "odata4.org" })
            .get("function", { date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        new ODataContext({ version: 4, url: "odata4.org" })
            .invoke("action", { date: new Date(1945, 4, 9, 14, 25, 1, 1) })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("Dates, on inserting", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata2.org",
        status: 204,
        response: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.1"}', "timezoneless iso8601 for second version");
        }
    });

    $.mockjax({
        url: "odata3.org",
        status: 204,
        response: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.1Z"}', "timezoneful iso8601 for third version");
        }
    });

    $.mockjax({
        url: "odata4.org",
        status: 204,
        response: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.1Z"}', "timezoneful iso8601 for fourth version");
        }
    });

    var promises = [
        new ODataStore({ url: "odata2.org", key: "id" })
            .insert({ date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        new ODataStore({ version: 3, url: "odata3.org", key: "id" })
            .insert({ date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        new ODataStore({ version: 4, url: "odata4.org", key: "id" })
            .insert({ date: new Date(1945, 4, 9, 14, 25, 1, 1) })
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .always(done);
});

QUnit.test("Dates, on updating", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata2.org(1)",
        status: 204,
        response: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.1"}', "timezoneless iso8601 for second version");
        }
    });

    $.mockjax({
        url: "odata3.org(1)",
        status: 204,
        response: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.1Z"}', "timezoneful iso8601 for third version");
        }
    });

    $.mockjax({
        url: "odata4.org(1)",
        status: 204,
        response: function(bag) {
            assert.equal(bag.data, '{"date":"1945-05-09T14:25:01.1Z"}', "timezoneful iso8601 for fourth version");
        }
    });

    var promises = [
        new ODataStore({ url: "odata2.org", key: "id" })
            .update(1, { date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        new ODataStore({ version: 3, url: "odata3.org", key: "id" })
            .update(1, { date: new Date(1945, 4, 9, 14, 25, 1, 1) }),

        new ODataStore({ version: 4, url: "odata4.org", key: "id" })
            .update(1, { date: new Date(1945, 4, 9, 14, 25, 1, 1) })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.module("Deserialization", moduleConfig);
QUnit.test("Dates, disableable, ODataStore", function(assert) {
    assert.expect(2);

    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        responseText: { value: [{ dateProperty: "1945-05-09T14:25:12.1234567Z" }] }
    });

    $.mockjax({
        url: "odata.org(1)",
        responseText: { dateProperty: "1945-05-09T14:25:12.1234567Z" }
    });

    var store = new ODataStore({ version: 4, url: "odata.org", deserializeDates: false });
    var promises = [
        store.load()
            .done(function(r) {
                assert.ok(typeof r[0].dateProperty === "string");
            }),

        store.byKey(1)
            .done(function(r) {
                assert.ok(typeof r.dateProperty === "string");
            })
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .always(done);
});

QUnit.test("Dates, disableable, ODataContext", function(assert) {
    assert.expect(4);

    var done = assert.async();

    $.mockjax({
        url: "odata.org/name",
        responseText: { value: [{ dateProperty: "1945-05-09T14:25:12.1234567Z" }] }
    });

    $.mockjax({
        url: "odata.org/name",
        responseText: { dateProperty: "1945-05-09T14:25:12.1234567Z" }
    });

    $.mockjax({
        url: "odata.org/function()",
        responseText: { dateProperty: "1945-05-09T14:25:12.1234567Z" }
    });

    $.mockjax({
        url: "odata.org/action",
        responseText: { dateProperty: "1945-05-09T14:25:12.1234567Z" }
    });

    var ctx = new ODataContext({
        version: 4,
        url: "odata.org",
        deserializeDates: false,
        entities: {
            "X": { name: "name" },
            "Y": { name: "name", deserializeDates: true }
        }
    });

    var promises = [
        ctx.get("function")
            .done(function(r) {
                assert.ok(typeof r.dateProperty === "string");
            }),

        ctx.invoke("action")
            .done(function(r) {
                assert.ok(typeof r.dateProperty === "string");
            }),

        ctx.X.load()
            .done(function(r) {
                assert.ok(typeof r[0].dateProperty === "string");
            }),

        ctx.Y.load()
            .done(function(r) {
                assert.ok($.type(r[0].dateProperty) === "date");
            })
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .always(done);
});

QUnit.module("JSONP support", {
    beforeEach: function() {
        this.jsonpCallbackName = "jsonpCallback";
        this.originalJsonpCallback = $.ajaxSettings.jsonpCallback;

        window[this.jsonpCallbackName] = $.noop;

        $.ajaxSettings.jsonpCallback = $.proxy(function() {
            return this.jsonpCallbackName;
        }, this);

        this.toJsonpResponseText = $.proxy(function(obj) {
            return this.jsonpCallbackName + "(" + JSON.stringify(obj) + ")";
        }, this);

        moduleConfig.beforeEach.apply(this, arguments);
    },

    afterEach: function() {
        $.ajaxSettings.jsonpCallback = this.originalJsonpCallback;
        window[this.jsonpCallbackName] = undefined;

        moduleConfig.afterEach.apply(this, arguments);
    }
});
QUnit.test("load()", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        responseText: this.toJsonpResponseText({ d: { results: [1, 2, 3] } }),
        response: function(bag) {
            assert.ok($.mockjax.mockedAjaxCalls()[0].url.indexOf("$callback") > -1);
        }
    });

    new ODataStore({ url: "odata.org", jsonp: true })
        .load()
        .done(function(r) {
            assert.deepEqual(r, [1, 2, 3]);
        })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("byKey()", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org(1)",
        responseText: this.toJsonpResponseText({ d: { foo: "bar" } }),
        response: function(bag) {
            var mockedCall = $.mockjax.mockedAjaxCalls()[0];
            assert.ok(mockedCall.url.indexOf("$callback") > -1);
        }
    });

    new ODataStore({ url: "odata.org", jsonp: true })
        .byKey(1)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .done(function(r) {
            assert.deepEqual(r, { foo: "bar" });
        })
        .always(done);
});

QUnit.module("Error handling", moduleConfig);
QUnit.test("generic HTTP error", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org('http-error')",
        status: 404,
        statusText: "Not Found",
        responseText: "Expected 404"
    });

    new ODataStore({ url: "odata.org" })
        .byKey("http-error")
        .fail(function(error) {
            assert.equal(error.message, "Not Found");

        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("OData service error", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org('error')",
        status: 500,
        responseText: {
            error: { message: "test entity error" }
        }
    });

    new ODataStore({ url: "odata.org" })
        .byKey("error")
        .fail(function(error) {
            assert.equal(error.message, "test entity error");
        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});


QUnit.test("unexpected server response with 200 status", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org('bad-response')",
        status: 200,
        responseText: "Server gone crazy"
    });

    new ODataStore({ url: "odata.org" })
        .byKey("bad-response")
        .fail(function(error) {
            assert.ok(error.message.indexOf("Unexpected server response") > -1);
        })
        .done(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("error handlers (query evaluation)", function(assert) {
    var done = assert.async();

    var helper = new ErrorHandlingHelper();

    var store = new ODataStore({
        url: "odata.org",
        errorHandler: helper.optionalHandler
    });

    helper.run(function() {
        return store
            .load({
                select: function(i) { throw Error("test"); }
            });
    }, done, assert);
});

QUnit.test("error handlers (byKey)", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org('error')",
        status: 500,
        responseText: {
            error: { message: "test entity error" }
        }
    });

    var helper = new ErrorHandlingHelper();

    helper.extraChecker = function(error) {
        assert.equal(error.message, "test entity error");
    };

    helper.run(
        function() {
            return new ODataStore({
                url: "odata.org",
                errorHandler: helper.optionalHandler
            }).byKey("error");
        },
        done,
        assert
    );
});

QUnit.test("error handlers (update)", function(assert) {
    var done = assert.async();

    $.mockjax({ url: "odata.org('error')" });

    var helper = new ErrorHandlingHelper();

    var store = new ODataStore({
        url: "odata.org",
        errorHandler: helper.optionalHandler
    });

    helper.run(function() {
        return store.update("error", {});
    }, done, assert);
});

QUnit.test("error handlers (remove)", function(assert) {
    var done = assert.async();

    $.mockjax({ url: "odata.org('error')" });

    var helper = new ErrorHandlingHelper();

    var store = new ODataStore({
        url: "odata.org",
        errorHandler: helper.optionalHandler
    });

    helper.run(function() {
        return store.remove("error");
    }, done, assert);
});

QUnit.test("error handlers (insert)", function(assert) {
    var done = assert.async();

    $.mockjax({ url: "odata.org" });

    var helper = new ErrorHandlingHelper();

    var store = new ODataStore({
        url: "odata.org",
        key: "id",
        errorHandler: helper.optionalHandler
    });

    helper.run(function() {
        return store.insert({});
    }, done, assert);
});

QUnit.test("error handlers (custom operation)", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org/TestOperationError"
    });

    var helper = new ErrorHandlingHelper();

    var context = new ODataContext({
        url: "odata.org",
        errorHandler: helper.optionalHandler
    });

    helper.run(function() {
        return context.invoke("TestOperationError");
    }, done, assert);
});

QUnit.test("Recursive inner exception (B232110)", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        responseText: {
            error: {
                "message": {
                    "value": "An error occurred while processing this request."
                },
                "innererror": {
                    "message": "An error occurred while updating the entries.See the inner exception for details.",
                    "internalexception": {
                        "message": "An error occurred while updating the entries.See the inner exception for details.",
                        "internalexception": {
                            "message": "The DELETE statement conflicted with the REFERENCE constraint"
                        }
                    }
                }
            }
        }
    });

    var helper = new ErrorHandlingHelper();

    helper.extraChecker = function(error) {
        assert.ok(error.errorDetails);
        assert.deepEqual(error.errorDetails, {
            "message": {
                "value": "An error occurred while processing this request."
            },
            "innererror": {
                "message": "An error occurred while updating the entries.See the inner exception for details.",
                "internalexception": {
                    "message": "An error occurred while updating the entries.See the inner exception for details.",
                    "internalexception": {
                        "message": "The DELETE statement conflicted with the REFERENCE constraint"
                    }
                }
            }
        });

        assert.equal(error.message, "The DELETE statement conflicted with the REFERENCE constraint");
    };

    var store = new ODataStore({
        url: "odata.org",
        errorHandler: helper.optionalHandler
    });

    helper.run($.proxy(store.load, store), done, assert);
});

QUnit.test("No recursive inner exception (B232110) on validation error", function(assert) {
    var done = assert.async();
    $.mockjax({
        url: "odata.org",
        responseText: {
            error: {
                message: "The Product Name field is required."
            }
        }
    });

    var helper = new ErrorHandlingHelper();

    helper.extraChecker = function(error) {
        assert.equal(error.message, "The Product Name field is required.");
    };

    var store = new ODataStore({
        url: "odata.org",
        errorHandler: helper.optionalHandler
    });

    helper.run($.proxy(store.load, store), done, assert);
});

QUnit.module("Addressing remote operations", moduleConfig);
QUnit.test("get", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org*",
        response: function(bag) {
            this.responseText = {
                d: {
                    method: bag.type.toLowerCase(),
                    data: bag.data,
                    url: bag.url
                }
            };
        }
    });

    var promises = [
        // v2 and v3
        new ODataContext({ url: "odata.org" })
            .get("operation", {
                Int: -42,
                Null: null,
                True: true,
                False: false,
                String: "value",
                Double: 3.141592,
                Date: new Date(2012, 11, 17, 14, 18, 23),
                Guid: new Guid("01234567-89ab-cdef-0123-456789abcdef")
            })
            .done(function(r) {
                assert.deepEqual(r, {
                    method: "get",
                    data: {
                        "Date": "datetime'2012-12-17T14:18:23'",
                        "Double": "3.141592",
                        "False": "false",
                        "Guid": "guid'01234567-89ab-cdef-0123-456789abcdef'",
                        "Int": "-42",
                        "Null": "null",
                        "String": "'value'",
                        "True": "true"
                    },
                    url: "odata.org/operation"
                });
            }),

        // v4
        new ODataContext({ version: 4, url: "odata.org" })
            .get("function", {
                Int: -42,
                Null: null,
                True: true,
                False: false,
                String: "value",
                Double: 3.141592,
                Date: new Date(2012, 11, 17, 14, 18, 23),
                Guid: new Guid("01234567-89ab-cdef-0123-456789abcdef")
            })
            .done(function(r) {
                assert.deepEqual(r, {
                    method: "get",
                    data: {},
                    url: "odata.org/function(Int=-42,Null=null,True=true,False=false,String='value',Double=3.141592,Date=2012-12-17T14:18:23Z,Guid=01234567-89ab-cdef-0123-456789abcdef)"
                });
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("T213119: The ODataContext.get method crashes when return value is a boolean true", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org/true",
        responseText: { value: true }
    });

    $.mockjax({
        url: "odata.org/false",
        responseText: { value: false }
    });

    var promises = [
        new ODataContext({ url: "odata.org" })
            .get("true")
            .done(function(r) {
                assert.strictEqual(r, true);
            }),

        new ODataContext({ url: "odata.org" })
            .get("false")
            .done(function(r) {
                assert.strictEqual(r, false);
            })
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .always(done);
});

QUnit.test("invoke for service operation", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org/operation*",
        response: function(bag) {
            this.responseText = {
                d: {
                    method: bag.type.toLowerCase(),
                    url: bag.url,
                    data: bag.data
                }
            };
        }
    });

    $.mockjax({
        url: "odata4.org/action",
        response: function(bag) {
            this.responseText = {
                method: bag.type.toLowerCase(),
                url: bag.url,
                data: bag.data
            };
        }
    });

    var promises = [
        // v2 and 3
        new ODataContext({ url: "odata.org" })
            .invoke("operation", { n: 13 })
            .done(function(r) {
                assert.deepEqual(r, {
                    method: "post",
                    url: "odata.org/operation?n=13",
                    data: "null"
                });
            }),

        // v4
        new ODataContext({ version: 4, url: "odata4.org" })
            .invoke("action", { n: 13 })
            .done(function(r) {
                assert.deepEqual(r, {
                    method: "post",
                    url: "odata4.org/action",
                    data: "{\"n\":13}"
                });
            })
    ];

    $.when.apply($, promises)
        .fail(function() { assert.ok(false, MUST_NOT_REACH_MESSAGE); })
        .always(done);
});

QUnit.test("invoke and get methods should understand scalar types in result", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org/scalar",
        responseText: {
            d: { results: { scalar: "scalar value" } }
        }
    });

    var promises = [
        new ODataContext({ url: "odata.org" })
            .get("scalar")
            .done(function(r) {
                assert.strictEqual(r, "scalar value");
            }),

        new ODataContext({ url: "odata.org" })
            .invoke("scalar")
            .done(function(r) {
                assert.equal(r, "scalar value");
            })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.module("Custom query params", moduleConfig);
QUnit.test("works", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        responseText: {},
        response: function(bag) {
            assert.equal(bag.data.customName, "'customValue'");
        }
    });

    $.mockjax({
        url: "odata4.org(customName='customValue')",
        responseText: {},
        response: function(bag) {
            assert.deepEqual(bag.data, {});
        }
    });

    var promises = [
        new ODataStore({ url: "odata.org" })
            .load({ customQueryParams: { customName: "customValue" } }),

        new ODataStore({ version: 3, url: "odata.org" })
            .load({ customQueryParams: { customName: "customValue" } }),

        new ODataStore({ version: 4, url: "odata4.org" })
            .load({ customQueryParams: { customName: "customValue" } })
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("url is correct when customQueryParams is undefined (T382714)", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata4.org/messages",
        responseText: {
            message: "expected message"
        }
    });

    $.mockjax({
        url: "odata4.org/messages()",
        responseText: {
            message: "unexpected message"
        }
    });

    new ODataStore({ version: 4, url: "odata4.org/messages" })
        .load({ customQueryParams: undefined })
        .done(function(r) {
            assert.equal(r.message, "expected message");
        })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("array value for odata 4", function(assert) {
    var done = assert.async();

    var guid = "3f17117f-63b1-ee7d-2b64-a7f717177773";

    var value = [1, "'1", new Date(1945, 4, 9, 14, 25, 1, 1), new Guid(guid), new EdmLiteral("123L")],
        expectedUrl = "odata4.org(customName=[1,'''1',1945-05-09T14:25:01.1Z," + guid + ",123L])";

    $.mockjax({
        url: expectedUrl,
        responseText: {},
        response: function(bag) {
            assert.deepEqual(bag.data, {});
        }
    });

    new ODataStore({ version: 4, url: "odata4.org" })
        .load({ customQueryParams: { customName: value } })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.module("Misc", moduleConfig);
QUnit.test("T226529", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",

        // NOTE: It's a simulation of impossible response
        // where the one collection property (collectionProperty0) returns with "results" wrapper
        // and the other one (collectionProperty1) returns without it (OData v2 specific).
        responseText: {
            d: {
                results: [
                    {
                        keyProperty: 0,
                        collectionProperty1: {
                            results: [
                                { keyProperty: 0 },
                                { keyProperty: 1 }
                            ]
                        },
                        collectionProperty2: [
                            { keyProperty: 0 },
                            { keyProperty: 1 }
                        ]
                    }
                ]
            }
        }
    });

    new ODataStore({ url: "odata.org" })
        .load()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .done(function(r) {
            assert.deepEqual(r, [
                {
                    keyProperty: 0,

                    collectionProperty1: [
                            { keyProperty: 0 },
                            { keyProperty: 1 }
                    ],

                    collectionProperty2: [
                            { keyProperty: 0 },
                            { keyProperty: 1 }
                    ]
                }
            ]);
        })
        .done(done);
});

QUnit.test("Sorting and grouping shouldn't add duplicate rules", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        responseText: { d: { results: [] } },
        response: function(bag) {
            assert.equal(bag.data["$orderby"], "a");
        }
    });

    new ODataStore({ url: "odata.org" })
        .load({ sort: "a", group: "a" })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("Sorting should be higher priority than grouping", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        responseText: { d: { results: [] } },
        response: function(bag) {
            assert.equal(bag.data["$orderby"], "a desc");
        }
    });

    new ODataStore({ url: "odata.org" })
        .load({ sort: { field: "a", desc: true }, group: "a" })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("Custom headers, query string params and timeout (beforeSend event)", function(assert) {
    assert.expect(6);

    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        responseText: { d: { results: [] } },
        response: assertFunc
    });

    $.mockjax({
        url: "odata.org(1)",
        responseText: { d: {} },
        response: assertFunc
    });

    var PARAM_NAME = "customParam",
        HEADER_NAME = "x-custom-header"; // NOTE: IE8 (http://stackoverflow.com/q/1130297/65899)

    function assertFunc(bag) {
        assert.equal(bag.timeout, 1122);
        assert.equal(bag.data[PARAM_NAME], "p");
        assert.equal(bag.headers[HEADER_NAME], "h");
    }

    function handleBeforeSend(requestOptions) {
        requestOptions.timeout = 1122;
        requestOptions.params[PARAM_NAME] = "p";
        requestOptions.headers[HEADER_NAME] = "h";
    }

    var promises = [
        new ODataStore({ url: "odata.org", beforeSend: handleBeforeSend })
            .load(),

        new ODataStore({ url: "odata.org", beforeSend: handleBeforeSend })
            .byKey(1)
    ];

    $.when.apply($, promises)
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("link creation helper method", function(assert) {
    var context = new ODataContext({
        url: "http://devexpress.com",
        entities: {
            alias: { name: "RealName" },
            "My Obj": { }
        }
    });

    assert.deepEqual(context.objectLink("My Obj", "key 1"), {
        __metadata: {
            uri: "http://devexpress.com/My%20Obj('key%201')"
        }
    });

    assert.equal(
        context.objectLink("alias", 1).__metadata.uri,
        "http://devexpress.com/RealName(1)"
    );

    assert.equal(context.objectLink("alias", null), null, "Should return null in case of not defined key value");
    assert.equal(context.objectLink("alias", undefined), null, "Should return null in case of not defined key value");
});

QUnit.test("custom entity name in ODataContext", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org/TestEntity1",
        responseText: { d: {} }
    });

    var context = new ODataContext({
        url: "odata.org",
        entities: {
            "abc": { name: "TestEntity1" }
        }
    });

    assert.expect(0);

    context["abc"].load()
        .always(done);
});

QUnit.test("withCredentials is set", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        responseText: { d: { results: [] } }
    });

    $(document).on("ajaxSend.test", function(e, xhr, settings) {
        assert.strictEqual(settings.xhrFields.withCredentials, true);

        $(document).off("ajaxSend.test");
        xhr.abort();
        done();
    });

    new ODataStore({ url: "odata.org", withCredentials: true })
        .load();
});

QUnit.test("verbose MIME specifier is used", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org",
        responseText: { d: { results: [] } },
        response: function(bag) {
            assert.ok(bag.accepts.json.indexOf("odata=verbose") > -1);
            assert.ok(bag.accepts.json.indexOf("application/json") > -1);
            assert.ok(bag.accepts.json.indexOf("text/plain") > -1, "need for count query");
        }
    });

    new ODataStore({ url: "odata.org" })
        .load()
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});

QUnit.test("URL absolutation algorithm works incorrectly (see T305070 for details)", function(assert) {
    var done = assert.async();

    $.mockjax({
        url: "odata.org/DataSet",
        responseText: {
            value: [1],
            "@odata.nextLink": "DataSet?$expand=prop($expand=nested)&$filter=contains(prop/nested/prop,'o')&$skiptoken=1"
        }
    });

    $.mockjax({
        url: "odata.org/DataSet?$expand=prop($expand=nested)&$filter=contains(prop/nested/prop,'o')&$skiptoken=1",
        responseText: {
            value: [2],
            "@odata.nextLink": "DataSet?$expand=prop($expand=nested)&$filter=contains(prop/nested/prop,'o')&$skiptoken=2"
        }
    });

    $.mockjax({
        url: "odata.org/DataSet?$expand=prop($expand=nested)&$filter=contains(prop/nested/prop,'o')&$skiptoken=2",
        responseText: {
            value: [3]
        }
    });

    assert.expect(0);

    new ODataStore({ version: 4, url: "odata.org/DataSet" })
        .load({ filter: ["prop.nested.prop", "contains", "o"], expand: ["prop($expand=nested)"] })
        .fail(function() {
            assert.ok(false, MUST_NOT_REACH_MESSAGE);
        })
        .always(done);
});
