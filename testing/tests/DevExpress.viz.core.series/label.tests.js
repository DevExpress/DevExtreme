import $ from "jquery";
import * as vizMocks from "../../helpers/vizMocks.js";
import pointModule from "viz/series/points/base_point";
import labelModule from "viz/series/points/label";
import { MockTranslator } from "../../helpers/chartMocks.js";

const environment = {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.data = {
            formatObject: {
                value: 15,
                argument: 25
            }
        };
        this.options = {
            connector: {
                "stroke-width": 2,
                stroke: "green"
            }
        };
        this.group = this.renderer.g();
        this.point = sinon.createStubInstance(pointModule.Point);
        this.point.hasValue.returns(true);
    },
    createLabel: function() {
        var label = new labelModule.Label({ renderer: this.renderer, point: this.point, labelsGroup: this.group });
        label.setOptions(this.options);
        label.setData(this.data.formatObject);
        return label;
    },
    createAndDrawLabel: function() {
        return this.createLabel().draw(true);
    },
    getConnectorElement: function() {
        return this.renderer.path.returnValues[0];
    },
    createLabelWithBBox: function(BBox, figure) {
        var label = this.createLabel();

        if(this.options.background.fill && this.options.background.fill !== "none") {
            this.renderer.bBoxTemplate = {
                x: BBox.x + 8,
                y: BBox.y + 4,
                width: BBox.width - 16,
                height: BBox.height - 8
            };
        } else {
            this.renderer.bBoxTemplate = BBox;
        }
        label.draw(true);
        label.setFigureToDrawConnector(figure);
        return label;
    }
};

QUnit.module("Label format", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.data = { argument: "1", value: 5 };
    },
    format: labelModule.Label._DEBUG_formatText
}));

QUnit.test("Default label format", function(assert) {
    assert.equal(this.format({ value: "test" }, { format: "" }), "test");
});

QUnit.test("Custom label format", function(assert) {
    assert.equal(this.format({ argument: "1", value: 5 }, { format: { type: "currency", precision: 2 } }), "$5.00");
});

QUnit.test("Label format object", function(assert) {
    var data = {};
    data.argument = 0.12;
    data.value = 5;
    data.originalValue = "5";
    data.originalArgument = "0.12";
    data.seriesName = "series";
    var options = { format: "currency", argumentFormat: "percent" };

    this.format(data, options);

    assert.equal(data.value, 5);
    assert.equal(data.argument, 0.12);
    assert.equal(data.originalValue, "5");
    assert.equal(data.originalArgument, "0.12");
    assert.equal(data.seriesName, "series");
    assert.equal(data.valueText, "$5");
    assert.equal(data.argumentText, "12%");
    assert.strictEqual(data.percent, undefined);
    assert.strictEqual(data.percentText, undefined);
    assert.strictEqual(data.total, undefined);
    assert.strictEqual(data.totalText, undefined);
});

QUnit.test("Label format object, financial series", function(assert) {
    var data = {};
    data.argument = 0.12;
    data.closeValue = 5;
    data.openValue = 2;
    data.lowValue = 1;
    data.highValue = 10;
    data.reductionValue = 2;
    var options = { format: "currency", argumentFormat: "percent" };

    this.format(data, options);

    assert.equal(data.argument, 0.12);
    assert.equal(data.closeValue, 5);
    assert.equal(data.closeValueText, "$5");
    assert.equal(data.argumentText, "12%");
    assert.equal(data.openValue, 2);
    assert.equal(data.openValueText, "$2");
    assert.equal(data.lowValue, 1);
    assert.equal(data.lowValueText, "$1");
    assert.equal(data.highValue, 10);
    assert.equal(data.highValueText, "$10");
    assert.strictEqual(data.percent, undefined);
    assert.strictEqual(data.percentText, undefined);
    assert.strictEqual(data.total, undefined);
    assert.strictEqual(data.totalText, undefined);
});

QUnit.module("Draw Label", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.translator = new MockTranslator({
            getCanvasVisibleArea: { minX: 0, maxX: 100, minY: 0, maxY: 210 }
        });
        this.renderer.bBoxTemplate = { x: 40, y: 40, height: 10, width: 20 };
        this.data = {
            formatObject: {
                value: 15,
                argument: 25,
                seriesName: "testName"
            },
            initialValue: 15
        };
        this.options = {
            rotationAngle: 30,
            horizontalOffset: 0,
            verticalOffset: 0,
            textAlignment: "left",
            visible: true,
            background: {
                fill: "none"
            },
            attributes: {}
        };
    }
}));

QUnit.test("Show", function(assert) {
    var label = this.createLabel();
    label.show();

    assert.equal(label._group.stub("attr").callCount, 1);
    assert.deepEqual(label._group.stub("attr").lastCall.args[0], { visibility: "visible" });
    assert.equal(label._point.correctLabelPosition.callCount, 1);
    assert.equal(label._point.correctLabelPosition.lastCall.args[0], label);
});

QUnit.test("Hide", function(assert) {
    var label = this.createLabel();

    label.show();
    label._group.stub("attr").reset();

    // act
    label.hide();

    assert.equal(label._group.stub("attr").callCount, 1);
    assert.deepEqual(label._group.stub("attr").lastCall.args[0], { visibility: "hidden" });
});

QUnit.test("T561563. Show already shown label - do not correct label position", function(assert) {
    var label = this.createLabel();
    label.show();
    label.hide();
    label._point.correctLabelPosition.reset();
    label.show();

    assert.equal(label._group.stub("attr").callCount, 3);
    assert.deepEqual(label._group.stub("attr").lastCall.args[0], { visibility: "visible" });
    assert.equal(label._point.correctLabelPosition.callCount, 0);
});

