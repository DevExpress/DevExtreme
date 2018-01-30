"use strict";

var widgets = {
    Accordion: require("ui/accordion"),
    Button: require("ui/button")
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

