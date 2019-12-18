var $ = require('jquery'),
    noop = require('core/utils/common').noop,
    ko = require('knockout');

require('ui/button');
require('ui/tree_view');
require('integration/knockout');

QUnit.test('T198402: Binding to properties of the view model not working from within a dxTreeView itemTemplate', function(assert) {
    var $element = $('<div data-bind=\'dxTreeView: { dataSource: dataSource, itemTemplate: itemTemplate } \'></div>').appendTo('#qunit-fixture');
    var onClickSpy = sinon.spy(noop);
    var viewModel = {
        dataSource: ko.observableArray([
            { Id: 1, Name: 'Name1' },
            { Id: 2, Name: 'Name2' },
            { Id: 3, Name: 'Name3' }
        ]),
        itemTemplate: function() {
            return '<div data-bind="dxButton: { onClick: $root.buttonClick }"></div>';
        },
        buttonClick: onClickSpy
    };

    ko.applyBindings(viewModel, $element.get(0));

    $('.dx-button').eq(0).trigger('dxclick');

    assert.ok(onClickSpy.calledOnce);
});