QUnit.test("Draw(true) -> draw(false) -> show - correct label position (container resize problem)", function(assert) {
    var label = this.createLabel();
    label.draw(true);
    label.draw(false);
    label._point.correctLabelPosition.reset();
    label.show();

    assert.equal(label._group.stub("attr").callCount, 3);
    assert.deepEqual(label._group.stub("attr").lastCall.args[0], { visibility: "visible" });
    assert.equal(label._point.correctLabelPosition.callCount, 1);
});

QUnit.test("Draw(true) - draw label", function(assert) {
    this.options.cssClass = "label_class";
    var label = this.createLabel().draw(true);

    assert.ok(label._group);
    assert.ok(label._insideGroup);
    assert.deepEqual(label._insideGroup.rotate.lastCall.args, [30, 50, 45], "rotation");
    assert.equal(label._textContent, "15", "text content");

    assert.equal(this.renderer.stub("text").callCount, 1, "text");
    assert.equal(this.renderer.stub("rect").callCount, 0, "rect");

    assert.deepEqual(this.renderer.text.lastCall.args, ["", 0, 0], "text args");

    assert.deepEqual(this.renderer.text.lastCall.returnValue.attr.firstCall.args, [{ text: "15", align: "left", "class": "label_class" }], "text attr");
    assert.deepEqual(label._group.stub("attr").lastCall.args[0], { visibility: "visible" });
    assert.equal(label._point.correctLabelPosition.callCount, 1);
    assert.equal(label._point.correctLabelPosition.lastCall.args[0], label);
});

QUnit.test("Rotation angle can be reseted", function(assert) {
    this.options.rotationAngle = 30;
    var label = this.createLabel().draw(true);

    this.options.rotationAngle = 0;

    label.setOptions(this.options);

    label.draw(true).shift(10, 10);

    assert.deepEqual(label._insideGroup.rotate.lastCall.args, [0, 50, 45], "rotation");
    assert.deepEqual(label.getBoundingRect(), { x: 10, y: 10, width: 20, height: 10 });
});

QUnit.test("Draw() - hide label", function(assert) {
    var label = this.createLabel().draw(true);
    label._point.correctLabelPosition.reset();

    label.draw();

    assert.deepEqual(label._group.stub("attr").lastCall.args[0], { visibility: "hidden" });
    assert.equal(label._point.correctLabelPosition.callCount, 0);
});

QUnit.test("Draw(true) after hide() - draw label", function(assert) {
    var label = this.createAndDrawLabel();

    // act
    label.hide();
    label.draw(true);

    assert.deepEqual(label._group.stub("attr").lastCall.args[0], { visibility: "visible" });
});

QUnit.test("Draw(true) after hide(true) - keep hidden state", function(assert) {
    var label = this.createAndDrawLabel();

    // act
    label.hide(true);
    label.draw(true);

    assert.deepEqual(label._group.stub("attr").lastCall.args[0], { visibility: "hidden" });
});

QUnit.test("Draw() after show() - hide label", function(assert) {
    var label = this.createAndDrawLabel();

    // act
    label.show();
    label.draw();

    assert.deepEqual(label._group.stub("attr").lastCall.args[0], { visibility: "hidden" });
});

QUnit.test("Draw() after show(true) - keep visible state", function(assert) {
    var label = this.createAndDrawLabel();

    // act
    label.show(true);
    label.draw();

    assert.deepEqual(label._group.stub("attr").lastCall.args[0], { visibility: "visible" });
});

QUnit.test("Draw label with zero point size", function(assert) {
    var label = this.createAndDrawLabel();

    assert.ok(label._group);
    assert.ok(label._insideGroup);

    assert.equal(this.renderer.stub("text").callCount, 1);
    assert.equal(this.renderer.stub("rect").callCount, 0);

    assert.equal(this.renderer.stub("text").firstCall.args[0], "");
    assert.equal(this.renderer.stub("text").firstCall.args[1], 0);
    assert.equal(this.renderer.stub("text").firstCall.args[2], 0);

    assert.equal(this.renderer.stub("text").firstCall.returnValue.attr.firstCall.args[0].text, "15");

    assert.equal(label._group.stub("append").lastCall.args[0], this.group);
    assert.equal(this.group.children.length, 1);
});

QUnit.test("Draw label with null value", function(assert) {
    this.data.formatObject = { value: null };
    var label = this.createAndDrawLabel();

    assert.ok(!label._group);
    assert.ok(!label._insideGroup);

    assert.equal(this.renderer.stub("text").callCount, 0);
    assert.equal(this.renderer.stub("rect").callCount, 0);
});

QUnit.test("Draw label with custom format", function(assert) {
    this.options.customizeText = function() { return this.argumentText + ":" + this.valueText + ":" + this.seriesName; };
    this.createAndDrawLabel();

    assert.equal(this.renderer.stub("text").callCount, 1);

    assert.equal(this.renderer.stub("text").firstCall.args[0], "");
    assert.equal(this.renderer.stub("text").firstCall.args[1], 0);
    assert.equal(this.renderer.stub("text").firstCall.args[2], 0);

    assert.equal(this.renderer.stub("text").firstCall.returnValue.attr.firstCall.args[0].text, "25:15:testName");
});

QUnit.test("Pass point to label customizeText", function(assert) {
    var passedPoint;

    this.options.customizeText = function() {
        passedPoint = this.point;
        return this.point.tag;
    };
    this.data.formatObject.point = { tag: "tag" };
    this.createAndDrawLabel();

    assert.deepEqual(passedPoint, this.data.formatObject.point);
    assert.equal(this.renderer.stub("text").firstCall.args[0], "");

    assert.equal(this.renderer.stub("text").firstCall.returnValue.attr.firstCall.args[0].text, "tag");
});

QUnit.test("Draw label with empty custom format", function(assert) {
    this.options.customizeText = function() { };
    var label = this.createAndDrawLabel();

    assert.ok(!label._group);
    assert.ok(!label._insideGroup);

    assert.equal(this.renderer.stub("text").callCount, 0);
    assert.equal(this.renderer.stub("rect").callCount, 0);
});

