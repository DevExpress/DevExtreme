import $ from "jquery";
import legendModule, { Legend } from "viz/components/legend";
import { stubClass } from "../../helpers/vizMocks.js";
const stubLegend = stubClass(Legend);
import vizMocks from "../../helpers/vizMocks.js";
import rendererModule from "viz/core/renderers/renderer";

import "viz/gauges/bar_gauge";

QUnit.module("Legend", {
    beforeEach() {
        this.renderer = new vizMocks.Renderer();

        sinon.stub(rendererModule, "Renderer", () => {
            return this.renderer;
        });

        sinon.stub(legendModule, "Legend", () => {
            var stub = new stubLegend();
            stub.stub("measure").returns([120, 120]);
            stub.stub("layoutOptions").returns({
                horizontalAlignment: "right",
                verticalAlignment: "top",
                side: "horizontal"
            });
            return stub;
        });
    },
    afterEach() {
        legendModule.Legend.restore();
        rendererModule.Renderer.restore();
    },

    createGauge(options) {
        return $("<div>").appendTo($("#qunit-fixture")).dxBarGauge(options).dxBarGauge("instance");
    }
});

QUnit.test("Create a legend on widget initialization", function(assert) {
    this.createGauge({
        values: [1, 2],
        legend: { visible: true }
    });

    const legendCtorArgs = legendModule.Legend.lastCall.args[0];
    const legendGroup = this.renderer.g.getCall(6).returnValue;

    assert.equal(legendGroup.attr.lastCall.args[0].class, "dxg-legend");
    assert.equal(legendCtorArgs.renderer, this.renderer);
    assert.equal(legendCtorArgs.textField, "text");
});

QUnit.test("Create legend item", function(assert) {
    this.createGauge({
        values: [1, 5],
        legend: { visible: true },
        palette: ["black", "green"]
    });

    const passedItems = legendModule.Legend.getCall(0).returnValue.update.lastCall.args[0];
    assert.equal(passedItems.length, 2);
    assert.deepEqual(passedItems[0], {
        id: 0,
        text: "1",
        item: {
            value: 1,
            color: "black"
        },
        states: {
            normal: { fill: "black" }
        },
        visible: true
    });

    assert.deepEqual(passedItems[1], {
        id: 1,
        text: "5",
        item: {
            value: 5,
            color: "green"
        },
        states: {
            normal: { fill: "green" }
        },
        visible: true
    });
});

QUnit.test("Update legend items", function(assert) {
    const gauge = this.createGauge({
        values: [1, 5],
        legend: { visible: true },
        palette: ["black", "green"]
    });

    gauge.values([10]);

    const passedItems = legendModule.Legend.getCall(0).returnValue.update.lastCall.args[0];
    assert.equal(passedItems.length, 1);
    assert.deepEqual(passedItems[0], {
        id: 0,
        text: "10",
        item: {
            value: 10,
            color: "black"
        },
        states: {
            normal: { fill: "black" }
        },
        visible: true
    });
});

QUnit.test("Bar is rendered after layout legend", function(assert) {
    this.createGauge({
        values: [1, 5],
        size: {
            width: 300
        },
        legend: { visible: true },
        animation: false
    });
    const bar = this.renderer.g.getCall(7).returnValue.children[0];
    assert.equal(bar.attr.lastCall.args[0].outerRadius, 50);
});
