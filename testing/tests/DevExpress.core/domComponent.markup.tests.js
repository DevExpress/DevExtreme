var $ = require("jquery"),
    registerComponent = require("core/component_registrator"),
    DOMComponent = require("core/dom_component"),
    nameSpace = {};

QUnit.testStart(function() {
    var markup = '<div id="component"></div>' + '<div id="anotherComponent"></div>';

    $("#qunit-fixture").html(markup);
});

var RTL_CLASS = "dx-rtl";

QUnit.module("Markup tests", {
    beforeEach: function(module) {
        this.TestComponent = DOMComponent.inherit({});

        registerComponent("TestComponent", nameSpace, this.TestComponent);
    },

    afterEach: function() {
        delete $.fn.TestComponent;
    }
});

QUnit.test("initial markup", function(assert) {
    var $element = $("#component").TestComponent({});

    assert.ok(!$element.hasClass(RTL_CLASS), "element hasn't a RTL class");
});

QUnit.test("init option 'rtlEnabled' is true", function(assert) {
    var $element = $("#component").TestComponent({ rtlEnabled: true });

    assert.ok($element.hasClass(RTL_CLASS), "element has a RTL class");
});

QUnit.test("init with custom dimensions", function(assert) {
    var element = $("#component").TestComponent({ width: 150, height: 75 }).get(0);

    assert.equal(element.style.width, "150px", "width is correct");
    assert.equal(element.style.height, "75px", "height is correct");
});
