"use strict";

var $ = require("jquery"),
    common = require("./commonParts/common.js"),
    createFunnel = common.createFunnel,
    environment = common.environment,
    stubAlgorithm = common.stubAlgorithm,
    rendererModule = require("viz/core/renderers/renderer"),
    legendModule = require("viz/components/legend"),
    paletteModule = require("viz/palette");

QUnit.module("Initialization", environment);

QUnit.test("Create empty widget", function(assert) {
    var funnel = createFunnel({});

    assert.ok(funnel);
    assert.equal(rendererModule.Renderer.firstCall.args[0].cssClass, "dxf dxf-funnel", "rootClass prefix rootClass");
    assert.equal(this.itemsGroup().append.lastCall.args[0], this.renderer.root, "items group added to root");
});

QUnit.test("Default size", function(assert) {
    $("#test-container").hide();
    var funnel = createFunnel({});

    assert.deepEqual(funnel.getSize(), { width: 400, height: 400 });
});

QUnit.test("Base funnel not fail when tooltip api is called", function(assert) {
    var funnel = createFunnel({
        dataSource: [{ value: 1 }]
    });

    funnel.getAllItems()[0].showTooltip();
    funnel.hideTooltip();

    assert.ok(funnel);
});

QUnit.module("DataSource processing", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
    }
}));

QUnit.test("Get values by valueField", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 10 }, { value: 5 }]
    });

    assert.ok(stubAlgorithm.normalizeValues.calledOnce);
    assert.equal(stubAlgorithm.normalizeValues.lastCall.args[0][0].value, 10);
    assert.equal(stubAlgorithm.normalizeValues.lastCall.args[0][1].value, 5);
});

QUnit.test("Skip not valid values", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: "10" }, { value: 0 }, { value: null }, { value: undefined }, { value: NaN }, { value: -1 }]
    });
    var args = stubAlgorithm.normalizeValues.lastCall.args[0];

    assert.equal(args.length, 3);
    assert.equal(args[0].value, 10);
    assert.equal(args[1].value, 0);
    assert.equal(args[2].value, 0);
});

QUnit.test("Sort dataSource by default", function(assert) {
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 10 }, { value: 5 }],
        valueField: "value"
    });

    var args = stubAlgorithm.normalizeValues.lastCall.args[0];

    assert.equal(args[0].value, 10);
    assert.equal(args[1].value, 5);
    assert.equal(args[2].value, 1);
});

QUnit.test("Disable sorting", function(assert) {
    createFunnel({
        algorithm: "stub",
        sortData: false,
        dataSource: [{ value: 1 }, { value: 10 }, { value: 5 }],
        valueField: "value"
    });

    var args = stubAlgorithm.normalizeValues.lastCall.args[0];

    assert.equal(args[0].value, 1);
    assert.equal(args[1].value, 10);
    assert.equal(args[2].value, 5);
});

QUnit.test("Use colors from dataSource", function(assert) {
    stubAlgorithm.normalizeValues.returns([1, 1]);
    stubAlgorithm.getFigures.returns([[1], [1]]);
    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 10, color: "green" }, { value: 1, color: "red" }],
        colorField: "color"
    });

    var items = this.items();

    assert.equal(items[0].smartAttr.lastCall.args[0].fill, "green");
    assert.equal(items[1].smartAttr.lastCall.args[0].fill, "red");
});

QUnit.module("Drawing", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        $("#test-container").css({
            width: 1000,
            height: 400
        });
    }
}));

QUnit.test("Draw Items", function(assert) {
    stubAlgorithm.normalizeValues.returns([1, 1]);
    stubAlgorithm.getFigures.returns([
        [0, 0, 0.5, 0, 0, 0.5, 0.5, 0.5],
        [0.5, 0.5, 1, 0.5, 0.5, 1, 1, 1]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
    });

    var items = this.items();

    assert.equal(items.length, 2);
    assert.equal(this.itemsGroup().clear.callCount, 1);

    assert.equal(this.renderer.path.args[0][1], "area");
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 0, 500, 0, 0, 200, 500, 200]);
    assert.deepEqual(items[1].attr.firstCall.args[0].points, [500, 200, 1000, 200, 500, 400, 1000, 400]);
});

