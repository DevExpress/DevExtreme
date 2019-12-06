import { DesktopTooltipStrategy } from "ui/scheduler/tooltip_strategies/desktopTooltipStrategy";
import { FunctionTemplate } from "core/templates/function_template";
import { extend } from "core/utils/extend";
import Tooltip from "ui/tooltip";
import List from "ui/list/ui.list.edit";
import Button from "ui/button";
import support from "core/utils/support";

const stubComponent = {
    option: sinon.stub().returns("stubOption"),
    focus: sinon.stub()
};
const stubCreateComponent = sinon.stub().returns(stubComponent);
const stubShowAppointmentPopup = sinon.stub();
const stubSetDefaultTemplate = sinon.stub();
const stubGetAppointmentTemplate = sinon.stub().returns("template");
const stubGetTargetedAppointmentData = sinon.stub().returns("targetedAppointmentData");
const stubCheckAndDeleteAppointment = sinon.stub();
const stubGetText = sinon.stub().returns('text');
const environment = {
    createSimpleTooltip: function(tooltipOptions) {
        return new DesktopTooltipStrategy(tooltipOptions);
    },
    tooltipOptions: {
        createComponent: stubCreateComponent,
        container: '<div>',
        setDefaultTemplate: stubSetDefaultTemplate,
        getAppointmentTemplate: stubGetAppointmentTemplate,
        showAppointmentPopup: stubShowAppointmentPopup,
        getText: stubGetText,
        checkAndDeleteAppointment: stubCheckAndDeleteAppointment,
        getTargetedAppointmentData: stubGetTargetedAppointmentData
    },
    extraOptions: {
        rtlEnabled: true,
        focusStateEnabled: true,
        editing: true,
    },
    afterEach: function() {
        stubCreateComponent.reset();
        stubComponent.option.reset();
        stubShowAppointmentPopup.reset();
        stubSetDefaultTemplate.reset();
        stubGetAppointmentTemplate.reset();
        stubGetText.reset();
        stubCheckAndDeleteAppointment.reset();
        stubGetTargetedAppointmentData.reset();
    }
};

QUnit.module("Tooltip", environment);

QUnit.test("Show tooltip", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);

    assert.ok(tooltip, 'tooltip is created');

    assert.equal(stubComponent.option.callCount, 2);
    assert.deepEqual(stubComponent.option.getCall(0).args, ["visible", true], 'tooltip is visible');
    assert.deepEqual(stubComponent.option.getCall(1).args, ["position", {
        "at": "top",
        "collision": "fit flipfit",
        "my": "bottom"
    }], 'tooltip has correct position');

    assert.ok(stubCreateComponent.calledOnce);
});

QUnit.test("Shouldn't show tooltip if data is not array", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = 12;

    tooltip.show('target', dataList, this.extraOptions);

    assert.ok(!stubCreateComponent.called);
});

QUnit.test("createComponent should be called with correct options", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);

    assert.equal(stubCreateComponent.getCall(0).args[0][0].className, "dx-scheduler-appointment-tooltip-wrapper");
    assert.deepEqual(stubCreateComponent.getCall(0).args[1], Tooltip);
    assert.equal(Object.keys(stubCreateComponent.getCall(0).args[2]).length, 7);
    assert.equal(stubCreateComponent.getCall(0).args[2].target, 'target');
    assert.equal(stubCreateComponent.getCall(0).args[2].maxHeight, 200);
    assert.equal(stubCreateComponent.getCall(0).args[2].rtlEnabled, true);

    assert.ok(stubCreateComponent.getCall(0).args[2].onShowing);
    assert.ok(stubCreateComponent.getCall(0).args[2].onShown);
    assert.ok(stubCreateComponent.getCall(0).args[2].contentTemplate);
    assert.ok(stubCreateComponent.getCall(0).args[2].closeOnTargetScroll);
});

