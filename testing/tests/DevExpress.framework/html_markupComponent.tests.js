var $ = require("jquery"),
    registerComponent = require("core/component_registrator"),
    MarkupComponent = require("framework/html/markup_component").MarkupComponent;

var TestMarkupComponent = MarkupComponent.inherit({
    _setDefaultOptions: function() {
        this.callBase();
        this.option({
            title: "default title"
        });
    },

    _render: function() {
        this.callBase();
        this.element().addClass("test-markup-component");
    },

    _dispose: function() {
        this.element().addClass("test-disposed");
        this.callBase();
    }

});

registerComponent("TestMarkupComponent", TestMarkupComponent);

QUnit.test("render", function(assert) {
    var $el = $("<div/>").TestMarkupComponent();
    assert.ok($el.is(".test-markup-component"));
});

QUnit.test("default options", function(assert) {
    var component = $("<div/>").TestMarkupComponent().TestMarkupComponent("instance");
    assert.equal(component.option("title"), "default title");

    component = $("<div/>").TestMarkupComponent({ title: "overrides default" }).TestMarkupComponent("instance");
    assert.equal(component.option("title"), "overrides default");
});

QUnit.test("option", function(assert) {
    var component = $("<div/>").TestMarkupComponent().TestMarkupComponent("instance");
    assert.deepEqual(component.option(), {
        title: "default title"
    });

    component.option({ newOption: "new value" });
    assert.deepEqual(component.option(), {
        title: "default title",
        newOption: "new value"
    });

    assert.equal(component.option("title"), "default title");
    assert.equal(component.option("newOption"), "new value");

    component.option("newOption", "changed");
    assert.equal(component.option("newOption"), "changed");
});

QUnit.test("dispose", function(assert) {
    var $el = $("<div/>").TestMarkupComponent();
    assert.ok($el.is(".test-markup-component"));
    assert.ok($el.is(":not(.test-disposed)"));

    $el.remove();
    assert.ok($el.is(".test-disposed"));
});

QUnit.test("fast ctor from cache", function(assert) {
    var callCount,
        counter = function() { callCount++; },
        Tester = TestMarkupComponent.inherit({
            _render: counter,
            _setDefaultOptions: counter,
            option: counter
        });

    callCount = 0;
    new Tester($("<div/>"), { myOption: true });
    assert.equal(callCount, 3);

    callCount = 0;
    new Tester($("<div/>"), { myOption: true, fromCache: true });
    assert.equal(callCount, 0);
});