QUnit.test("Draw label with empty custom string", function(assert) {
    this.options.customizeText = function() { return ""; };
    var label = this.createAndDrawLabel();

    assert.ok(!label._group);
    assert.ok(!label._insideGroup);

    assert.equal(this.renderer.stub("text").callCount, 0);
    assert.equal(this.renderer.stub("rect").callCount, 0);
});

QUnit.test("Draw label with null custom string", function(assert) {
    this.options.customizeText = function() { return null; };
    var label = this.createLabel();

    label.show();

    assert.ok(!label._group);
    assert.ok(!label._insideGroup);

    assert.equal(this.renderer.stub("text").callCount, 0);
    assert.equal(this.renderer.stub("rect").callCount, 0);
});

QUnit.test("Draw label with undefined custom string", function(assert) {
    this.options.customizeText = function() { return undefined; };
    var label = this.createLabel();

    label.show();

    assert.ok(!label._group);
    assert.ok(!label._insideGroup);

    assert.equal(this.renderer.stub("text").callCount, 0);
    assert.equal(this.renderer.stub("rect").callCount, 0);
});

QUnit.test("Draw labelBackground (fill is specified)", function(assert) {
    this.options.background.fill = "red";
    this.renderer.bBoxTemplate = { x: 10, y: 40, height: 10, width: 20 };

    var label = this.createAndDrawLabel();

    assert.equal(this.renderer.stub("rect").callCount, 1);
    assert.equal(this.renderer.stub("rect").firstCall.returnValue, label._background);
    assert.deepEqual(this.renderer.stub("rect").firstCall.args, []);
    assert.equal(label._background.stub("attr").callCount, 2);
    assert.deepEqual(label._background.stub("attr").getCall(0).args, [{ fill: 'red' }], "background attr");
    assert.deepEqual(label._background.stub("attr").getCall(1).args, [{ x: 2, y: 36, width: 36, height: 18 }], "background position");
});

QUnit.test("Draw labelBackground (fill is specified) with reduction color", function(assert) {
    this.options.background.fill = "red";
    this.renderer.bBoxTemplate = { x: 10, y: 40, height: 10, width: 20 };

    var label = this.createLabel();

    label.setColor("blue");
    label.show();

    assert.equal(this.renderer.stub("rect").callCount, 1);
    assert.equal(this.renderer.stub("rect").firstCall.returnValue, label._background);
    assert.deepEqual(this.renderer.stub("rect").firstCall.args, []);
    assert.equal(label._background.stub("attr").callCount, 3);
    assert.deepEqual(label._background.stub("attr").getCall(0).args, [{ fill: 'red' }], "background attr");
    assert.deepEqual(label._background.stub("attr").getCall(1).args, [{ fill: 'blue' }], "background attr fill");
    assert.deepEqual(label._background.stub("attr").getCall(2).args, [{ x: 2, y: 36, width: 36, height: 18 }], "background position");
});

QUnit.test("Draw labelBackground (stroke is specified, strokeWidth is not specified)", function(assert) {
    this.options.background.stroke = "red";
    var label = this.createLabel();

    label.show();

    assert.equal(this.renderer.stub("rect").callCount, 0);
});

QUnit.test("Draw labelBackground (stroke is not specified, strokeWidth is specified)", function(assert) {
    this.options.background["stroke-width"] = 1;
    var label = this.createLabel();

    label.show();

    assert.equal(this.renderer.stub("rect").callCount, 0);
});

QUnit.test("Draw labelBackground (stroke and strokeWidth specified)", function(assert) {
    this.options.background.stroke = "red";
    this.options.background["stroke-width"] = 1;
    var label = this.createLabel();

    label.show();

    assert.equal(this.renderer.stub("rect").callCount, 1);
});

QUnit.module("Connector", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.options.background = { fill: "red" };
    }
}));

QUnit.test("Draw connector without reduction style", function(assert) {
    this.options.connector.stroke = 'red';
    this.createAndDrawLabel();

    assert.equal(this.getConnectorElement()._stored_settings.stroke, 'red');
    assert.ok(this.getConnectorElement().sharp.called);
});

QUnit.test("Draw connector with reduction style", function(assert) {
    this.options.connector.stroke = 'red';
    var label = this.createAndDrawLabel();

    label.setColor("blue");

    label.show();

    assert.equal(this.getConnectorElement()._stored_settings.stroke, 'blue');
    assert.ok(this.getConnectorElement().sharp.called);
});

QUnit.test("To right", function(assert) {
    this.options.background.fill = "none";
    var label = this.createAndDrawLabel(),
        connector = this.getConnectorElement();

    label.setFigureToDrawConnector({ x: 100, y: 100, width: 0, height: 0 });
    label.shift(200, 100);

    assert.ok(connector);
    assert.deepEqual(connector._stored_settings.points, [100, 100, 200, 100]);
});

QUnit.test("To left", function(assert) {
    this.options.background.fill = "none";
    var label = this.createAndDrawLabel();
    label.setFigureToDrawConnector({ x: 100, y: 100, width: 0, height: 0 });
    label.shift(50, 100);

    assert.deepEqual(this.getConnectorElement()._stored_settings.points, [100, 100, 69, 100]);
});

QUnit.test("To top", function(assert) {
    this.options.background.fill = "none";
    var label = this.createAndDrawLabel();

    label.setFigureToDrawConnector({ x: 100, y: 100, width: 0, height: 0 });
    label.shift(100, 50);

    assert.deepEqual(this.getConnectorElement()._stored_settings.points, [100, 100, 100, 59]);
});

QUnit.test("To bottom", function(assert) {
    this.options.background.fill = "none";
    var label = this.createAndDrawLabel();

    label.setFigureToDrawConnector({ x: 100, y: 100, width: 0, height: 0 });
    label.shift(100, 200);

    assert.deepEqual(this.getConnectorElement()._stored_settings.points, [100, 100, 100, 200]);
});

