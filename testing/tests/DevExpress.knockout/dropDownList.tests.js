var $ = require('jquery'),
    fx = require('animation/fx'),
    ko = require('knockout');

require('integration/knockout');
require('ui/drop_down_editor/ui.drop_down_list');

require('common.css!');

QUnit.testStart(function() {
    var markup =
        '<div id="dropDownListWithKO" data-bind="dxDropDownList: { dataSource: dataSource }"></div>\
        <div id="dropDownListWithKOAndKeyboardSupport" data-bind="dxDropDownList: { dataSource: dataSource, focusStateEnabled: true }"></div>\
        <div id="dropDownListWithKOAndSelectedItem" data-bind="dxDropDownList: {items: items, selectedItem: selectedItem}"></div>';

    $('#qunit-fixture').html(markup);
});

var moduleConfig = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        this.clock.restore();
        fx.off = false;
    }
};

QUnit.module('items & dataSource', moduleConfig);

QUnit.test('dataSource should changed when keyboard is support', function(assert) {
    var $dropDownList = $('#dropDownListWithKOAndKeyboardSupport');

    var model = {
        dataSource: ko.observableArray()
    };

    ko.applyBindings(model, $dropDownList.get(0));

    model.dataSource.push('one');

    $dropDownList.dxDropDownList('option', 'opened', true);
    this.clock.tick();

    assert.equal($.trim($('.dx-item').text()), 'one', 'item rendered');

});

QUnit.test('visible item binding', function(assert) {
    var $dropDownList = $('#dropDownListWithKO');
    var model = {
        dataSource: [{
            text: 'text',
            visible: ko.observable(false)
        }]
    };

    ko.applyBindings(model, $dropDownList.get(0));

    $dropDownList.dxDropDownList('option', 'opened', true);
    this.clock.tick();

    assert.ok($('.dx-item').is(':hidden'), 'item is hidden');
});


QUnit.module('selectedItem', moduleConfig);

QUnit.test('selectedItem binding', function(assert) {
    var $dropDownList = $('#dropDownListWithKOAndSelectedItem');
    var vm = {
        items: [1, 2, 3, 4],
        selectedItem: ko.observable()
    };

    ko.applyBindings(vm, $dropDownList.get(0));
    $dropDownList.dxDropDownList('option', 'value', 1);

    assert.equal(vm.selectedItem(), 1, 'selectedItem changed');
});
