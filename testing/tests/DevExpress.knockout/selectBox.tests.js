var $ = require('jquery'),
    SelectBox = require('ui/select_box'),
    fx = require('animation/fx'),
    ko = require('knockout');

require('integration/knockout');

QUnit.testStart(function() {
    var markup =
        '<div id="selectBoxWithFieldTemplate" data-bind="dxSelectBox: { dataSource: dataSource, fieldTemplate: \'field\', valueExpr: \'key\', value: value }">\
            <div data-options="dxTemplate: {name: \'field\'}">\
                <div data-bind="dxTextBox: {}"></div>\
                <span id="customField" data-bind="text: $data.name"></span>\
            </div>\
        </div>\
        <div id="selectBoxWithCustomConfig" data-bind="dxSelectBox: customConfig"></div>\
        \
        <div id="selectBoxWithFieldTemplate2" data-bind="dxSelectBox: { dataSource: dataSource, fieldTemplate: \'field\', selectedItem: selectedItem }">\
            <div data-options="dxTemplate: {name: \'field\'}">\
                <div id="templateTextBox" data-bind="dxTextBox: {value: $data}"></div>\
            </div>\
        </div>\
        \
        <div id="selectBoxFieldTemplateWithDropDownButton" data-bind="dxSelectBox: { items: items, fieldTemplate: \'field\', showDropDownButton: true }">\
            <div data-options="dxTemplate: {name: \'field\'}">\
                <span>test</span>\
                <div data-bind="dxTextBox: {}"></div>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

var moduleSetup = {
    beforeEach: function() {
        SelectBox.defaultOptions({ options: { deferRendering: false } });
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

QUnit.module('widget options', moduleSetup);

QUnit.test('fieldTemplate is bound to selected item', function(assert) {
    var viewModel = {
        dataSource: [
            { key: 1, name: 'one' },
            { key: 2, name: 'two' }
        ],
        value: 1
    };

    var $selectBox = $('#selectBoxWithFieldTemplate');

    ko.applyBindings(viewModel, $selectBox.get(0));

    assert.equal($('#customField').text(), 'one', 'fieldTemplate got item in viewModel');
});

QUnit.test('T221863: null value as template data', function(assert) {
    var viewModel = {
        dataSource: [1, 2, 3],
        selectedItem: null
    };

    var $selectBox = $('#selectBoxWithFieldTemplate2');

    ko.applyBindings(viewModel, $selectBox.get(0));

    var input = $('#templateTextBox').find('.dx-textbox-input');

    assert.equal(input.text(), '', 'textBox is empty when selected item is null');
});

QUnit.test('dropDownButton should be rendered when fieldTemplate is specified', function(assert) {
    var $selectBox = $('#selectBoxFieldTemplateWithDropDownButton');
    var vm = {
        items: [1, 2, 3]
    };

    ko.applyBindings(vm, $selectBox.get(0));

    assert.equal($selectBox.find('.dx-dropdowneditor-button').length, 1, 'dropDownButton rendered after init');

    $selectBox.dxSelectBox('option', 'value', 1);
    assert.equal($selectBox.find('.dx-dropdowneditor-button').length, 1, 'dropDownButton rendered after init');
});

QUnit.testInActiveWindow('select box should correctly update computed value', function(assert) {
    var clock = sinon.useFakeTimers(),
        $selectBox = $('#selectBoxWithCustomConfig'),
        getVM = function() {
            var that = this;
            that.disabled = ko.observable(false);
            that._value = ko.observable('');

            that.customConfig = {
                dataSource: [
                    { value: 1, displayValue: 1 },
                    { value: 2, displayValue: 2 }
                ],
                valueExpr: 'value',
                displayExpr: 'displayValue',
                disabled: that.disabled,
                value: ko.computed({
                    read: function() { return that._value(); },
                    write: function(newVal) {
                        that._value(newVal);
                        that.disabled(true);
                        setTimeout(function() {
                            that.disabled(false);
                        }, 200);
                    }
                })
            };
        };

    ko.applyBindings(new getVM(), $selectBox.get(0));

    var selectBox = $selectBox.dxSelectBox('instance');

    selectBox.focus();
    selectBox.open();
    $('.dx-selectbox-popup-wrapper .dx-list-item')
        .first()
        .trigger('focusin')
        .trigger('dxclick');
    clock.tick(300);

    assert.equal(selectBox.option('value'), 1, 'select box correctly updates the value');
    assert.equal($selectBox.find('.dx-texteditor-input').val(), 1, 'input value is correct');
    clock.restore();
});