QUnit.test("Draw Items, inverted chart", function(assert) {
    stubAlgorithm.normalizeValues.returns([1, 1]);
    stubAlgorithm.getFigures.returns([
        [0, 0, 0.5, 0, 0, 0.5, 0.5, 0.5],
        [0.5, 0.5, 1, 0.5, 0.5, 1, 1, 1]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        inverted: true
    });

    var items = this.items();

    assert.equal(items.length, 2);
    assert.equal(this.itemsGroup().clear.callCount, 1);

    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 400, 500, 400, 0, 200, 500, 200]);
    assert.deepEqual(items[1].attr.firstCall.args[0].points, [500, 200, 1000, 200, 500, 0, 1000, 0]);
});

QUnit.test("Resize", function(assert) {
    stubAlgorithm.normalizeValues.returns([1, 1]);
    stubAlgorithm.getFigures.returns([
        [1, 1]
    ]);

    var funnel = createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
    });
    this.itemsGroup().clear.reset();

    funnel.option("size", { width: 900, height: 600 });

    var items = this.items();

    assert.equal(items.length, 1);
    assert.equal(this.itemsGroup().clear.callCount, 1);
    assert.deepEqual(items[0].attr.firstCall.args[0].points, [900, 600]);
});

QUnit.test("palette", function(assert) {
    sinon.spy(paletteModule, "Palette");

    stubAlgorithm.normalizeValues.returns([1, 1]);
    stubAlgorithm.getFigures.returns([
        [1], [1]
    ]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        palette: ["red", "blue"]
    });

    var items = this.items();

    assert.deepEqual(items[0].smartAttr.lastCall.args[0].fill, "red");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0].fill, "blue");
    assert.deepEqual(paletteModule.Palette.lastCall.args[1], {
        useHighlight: true
    }, "useHighlight");

    //teardown
    paletteModule.Palette.restore();
});

QUnit.module("Update options", environment);

QUnit.test("Update styles of items", function(assert) {
    stubAlgorithm.normalizeValues.returns([1, 1]);
    stubAlgorithm.getFigures.returns([
        [1], [1]
    ]);

    var funnel = createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }]
    });

    funnel.option({ item: { border: { width: 3, color: "red" } } });

    var items = this.items();

    assert.deepEqual(items[0].smartAttr.lastCall.args[0]["stroke-width"], 3);
    assert.deepEqual(items[0].smartAttr.lastCall.args[0]["stroke"], "red");

    assert.deepEqual(items[1].smartAttr.lastCall.args[0]["stroke-width"], 3);
    assert.deepEqual(items[1].smartAttr.lastCall.args[0]["stroke"], "red");
});

QUnit.test("Update value field", function(assert) {
    stubAlgorithm.normalizeValues.returns([1]);
    stubAlgorithm.getFigures.returns([
        [1]
    ]);

    var funnel = createFunnel({
        algorithm: "stub",
        dataSource: [{ val: 1, value: 5, argument: "One", color: "red" }],
        valueField: "value",
        argumentField: "argument",
        colorField: "color"
    });

    funnel.option({
        valueField: "val"
    });

    var items = funnel.getAllItems();

    assert.equal(items[0].data.value, 1);
    assert.equal(items[0].data.argument, "One");
    assert.equal(items[0].color, "red");
});