QUnit.test("with backgroundColor", function(assert) {
    this.options.background = { fill: "red" };
    var label = this.createAndDrawLabel();

    label.setFigureToDrawConnector({ x: 100, y: 100, width: 0, height: 0 });
    label.shift(100, 200);

    assert.deepEqual(this.getConnectorElement()._stored_settings.points, [100, 100, 100, 200]);
});

QUnit.test("bar with odd width. Vertical connector", function(assert) {
    this.options.background.fill = "none";
    var label = this.createAndDrawLabel(),
        connector = this.getConnectorElement();

    label.setFigureToDrawConnector({ x: 300, y: 400, width: 1255, height: 14 });
    label.shift(916, 366);

    assert.ok(connector);
    assert.deepEqual(connector._stored_settings.points, [927, 400, 927, 375]);
});

QUnit.test("bar with odd height. Horizontal connector", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 20, width: 10 }, { x: 59, y: 296, width: 92, height: 97 });

    label.shift(161, 343);

    assert.deepEqual(label._connector._stored_settings.points, [151, 344, 161, 344]);
});

QUnit.test("bar. Horizontal connector. Central point. Connector to the left side", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 20, width: 10 }, { x: 59, y: 306, width: 92, height: 97 });

    label.shift(161, 343);

    assert.deepEqual(label._connector._stored_settings.points, [151, 354, 161, 354]);
});

QUnit.test("bar. Horizontal connector. Central point. Connector to the right side", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 20, width: 10 }, { x: -141, y: 306, width: 92, height: 97 });

    label.shift(-161, 343);

    assert.deepEqual(label._connector._stored_settings.points, [-141, 354, -152, 354]);
});

QUnit.test("Inside", function(assert) {
    var label = this.createAndDrawLabel();

    label.setFigureToDrawConnector({ x: 0, y: 0, width: 100, height: 100 });
    label.shift(80, 80);

    assert.deepEqual(this.getConnectorElement()._stored_settings.points, []);
});

QUnit.test("Rotated label. RotatedAngle = 35", function(assert) {
    this.options.rotationAngle = 35;
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 344, y: 322, width: 30, height: 20 });

    label.shift(390, 341);

    assert.deepEqual(label._connector._stored_settings.points, [374, 332, 402, 351]);
});

QUnit.test("Rotated label. RotatedAngle = 90", function(assert) {
    this.options.rotationAngle = 90;
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 344, y: 322, width: 30, height: 20 });

    label.shift(390, 341);

    assert.deepEqual(label._connector._stored_settings.points, [374, 332, 390, 341]);
});

QUnit.test("Rotated label. RotatedAngle = 180", function(assert) {
    this.options.rotationAngle = 180;
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 344, y: 322, width: 30, height: 20 });

    label.shift(390, 341);

    assert.deepEqual(label._connector._stored_settings.points, [374, 332, 390, 341]);
});

QUnit.test("Rotated label. RotatedAngle = 270", function(assert) {
    this.options.rotationAngle = 270;
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 344, y: 322, width: 30, height: 20 });

    label.shift(390, 341);

    assert.deepEqual(label._connector._stored_settings.points, [374, 332, 390, 341]);
});

// T520777
QUnit.test("Drawn connector to label with odd side", function(assert) {
    var label = this.createLabelWithBBox({ x: 181, y: 36, height: 24, width: 75 }, { x: 218, y: 70, width: 0, height: 0 });
    label.shift(181, 15);

    assert.deepEqual(label._connector._stored_settings.points, [218, 70, 218, 38]);
});

QUnit.test("connector point with rectangle. label to bottom", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 90, y: 10, width: 20, height: 20 });

    label.shift(90, 40);

    assert.deepEqual(label._connector._stored_settings.points, [100, 30, 100, 40]);
});

QUnit.test("connector point with rectangle. label to top", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 90, y: 40, width: 20, height: 20 });

    label.shift(90, 10);

    assert.deepEqual(label._connector._stored_settings.points, [100, 40, 100, 19]);
});

QUnit.test("connector point with rectangle. label to left", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 90, y: 40, width: 20, height: 20 });

    label.shift(10, 40);

    assert.deepEqual(label._connector._stored_settings.points, [90, 49, 29, 49]);
});

QUnit.test("connector point with rectangle. label to right", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 10, y: 40, width: 20, height: 20 });

    label.shift(90, 40);

    assert.deepEqual(label._connector._stored_settings.points, [30, 49, 90, 49]);
});

QUnit.test("Shift label. save only first point", function(assert) {
    var label = this.createLabelWithBBox({ x: 100, y: 200, height: 10, width: 20 }, { x: 100, y: 100, width: 20, height: 10 });

    label.shift(100, 200);
    label.shift(100, 300);
    label.shift(200, 200);

    assert.deepEqual(label._connector._stored_settings.points, [120, 105, 200, 200]);
});

QUnit.test("point. Horizontal connector. Central point. Connector to the left side", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 20, width: 10 }, { x: 145, y: 353, r: 6 });

    label.shift(161, 343);

    assert.deepEqual(label._connector._stored_settings.points, [151, 353, 161, 353]);
});

QUnit.test("point. Horizontal connector. Central point. Connector to the right side", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 20, width: 10 }, { x: 187, y: 353, r: 6 });

    label.shift(161, 343);

    assert.deepEqual(label._connector._stored_settings.points, [181, 353, 170, 353]);
});

