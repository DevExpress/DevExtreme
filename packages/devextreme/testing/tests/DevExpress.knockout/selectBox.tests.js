import $ from 'jquery';
import SelectBox from 'ui/select_box';
import fx from 'common/core/animation/fx';
import ko from 'knockout';

import 'integration/knockout';

const moduleWithoutCsp = QUnit.urlParams['nocsp'] ? QUnit.module : QUnit.module.skip;

QUnit.testStart(function() {
    const markup =
        '<div id="selectBoxWithFieldAddons" data-bind="dxSelectBox: { dataSource: dataSource, fieldAddons: { beforeTemplate: \'field\' }, valueExpr: \'key\', value: value }">\
            <div data-options="dxTemplate: {name: \'field\'}">\
                <span id="customField" data-bind="text: $data.name"></span>\
            </div>\
        </div>\
        <div id="selectBoxWithCustomConfig" data-bind="dxSelectBox: customConfig"></div>\
        \
        <div id="selectBoxWithFieldAddons2" data-bind="dxSelectBox: { dataSource: dataSource, fieldAddons: { beforeTemplate: \'field\' }, selectedItem: selectedItem }">\
            <div data-options="dxTemplate: {name: \'field\'}">\
                <span id="templateField" data-bind="text: $data"></span>\
            </div>\
        </div>';

    $('#qunit-fixture').html(markup);
});

const moduleSetup = {
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

moduleWithoutCsp('widget options', moduleSetup);

QUnit.test('fieldAddons.beforeTemplate is bound to selected item', function(assert) {
    const viewModel = {
        dataSource: [
            { key: 1, name: 'one' },
            { key: 2, name: 'two' }
        ],
        value: 1
    };

    const $selectBox = $('#selectBoxWithFieldAddons');

    ko.applyBindings(viewModel, $selectBox.get(0));

    assert.equal($('#customField').text(), 'one', 'template got item in viewModel');
});

QUnit.test('T221863: null value as template data', function(assert) {
    const viewModel = {
        dataSource: [1, 2, 3],
        selectedItem: null
    };

    const $selectBox = $('#selectBoxWithFieldAddons2');

    ko.applyBindings(viewModel, $selectBox.get(0));

    assert.equal($('#templateField').text(), '', 'template is empty when selected item is null');
});

QUnit.testInActiveWindow('select box should correctly update computed value', function(assert) {
    const $selectBox = $('#selectBoxWithCustomConfig');
    const getVM = function() {
        const that = this;
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

    const selectBox = $selectBox.dxSelectBox('instance');

    selectBox.focus();
    selectBox.open();
    $('.dx-selectbox-popup-wrapper .dx-list-item')
        .first()
        .trigger('focusin')
        .trigger('dxclick');
    this.clock.tick(300);

    assert.equal(selectBox.option('value'), 1, 'select box correctly updates the value');
    assert.equal($selectBox.find('.dx-texteditor-input').val(), 1, 'input value is correct');
    this.clock.restore();
});
