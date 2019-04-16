import $ from "jquery";
import { createAnnotations } from "viz/core/annotations";
import vizMocks from "../../helpers/vizMocks.js";

const environment = {
    beforeEach() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();

        this.widget = {
            _renderer: this.renderer,
            _getAnnotationCoords: sinon.stub().returns({ x: 100, y: 200 })
        };
    }
};

QUnit.module("Image annotation", environment);

QUnit.test("Do not draw annotation if cannot get coords", function(assert) {
    const testCase = (anchor, coords, message) => {
        this.widget._getAnnotationCoords.returns(anchor);
        const annotation = createAnnotations([$.extend({ type: "image", image: { url: "some_url" } }, coords)], {})[0];

        annotation.draw(this.widget, this.group);

        assert.equal(this.renderer.stub("image").callCount, 0, message);
    };

    testCase({ x: undefined, y: undefined }, { x: undefined, y: undefined }, "No anchor, no coords");
    testCase({ x: null, y: null }, { x: null, y: null }, "No anchor, no coords");
    testCase({ x: undefined, y: undefined }, { x: 100, y: undefined }, "Only x is defined");
    testCase({ x: undefined, y: undefined }, { x: undefined, y: 100 }, "Only y is defined");
});

QUnit.test("Image params", function(assert) {
    const annotation = createAnnotations([{ x: 10, y: 20, type: "image", image: { url: "some_url", width: 10, height: 10, location: "some_location" } }])[0];

    annotation.draw(this.widget, this.group);

    assert.deepEqual(this.renderer.image.firstCall.args, [0, 0, 10, 10, "some_url", "some_location"]);
});

QUnit.test("Merge common and item options", function(assert) {
    const annotation = createAnnotations([{ x: 10, y: 20, type: "image", image: { url: "some_url", width: 10 } }], { image: { height: 10 } })[0];

    annotation.draw(this.widget, this.group);

    assert.deepEqual(this.renderer.image.firstCall.args, [0, 0, 10, 10, "some_url", "center"]);
});

QUnit.test("Merge customizeAnnotation result and common+item options", function(assert) {
    const customizeAnnotation = sinon.stub().returns({ image: { url: "customized_url" } });
    const itemOptions = {
        x: 10, y: 20,
        type: "image",
        image: { url: "some_url", width: 10 }
    };
    const annotation = createAnnotations([itemOptions], { image: { height: 10 } }, customizeAnnotation)[0];

    annotation.draw(this.widget, this.group);

    assert.deepEqual(this.renderer.image.firstCall.args, [0, 0, 10, 10, "customized_url", "center"]);
    assert.equal(customizeAnnotation.callCount, 1);
    assert.equal(customizeAnnotation.getCall(0).args[0], itemOptions);
});

QUnit.test("Draw image inside a plaque with borders and arrow", function(assert) {
    const annotation = createAnnotations([{ type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
        border: {
            width: 2,
            color: "#000000",
            dashStyle: "solid",
            visible: true
        },
        color: "#AAAAAA",
        opacity: 0.5,
        arrowLength: 20,
        arrowWidth: 30,
        paddingLeftRight: 10,
        paddingTopBottom: 15,
        shadow: {
            opacity: 0.2,
            offsetX: 3,
            offsetY: 4,
            blur: 5,
            color: "#111111"
        }
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    assert.equal(this.renderer.g.callCount, 3);
    const wrapperGroup = this.renderer.g.getCall(0).returnValue;
    assert.deepEqual(wrapperGroup.append.firstCall.args, [this.group]);

    const annotationGroup = this.renderer.g.getCall(1).returnValue;
    assert.deepEqual(annotationGroup.attr.firstCall.args, [{ class: "dxc-image-annotation" }]);
    assert.deepEqual(annotationGroup.append.firstCall.args, [wrapperGroup]);

    assert.equal(this.renderer.shadowFilter.callCount, 1);
    assert.deepEqual(this.renderer.shadowFilter.firstCall.returnValue.attr.firstCall.args, [{
        x: "-50%",
        y: "-50%",
        width: "200%",
        height: "200%",
        opacity: 0.2,
        offsetX: 3,
        offsetY: 4,
        blur: 5,
        color: "#111111"
    }]);

    assert.equal(this.renderer.path.callCount, 1);
    assert.deepEqual(this.renderer.path.getCall(0).args, [[], "area"]);
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.firstCall.args, [{
        "stroke-width": 2,
        stroke: "#000000",
        dashStyle: "solid",
        fill: "#AAAAAA",
        "filter": "shadowFilter.id",
        opacity: 0.5
    }]);
    assert.deepEqual(plaque.append.firstCall.args, [annotationGroup]);
    assert.equal(plaque.sharp.callCount, 1);
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [80, 140, 120, 140, 120, 180, 115, 180, 100, 200, 85, 180, 80, 180]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.append.firstCall.args, [annotationGroup]);
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 1 - 10, 160 - 2 - 5]);

    assert.equal(this.renderer.image.callCount, 1);
    assert.deepEqual(this.renderer.image.firstCall.returnValue.append.firstCall.args, [contentGroup]);
});