QUnit.test("Update argument field", function(assert) {
    stubAlgorithm.normalizeValues.returns([1]);
    stubAlgorithm.getFigures.returns([
        [1]
    ]);

    var funnel = createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1, argument: "One", arg: "Two", color: "red" }],
        valueField: "value",
        argumentField: "argument",
        colorField: "color"
    });

    funnel.option({
        argumentField: "arg"
    });

    var items = funnel.getAllItems();

    assert.equal(items[0].data.value, 1);
    assert.equal(items[0].data.argument, "Two");
    assert.equal(items[0].color, "red");
});

QUnit.test("Update color field", function(assert) {
    stubAlgorithm.normalizeValues.returns([1]);
    stubAlgorithm.getFigures.returns([
        [1]
    ]);

    var funnel = createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1, argument: "One", color1: "red", color2: "green" }],
        valueField: "value",
        argumentField: "argument",
        colorField: "color1"
    });

    funnel.option({
        colorField: "color2"
    });

    var items = funnel.getAllItems();

    assert.equal(items[0].data.value, 1);
    assert.equal(items[0].data.argument, "One");
    assert.equal(items[0].color, "green");
});

QUnit.test("Update inverted option", function(assert) {
    stubAlgorithm.normalizeValues.returns([1, 1]);
    stubAlgorithm.getFigures.returns([
        [0, 0, 0.5, 0, 0, 0.5, 0.5, 0.5],
        [0.5, 0.5, 1, 0.5, 0.5, 1, 1, 1]
    ]);

    var funnel = createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        inverted: true
    });
    funnel.option({ inverted: false });

    var items = this.items();

    assert.equal(items.length, 2);
    assert.equal(this.itemsGroup().clear.callCount, 2);

    assert.deepEqual(items[0].attr.firstCall.args[0].points, [0, 0, 500, 0, 0, 200, 500, 200]);
    assert.deepEqual(items[1].attr.firstCall.args[0].points, [500, 200, 1000, 200, 500, 400, 1000, 400]);
});

QUnit.test("Update palette", function(assert) {
    sinon.spy(paletteModule, "Palette");

    stubAlgorithm.normalizeValues.returns([1, 1]);
    stubAlgorithm.getFigures.returns([
        [1], [1]
    ]);

    var funnel = createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 1 }],
        palette: ["red", "blue"]
    });

    funnel.option({ palette: ["green", "orange"] });

    var items = this.items();

    assert.deepEqual(items[0].smartAttr.lastCall.args[0].fill, "green");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0].fill, "orange");
});

QUnit.test("SortData option", function(assert) {
    stubAlgorithm.normalizeValues.returns([1, 1]);
    stubAlgorithm.getFigures.returns([
        [1], [1]
    ]);

    var funnel = createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }, { value: 10 }],
        palette: ["red", "blue"],
        sortData: true
    });

    funnel.option({ sortData: false });

    var items = funnel.getAllItems();

    assert.equal(items[0].data.value, 1);
    assert.equal(items[1].data.value, 10);
});

QUnit.module("Items", environment);

QUnit.test("Creation", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 10, argument: "One" }, { value: 5, argument: "Two", color: "#234234" }],
        }),
        items = funnel.getAllItems();

    assert.equal(items[0].data.value, 10);
    assert.equal(items[0].data.argument, "One");
    assert.equal(items[0].percent, 1);

    assert.equal(items[1].data.value, 5);
    assert.equal(items[1].data.argument, "Two");
    assert.equal(items[1].percent, 0.5);
});

QUnit.test("Normal style", function(assert) {
    createFunnel({
        dataSource: [{ value: 10, argument: "One", color: "#123123" }, { value: 5, argument: "Two", color: "#234234" }],
        item: {
            border: {
                color: "#ffffff",
                width: 2
            }
        }
    });
    var items = this.items();

    assert.equal(items[0].smartAttr.lastCall.args[0].fill, "#123123");
    assert.deepEqual(items[0].smartAttr.lastCall.args[0].stroke, "#ffffff");
    assert.deepEqual(items[0].smartAttr.lastCall.args[0]["stroke-width"], 2);

    assert.equal(items[1].smartAttr.lastCall.args[0].fill, "#234234");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0].stroke, "#ffffff");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0]["stroke-width"], 2);
});