QUnit.test("onShowing and closeOnTargetScroll options passed to createComponent should work correct", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);

    const done = assert.async();

    stubCreateComponent.getCall(0).args[2].onShowing();
    assert.equal(stubCreateComponent.getCall(0).args[2].closeOnTargetScroll(), true);
    assert.timeout(1000);
    setTimeout(function() {
        assert.equal(stubCreateComponent.getCall(0).args[2].closeOnTargetScroll(), false);
        done();
    });
});

QUnit.test("contentTemplate passed to createComponent should work correct", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);

    stubCreateComponent.getCall(0).args[2].contentTemplate("<div>");

    assert.equal(stubCreateComponent.getCall(1).args[0][0].nodeName, 'DIV');
    assert.equal(stubCreateComponent.getCall(1).args[1], List);
    assert.equal(Object.keys(stubCreateComponent.getCall(1).args[2]).length, 5);
    assert.equal(stubCreateComponent.getCall(1).args[2].dataSource, dataList);
    assert.equal(stubCreateComponent.getCall(1).args[2].showScrollbar, "onHover");
    assert.ok(stubCreateComponent.getCall(1).args[2].onContentReady);
    assert.ok(stubCreateComponent.getCall(1).args[2].onItemClick);
    assert.ok(stubCreateComponent.getCall(1).args[2].itemTemplate);
});

QUnit.test("Tooltip should update the content after call method 'show' several times", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);

    stubCreateComponent.getCall(0).args[2].contentTemplate("<div>");
    stubComponent.option.reset();

    tooltip.show('target', ['updatedData1', 'updatedData2'], this.extraOptions);

    assert.equal(stubComponent.option.callCount, 5);
    assert.deepEqual(stubComponent.option.getCall(0).args, ["visible", false]);
    assert.deepEqual(stubComponent.option.getCall(1).args, ["target", "target"]);
    assert.deepEqual(stubComponent.option.getCall(2).args, ["dataSource", ["updatedData1", "updatedData2"]]);
    assert.deepEqual(stubComponent.option.getCall(3).args, ["visible", true]);
    assert.deepEqual(stubComponent.option.getCall(4).args, ["position", {
        "at": "top",
        "collision": "fit flipfit",
        "my": "bottom"
    }]);
});

QUnit.test("onShown passed to createComponent should work correct", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);
    stubComponent.option.reset();
    stubCreateComponent.getCall(0).args[2].contentTemplate("<div>");
    stubCreateComponent.getCall(0).args[2].onShown();

    assert.equal(stubComponent.option.callCount, 2);
    assert.deepEqual(stubComponent.option.getCall(0).args, ["focusStateEnabled", true]);
    assert.deepEqual(stubComponent.option.getCall(1).args, ["focusedElement", null]);
    assert.ok(stubComponent.focus.called);
});

QUnit.test("contentTemplate passed to createComponent should pass correct showScrollbar option for touch device", function(assert) {
    const _touch = support.touch;
    try {
        support.touch = true;
        const tooltip = this.createSimpleTooltip(this.tooltipOptions);
        const dataList = ['data1', 'data2'];

        tooltip.show('target', dataList, this.extraOptions);
        stubCreateComponent.getCall(0).args[2].contentTemplate("<div>");

        assert.equal(stubCreateComponent.getCall(1).args[2].showScrollbar, "always");
    } finally {
        support.touch = _touch;
    }
});

QUnit.test("onContentReady passed to createComponent should work correct", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);
    stubCreateComponent.getCall(0).args[2].contentTemplate("<div>");

    assert.equal(stubCreateComponent.getCall(1).args[2].onContentReady(), undefined, 'called without errors');
});

QUnit.test("onContentReady passed to createComponent should work correct, with dragBehavior", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];
    const dragBehavior = sinon.spy();

    tooltip.show('target', dataList, extend(this.extraOptions, { dragBehavior: dragBehavior }));
    stubCreateComponent.getCall(0).args[2].contentTemplate("<div>");

    assert.equal(stubCreateComponent.getCall(1).args[2].onContentReady(), undefined, 'called without errors');
    assert.ok(dragBehavior.called);
});

