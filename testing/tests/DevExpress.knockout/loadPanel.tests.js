const $ = require('jquery');
const ko = require('knockout');

require('ui/load_panel');
require('integration/knockout');

QUnit.testStart(function() {
    const markup =
        '<div id="target" style="position: absolute; top: 0; left: 0; width: 100px; height: 100px;">\
            <div id="B234630">\
                <div data-bind="dxLoadPanel: { visible: visible, container: \'#B234630_target\' }"></div>\
                <div id="B234630_target">.</div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('regressions');

QUnit.test('B234630 - targetContainer with ko', function(assert) {
    const vm = {
        visible: ko.observable(false)
    };

    ko.applyBindings(vm, $('#B234630').get(0));
    vm.visible(true);
    assert.equal($('#B234630_target').find('.dx-overlay-content').length, 1);
    vm.visible(false);
});
