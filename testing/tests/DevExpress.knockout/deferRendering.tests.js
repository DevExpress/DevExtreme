"use strict";

var $ = require("jquery"),
    ko = require("knockout");

require("ui/defer_rendering");
require("integration/knockout");

QUnit.testStart(function() {
    var markup =
        '<div id="renderDelegateWithWithBinding">\
            <div data-bind="dxDeferRendering: {}">\
                <!-- ko with: innerObject -->\
                <div class="item1" data-bind="text: message">initial</div>\
                <!-- /ko -->\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});


QUnit.module("dxDeferRendering");

QUnit.test("render with the 'with' binding", function(assert) {
    var done = assert.async(),
        vm = {
            innerObject: {
                message: "content"
            }
        },
        $test = $("#renderDelegateWithWithBinding");

    ko.applyBindings(vm, $test.get(0));

    assert.equal($test.find(".item1").text(), "initial");
    var render = $test.find(".dx-pending-rendering").data("dx-render-delegate");
    render().done(function() {
        assert.equal($test.find(".item1").text(), "content");
        done();
    });
});
