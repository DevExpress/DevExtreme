"use strict";

var widgets = {
    Accordion: require("ui/accordion"),
    Box: require("ui/box"),
    Button: require("ui/button"),
    CheckBox: require("ui/check_box"),
    ResponsiveBox: require("ui/responsive_box")
};

QUnit.module("Scripts loading");

QUnit.test("Widgets", function(assert) {
    for(var widget in widgets) {
        assert.ok(widgets[widget], widget);
    }
});

QUnit.module("Widget creation", {
    beforeEach: function() {
        var fixture = document.getElementById("qunit-fixture");
        this.element = document.createElement("div");
        fixture.appendChild(this.element);
    },
    afterEach: function() {
        this.instance.dispose();
    }
});

QUnit.test("Button", function(assert) {
    this.instance = new widgets.Button(this.element);
    assert.ok(this.instance);
});

