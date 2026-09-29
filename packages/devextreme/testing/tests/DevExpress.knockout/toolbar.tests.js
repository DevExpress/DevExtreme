import $ from 'jquery';
import ko from 'knockout';

import 'ui/toolbar';
import 'integration/knockout';

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

$('#qunit-fixture').html('<div id="toolbar" data-bind="dxToolbar: { items: items }"></div>');

moduleWithoutCsp('regression', {
    beforeEach: function() {
        this.$element = $('#toolbar');
    }
});

QUnit.test('polymorph widget correctly renders nested widgets', function(assert) {
    const vm = {
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
