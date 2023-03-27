import $ from 'jquery';
const noop = require('core/utils/common').noop;
import ko from 'knockout';

import 'ui/button';
import 'ui/tree_view';
import 'integration/knockout';

QUnit.test('T198402: Binding to properties of the view model not working from within a dxTreeView itemTemplate', function(assert) {
    const $element = $('<div data-bind=\'dxTreeView: { dataSource: dataSource, itemTemplate: itemTemplate } \'></div>').appendTo('#qunit-fixture');
    const onClickSpy = sinon.spy(noop);
    const viewModel = {
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
