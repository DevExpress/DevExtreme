var $ = require('jquery'),
    ko = require('knockout');

require('ui/tabs');
require('integration/knockout');

QUnit.test('regression: B250529', function(assert) {
    var itemClickFired = false;

    var vm = {
        options: {
            items: [1, 2],
            selectedIndex: ko.observable(0),
            onItemClick: function() {
                itemClickFired = true;
            }
        }
    };

    var markup = $('<div></div>').attr('data-bind', 'dxTabs: options').appendTo('#qunit-fixture');
    ko.applyBindings(vm, markup[0]);

    markup.find('.dx-tab').eq(1).trigger('dxclick');

    assert.equal(vm.options.selectedIndex(), 1, 'ensure that selected tab is changed');
    assert.equal(itemClickFired, true, 'ensure that \'onItemClick\' is fired');
});