QUnit.test("Use external connector strategy", function(assert) {
    this.options.background.fill = "none";

    var label = new labelModule.Label({
        renderer: this.renderer,
        point: this.point,
        labelsGroup: this.group,
        strategy: {
            isLabelInside: function(labelPoint, figure) {
                return false;
            },
            getFigureCenter: function() {
                return [0, 0];
            },
            prepareLabelPoints: function(points) {
                return [[100, 55]];
            },
            isHorizontal: function(bBox, figure) {
                return false;
            },
            findFigurePoint: function(figure, labelPoint) {
                return [10, 10];
            },

            adjustPoints: function(points) {
                return points;
            }
        }
    });
    label.setOptions(this.options);
    label.setData(this.data.formatObject);

    label.draw(true);

    label.setFigureToDrawConnector({ x: 100, y: 100, width: 0, height: 0 });
    label.shift(100, 50);

    assert.deepEqual(this.getConnectorElement()._stored_settings.points, [10, 10, 100, 55]);
});

QUnit.test("Label and point not on one line. Label on top", function(assert) {
    var label = this.createLabelWithBBox({ x: 20, y: 20, width: 20, height: 5 }, { x: 32, y: 50, width: 4, height: 10 });

    label.shift(20, 20);

    assert.deepEqual(label._connector._stored_settings.points, [34, 50, 34, 24]);
});

QUnit.test("Label and point not on one line. Label on bottom", function(assert) {
    var label = this.createLabelWithBBox({ x: 20, y: 20, width: 20, height: 5 }, { x: 32, y: 0, width: 4, height: 10 });

    label.shift(20, 20);

    assert.deepEqual(label._connector._stored_settings.points, [34, 10, 34, 20]);
});

QUnit.test("Label and point not on one line. Label on left", function(assert) {
    var label = this.createLabelWithBBox({ x: 20, y: 20, width: 5, height: 20 }, { x: 35, y: 25, width: 20, height: 4 });

    label.shift(20, 20);

    assert.deepEqual(label._connector._stored_settings.points, [35, 27, 24, 27]);
});

QUnit.test("Label and point not on one line. Label on right", function(assert) {
    var label = this.createLabelWithBBox({ x: 20, y: 20, width: 5, height: 20 }, { x: 0, y: 25, width: 10, height: 4 });

    label.shift(20, 20);

    assert.deepEqual(label._connector._stored_settings.points, [10, 27, 20, 27]);
});

QUnit.test("Label and point not on one line. Rotated. Label on top", function(assert) {
    this.options.rotationAngle = 45;
    var label = this.createLabelWithBBox({ x: 20, y: 20, width: 20, height: 5 }, { x: 32, y: 50, width: 4, height: 10 });

    label.shift(20, 20);

    assert.deepEqual(label._connector._stored_settings.points, [34, 50, 34, 34]);
});

QUnit.test("Label and point not on one line. Rotated. Label on bottom", function(assert) {
    this.options.rotationAngle = 45;
    var label = this.createLabelWithBBox({ x: 20, y: 20, width: 20, height: 5 }, { x: 32, y: 0, width: 4, height: 10 });

    label.shift(20, 20);

    assert.deepEqual(label._connector._stored_settings.points, [34, 10, 34, 34]);
});

QUnit.test("Label and point not on one line. Rotated. Label on left", function(assert) {
    this.options.rotationAngle = 45;
    var label = this.createLabelWithBBox({ x: 20, y: 20, width: 5, height: 20 }, { x: 35, y: 25, width: 20, height: 4 });

    label.shift(20, 20);

    assert.deepEqual(label._connector._stored_settings.points, [35, 27, 27, 27]);
});

QUnit.test("Label and point not on one line. Rotated. Label on right", function(assert) {
    this.options.rotationAngle = 45;
    var label = this.createLabelWithBBox({ x: 20, y: 20, width: 5, height: 20 }, { x: 0, y: 25, width: 10, height: 4 });

    label.shift(20, 20);

    assert.deepEqual(label._connector._stored_settings.points, [10, 27, 27, 27]);
});

QUnit.module("Connector. Pie strategy", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.options.background = { fill: "red" };
    }
}));

QUnit.test("Angle point can be calculated (obtuse angle) - take it", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 80, y: 10, angle: -30 });

    label.shift(120, 15);

    assert.deepEqual(label._connector._stored_settings.points, [80, 10, 97, 20, 120, 20]);
});

QUnit.test("Angle point can be calculated (obtuse angle). Positive angle. III part", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 220, y: 310, angle: 182 });

    label.shift(180, 320);

    assert.deepEqual(label._connector._stored_settings.points, [220, 310, 208, 325, 200, 325]);
});

QUnit.test("Angle point can be calculated (obtuse angle). Obtuse angle. Positive angle. IV part", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 344, y: 322, angle: 292 });

    label.shift(390, 341);

    assert.deepEqual(label._connector._stored_settings.points, [344, 322, 354, 346, 390, 346]);
});

QUnit.test("Angle point cannot be calculated (acute angle) - take label point", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 70, y: 10, angle: -30 });

    label.shift(100, 15);

    assert.deepEqual(label._connector._stored_settings.points, [70, 10, 87, 20, 100, 20]);
});

QUnit.test("Rotated label - take point on horizontal intersection with label's edge", function(assert) {
    this.options.rotationAngle = 35;
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 344, y: 322, angle: 292 });

    label.shift(390, 341);

    assert.deepEqual(label._connector._stored_settings.points, [344, 322, 356, 351, 393, 351]);
});

QUnit.test("Connector with angle could not be built between label and point. Label on the right", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 90, y: 10, angle: -30 });

    label.shift(100, 15);

    assert.deepEqual(label._connector._stored_settings.points, [90, 10, 100, 20]);
});

QUnit.test("Connector with angle could not be built between label and point. Label on the left", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 100, y: 10, angle: -150 });

    label.shift(70, 15);

    assert.deepEqual(label._connector._stored_settings.points, [100, 10, 90, 20]);
});

QUnit.test("Label on top - build straight connector to the bottom center of label", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 63 }, { x: 100, y: 50, angle: 80 });

    label.shift(85, 20);

    assert.deepEqual(label._connector._stored_settings.points, [100, 50, 117, 30]);
});

