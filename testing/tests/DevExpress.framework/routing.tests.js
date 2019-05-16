var $ = require("jquery"),
    Router = require("framework/router"),
    JSON_URI_PREFIX = require("framework/router").Route.__internals.JSON_URI_PREFIX;

var singleRoute = function() {
    var routes = new Router();
    routes.register.apply(routes, arguments);
    return routes;
};

QUnit.module("Parsing");

QUnit.test("match", function(assert) {
    var r = singleRoute(":controller/:action");
    var values = r.parse("home/index");

    assert.deepEqual(values, {
        controller: "home",
        action: "index"
    });
});

QUnit.test("trailing separator doesn`t matter", function(assert) {
    var r = singleRoute("./:param/"),
        values;

    values = r.parse("test");
    assert.equal(values.param, "test");

    values = r.parse("/.test./");
    assert.equal(values.param, "test.");
});

QUnit.test("sharp is ordinary symbol", function(assert) {
    var r = singleRoute('#test#');
    assert.equal('#test#', r.format());
});

QUnit.test("static segments not placed into match result", function(assert) {
    assert.deepEqual(
        singleRoute("static/:param/static2").parse("static/1/static2"),
        { param: "1" }
    );
});

QUnit.test("static segment prevents shortened route match", function(assert) {
    var r = singleRoute(":controller/:action/tail", { action: "index" });
    assert.strictEqual(r.parse("home"), false);
});

QUnit.test("explicit route segment overrides its default", function(assert) {
    var r = singleRoute(":c/:a", { a: "index" }),
        values = r.parse("home/about");

    assert.equal(values.a, "about");
});

QUnit.test("match with all defaults", function(assert) {
    var r = singleRoute(":param", { param: "test" }),
        values = r.parse("");

    assert.deepEqual(values, { param: "test" });

    r = singleRoute(":controller/:action", { controller: "home", action: "index" });
    values = r.parse("");

    assert.deepEqual(values, { controller: "home", action: "index" });
});

QUnit.test("empty default does not mean its absence", function(assert) {
    var r = singleRoute(":action/:model", { model: "" }),
        values = r.parse("welcome");

    assert.strictEqual(values.model, "");
});

QUnit.test("static route", function(assert) {
    var r = singleRoute("/a/b/c/");

    $.each(
        ["a/b/c", "/a/b/c", "a/b/c/", "/a/b/c/"],
        function() {
            assert.ok(r.parse(this) !== false);
        }
    );
});

QUnit.test("match with text constraints", function(assert) {
    var r = singleRoute(":id", null, { id: "\\d+" });
    assert.ok(!r.parse("a1"));
    assert.ok(r.parse("123"));
});

QUnit.test("match with regex constraints", function(assert) {
    var r = singleRoute(":id", null, { id: /\d+/ });
    assert.ok(!r.parse("a1"));
    assert.ok(r.parse("123"));
});

QUnit.test("match empty (root) route", function(assert) {
    var r = singleRoute("");
    assert.ok(r.parse(""));
});

QUnit.module("Formatting");

QUnit.test("format", function(assert) {
    var r = singleRoute(":controller/static/:action"),
        uri = r.format({
            controller: "home",
            action: "index"
        });
    assert.equal(uri, "home/static/index");
});

QUnit.test("format produces shortened url when defaults allow", function(assert) {
    var r = singleRoute(":controller/:action/:id", {
        action: "index",
        id: -1
    });

    var uri = r.format({ controller: "home" });
    assert.equal(uri, "home");
});

QUnit.test("format doesn't produce slash in the end", function(assert) {
    var r = singleRoute("about/:p1/:p2", {
        p: 'test',
        p1: undefined,
        p2: undefined
    });

    var uri = r.format(r.parse("about"));
    assert.equal(uri, "about");
});

QUnit.test("format with missing parameter", function(assert) {
    var r = singleRoute(":p");
    assert.strictEqual(r.format(), false);
});

QUnit.test("format with all defaults", function(assert) {
    var r = singleRoute(":a/:b", { a: "a", b: "b" });
    assert.strictEqual(r.format(), "");
});