QUnit.test("Hover style", function(assert) {
    var funnel = createFunnel({
        dataSource: [{ value: 10, argument: "One" }, { value: 5, argument: "Two", color: "#234234" }],
        item: {
            border: {
                color: "#ffffff",
                width: 2
            },
            hoverStyle: {
                border: {
                    color: "#123123",
                    width: 3
                },
                hatching: {
                    direction: "left"
                }
            }
        }
    });

    funnel.getAllItems()[1].hover(true);

    var items = this.items();

    assert.equal(items[1].smartAttr.lastCall.args[0].fill, "#234234");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0].stroke, "#123123");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0]["stroke-width"], 3);
    assert.deepEqual(items[1].smartAttr.lastCall.args[0].hatching, {
        direction: "left",
        opacity: 0.75,
        step: 6,
        width: 2
    });
});

QUnit.test("Clear hover of item", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 10, argument: "One" }, { value: 5, argument: "Two", color: "#234234" }],
            item: {
                border: {
                    color: "#ffffff",
                    width: 2
                },
                hoverStyle: {
                    border: {
                        color: "#123123",
                        width: 3
                    },
                    hatching: {
                        direction: "left"
                    }
                }
            }
        }),
        item = funnel.getAllItems()[1];

    item.hover(true);
    item.hover(false);

    var items = this.items();

    assert.equal(items[1].smartAttr.lastCall.args[0].fill, "#234234");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0].stroke, "#ffffff");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0]["stroke-width"], 2);
    assert.ok(!items[1].smartAttr.lastCall.args[0].hatching);
});

QUnit.test("hover changed event", function(assert) {
    var hoverChanged = sinon.spy(),
        funnel = createFunnel({
            dataSource: [{ value: 10 }, { value: 5 }],
            onHoverChanged: hoverChanged
        }),
        item = funnel.getAllItems()[0];

    item.hover(true);

    assert.ok(hoverChanged.calledOnce);
    assert.strictEqual(hoverChanged.lastCall.args[0].item, item);
});


QUnit.test("hover changed event after hover second item", function(assert) {
    var hoverChanged = sinon.spy(),
        funnel = createFunnel({
            dataSource: [{ value: 10 }, { value: 5 }, { value: 5 }],
            onHoverChanged: hoverChanged
        }),
        item = funnel.getAllItems()[0];

    item.hover(true);
    hoverChanged.reset();

    funnel.getAllItems()[1].hover(true);

    assert.equal(hoverChanged.callCount, 2);
});

QUnit.test("disable hover", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 10, argument: "One" }],
            hoverEnabled: false
        }),
        items = funnel.getAllItems();

    items[0].hover(true);

    assert.ok(!items[0].isHovered());
});

QUnit.test("Selection", function(assert) {
    var funnel = createFunnel({
        dataSource: [{ value: 10, argument: "One" }, { value: 5, argument: "Two", color: "#234234" }],
        item: {
            border: {
                color: "#ffffff",
                width: 2
            },
            selectionStyle: {
                border: {
                    color: "#123123",
                    width: 3
                }
            }
        }
    });

    funnel.getAllItems()[1].select(true);
    var items = this.items();

    assert.equal(items[1].smartAttr.lastCall.args[0].fill, "#234234");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0].stroke, "#123123");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0]["stroke-width"], 3);
    assert.deepEqual(items[1].smartAttr.lastCall.args[0].hatching, {
        opacity: 0.5,
        step: 6,
        width: 2,
        direction: "right"
    });
});

QUnit.test("Single selection", function(assert) {
    var funnel = createFunnel({
        dataSource: [{ value: 10, argument: "One" }, { value: 5, argument: "Two" }]
    });

    funnel.getAllItems()[1].select(true);
    funnel.getAllItems()[0].select(true);


    assert.equal(funnel.getAllItems()[0].isSelected(), true);
    assert.equal(funnel.getAllItems()[1].isSelected(), false);
});

