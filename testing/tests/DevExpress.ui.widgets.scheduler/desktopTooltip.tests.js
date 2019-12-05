import { DesktopTooltipStrategy } from "ui/scheduler/tooltip_strategies/desktopTooltipStrategy";
import Tooltip from "ui/tooltip";

var stubCreateComponent = sinon.stub().returns({
    option: sinon.spy()
});
var environment = {
    createSimpleTooltip: function(tooltipOptions) {
        return new DesktopTooltipStrategy(tooltipOptions);
    },
    tooltipOptions: {
        createComponent: stubCreateComponent,
        container: 'container',
        setDefaultTemplate: sinon.spy(),
        getAppointmentTemplate: sinon.spy(),
        showAppointmentPopup: sinon.spy(),
        getText: sinon.spy(function() { return 'text'; }),
        checkAndDeleteAppointment: sinon.spy(),
        getTargetedAppointmentData: sinon.spy()
    },
    extraOptions: {
        rtlEnabled: true,
        focusStateEnabled: true,
        editing: true,
    },
    afterEach: function() {
        stubCreateComponent.reset();
    }
};

QUnit.module("Tooltip", environment);

QUnit.test("Show tooltip", function(assert) {
    var tooltip = this.createSimpleTooltip(this.tooltipOptions);
    var dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);

    assert.ok(tooltip, 'tooltip is created');

    assert.equal(tooltip._tooltip.option.callCount, 2);
    assert.deepEqual(tooltip._tooltip.option.getCall(0).args, ["visible", true], 'tooltip is visible');
    assert.deepEqual(tooltip._tooltip.option.getCall(1).args, ["position", {
        "at": "top",
        "collision": "fit flipfit",
        "my": "bottom"
    }], 'tooltip has correct position');

    assert.ok(this.tooltipOptions.createComponent.calledOnce);
});

QUnit.test("createComponent should be called with correct options", function(assert) {
    var tooltip = this.createSimpleTooltip(this.tooltipOptions);
    var dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);

    var createComponent = this.tooltipOptions.createComponent;

    assert.equal(createComponent.getCall(0).args[0][0].className, "dx-scheduler-appointment-tooltip-wrapper");
    assert.deepEqual(createComponent.getCall(0).args[1], Tooltip);
    assert.equal(Object.keys(createComponent.getCall(0).args[2]).length, 7);
    assert.equal(createComponent.getCall(0).args[2].target, 'target');
    assert.equal(createComponent.getCall(0).args[2].maxHeight, 200);
    assert.equal(createComponent.getCall(0).args[2].rtlEnabled, true);

    assert.ok(createComponent.getCall(0).args[2].onShowing);
    assert.ok(createComponent.getCall(0).args[2].onShown);
    assert.ok(createComponent.getCall(0).args[2].contentTemplate);
    assert.ok(createComponent.getCall(0).args[2].closeOnTargetScroll);
});

QUnit.test("onShowing and closeOnTargetScroll options in createComponent should work correct", function(assert) {
    var tooltip = this.createSimpleTooltip(this.tooltipOptions);
    var dataList = ['data1', 'data2'];

    tooltip.show('target', dataList, this.extraOptions);

    var createComponent = this.tooltipOptions.createComponent;

    // assert.timeout(1000);
    createComponent.getCall(0).args[2].onShowing();

    assert.equal(createComponent.getCall(0).args[2].closeOnTargetScroll(), true);

    // assert.equal(createComponent.getCall(0).args[2].closeOnTargetScroll(), false);
});
