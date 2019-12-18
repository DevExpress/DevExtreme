var $ = require('jquery'),
    ko = require('knockout');

require('ui/toolbar');
require('integration/knockout');

$('#qunit-fixture').html('<div id="toolbar" data-bind="dxToolbar: { items: items }"></div>');


QUnit.module('regression', {
    beforeEach: function() {
        this.$element = $('#toolbar');
    }
});

QUnit.test('polymorph widget correctly renders nested widgets', function(assert) {
    var vm = {
        items: [{
            widget: 'dxButton',
            options: {
                disabled: ko.observable(false)
            }
        }]
    };
    ko.applyBindings(vm, $('#toolbar')[0]);

    vm.items[0].options.disabled(true);
    assert.equal($('#toolbar').find('.dx-state-disabled').length, 1);
});