QUnit.test("Multiple selection", function(assert) {
    var funnel = createFunnel({
        dataSource: [{ value: 10, argument: "One" }, { value: 5, argument: "Two" }],
        selectionMode: "multiple"
    });

    funnel.getAllItems()[1].select(true);
    funnel.getAllItems()[0].select(true);


    assert.equal(funnel.getAllItems()[0].isSelected(), true);
    assert.equal(funnel.getAllItems()[1].isSelected(), true);
});

QUnit.test("disable selection", function(assert) {
    var funnel = createFunnel({
        dataSource: [{ value: 10, argument: "One" }],
        selectionMode: "none"
    });

    funnel.getAllItems()[0].select(true);

    assert.equal(funnel.getAllItems()[0].isSelected(), false);
});

QUnit.test("selection changed event", function(assert) {
    var spy = sinon.spy(),
        funnel = createFunnel({
            dataSource: [{ value: 10 }, { value: 5 }],
            onSelectionChanged: spy
        }),
        item = funnel.getAllItems()[0];

    item.select(true);

    assert.ok(spy.calledOnce);
    assert.strictEqual(spy.lastCall.args[0].item, item);
});

QUnit.test("selection changed event in single mode fire only for selected element and unselected", function(assert) {
    var spy = sinon.spy(),
        funnel = createFunnel({
            dataSource: [{ value: 10 }, { value: 5 }, { value: 5 }],
            onSelectionChanged: spy,
            selectionMode: "single"
        }),
        item = funnel.getAllItems()[0];

    item.select(true);
    spy.reset();
    funnel.getAllItems()[1].select(true);

    assert.equal(spy.callCount, 2);
});

QUnit.test("Clear selection", function(assert) {
    var funnel = createFunnel({
        dataSource: [{ value: 10, argument: "One" }, { value: 5, argument: "Two", color: "#234234" }],
        item: {
            border: {
                color: "#ffffff",
                width: 2
            },
            selectionStyle: {
                border: {
                    color: "#123123",
                    width: 3
                }
            }
        }
    });

    funnel.getAllItems()[1].select(true);
    funnel.getAllItems()[1].select(false);
    var items = this.items();

    assert.equal(items[1].smartAttr.lastCall.args[0].fill, "#234234");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0].stroke, "#ffffff");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0]["stroke-width"], 2);
    assert.ok(!items[1].smartAttr.lastCall.args[0].hatching);
});

QUnit.test("Clear selection of all elements", function(assert) {
    var funnel = createFunnel({
        dataSource: [{ value: 10, argument: "One", color: "#987987" }, { value: 5, argument: "Two", color: "#234234" }],
        item: {
            border: {
                color: "#ffffff",
                width: 2
            },
            selectionStyle: {
                border: {
                    color: "#123123",
                    width: 3
                }
            }
        }
    });

    funnel.getAllItems()[0].select(true);
    funnel.getAllItems()[1].select(true);
    funnel.clearSelection();

    var items = this.items();

    assert.equal(items[0].smartAttr.lastCall.args[0].fill, "#987987");
    assert.deepEqual(items[0].smartAttr.lastCall.args[0].stroke, "#ffffff");
    assert.deepEqual(items[0].smartAttr.lastCall.args[0]["stroke-width"], 2);
    assert.ok(!items[0].smartAttr.lastCall.args[0].hatching);

    assert.equal(items[1].smartAttr.lastCall.args[0].fill, "#234234");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0].stroke, "#ffffff");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0]["stroke-width"], 2);
    assert.ok(!items[1].smartAttr.lastCall.args[0].hatching);
});

