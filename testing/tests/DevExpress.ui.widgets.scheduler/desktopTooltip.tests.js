import { DesktopTooltipStrategy } from 'ui/scheduler/tooltip_strategies/desktopTooltipStrategy';
import { FunctionTemplate } from 'core/templates/function_template';
import { extend } from 'core/utils/extend';
import Tooltip from 'ui/tooltip';
import List from 'ui/list/ui.list.edit';
import Button from 'ui/button';
import support from 'core/utils/support';

const stubComponent = {
    option: sinon.stub().returns('stubOption'),
    focus: sinon.stub(),
};
const stubCreateComponent = sinon.stub().returns(stubComponent);
const stubShowAppointmentPopup = sinon.stub();
const stubAddDefaultTemplates = sinon.stub();
const stubGetAppointmentTemplate = sinon.stub().returns('template');
const stubCheckAndDeleteAppointment = sinon.stub();
const stubCreateFormattedDateText = sinon.stub().returns('text');
const stubGetAppointmentDisabled = sinon.stub().returns(false);
const stubIsAppointmentInAllDayPanel = sinon.stub().returns(true);

const environment = {
    createSimpleTooltip: function(tooltipOptions) {
        return new DesktopTooltipStrategy(tooltipOptions);
    },
    tooltipOptions: {
        createComponent: stubCreateComponent,
        container: '<div>',
        addDefaultTemplates: stubAddDefaultTemplates,
        getAppointmentTemplate: stubGetAppointmentTemplate,
        showAppointmentPopup: stubShowAppointmentPopup,
        createFormattedDateText: stubCreateFormattedDateText,
        getAppointmentDisabled: stubGetAppointmentDisabled,
        checkAndDeleteAppointment: stubCheckAndDeleteAppointment,
        isAppointmentInAllDayPanel: stubIsAppointmentInAllDayPanel,
    },
    extraOptions: {
        rtlEnabled: true,
        focusStateEnabled: true,
        editing: true,
        offset: 'offset',
        isButtonClick: false,
    },
    afterEach: function() {
        stubCreateComponent.reset();
        stubComponent.option.reset();
        stubShowAppointmentPopup.reset();
        stubAddDefaultTemplates.reset();
        stubGetAppointmentTemplate.reset();
        stubCreateFormattedDateText.reset();
        stubCreateFormattedDateText.reset();
        stubCheckAndDeleteAppointment.reset();
    }
};

QUnit.module('Tooltip', environment);

QUnit.test('Show tooltip', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);

    assert.ok(tooltip, 'tooltip is created');

    assert.equal(stubComponent.option.callCount, 2);
    assert.deepEqual(stubComponent.option.getCall(0).args, ['position', {
        'at': 'top',
        'collision': 'fit flipfit',
        'my': 'bottom',
        boundary: '<div>',
        offset: 'offset',
    }], 'tooltip has correct position');
    assert.deepEqual(stubComponent.option.getCall(1).args, ['visible', true], 'tooltip is visible');

    assert.ok(stubCreateComponent.calledOnce);
});

QUnit.test('Shouldn\'t show tooltip if data is not array', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = 12;

    tooltip.show('target', dataList, this.extraOptions);

    assert.ok(!stubCreateComponent.called);
});

QUnit.test('createComponent should be called with correct options', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);

    assert.equal(stubCreateComponent.getCall(0).args[0][0].className, 'dx-scheduler-appointment-tooltip-wrapper');
    assert.deepEqual(stubCreateComponent.getCall(0).args[1], Tooltip);
    assert.equal(Object.keys(stubCreateComponent.getCall(0).args[2]).length, 5);
    assert.equal(stubCreateComponent.getCall(0).args[2].target, 'target');
    assert.equal(stubCreateComponent.getCall(0).args[2].maxHeight, 200);
    assert.equal(stubCreateComponent.getCall(0).args[2].rtlEnabled, true);

    assert.ok(stubCreateComponent.getCall(0).args[2].onShown);
    assert.ok(stubCreateComponent.getCall(0).args[2].contentTemplate);
});

QUnit.test('contentTemplate passed to createComponent should work correct', function(assert) {
    const _touch = support.touch;
    try {
        support.touch = false;
        const tooltip = this.createSimpleTooltip(this.tooltipOptions);
        const dataList = ['data1', 'data2'];

        tooltip.show('target', dataList, this.extraOptions);

        stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');

        assert.equal(stubCreateComponent.getCall(1).args[0][0].nodeName, 'DIV');
        assert.equal(stubCreateComponent.getCall(1).args[1], List);
        assert.equal(Object.keys(stubCreateComponent.getCall(1).args[2]).length, 6);
        assert.equal(stubCreateComponent.getCall(1).args[2].dataSource, dataList);
        assert.equal(stubCreateComponent.getCall(1).args[2].showScrollbar, 'onHover');
        assert.ok(stubCreateComponent.getCall(1).args[2].onContentReady);
        assert.ok(stubCreateComponent.getCall(1).args[2].onItemClick);
        assert.ok(stubCreateComponent.getCall(1).args[2].itemTemplate);
        assert.notOk(stubCreateComponent.getCall(1).args[2]._swipeEnabled);
    } finally {
        support.touch = _touch;
    }
});

