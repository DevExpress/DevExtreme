"use strict";

var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    ko = require("knockout"),
    KoTemplate = require("integration/knockout/template");

QUnit.module("rendering", {
    beforeEach: function() {
        var that = this;

        this.testBindingInit = noop;
        ko.bindingHandlers.testBinding = {
            init: function(element) {
                that.testBindingInit(element);
            }
        };
    },
    afterEach: function() {
        ko.bindingHandlers.testBinding = null;
    }
});

QUnit.test("template should be rendered to container directly", function(assert) {
    var $container = $("<div class='container'>"),
        template = new KoTemplate($("<div class='content' data-bind='testBinding: {}'>"));

    this.testBindingInit = function(element) {
        assert.equal($(element).parent().get(0), $container.get(0), "template rendered in attached container");
    };
    template.render({ container: $container });
});

QUnit.test("template result should be correct", function(assert) {
    var $container = $("<div class='container'>"),
        template = new KoTemplate($("<div class='content' data-bind='testBinding: {}'>"));

    var result;
    this.testBindingInit = function(element) {
        result = element;
    };
    assert.equal(template.render({ container: $container }).get(0), result, "result is correct");
});