QUnit.test("Select and hover item", function(assert) {
    var funnel = createFunnel({
        dataSource: [{ value: 10, argument: "One" }, { value: 5, argument: "Two", color: "#234234" }],
    });

    funnel.getAllItems()[1].select(true);
    funnel.getAllItems()[1].hover(true);
    var items = this.items();

    assert.equal(items[1].smartAttr.lastCall.args[0].fill, "#234234");
    assert.deepEqual(items[1].smartAttr.lastCall.args[0].hatching, {
        opacity: 0.5,
        step: 6,
        width: 2,
        direction: "right"
    });
});

QUnit.test("getColor method", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 10, argument: "One", color: "#987987" }, { value: 5, argument: "Two", color: "#234234" }],
        }),
        items = funnel.getAllItems();

    assert.equal(items[0].getColor(), "#987987");
    assert.equal(items[1].getColor(), "#234234");
});

QUnit.test("isHovered method", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 10, argument: "One" }, { value: 5, argument: "Two" }],
        }),
        items = funnel.getAllItems();

    items[1].hover(true);

    assert.ok(items[1].isHovered());
    assert.ok(!items[0].isHovered());
});

QUnit.test("isSelected method", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 10, argument: "One" }, { value: 5, argument: "Two" }],
        }),
        items = funnel.getAllItems();

    items[1].select(true);

    assert.ok(items[1].isSelected());
    assert.ok(!items[0].isSelected());
});

QUnit.test("isHovered method after hover and select", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 10, argument: "One" }, { value: 5, argument: "Two" }],
        }),
        items = funnel.getAllItems();

    items[1].hover(true);
    items[1].select(true);

    assert.ok(items[1].isHovered());
});

QUnit.test("isSelected method after hover and select", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 10, argument: "One" }, { value: 5, argument: "Two" }],
        }),
        items = funnel.getAllItems();

    items[1].hover(true);
    items[1].select(true);

    assert.ok(items[1].isSelected());
});

QUnit.module("Legend", environment);

QUnit.test("Creation", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 5, argument: "One", color: "orange" }],
            legend: { visible: true }
        }),
        legendCtorArgs = legendModule.Legend.lastCall.args[0],
        item = funnel.getAllItems()[0],
        formatObject = legendCtorArgs.getFormatObject(item);

    assert.equal(legendCtorArgs.renderer, this.renderer);
    assert.equal(legendCtorArgs.group, this.renderer.root);
    assert.equal(legendCtorArgs.textField, "text");
    assert.equal(formatObject.item.data.argument, "One");
    assert.equal(formatObject.item.data.value, 5);
    assert.equal(formatObject.item.id, 0);
    assert.equal(formatObject.item.color, "orange");
    assert.equal(formatObject.item.percent, 1);
});

QUnit.test("Update", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 5, argument: "One" }, { value: 10, argument: "Two" }],
            legend: { visible: true }
        }),
        items = funnel.getAllItems(),
        lastCallUpdate = this.legend.update.lastCall.args[0];

    for(var i = 0; i < items.length; i++) {
        assert.equal(lastCallUpdate[i].data.argument, items[i].data.argument);
        assert.deepEqual(lastCallUpdate[i].states, items[i].states);
        assert.equal(lastCallUpdate[i].id, items[i].id);
    }
});

QUnit.test("Legend options", function(assert) {
    createFunnel({
        dataSource: [{ value: 5, argument: "One" }, { value: 10, argument: "Two" }],
        legend: { visible: true, horizontalAlignment: "center", verticalAlignment: "bottom" }
    });

    assert.equal(this.legend.update.lastCall.args[1].horizontalAlignment, "center");
    assert.equal(this.legend.update.lastCall.args[1].verticalAlignment, "bottom");
});

QUnit.test("Hover legend", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 5, argument: "One" }, { value: 10, argument: "Two" }],
            legend: { visible: true }
        }),
        items = funnel.getAllItems();

    items[1].hover(true);

    assert.equal(this.legend.applyHover.lastCall.args[0], 1);
});