QUnit.test('Tooltip should update the content after call method "show" several times', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);

    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');
    stubComponent.option.reset();

    tooltip.show('target', ['updatedData1', 'updatedData2'], this.extraOptions);

    assert.equal(stubComponent.option.callCount, 5);
    assert.deepEqual(stubComponent.option.getCall(0).args, ['visible', false]);
    assert.deepEqual(stubComponent.option.getCall(1).args, ['target', 'target']);
    assert.deepEqual(stubComponent.option.getCall(2).args, ['dataSource', ['updatedData1', 'updatedData2']]);
    assert.deepEqual(stubComponent.option.getCall(3).args, ['position', {
        'at': 'top',
        'collision': 'fit flipfit',
        'my': 'bottom',
        boundary: '<div>',
        offset: 'offset'
    }]);
    assert.deepEqual(stubComponent.option.getCall(4).args, ['visible', true]);
});

QUnit.test('onShown passed to createComponent should work correct, one element in tooltip', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);
    stubComponent.option.reset();
    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');
    stubCreateComponent.getCall(0).args[2].onShown();

    assert.equal(stubComponent.option.callCount, 1);
    assert.deepEqual(stubComponent.option.getCall(0).args, ['focusStateEnabled', true]);
});

QUnit.test('onShown passed to createComponent should work correct, several elements in tooltip', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, extend(this.extraOptions, { isButtonClick: true }));
    stubComponent.option.reset();
    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');
    stubCreateComponent.getCall(0).args[2].onShown();

    assert.equal(stubComponent.option.callCount, 2);
    assert.deepEqual(stubComponent.option.getCall(1).args, ['focusedElement', null]);
    assert.ok(stubComponent.focus.called);
});

QUnit.test('contentTemplate passed to createComponent should pass correct showScrollbar option for touch device', function(assert) {
    const _touch = support.touch;
    try {
        support.touch = true;
        const tooltip = this.createSimpleTooltip(this.tooltipOptions);
        const dataList = ['data1', 'data2'];

        tooltip.show('target', dataList, this.extraOptions);
        stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');

        assert.equal(stubCreateComponent.getCall(1).args[2].showScrollbar, 'always');
    } finally {
        support.touch = _touch;
    }
});

QUnit.test('onContentReady passed to createComponent should work correct', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);
    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');

    assert.equal(stubCreateComponent.getCall(1).args[2].onContentReady(), undefined, 'called without errors');
});

QUnit.test('onContentReady passed to createComponent should work correct, with dragBehavior', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];
    const dragBehavior = sinon.spy();

    tooltip.show('target', dataList, extend(this.extraOptions, { dragBehavior: dragBehavior }));
    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');

    assert.equal(stubCreateComponent.getCall(1).args[2].onContentReady(), undefined, 'called without errors');
    assert.ok(dragBehavior.called);
});

QUnit.test('onItemClick passed to createComponent should work correct', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];
    const event = { itemData: { appointment: 'appointment', targetedAppointment: 'targetedAppointment' } };

    tooltip.show('target', dataList, this.extraOptions);
    stubComponent.option.reset();
    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');
    stubCreateComponent.getCall(1).args[2].onItemClick(event);

    assert.deepEqual(stubComponent.option.getCall(0).args, ['visible', false], 'tooltip is hide');
    assert.deepEqual(stubShowAppointmentPopup.getCall(0).args, [event.itemData.appointment, false, event.itemData.targetedAppointment]);
});

QUnit.test('onItemClick passed to createComponent should work correct, with clickEvent', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];
    const event = { itemData: { appointment: 'appointment', targetedAppointment: 'targetedAppointment' } };
    const clickEvent = sinon.spy();

    tooltip.show('target', dataList, extend(this.extraOptions, { clickEvent: clickEvent }));
    stubComponent.option.reset();
    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');
    stubCreateComponent.getCall(1).args[2].onItemClick(event);

    assert.deepEqual(stubComponent.option.getCall(0).args, ['visible', false], 'tooltip is hide');
    assert.deepEqual(stubShowAppointmentPopup.getCall(0).args, [event.itemData.appointment, false, event.itemData.targetedAppointment]);
    assert.ok(clickEvent.called);
});