QUnit.test("static segment prohibits shortened route url generation", function(assert) {
    var r = singleRoute(":a/tail", { a: "a" });
    assert.equal(r.format(), "a/tail");
});

QUnit.test("non-default param value prohibits shortened route url generation", function(assert) {
    var r = singleRoute(":a/:b", { a: "a", b: "b" });
    assert.equal(r.format({ b: 'ZZZ' }), "a/ZZZ");
});

QUnit.test("format with regex constraints", function(assert) {
    var r = singleRoute(":id", null, { id: /\d+/ });

    assert.ok(!r.format({ id: "a1" }));
    assert.ok(r.format({ id: 123 }));
});

QUnit.test("format with text constraints", function(assert) {
    var r = singleRoute(":id", null, { id: "\\d+" });

    assert.ok(!r.format({ id: "a1" }));
    assert.ok(r.format({ id: 123 }));
});

QUnit.test("format empty (root) route", function(assert) {
    var r = singleRoute("");
    assert.strictEqual(r.format(), "");
});

QUnit.test("format static url", function(assert) {
    var r = singleRoute("/a/b/");
    assert.equal(r.format(), 'a/b');
});

QUnit.test("route regression 1", function(assert) {
    var r = singleRoute(":param/:id", { param: "", id: -1 }, { id: "\\d+" });
    assert.ok(!r.parse('abc/-1'));
});

QUnit.test("route regression 2", function(assert) {
    var r = singleRoute("static", { test: "passed" }),
        values;

    values = r.parse('static');
    assert.equal(values.test, 'passed');

    r = singleRoute("static/:p", { test: "passed" });
    values = r.parse('static/a');
    assert.equal(values.test, 'passed');
    assert.equal(values.p, 'a');
});

QUnit.test("repeated format", function(assert) {
    var r = singleRoute(":controller/static/:action");
    assert.equal(
        r.format({
            controller: "home",
            action: "index"
        }),
        "home/static/index"
    );
    assert.equal(
        r.format({
            controller: "home2",
            action: "index2"
        }),
        "home2/static/index2"
    );
});

QUnit.test("escape format", function(assert) {
    var r = singleRoute(":id/sta+tic(a|b|c)*&*");
    assert.equal(r.format({ id: 123 }), "123/sta+tic(a|b|c)*&*");
});

QUnit.module("Regression");

QUnit.test("format with undefined default", function(assert) {
    var r = singleRoute(":view/:id", { view: "index", id: undefined });
    var values = r.parse("");
    var uri = r.format(values);
    assert.equal(uri, "index");
});

QUnit.test("format with undefined param in the middle (Q578711)", function(assert) {
    var r = singleRoute(":view/:middle/:last", { view: "index", middle: undefined, last: undefined });
    var values = r.parse("");
    var uri = r.format(values);
    assert.equal(uri, "index");

    values = r.parse("test//p1");
    uri = r.format(values);
    assert.equal(uri, "test//p1");
});


QUnit.test("format must use all passed params", function(assert) {
    var router = new Router();
    router.register(":a");
    router.register(":a/:b");

    assert.equal(router.format({ a: "A", b: "B" }), "A/B");
});

QUnit.test("format with passed default param missing from pattern", function(assert) {
    var r = singleRoute("static/:a", { view: "view1" });
    assert.equal(r.format({ view: "view1", a: 1 }), "static/1");
});

