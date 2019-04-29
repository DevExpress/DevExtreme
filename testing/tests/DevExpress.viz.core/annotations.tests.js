import $ from "jquery";
import { createAnnotations } from "viz/core/annotations";
import vizMocks from "../../helpers/vizMocks.js";

const environment = {
    beforeEach() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();

        this.widget = {
            _renderer: this.renderer,
            _getAnnotationCoords: sinon.stub().returns({ x: 100, y: 200, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 500, height: 500 } })
        };
    }
};

QUnit.module("Image annotation", environment);

QUnit.test("Do not draw annotation if cannot get coords, or coords out of canvas", function(assert) {
    const testCase = (anchor, coords, message) => {
        this.widget._getAnnotationCoords.returns($.extend({ canvas: { left: 50, top: 50, right: 50, bottom: 50, width: 500, height: 500 } }, anchor));
        const annotation = createAnnotations([$.extend({ type: "image", image: { url: "some_url" } }, coords)], {})[0];

        annotation.draw(this.widget, this.group);

        assert.equal(this.renderer.stub("image").callCount, 0, message);
    };

    testCase({ x: undefined, y: undefined }, { x: undefined, y: undefined }, "No anchor, no coords");
    testCase({ x: null, y: null }, { x: null, y: null }, "No anchor, no coords");
    testCase({ x: undefined, y: undefined }, { x: 100, y: undefined }, "Only x is defined");
    testCase({ x: undefined, y: undefined }, { x: undefined, y: 100 }, "Only y is defined");

    testCase({ x: 30, y: 200 }, { x: undefined, y: undefined });
    testCase({ x: 470, y: 200 }, { x: undefined, y: undefined });
    testCase({ x: 200, y: 30 }, { x: undefined, y: undefined });
    testCase({ x: 200, y: 470 }, { x: undefined, y: undefined });
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

QUnit.test("Get size from annotation setting if it less than image size", function(assert) {
    const annotation = createAnnotations([{ type: "image", image: { url: "some_url", width: 50, height: 50 } }], {
        color: "#AAAAAA",
        opacity: 0.5,
        arrowLength: 0,
        arrowWidth: 0,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        width: 20,
        height: 30
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const imageArgs = this.renderer.image.lastCall.args;
    assert.deepEqual(imageArgs[2], 20, "width");
    assert.deepEqual(imageArgs[3], 30, "height");
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
    this.widget._getAnnotationCoords.returns({ x: 290, y: 200, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 500, height: 500 } });
    const annotation = createAnnotations([{ x: 300, y: 50, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 10,
        paddingLeftRight: 10,
        paddingTopBottom: 15
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [280, 30, 320, 30, 320, 70, 295, 70, 290, 200, 285, 70, 280, 70]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [300 - 1 - 10, 50 - 2 - 5]);
});

QUnit.test("Draw annotation with anchor and only x", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 290, y: 200, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 500, height: 500 } });
    const annotation = createAnnotations([{ x: 300, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 10,
        paddingLeftRight: 10,
        paddingTopBottom: 15
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [280, 140, 320, 140, 320, 180, 295, 180, 290, 200, 285, 180, 280, 180]
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
        points: [280, 30, 320, 30, 320, 70, 280, 70]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [300 - 1 - 10, 50 - 2 - 5]);
});

QUnit.module("Check plaque path", environment);

QUnit.test("Arrow on the top, left side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 120, y: 240, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [100, 220, 100, 220, 100, 200, 110, 220, 140, 220, 140, 260, 100, 260]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [120 - 10, 240 - 10]);
});

QUnit.test("Arrow on the top, center", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 100, y: 240, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [80, 220, 90, 220, 100, 200, 110, 220, 120, 220, 120, 260, 80, 260]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 10, 240 - 10]);
});

QUnit.test("Arrow on the top, right side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 80, y: 240, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [60, 220, 90, 220, 100, 200, 100, 220, 100, 220, 100, 260, 60, 260]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [80 - 10, 240 - 10]);
});

QUnit.test("Arrow on the bottom, left side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 120, y: 160, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [100, 140, 140, 140, 140, 180, 110, 180, 100, 200, 100, 180, 100, 180]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [120 - 10, 160 - 10]);
});