QUnit.test('itemTemplate passed to createComponent should work correct', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];
    const item = { appointment: 'data', targetedAppointment: 'currentData', color: { done: sinon.spy() } };

    tooltip.show('target', dataList, this.extraOptions);
    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');

    const itemTemplate = stubCreateComponent.getCall(1).args[2].itemTemplate(item, 'index');

    assert.ok(itemTemplate instanceof FunctionTemplate);
    assert.ok(stubAddDefaultTemplates.getCall(0).args[0]['appointmentTooltip'] instanceof FunctionTemplate);
    assert.equal(stubGetAppointmentTemplate.getCall(0).args[0], 'appointmentTooltipTemplate');
    assert.deepEqual(stubCreateFormattedDateText.getCall(0).args, [item.appointment, item.targetedAppointment]);

    // create delete button
    assert.equal(stubCreateComponent.getCall(2).args[0][0].className, 'dx-tooltip-appointment-item-delete-button');
    assert.deepEqual(stubCreateComponent.getCall(2).args[1], Button);
    assert.equal(stubCreateComponent.getCall(2).args[2].icon, 'trash');
    assert.equal(stubCreateComponent.getCall(2).args[2].stylingMode, 'text');
    assert.ok(stubCreateComponent.getCall(2).args[2].onClick);

    // check onClick function
    stubComponent.option.reset();
    const e = { event: { stopPropagation: sinon.spy() } };
    stubCreateComponent.getCall(2).args[2].onClick(e);
    assert.deepEqual(stubComponent.option.getCall(0).args, ['visible', false], 'tooltip is hide');
    assert.ok(e.event.stopPropagation.called);
    assert.deepEqual(stubCheckAndDeleteAppointment.getCall(0).args, [item.appointment, item.targetedAppointment]);
});

QUnit.test('Delete button shouldn\'t createed, editing = false', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];
    const item = { appointment: 'appointment', targetedAppointment: 'appointment', color: { done: sinon.spy() } };

    tooltip.show('target', dataList, extend(this.extraOptions, { editing: false }));
    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');
    stubCreateComponent.getCall(1).args[2].itemTemplate(item, 'index');

    assert.equal(stubCreateComponent.getCall(2), undefined);
});

QUnit.test('Delete button shouldn\'t created, appointment is disabled', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = [{ data: 'data1', disabled: true }, { data: 'data2', disabled: true }];
    const item = { appointment: dataList[0], targetedAppointment: 'currentData', color: { done: sinon.spy() } };

    tooltip.show('target', dataList, this.extraOptions);
    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');
    stubCreateComponent.getCall(1).args[2].itemTemplate(item, 'index');

    assert.equal(stubCreateComponent.getCall(2), undefined);
});

QUnit.test('isAlreadyShown method, tooltip is not created', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const target = ['target'];

    assert.ok(!tooltip.isAlreadyShown(target), 'tooltip is not created and haven\'t data');
});

QUnit.test('isAlreadyShown method, tooltip is created and shown', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = [{ data: 'data1' }, { data: 'data2' }];
    const target = ['target'];
    const callback = sinon.stub();

    callback.withArgs('target').returns(target);
    callback.withArgs('visible').returns(true);
    stubComponent.option = callback;

    tooltip.show(target, dataList, this.extraOptions);
    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');

    assert.ok(tooltip.isAlreadyShown(target), 'tooltip is shown and have the same target');
    assert.ok(!tooltip.isAlreadyShown(['target_1']), 'tooltip is shown and have another target');
});

QUnit.test('isAlreadyShown method, tooltip is hide', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = [{ data: 'data1' }, { data: 'data2' }];
    const target = ['target'];
    const callback = sinon.stub();

    callback.withArgs('target').returns(target);
    callback.withArgs('visible').returns(false);
    stubComponent.option = callback;
    tooltip.show(target, dataList, this.extraOptions);

    assert.ok(!tooltip.isAlreadyShown(target), 'tooltip is hidden');
});

QUnit.test('appointmentTooltipTemplate equal to "appointmentTooltipTemplate"', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];
    const item = { appointment: 'appointment', targetedAppointment: 'targetedAppointment', color: { done: sinon.spy() } };

    tooltip.show('target', dataList, extend(this.extraOptions, { appointmentTooltipTemplate: 'appointmentTooltipTemplate' }));
    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');
    stubCreateComponent.getCall(1).args[2].itemTemplate(item, 'index');

    assert.ok(stubAddDefaultTemplates.getCall(0).args[0]['appointmentTooltip'] instanceof FunctionTemplate);
    assert.equal(stubGetAppointmentTemplate.getCall(0).args[0], 'appointmentTooltipTemplate');
});

QUnit.test('appointmentTooltipTemplate equal to custom template', function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];
    const item = { appointment: 'appointment', targetedAppointment: 'targetedAppointment', color: { done: sinon.spy() } };

    tooltip.show('target', dataList, extend(this.extraOptions, { appointmentTooltipTemplate: 'custom_template' }));
    stubCreateComponent.getCall(0).args[2].contentTemplate('<div>');
    stubCreateComponent.getCall(1).args[2].itemTemplate(item, 'index');

    assert.ok(stubAddDefaultTemplates.getCall(0).args[0]['dropDownAppointment'] instanceof FunctionTemplate);
    assert.equal(stubGetAppointmentTemplate.getCall(0).args[0], 'appointmentTooltipTemplate');
});
