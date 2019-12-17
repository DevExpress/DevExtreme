import $ from "jquery";
import registerComponent from "core/component_registrator";
import DOMComponent from "core/dom_component";

const nameSpace = {};

QUnit.testStart(function() {
    var markup = '<div id="component"></div>' + '<div id="anotherComponent"></div>';

    $("#qunit-fixture").html(markup);
});

var RTL_CLASS = "dx-rtl";

QUnit.module("Markup tests", {
    beforeEach: function(module) {
        this.TestComponent = DOMComponent.inherit({
            _useTemplates() {
                return false;
            }
        });

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

[
    { width: null, height: null },
    { width: 50, height: 25 },
    { width: 0, height: 0 },
    { width: "", height: "" }
].forEach(({ width, height }) => {
    QUnit.test(`change dimensions from predefined values, width => ${width}, height => ${height}`, function(assert) {
        const instance = $("#component").TestComponent({ width: 150, height: 75 }).TestComponent("instance");
        const element = instance.$element().get(0);
        const getExpectedValue = (dimension) => typeof dimension === "number" ? dimension + "px" : "";

        instance.option({
            width,
            height
        });

        assert.equal(element.style.width, getExpectedValue(width), `width => ${width}, value is correct`);
        assert.equal(element.style.height, getExpectedValue(height), `height => ${height}, value is correct`);
    });

    QUnit.test(`change dimensions from default values, width => ${width}, height => ${height}`, function(assert) {
        const instance = $("#component").TestComponent({}).TestComponent("instance");
        const element = instance.$element().get(0);
        const getExpectedValue = (dimension) => typeof dimension === "number" ? dimension + "px" : "";

        instance.option({
            width,
            height
        });

        assert.equal(element.style.width, getExpectedValue(width), `width => ${width}, value is correct`);
        assert.equal(element.style.height, getExpectedValue(height), `height => ${height}, value is correct`);
    });
});