QUnit.test("Arrow on the bottom, center", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 100, y: 160, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [80, 140, 120, 140, 120, 180, 110, 180, 100, 200, 90, 180, 80, 180]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 10, 160 - 10]);
});

QUnit.test("Arrow on the bottom, right side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 80, y: 160, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [60, 140, 100, 140, 100, 180, 100, 180, 100, 200, 90, 180, 60, 180]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [80 - 10, 160 - 10]);
});

QUnit.test("Arrow on the left, top side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 60, y: 220, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [40, 200, 80, 200, 80, 200, 100, 200, 80, 210, 80, 240, 40, 240]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [60 - 10, 220 - 10]);
});

QUnit.test("Arrow on the left, center", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 60, y: 200, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [40, 180, 80, 180, 80, 190, 100, 200, 80, 210, 80, 220, 40, 220]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [60 - 10, 200 - 10]);
});

QUnit.test("Arrow on the left, bottom side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 60, y: 180, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [40, 160, 80, 160, 80, 190, 100, 200, 80, 200, 80, 200, 40, 200]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [60 - 10, 180 - 10]);
});

QUnit.test("Arrow on the right, top side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 140, y: 220, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [120, 200, 160, 200, 160, 240, 120, 240, 120, 210, 100, 200, 120, 200]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [140 - 10, 220 - 10]);
});

QUnit.test("Arrow on the left, center", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 140, y: 200, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [120, 180, 160, 180, 160, 220, 120, 220, 120, 210, 100, 200, 120, 190]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [140 - 10, 200 - 10]);
});

QUnit.test("Arrow on the left, bottom side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 140, y: 180, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [120, 160, 160, 160, 160, 200, 120, 200, 120, 200, 100, 200, 120, 190]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [140 - 10, 180 - 10]);
});

QUnit.test("Arrow on top-left corner", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 140, y: 240, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [120, 230, 100, 200, 130, 220, 160, 220, 160, 260, 120, 260]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [140 - 10, 240 - 10]);
});

QUnit.test("Arrow on top-right corner", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 60, y: 240, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [40, 220, 70, 220, 100, 200, 80, 230, 80, 260, 40, 260]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [60 - 10, 240 - 10]);
});

QUnit.test("Arrow on bottom-right corner", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 60, y: 160, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [40, 140, 80, 140, 80, 170, 100, 200, 70, 180, 40, 180]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [60 - 10, 160 - 10]);
});

QUnit.test("Arrow on bottom-left corner", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 140, y: 160, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [120, 140, 160, 140, 160, 180, 130, 180, 100, 200, 120, 170]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [140 - 10, 160 - 10]);
});

QUnit.test("Anchor is inside plaque", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 100, y: 200, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [80, 180, 120, 180, 120, 220, 80, 220]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 10, 200 - 10]);
});

QUnit.test("Arrow on the left, center. Arrow width is bigger than annotation height", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 60, y: 200, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 200,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [40, 180, 80, 180, 80, 180, 100, 200, 80, 220, 80, 220, 40, 220]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [60 - 10, 200 - 10]);
});

QUnit.test("Arrow on the bottom, center. Arrow width is bigger than annotation width", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ x: 100, y: 160, type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 200,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [80, 140, 120, 140, 120, 180, 120, 180, 100, 200, 80, 180, 80, 180]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 10, 160 - 10]);
});

QUnit.module("Check plaque path on pane bounds", environment);

QUnit.test("Out of right bound - draw plaque from right border", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 440, y: 200, canvas: { left: 50, top: 50, right: 50, bottom: 50, width: 500, height: 500 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [410, 140, 450, 140, 450, 180, 450, 180, 440, 200, 430, 180, 410, 180]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [430 - 10, 160 - 10]);
});

QUnit.test("Out of left bound - draw plaque from left border", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 60, y: 200, canvas: { left: 50, top: 50, right: 50, bottom: 50, width: 500, height: 500 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [50, 140, 90, 140, 90, 180, 70, 180, 60, 200, 50, 180, 50, 180]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [70 - 10, 160 - 10]);
});