QUnit.test("Label on bottom - build straight connector to the top center of label", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 63 }, { x: 100, y: 50, angle: 280 });

    label.shift(85, 70);

    assert.deepEqual(label._connector._stored_settings.points, [100, 50, 117, 70]);
});

QUnit.test("Rotated label on top - take point on vertical intersection with label's edge", function(assert) {
    this.options.rotationAngle = 35;
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 100, y: 50, angle: 80 });

    label.shift(85, 20);

    assert.deepEqual(label._connector._stored_settings.points, [100, 50, 97, 36]);
});

QUnit.test("Label on top - build straight connector to the bottom center of label", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 100, y: 50, angle: 80 });

    label.shift(85, 20);

    assert.deepEqual(label._connector._stored_settings.points, [100, 50, 95, 30]);
});

// T175028
QUnit.test("zero angle - build correct connector", function(assert) {
    var label = this.createLabelWithBBox({ x: 0, y: 0, height: 10, width: 20 }, { x: 80, y: 10, angle: 0 });

    label.shift(100, 15);

    assert.deepEqual(label._connector._stored_settings.points, [80, 10, 92, 20, 100, 20]);
});

QUnit.module("Set options", $.extend({}, environment, {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.translator = new MockTranslator({
            getCanvasVisibleArea: { minX: 0, maxX: 100, minY: 0, maxY: 210 }
        });
        this.renderer.bBoxTemplate = { x: 40, y: 40, height: 10, width: 20 };
        this.data = {
            formatObject: {
                value: 15,
                argument: 25,
                seriesName: "testName"
            },
            initialValue: 15
        };
        this.point = sinon.createStubInstance(pointModule.Point);
        this.point.hasValue.returns(true);
        this.options = {
            horizontalOffset: 0,
            verticalOffset: 0,
            visible: true,
            background: {
                fill: "red"
            },
            connector: {
                "stroke-width": 2,
                stroke: "green"
            },
            attributes: {}
        };
    }
}));

QUnit.test("Set options to existing elements", function(assert) {
    var label = this.createLabel();

    label.show();

    this.options.background.fill = "yellow";
    this.options.connector.stroke = "green";
    label.setData({ argument: 10, value: 10 });
    label.setOptions(this.options);
    label.show();

    assert.equal(label._text._stored_settings.text, "10");
    assert.equal(label._background._stored_settings.fill, "yellow");
    assert.equal(label._connector._stored_settings.stroke, "green");

    assert.equal(this.renderer.stub("text").callCount, 1);
    assert.equal(this.renderer.stub("rect").callCount, 1);
    assert.equal(this.renderer.stub("path").callCount, 1);
});

QUnit.test("Set options to unexisting elements", function(assert) {
    this.options.background.fill = "none";
    this.options.connector["stroke-width"] = 0;
    var label = this.createLabel();

    label.show();
    this.options.background.fill = "yellow";
    this.options.connector["stroke-width"] = 2;
    label.setData({ argument: 10, value: 10 });
    label.setOptions(this.options);
    label.show();

    assert.equal(label._text._stored_settings.text, "10");
    assert.equal(label._background._stored_settings.fill, "yellow");
    assert.equal(label._connector._stored_settings["stroke-width"], 2);

    assert.equal(this.renderer.stub("text").callCount, 1);
    assert.equal(this.renderer.stub("rect").callCount, 1);
    assert.equal(this.renderer.stub("path").callCount, 1);
});

QUnit.test("Set options on empty text", function(assert) {
    var label = this.createLabel();

    label.show();

    this.options.customizeText = function() {
        return "";
    };
    label.setData({ argument: 10, value: 10 });
    label._group.stub("attr").reset();
    label.setOptions(this.options);
    label.show();

    assert.strictEqual(label._group.stub("attr").callCount, 1);
    assert.deepEqual(label._group.stub("attr").lastCall.args[0], { visibility: "hidden" });
});

QUnit.test("getBoundingRect on empty text", function(assert) {
    var label = this.createLabel();

    label.show();

    this.options.customizeText = function() {
        return "";
    };
    label.setOptions(this.options);
    label.show();

    assert.deepEqual(label.getBoundingRect(), {});
});

QUnit.test("Set tracker data", function(assert) {
    this.options.background.fill = "red";
    this.renderer.bBoxTemplate = { x: 10, y: 40, height: 10, width: 20 };
    var label = this.createAndDrawLabel();

    label.setTrackerData("trackerData");

    assert.deepEqual(this.renderer.stub("text").getCall(0).returnValue.data.getCall(0).args[0], { "chart-data-point": "trackerData" }, "tracker data");
    assert.deepEqual(this.renderer.stub("rect").getCall(0).returnValue.data.getCall(0).args[0], { "chart-data-point": "trackerData" }, "tracker data");
});

QUnit.module("Dispose", $.extend({}, environment, {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.translator = new MockTranslator({
            getCanvasVisibleArea: { minX: 0, maxX: 100, minY: 0, maxY: 210 }
        });
        this.renderer.bBoxTemplate = { x: 40, y: 40, height: 10, width: 20 };
        this.data = {
            formatObject: {
                value: 15,
                argument: 25,
                seriesName: "testName"
            },
            initialValue: 15
        };
        this.point = sinon.createStubInstance(pointModule.Point);
        this.point.hasValue.returns(true);
        this.options = {
            horizontalOffset: 0,
            verticalOffset: 0,
            visible: true,
            background: {
                fill: "red"
            },
            connector: {
                "stroke-width": 2
            },
            attributes: {}
        };
    }
}));

