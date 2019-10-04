var domAdapter = require("core/dom_adapter").default;

QUnit.module("DOM Adapter", {
    beforeEach: function() {
        var fixture = document.getElementById("qunit-fixture");
        this.container = document.createElement("div");
        fixture.appendChild(this.container);
    }
});

QUnit.test("insertElement", function(assert) {
    var target = document.createElement("span");

    domAdapter.insertElement(this.container, target);

    assert.equal(this.container.childNodes.length, 1);
});

QUnit.test("listen with no window", function(assert) {
    assert.expect(0);

    var windowObject = {};
    windowObject.window = windowObject;

    domAdapter.listen(windowObject, "test-event", function() {});
});

QUnit.module("DOM Adapter injection", {
    afterEach: function() {
        domAdapter.resetInjection();
    }
});

QUnit.test("inject document", function(assert) {
    var doc = {};
    domAdapter.inject({
        _document: doc
    });
    assert.equal(domAdapter.getDocument(), doc);
});
