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
    const testCase = (coords, message) => {
        this.widget._getAnnotationCoords.returns(coords);
        const annotation = createAnnotations([{ type: "image", image: { url: "some_url" } }], {})[0];

        annotation.draw(this.widget, this.group);

        assert.equal(this.renderer.stub("image").callCount, 0, message);
    };

    testCase({ x: undefined, y: undefined }, "Both values are undefined");
    testCase({ x: null, y: null }, "Both values are null");
    testCase({ x: 100, y: undefined }, "Only y is undefined");
    testCase({ x: undefined, y: 100 }, "Only x is undefined");
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
    const annotation = createAnnotations([{ x: 0, y: 0, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
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
    assert.deepEqual(annotationGroup.move.firstCall.args, [80, 140]);

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
        points: [0, 0, 40, 0, 40, 40, 35, 40, 20, 60, 5, 40, 0, 40]
    }]);

    const contentGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(contentGroup.append.firstCall.args, [annotationGroup]);
    assert.deepEqual(contentGroup.move.firstCall.args, [9, 13]);

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

QUnit.module("Text annotaion", environment);

QUnit.test("Draw text inside plaque", function(assert) {
    const annotation = createAnnotations([{ x: 0, y: 0, type: "label", text: "some text", font: {} } ], {})[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    const annotationGroup = this.renderer.g.getCall(1).returnValue;
    assert.deepEqual(annotationGroup.attr.firstCall.args, [{ class: "dxc-label-annotation" }]);

    assert.strictEqual(this.renderer.text.callCount, 1);
    assert.deepEqual(this.renderer.text.firstCall.returnValue.append.firstCall.args, [this.renderer.g.getCall(2).returnValue]);
});

QUnit.test("Label params", function(assert) {
    const annotation = createAnnotations([{ x: 0, y: 0, type: "label", text: "some text", font: { size: 20 } } ], {})[0];

    annotation.draw(this.widget, this.group);

    assert.deepEqual(this.renderer.text.firstCall.args, ["some text"]);
    assert.deepEqual(this.renderer.text.firstCall.returnValue.css.firstCall.args, [{ "font-size": 20 }]);
});

QUnit.test("Merge common and item options", function(assert) {
    const annotation = createAnnotations([{ x: 0, y: 0, type: "label", text: "some text", font: { size: 20 } } ], {
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
    const items = [{ x: 0, y: 0, opt_1: "opt_1", type: "image", image: { url: "some_url" } }];
    const annotation = createAnnotations(items, {})[0];

    annotation.draw(this.widget, this.group);

    // assert
    assert.deepEqual(annotation.getTooltipFormatObject(), items[0]);
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
        { type: "label" }
    ], {});

    assert.equal(annotations.length, 2);
    assert.equal(annotations[0].type, "image");
    assert.equal(annotations[1].type, "label");
});
