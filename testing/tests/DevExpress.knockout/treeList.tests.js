var $ = require('jquery'),
    ko = require('knockout');

require('ui/tree_list');
require('integration/knockout');

var testArray = [
    { Id: 1, Head_ID: 0, Name: 'Name1' },
    { Id: 2, Head_ID: 1, Name: 'Name2' },
    { Id: 3, Head_ID: 1, Name: 'Name3' },
    { Id: 4, Head_ID: 2, Name: 'Name4' },
    { Id: 5, Head_ID: 2, Name: 'Name5' },
    { Id: 6, Head_ID: 3, Name: 'Name6' },
    { Id: 7, Head_ID: 3, Name: 'Name7' }
];

QUnit.testStart(function() {
    var markup =
        '<div id="testContainer">\
            <div id=treeList data-bind="dxTreeList: treeListOptions"></div>\
            <div id="testElement" data-bind="foreach: keys"><div data-bind="text: $data"></div></div>\
        <div>';

    $('#qunit-fixture').html(markup);
});

QUnit.test('Two-way binding works well with the \'expandedRowKeys\' option', function(assert) {
    var $testContainer = $('#testContainer'),
        keys = ko.observableArray([1]),
        clock = sinon.useFakeTimers(),
        viewModel = {
            treeListOptions: {
                dataSource: testArray,
                columns: ['Name'],
                keyExpr: 'Id',
                parentIdExpr: 'Head_ID',
                expandedRowKeys: keys
            },
            keys: keys
        };

    ko.applyBindings(viewModel, $testContainer.get(0));

    clock.tick();

    $testContainer
        .find('.dx-treelist-collapsed')
        .first()
        .trigger('dxclick');

    clock.tick();

    assert.equal($('#testElement').text(), '12', 'Observable correctly notify its subscribers');
    clock.restore();
});

QUnit.test('Two-way binding works well with the \'expandedRowKeys\' and \'autoExpandAll\' options', function(assert) {
    var $testContainer = $('#testContainer'),
        keys = ko.observableArray([]),
        clock = sinon.useFakeTimers(),
        viewModel = {
            treeListOptions: {
                dataSource: testArray,
                autoExpandAll: true,
                columns: ['Name'],
                keyExpr: 'Id',
                parentIdExpr: 'Head_ID',
                expandedRowKeys: keys
            },
            keys: keys
        };

    ko.applyBindings(viewModel, $testContainer.get(0));

    clock.tick();

    assert.equal($('#testElement').text(), '231', 'Observable correctly notify its subscribers');
    clock.restore();
});
