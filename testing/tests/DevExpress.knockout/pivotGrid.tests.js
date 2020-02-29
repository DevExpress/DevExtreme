const $ = require('jquery');
const ko = require('knockout');

require('ui/pivot_grid/ui.pivot_grid');
require('integration/knockout');

QUnit.testStart(function() {
    const markup =
        '<div id="view">\
            <div id="pivotGridContainer" data-bind="dxPivotGrid: pivotOptions"></div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('dxPivotGrid', {
    beforeEach: function() {
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
    },

    applyBindings: function(pivotOptions) {
        ko.applyBindings({ pivotOptions: pivotOptions }, document.getElementById('view'));
    }
});

QUnit.test('T244054. DataSource option changing', function(assert) {
    const dataSource = ko.observable({
        store: [
            { key: 1, title: 'Item1' },
            { key: 2, title: 'Item2' }],
        fields: [
            { dataField: 'title', area: 'column' },
            { dataField: 'key', area: 'row' },
            { summaryType: 'count', area: 'data' }
        ]
    });

    this.applyBindings({ dataSource: dataSource });
    this.clock.tick();

    // Act
    dataSource({ store: [{ key: 10, title: 'Item1' }, { key: 20, title: 'Item2' }], fields: [{ dataField: 'title', area: 'column' }, { dataField: 'key', area: 'row' }, { summaryType: 'count', area: 'data' }] });
    this.clock.tick();
    // Assert
    assert.ok($('#pivotGridContainer').dxPivotGrid('instance'));
    const $rowAreaCells = $('#pivotGridContainer .dx-pivotgrid-vertical-headers td');
    assert.strictEqual($rowAreaCells.eq(0).text(), '10');
    assert.strictEqual($rowAreaCells.eq(1).text(), '20');
});