QUnit.test("json serialization for complex objects", function(assert) {
    var r = singleRoute("static/:a"),
        prefix = "static/" + JSON_URI_PREFIX;

    assert.equal(
        r.format({ a: [1, 2, 3] }),
        prefix + "%5B1%2C2%2C3%5D"
    );
    assert.deepEqual(
        r.parse(prefix + "%5B1%2C2%2C3%5D"),
        { a: [1, 2, 3] }
    );

    assert.deepEqual(
        r.parse(prefix + "{\"b\":\"B\"}"),
        { a: { b: "B" } }
    );
});
QUnit.test("Custom parameters as query string", function(assert) {
    var router = new Router();
    router.register(":view/:id", { view: 'View1', id: undefined });
    var uri = "View2/1?a=2&b=3";
    var routeData = router.parse(uri);
    assert.equal(routeData.view, "View2");
    assert.equal(routeData.id, "1");
    assert.equal(routeData.a, "2");
    assert.equal(routeData.b, "3");
    assert.equal(router.format(routeData), uri);
});
QUnit.test("long param list B231902", function(assert) {
    var router = new Router();
    router.register(":view/:type1/:type2/:type3/:type4/:type5/:type6/:type7/:type8/:type9/:type10/:type11", {
        view: "View3", type1: undefined, type2: undefined, type3: undefined, type4: undefined, type5: undefined, type6: undefined,
        type7: undefined, type8: undefined, type9: undefined, type10: undefined, type11: undefined
    });
    var res = router.parse("view1/0/1/2/3/4/5/6/7/8/9/10");
    assert.deepEqual(res, {
        view: 'view1',
        type1: '0',
        type2: '1',
        type3: '2',
        type4: '3',
        type5: '4',
        type6: '5',
        type7: '6',
        type8: '7',
        type9: '8',
        type10: '9',
        type11: '10'
    });
});

// Q476683
QUnit.test("Period stripped out of parameter passed to a view", function(assert) {
    var router = new Router();

    router.register(":viewName/:myString");

    var res = router.parse("superpuperview/Hello my name is John...");

    assert.equal(res.viewName, "superpuperview");
    assert.equal(res.myString, "Hello my name is John...");
});

// Q484546
QUnit.test("format should compare values which don't exist in segments", function(assert) {
    var router = new Router(),
        uri;

    router.register("View1/:message", { view: 'View1', message: undefined });
    router.register("View2/:message/:id", { view: 'View2', message: undefined, id: undefined });
    router.register(":view/:id", { view: "Index", id: undefined });

    uri = router.format({
        view: "Index",
        id: 1
    });
    assert.equal(uri, "Index/1", "Index/1");
    uri = router.format({
        view: "Index"
    });
    assert.equal(uri, "Index", "Index");
    uri = router.format({
        view: "View1"
    });
    assert.equal(uri, "View1", "View1");
    uri = router.format({
        view: "View1",
        message: "hi"
    });
    assert.equal(uri, "View1/hi", "View1/hi");
    uri = router.format({
        view: "View2",
        message: "hi",
        id: 1
    });
    assert.equal(uri, "View2/hi/1", "View2/hi/1");
});
QUnit.test("B236385 '\\' symbol in route arguments", function(assert) {
    var router = new Router(),
        uri;
    router.register(":view/:item", { view: 'View1', item: undefined });
    uri = router.format({ view: "View2", item: { test: "N/A" } });
    var routeData = router.parse(uri);
    assert.equal(routeData.view, "View2");
    assert.equal(routeData.item.test, "N/A");
});
QUnit.test("B237622 space symbol in route arguments and double route", function(assert) {
    var router = new Router();

    router.register(":view/:id", { view: "home", id: undefined });
    router.register(":view/:id/:id2", { view: "about", id: undefined, id2: undefined });

    var uri = router.format({
        view: "about",
        id: "par 1",
        id2: "par 2",
    });
    var routeData = router.parse(uri);
    assert.equal(routeData.view, "about");
    assert.equal(routeData.id, "par 1");
    assert.equal(routeData.id2, "par 2");
});

QUnit.test("Space symbol in route argument is encoded once", function(assert) {
    var router = new Router();

    router.register(":view/:id", { view: "home", id: undefined });

    var uri = router.format({
        view: "home",
        p: "par 1"
    });

    var routeData = router.parse(uri);
    var formattedUri = router.format(routeData);

    assert.equal(uri, formattedUri, "uri shouldn't be encoded twice");

});

QUnit.test("T398751: The DevExtreme router does not accept the dash in URLs", function(assert) {
    var router = new Router();

    router.register("my-view/:id", { view: "home", id: undefined });

    var routeData = router.parse("my-view/123");

    assert.equal(routeData.view, "home", "T398751: The DevExtreme router does not accept the dash in URLs");
    assert.equal(routeData.id, "123", "parameter is parsed properly");

});