QUnit.test("Selection legend", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 5, argument: "One" }, { value: 10, argument: "Two" }],
            legend: { visible: true }
        }),
        items = funnel.getAllItems();

    items[1].select(true);

    assert.equal(this.legend.applySelected.lastCall.args[0], 1);
});

QUnit.test("Hover and unhover legend", function(assert) {
    var funnel = createFunnel({
            dataSource: [{ value: 5, argument: "One" }, { value: 10, argument: "Two" }],
            legend: { visible: true }
        }),
        items = funnel.getAllItems();

    items[1].hover(true);
    items[1].hover(false);

    assert.equal(this.legend.resetItem.lastCall.args[0], 1);
});

QUnit.test("Update items", function(assert) {
    var funnel = createFunnel({
        dataSource: [{ value: 5, argument: "One" }, { value: 10, argument: "Two" }],
        legend: { visible: true }
    });

    funnel.option({ dataSource: [{ value: 1, argument: "One" }, { value: 4, argument: "Two" }] });

    var items = funnel.getAllItems(),
        lastCallUpdate = this.legend.update.lastCall.args[0];

    for(var i = 0; i < items.length; i++) {
        assert.deepEqual(lastCallUpdate[i].data.value, items[i].data.value);
    }
});

QUnit.test("Reserve space for legend", function(assert) {
    this.legend.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top",
        side: "horizontal"
    });

    $("#test-container").css({
        width: 800,
        height: 600
    });

    stubAlgorithm.getFigures.returns([[0, 0, 1, 1]]);

    createFunnel({
        algorithm: "stub",
        dataSource: [{ value: 1 }],
        legend: {
            visible: true
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 700, 600]);
});

QUnit.module("Adaptive Layout", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        $("#test-container").css({
            width: 800,
            height: 600
        });

        stubAlgorithm.getFigures.returns([[0, 0, 1, 1]]);
    },

    afterEach: function() {
        environment.afterEach.call(this);
    }
}));

QUnit.test("hide legend. horizontal alignment", function(assert) {
    this.legend.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top",
        side: "horizontal"
    });

    createFunnel({
        algorithm: "stub",
        adaptiveLayout: {
            width: 701,
            height: 100
        },
        dataSource: [{ value: 1 }],
        legend: {
            visible: true
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
    assert.ok(this.legend.freeSpace.called);
});

QUnit.test("hide legend. vertical alignment", function(assert) {
    this.legend.stub("layoutOptions").returns({
        horizontalAlignment: "center",
        verticalAlignment: "bottom",
        side: "vertical"
    });

    createFunnel({
        algorithm: "stub",
        adaptiveLayout: {
            height: 500
        },
        dataSource: [{ value: 1 }],
        legend: {
            visible: true
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
    assert.ok(this.legend.freeSpace.called);
});

QUnit.test("hide title", function(assert) {
    this.title.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top"
    });

    createFunnel({
        algorithm: "stub",
        adaptiveLayout: {
            height: 500
        },
        dataSource: [{ value: 1 }]
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
    assert.ok(this.title.freeSpace.called);
});

QUnit.test("hide export menu", function(assert) {
    this.export.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top"
    });

    createFunnel({
        algorithm: "stub",
        adaptiveLayout: {
            height: 500
        },
        dataSource: [{ value: 1 }]
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
    assert.ok(this.export.freeSpace.called);
});

QUnit.test("hide pair elements: title and export", function(assert) {
    this.title.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top"
    });
    this.export.stub("layoutOptions").returns({
        horizontalAlignment: "right",
        verticalAlignment: "top",
        weak: true
    });

    createFunnel({
        algorithm: "stub",
        adaptiveLayout: {
            height: 500
        },
        dataSource: [{ value: 1 }]
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
    assert.ok(this.export.freeSpace.called);
    assert.ok(this.title.freeSpace.called);
});