QUnit.test("Draw image inside a plaque without borders", function(assert) {
    const annotation = createAnnotations([{ x: 0, y: 0, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
        border: {
            width: 2,
            color: "#000000",
            dashStyle: "solid",
            visible: false
        },
        color: "#AAAAAA",
        opacity: 0.5
    })[0];
    this.renderer.g.reset();
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.firstCall.args, [{
        "stroke-width": 0,
        fill: "#AAAAAA",
        "filter": "shadowFilter.id",
        opacity: 0.5
    }]);
});

QUnit.test("Draw annotation with anchor and x/y", function(assert) {
    const annotation = createAnnotations([{ x: 300, y: 50, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 30,
        paddingLeftRight: 10,
        paddingTopBottom: 15
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [280, 30, 320, 30, 320, 70, 315, 70, 100, 200, 285, 70, 280, 70]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [300 - 1 - 10, 50 - 2 - 5]);
});

QUnit.test("Draw annotation with anchor and only x", function(assert) {
    const annotation = createAnnotations([{ x: 300, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 30,
        paddingLeftRight: 10,
        paddingTopBottom: 15
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [280, 140, 320, 140, 320, 180, 315, 180, 100, 200, 285, 180, 280, 180]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [300 - 1 - 10, 160 - 2 - 5]);
});

QUnit.test("Draw annotation with anchor and only y", function(assert) {
    const annotation = createAnnotations([{ y: 50, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 30,
        paddingLeftRight: 10,
        paddingTopBottom: 15
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [80, 30, 120, 30, 120, 70, 115, 70, 100, 200, 85, 70, 80, 70]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 1 - 10, 50 - 2 - 5]);
});

QUnit.test("Draw annotation with x/y and without anchor", function(assert) {
    this.widget._getAnnotationCoords.returns({});
    const annotation = createAnnotations([{ x: 300, y: 50, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 30,
        paddingLeftRight: 10,
        paddingTopBottom: 15
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [280, 30, 320, 30, 320, 70, 315, 70, 300, 70, 285, 70, 280, 70]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [300 - 1 - 10, 50 - 2 - 5]);
});

QUnit.module("Text annotaion", environment);

QUnit.test("Draw text inside plaque", function(assert) {
    const annotation = createAnnotations([{ x: 0, y: 0, type: "text", text: "some text", font: {} } ], {})[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    const annotationGroup = this.renderer.g.getCall(1).returnValue;
    assert.deepEqual(annotationGroup.attr.firstCall.args, [{ class: "dxc-text-annotation" }]);

    assert.strictEqual(this.renderer.text.callCount, 1);
    assert.deepEqual(this.renderer.text.firstCall.returnValue.append.firstCall.args, [this.renderer.g.getCall(2).returnValue]);
});

QUnit.test("Text params", function(assert) {
    const annotation = createAnnotations([{ x: 0, y: 0, type: "text", text: "some text", font: { size: 20 } } ], {})[0];

    annotation.draw(this.widget, this.group);

    assert.deepEqual(this.renderer.text.firstCall.args, ["some text"]);
    assert.deepEqual(this.renderer.text.firstCall.returnValue.css.firstCall.args, [{ "font-size": 20 }]);
});

QUnit.test("Merge common and item options", function(assert) {
    const annotation = createAnnotations([{ x: 0, y: 0, type: "text", text: "some text", font: { size: 20 } } ], {
        font: { color: "red" }
    })[0];

    annotation.draw(this.widget, this.group);

    assert.deepEqual(this.renderer.text.firstCall.returnValue.css.firstCall.args, [{ "font-size": 20, "fill": "red" }]);
});

QUnit.module("Tooltip", environment);

QUnit.test("Get tooltip params", function(assert) {
    const annotation = createAnnotations([{ x: 0, y: 0, type: "image", image: { url: "some_url" } }], {})[0];

    annotation.draw(this.widget, this.group);

    // assert
    assert.deepEqual(annotation.getTooltipParams(), { x: 100, y: 200 });
});

QUnit.test("Get tooltip format object", function(assert) {
    const items = [{ x: 0, y: 0, opt_1: "opt_1", type: "image", image: { url: "some_url" }, description: "item_desc" }];
    const annotation = createAnnotations(items, {})[0];

    annotation.draw(this.widget, this.group);

    // assert
    assert.deepEqual(annotation.getTooltipFormatObject(), $.extend({ valueText: "item_desc" }, items[0]));
});

QUnit.test("customizeTooltip in item", function(assert) {
    const customizeTooltip = function() { return 2; };
    const items = [{ x: 0, y: 0, opt_1: "opt_1", type: "image", image: { url: "some_url" }, customizeTooltip }];
    const annotation = createAnnotations(items, { customizeTooltip: function() { return 1; } })[0];

    annotation.draw(this.widget, this.group);

    // assert
    assert.equal(annotation.options.customizeTooltip, customizeTooltip);
});

QUnit.module("Misc", environment);

QUnit.test("Do not create annotation with wrong type", function(assert) {
    const annotations = createAnnotations([
        { type: "image" },
        { type: "wrongtype" },
        { type: "text" }
    ], {});

    assert.equal(annotations.length, 2);
    assert.equal(annotations[0].type, "image");
    assert.equal(annotations[1].type, "text");
});
