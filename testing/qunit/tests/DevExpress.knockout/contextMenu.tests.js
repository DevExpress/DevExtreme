const $ = require('jquery');
const ko = require('knockout');

require('ui/context_menu/ui.context_menu');
require('integration/knockout');

QUnit.test('context menu should change it\'s position if it\'s part was changed by viewmodel', function(assert) {
    const vm = {
        my: ko.observable('top')
    };

    $('#qunit-fixture').append('<div id="menu1" data-bind="dxContextMenu: { position: { my: my } }"></div>');
    ko.applyBindings(vm, $('#menu1').get(0));

    const instance = $('#menu1').dxContextMenu('instance');

    vm.my('bottom');

    assert.equal(instance.option('position').my, 'bottom', 'position option was changed');
});