QUnit.test("onItemClick passed to createComponent should work correct", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];
    const event = { itemData: { data: 'data', currentData: 'currentData' } };

    tooltip.show('target', dataList, this.extraOptions);
    stubComponent.option.reset();
    stubCreateComponent.getCall(0).args[2].contentTemplate("<div>");
    stubCreateComponent.getCall(1).args[2].onItemClick(event);

    assert.deepEqual(stubComponent.option.getCall(0).args, ["visible", false], 'tooltip is hide');
    assert.deepEqual(stubShowAppointmentPopup.getCall(0).args, [event.itemData.data, false, event.itemData.currentData]);
});

QUnit.test("onItemClick passed to createComponent should work correct, with clickEvent", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];
    const event = { itemData: { data: 'data', currentData: 'currentData' } };
    const clickEvent = sinon.spy();

    tooltip.show('target', dataList, extend(this.extraOptions, { clickEvent: clickEvent }));
    stubComponent.option.reset();
    stubCreateComponent.getCall(0).args[2].contentTemplate("<div>");
    stubCreateComponent.getCall(1).args[2].onItemClick(event);

    assert.deepEqual(stubComponent.option.getCall(0).args, ["visible", false], 'tooltip is hide');
    assert.deepEqual(stubShowAppointmentPopup.getCall(0).args, [event.itemData.data, false, event.itemData.currentData]);
    assert.ok(clickEvent.called);
});

QUnit.test("itemTemplate passed to createComponent should work correct", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];
    const item = { data: "data", currentData: "currentData", color: { done: sinon.spy() } };

    tooltip.show('target', dataList, this.extraOptions);
    stubCreateComponent.getCall(0).args[2].contentTemplate("<div>");

    const itemTemplate = stubCreateComponent.getCall(1).args[2].itemTemplate(item, "index");

    assert.ok(itemTemplate instanceof FunctionTemplate);
    assert.equal(stubSetDefaultTemplate.getCall(0).args[0], "appointmentTooltip");
    assert.ok(stubSetDefaultTemplate.getCall(0).args[1] instanceof FunctionTemplate);
    assert.equal(stubGetAppointmentTemplate.getCall(0).args[0], "appointmentTooltipTemplate");
    assert.deepEqual(stubGetText.getCall(0).args, [item.data, item.currentData]);

    // create delete button
    assert.equal(stubCreateComponent.getCall(2).args[0][0].className, "dx-tooltip-appointment-item-delete-button");
    assert.deepEqual(stubCreateComponent.getCall(2).args[1], Button);
    assert.equal(stubCreateComponent.getCall(2).args[2].icon, "trash");
    assert.equal(stubCreateComponent.getCall(2).args[2].stylingMode, "text");
    assert.ok(stubCreateComponent.getCall(2).args[2].onClick);

    // check onClick function
    stubComponent.option.reset();
    const e = { event: { stopPropagation: sinon.spy() } };
    stubCreateComponent.getCall(2).args[2].onClick(e);
    assert.deepEqual(stubComponent.option.getCall(0).args, ["visible", false], 'tooltip is hide');
    assert.ok(e.event.stopPropagation.called);
    assert.deepEqual(stubCheckAndDeleteAppointment.getCall(0).args, [item.data, item.currentData]);
});

QUnit.test("Delete button should't create, editing = false", function(assert) {
    const tooltip = this.createSimpleTooltip(this.tooltipOptions);
    const dataList = ['data1', 'data2'];
    const item = { data: "data", currentData: "currentData", color: { done: sinon.spy() } };

    tooltip.show('target', dataList, extend(this.extraOptions, { editing: false }));
    stubCreateComponent.getCall(0).args[2].contentTemplate("<div>");
    stubCreateComponent.getCall(1).args[2].itemTemplate(item, "index");

    assert.equal(stubCreateComponent.getCall(2), undefined);
});