QUnit.test("Simple label", function(assert) {
    var label = this.createLabel();
    label.show();

    var _group = label._group;

    label.dispose();

    assert.strictEqual(label._data, null, "data");
    assert.strictEqual(label._options, null, "options");

    assert.strictEqual(label._text, null, "text");
    assert.strictEqual(label._background, null, "background");
    assert.strictEqual(label._connector, null, "connector");
    assert.strictEqual(label._group, null, "group");
    assert.strictEqual(label._insideGroup, null, "inside group");

    assert.ok(_group.stub("dispose").calledOnce);
});

QUnit.test("Pie label", function(assert) {
    var label = this.createLabel();
    label.show();

    var _group = label._group;

    label.dispose();

    assert.strictEqual(label._data, null, "data");
    assert.strictEqual(label._options, null, "options");

    assert.strictEqual(label._text, null, "text");
    assert.strictEqual(label._background, null, "background");
    assert.strictEqual(label._connector, null, "connector");
    assert.strictEqual(label._group, null, "group");
    assert.strictEqual(label._insideGroup, null, "inside group");

    assert.ok(_group.stub("dispose").calledOnce);
});

QUnit.module("getBoundingRect", $.extend({}, environment, {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.translator = new MockTranslator({
            getCanvasVisibleArea: { minX: 0, maxX: 100, minY: 0, maxY: 210 }
        });
        this.renderer.bBoxTemplate = { x: 40 + 8, y: 40 + 4, height: 10 - 8, width: 20 - 16 };
        this.point = sinon.createStubInstance(pointModule.Point);
        this.point.hasValue.returns(true);
        this.data = {
            formatObject: {
                value: 15,
                argument: 25,
                seriesName: "testName"
            }
        };
        this.options = {
            horizontalOffset: 0,
            verticalOffset: 0,
            visible: true,
            background: {
                fill: "red"
            },
            attributes: {}
        };
    }
}));

QUnit.test("get bounding rect", function(assert) {
    var label = this.createLabel();
    label.show();
    label.shift(40, 40);

    assert.deepEqual(label.getBoundingRect(), { x: 40, y: 40, width: 20, height: 10 });
});

QUnit.module("Layouted label", $.extend({}, environment, {
    beforeEach: function() {
        this.options = {
            horizontalOffset: 0,
            verticalOffset: 0,
            radialOffset: 0,
            visible: true,
            position: "inside",
            alignment: "[DIRECTION]",
            background: {
                fill: "red"
            },
            connector: {
                'stroke-width': 2
            }
        };
        this.point = sinon.createStubInstance(pointModule.Point);
        this.point.hasValue.returns(true);
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.data = {
            formatObject: {
                value: 15,
                argument: 25,
                seriesName: "testName"
            },
            initialValue: 15
        };
        this.translator = new MockTranslator({
            getCanvasVisibleArea: { minX: 0, maxX: 100, minY: 0, maxY: 210 }
        });
        this.renderer.bBoxTemplate = { x: 9, y: 6, height: 10 - 8, width: 20 - 16 };
    }
}));

QUnit.test("simple shift", function(assert) {
    var label = this.createLabel(),
        innerGroup;
    label.show();

    label.shift(10, 10);

    innerGroup = label._insideGroup;
    assert.ok(innerGroup);
    assert.deepEqual(innerGroup._stored_settings, { translateX: 10 - 1, translateY: 10 - 2 });
    assert.equal(label._insideGroup.stub("append").lastCall.args[0], label._group);
    assert.equal(label._group.stub("append").lastCall.args[0], this.group);
});

QUnit.test("disposing elements. not crash", function(assert) {
    assert.expect(0);

    var label = this.createLabel();

    label.show();
    label.dispose();
    label.shift(10, 10, "hidden");
});

QUnit.test("Cache boundingRect", function(assert) {
    var label = this.createAndDrawLabel(),
        BBox;

    label.shift(1, 2);
    label.getBoundingRect();
    BBox = label.getBoundingRect();

    assert.ok(BBox, "bbox returned");
    assert.deepEqual(BBox, {
        height: 10,
        width: 20,
        x: 1,
        y: 2
    }, "equal bbox");
});

QUnit.test("getBoundingRect. After redraw", function(assert) {
    this.options.connector = null;
    var label = this.createLabel(),
        BBox;

    label.show();
    label.shift(1, 2);

    label.show();

    BBox = label.getBoundingRect();

    assert.ok(BBox, "bbox returned");
    assert.deepEqual(BBox, {
        height: 10,
        width: 20,
        x: 1,
        y: 2
    }, "equal bbox");

    assert.equal(label._insideGroup.stub("append").lastCall.args[0], label._group);
    assert.equal(label._group.stub("append").lastCall.args[0], this.group);
});

QUnit.test("getBoundingRect after shift", function(assert) {
    var label = this.createLabel(),
        innerGroup,
        BBox;

    label.show();

    innerGroup = this.group.children[0];

    label.shift(100, 100);

    BBox = label.getBoundingRect();

    assert.ok(BBox, "bbox returned");
    assert.ok(!innerGroup.stub("getBBox").called);
    assert.deepEqual(BBox, {
        height: 10,
        width: 20,
        x: 100,
        y: 100
    }, "equal bbox");
});

QUnit.test("getBoundingRect after double shift", function(assert) {
    var label = this.createLabel(),
        innerGroup,
        BBox;

    label.show();

    innerGroup = this.group.children[0];

    label.shift(100, 100);
    label.shift(200, 200);

    BBox = label.getBoundingRect();

    assert.ok(BBox, "bbox returned");
    assert.ok(!innerGroup.stub("getBBox").called);
    assert.deepEqual(BBox, {
        height: 10,
        width: 20,
        x: 200,
        y: 200
    }, "equal bbox");
});

QUnit.test("getLayoutOptions", function(assert) {
    var label = this.createLabel(this.options),
        options = label.getLayoutOptions();

    assert.deepEqual(options, {
        alignment: "[DIRECTION]",
        background: true,
        horizontalOffset: this.options.horizontalOffset,
        verticalOffset: this.options.verticalOffset,
        position: this.options.position,
        radialOffset: this.options.radialOffset,
        connectorOffset: 8
    });
});

