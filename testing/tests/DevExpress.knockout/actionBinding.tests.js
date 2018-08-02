var $ = require("jquery"),
    ko = require("knockout");

require("integration/knockout");

QUnit.testStart(function() {
    var markup =
        '<div id="basic">\
            <div class="action" data-bind="dxAction: action"></div>\
        </div>\
        \
        <div id="bubbling">\
            <div data-bind="dxAction: outerAction">\
                <div class="actionNoBubblingInner" data-bind="dxAction: innerAction"></div>\
            </div>\
            \
            <div data-bind="dxAction: outerAction">\
                <div class="actionBubblingInner" data-bind="dxAction: { bubbling: true, execute: innerAction }"></div>\
            </div>\
        </div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("dxAction");

QUnit.test("action binding args", function(assert) {
    var $actionElement = $(".action");

    var vm = {
        action: function(e) {
            assert.equal(e.model, vm);
            assert.equal(e.element.get(0), $actionElement.get(0));
        }
    };

    ko.applyBindings(vm, $("#basic").get(0));

    $actionElement.trigger("dxclick");
});

QUnit.test("event bubbling is prevented by default", function(assert) {
    assert.expect(1);

    var vm = {
        innerAction: function() {
            assert.ok(true);
        },
        outerAction: function() {
            assert.ok(false);
        }
    };

    ko.applyBindings(vm, $("#bubbling").get(0));

    $(".actionNoBubblingInner").trigger("dxclick");
});

QUnit.test("event bubbling allowed", function(assert) {
    assert.expect(2);

    var vm = {
        innerAction: function() {
            assert.ok(true);
        },
        outerAction: function() {
            assert.ok(true);
        }
    };

    ko.applyBindings(vm, $("#bubbling").get(0));

    $(".actionBubblingInner").trigger("dxclick");
});