QUnit.test("Plaque width more than canvas - draw plaque in center", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 5, y: 200, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 20, height: 500 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [-10, 140, 30, 140, 30, 180, 15, 180, 5, 200, -5, 180, -10, 180]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [10 - 10, 160 - 10]);
});

QUnit.test("Out of top bound - draw plaque under anchor", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 200, y: 90, canvas: { left: 50, top: 50, right: 50, bottom: 50, width: 500, height: 500 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [180, 110, 190, 110, 200, 90, 210, 110, 220, 110, 220, 150, 180, 150]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [200 - 10, 130 - 10]);
});

QUnit.test("Out of top bound, but does not fit under anchor - draw plaque from top border", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 200, y: 50, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 500, height: 90 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [180, 0, 220, 0, 220, 40, 210, 40, 200, 50, 190, 40, 180, 40]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [200 - 10, 20 - 10]);
});

QUnit.test("Plaque height more than canvas - draw plaque from top border", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 200, y: 10, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 500, height: 30 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 20,
        paddingLeftRight: 10,
        paddingTopBottom: 10
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [180, 0, 220, 0, 220, 40, 180, 40]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [200 - 10, 20 - 10]);
});

QUnit.module("Text annotaion", environment);

QUnit.test("Draw text inside plaque", function(assert) {
    const annotation = createAnnotations([{ x: 0, y: 0, type: "text", text: "some text", font: {} } ], {})[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    const annotationGroup = this.renderer.g.getCall(1).returnValue;
    assert.deepEqual(annotationGroup.attr.firstCall.args, [{ class: "dxc-text-annotation" }]);

    assert.strictEqual(this.renderer.text.callCount, 1);
    const text = this.renderer.text.firstCall.returnValue;
    assert.deepEqual(text.append.firstCall.args, [this.renderer.g.getCall(2).returnValue]);
    assert.ok(!text.setMaxSize.called);
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

QUnit.test("Draw text with width/height", function(assert) {
    const annotation = createAnnotations([{
        x: 0, y: 0,
        type: "text",
        text: "some text",
        font: {},
        width: 100,
        height: 150,
        textOverflow: "hide",
        wordWrap: "normal",
        paddingLeftRight: 10,
        paddingTopBottom: 20,
        arrowWidth: 0
    }], {})[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    const annotationGroup = this.renderer.g.getCall(1).returnValue;
    assert.deepEqual(annotationGroup.attr.firstCall.args, [{ class: "dxc-text-annotation" }]);

    const text = this.renderer.text.firstCall.returnValue;

    assert.equal(text.setMaxSize.callCount, 1);
    assert.deepEqual(text.setMaxSize.lastCall.args, [100, 150, { textOverflow: "hide", wordWrap: "normal" }]);

    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [-60, -95, 60, -95, 60, 95, 100, 200, 60, 95, -60, 95]
    }]);
});

QUnit.test("Do not call setMax size is less than 0", function(assert) {
    const annotation = createAnnotations([{
        x: 0, y: 0,
        type: "text",
        text: "some text",
        font: {},
        width: -1,
        height: -1,
        textOverflow: "hide",
        wordWrap: "normal",
        paddingLeftRight: 30,
        paddingTopBottom: 20,
        arrowWidth: 0
    }], {})[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    const annotationGroup = this.renderer.g.getCall(1).returnValue;
    assert.deepEqual(annotationGroup.attr.firstCall.args, [{ class: "dxc-text-annotation" }]);

    const text = this.renderer.text.firstCall.returnValue;

    assert.ok(!text.stub("setMaxSize").called);
});


QUnit.test("Draw plague bound text bbox if it greater than passed size", function(assert) {
    const annotation = createAnnotations([{
        x: 0, y: 0,
        type: "text",
        text: "some text",
        font: {},
        width: 1,
        height: 1,
        textOverflow: "hide",
        wordWrap: "normal",
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        arrowWidth: 0
    }], {})[0];
    this.renderer.g.reset();
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 100, height: 200 };

    annotation.draw(this.widget, this.group);

    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.deepEqual(plaque.attr.lastCall.args, [{
        points: [-50, -100, 50, -100, 50, 100, 100, 200, 50, 100, -50, 100]
    }]);
});

QUnit.module("Tooltip", environment);

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