QUnit.test("getLayoutOptions without background", function(assert) {
    this.options.background = {
        visible: false
    };
    var label = this.createLabel(this.options),
        options = label.getLayoutOptions();

    assert.equal(options.background, false);
    assert.equal(options.connectorOffset, 0);
});

QUnit.test("getLayoutOptions when connector visible", function(assert) {
    this.options.connector = {
        "stroke-width": 1,
        stroke: "red"
    };
    var label = this.createLabel(this.options),
        options = label.getLayoutOptions();

    assert.equal(options.connectorOffset, 20);
});

QUnit.test("fit without background", function(assert) {
    this.options.background = { fill: "none" };

    var label = this.createAndDrawLabel();

    label.shift(-7, -2);
    label.fit(15);

    var text = this.renderer.text.getCall(0).returnValue;

    assert.equal(text.setMaxSize.args[0][0], 15, "Max width param");
});

QUnit.test("fit with background", function(assert) {
    this.options.background = { fill: "red" };

    var label = this.createAndDrawLabel();

    label.shift(-7, -2);
    label.fit(31);

    var text = this.renderer.text.getCall(0).returnValue,
        background = this.renderer.rect.getCall(0).returnValue;

    assert.equal(text.setMaxSize.args[0][0], 15, "Max width param");
    assert.strictEqual(background.attr.called, true, "New background rect");
});

QUnit.test("Label's fit. Count of rows changed", function(assert) {
    this.options.background = { fill: "red" };
    const label = this.createAndDrawLabel();

    this.renderer.text.lastCall.returnValue.setMaxSize = function() {
        return { rowCount: 2 };
    };
    label.shift(-7, -2);

    assert.strictEqual(label.fit(31), true);
});

QUnit.test("Label's fit. Count of rows not changed", function(assert) {
    this.options.background = { fill: "red" };
    const label = this.createAndDrawLabel();

    this.renderer.text.lastCall.returnValue.setMaxSize = function() {
        return { rowCount: 1 };
    };
    label.shift(-7, -2);
    label.fit(31);
    assert.strictEqual(label.fit(31), false);
});

QUnit.test("Label's fit. rowCount = 0 ", function(assert) {
    this.options.background = { fill: "red" };
    const label = this.createAndDrawLabel();

    this.renderer.text.lastCall.returnValue.setMaxSize = function() {
        return { rowCount: 0 };
    };
    label.shift(-7, -2);
    assert.strictEqual(label.fit(31), false);
});

QUnit.test("Hide background when text is empty", function(assert) {
    this.options.background = { fill: "red" };
    const label = this.createAndDrawLabel();
    const background = this.renderer.rect.getCall(0).returnValue;

    this.renderer.text.lastCall.returnValue.setMaxSize = function() {
        return { textIsEmpty: true };
    };
    label.shift(-7, -2);
    label.fit(31);

    assert.strictEqual(background.dispose.callCount, 1);
});

QUnit.test("resetEllipsis", function(assert) {
    this.options.background = { fill: "red" };

    var label = this.createAndDrawLabel();

    label.shift(-7, -2);
    label.resetEllipsis(15);

    var text = this.renderer.text.getCall(0).returnValue,
        background = this.renderer.rect.getCall(0).returnValue;

    assert.strictEqual(text.restoreText.called, true, "text is restored");
    assert.strictEqual(background.attr.called, true, "New background rect");
});

QUnit.module("Format label", $.extend({}, environment, {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();
        this.data = {
            formatObject: {
                value: 10,
                argument: 12,
                seriesName: "testName"
            },
            initialValue: 15
        };
        this.point = sinon.createStubInstance(pointModule.Point);
        this.point.hasValue.returns(true);
        this.options = {
            horizontalOffset: 0,
            verticalOffset: 0,
            visible: true,
            format: { type: "fixedPoint", precision: 2 },
            argumentFormat: { type: "fixedPoint", precision: 2 },
            background: {
                fill: "red"
            },
            connector: {
                'stroke-width': 2
            },
            attributes: {}
        };
        this.translator = new MockTranslator({
            getCanvasVisibleArea: { minX: 0, maxX: 100, minY: 0, maxY: 210 }
        });
        this.renderer.bBoxTemplate = { x: 40, y: 40, height: 10, width: 20 };
    }
}));

QUnit.test("Fixed point", function(assert) {
    var customizeTextSpy = sinon.spy();
    this.options.format = { type: "fixedPoint", precision: 2 };
    this.options.argumentFormat = { type: "fixedPoint", precision: 2 };
    this.options.customizeText = customizeTextSpy;
    var label = this.createLabel();

    label.show();

    assert.ok(customizeTextSpy.calledOnce);
    assert.deepEqual(customizeTextSpy.lastCall.args[0],
        {
            argument: 12,
            argumentText: "12.00",
            seriesName: "testName",
            value: 10,
            valueText: "10.00"
        });

});

QUnit.module("Is visible", environment);

QUnit.test("has text", function(assert) {
    this.data = {
        formatObject: {
            value: 10,
            argument: 12
        }
    };
    assert.ok(this.createAndDrawLabel().isVisible());
});

QUnit.test("has no text", function(assert) {
    this.data = { formatObject: {} };
    assert.ok(!this.createAndDrawLabel().isVisible());
});

QUnit.module("hideInsideLabel", environment);

QUnit.test("Called 'hideInsideLabel' method", function(assert) {
    this.point.hideInsideLabel = sinon.stub().returns(true);
    var label = this.createLabel(),
        coords = { x: 2, y: 3 };

    assert.ok(label.hideInsideLabel(coords));
    assert.equal(this.point.hideInsideLabel.lastCall.args[0], label);
    assert.equal(this.point.hideInsideLabel.lastCall.args[1], coords);
});
