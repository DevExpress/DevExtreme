import $ from "jquery";
import { createAnnotations } from "viz/core/annotations";
import vizMocks from "../../helpers/vizMocks.js";

const environment = {
    beforeEach() {
        this.renderer = new vizMocks.Renderer();
        this.group = this.renderer.g();

        this.widget = {
            _getTemplate(callback) {
                return {
                    render(arg) {
                        callback(arg.model, arg.container);
                        arg.onRendered();
                    }
                };
            },
            _renderer: this.renderer,
            _getAnnotationCoords: sinon.stub().returns({ x: 100, y: 200, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 500, height: 500 } })
        };
    },
    createAnnotations(items, options = {}, customizeAnnotation) {
        return createAnnotations(this.widget, items, $.extend(true, { argument: 0 }, options), customizeAnnotation);
    }
};

function checkCloudPath(assert, cloud, points, rotation) {
    let path = cloud.attr.lastCall.args[0].d;
    path = path.replace(/a 0 0 0 0 1 0 0/g, "");


    const regExp = /(?:(-?\d+),(-?\d+))/g;
    let m;
    const coords = [];

    do {
        m = regExp.exec(path);
        if(m) {
            coords.push(Number(m[1]), Number(m[2]));
        }
    } while(m);

    assert.equal(path[0], "M");
    assert.equal(path[path.length - 1], "Z");
    assert.deepEqual(coords, points);
    assert.deepEqual(cloud.rotate.lastCall.args, rotation);
}

QUnit.module("Image annotation", environment);

QUnit.test("Do not draw annotation if cannot get coords, or coords out of canvas", function(assert) {
    const testCase = (anchor, coords, message) => {
        this.widget._getAnnotationCoords.returns($.extend({ canvas: { left: 50, top: 50, right: 50, bottom: 50, width: 500, height: 500 } }, anchor));
        const annotation = this.createAnnotations([$.extend({ type: "image", image: { url: "some_url" } }, coords)], {})[0];

        annotation.draw(this.widget, this.group);

        assert.equal(this.renderer.stub("image").callCount, 0, message);
    };

    testCase({ x: undefined, y: undefined }, { x: undefined, y: undefined }, "No anchor, no coords");
    testCase({ x: 50, y: undefined }, { x: undefined, y: undefined }, "Only anchor x, no coords");
    testCase({ x: null, y: null }, { x: null, y: null }, "No anchor, no coords");
    testCase({ x: undefined, y: undefined }, { x: 100, y: undefined }, "Only x is defined");
    testCase({ x: undefined, y: undefined }, { x: undefined, y: 100 }, "Only y is defined");

    testCase({ x: 30, y: 200 }, { x: undefined, y: undefined });
    testCase({ x: 470, y: 200 }, { x: undefined, y: undefined });
    testCase({ x: 200, y: 30 }, { x: undefined, y: undefined });
    testCase({ x: 200, y: 470 }, { x: undefined, y: undefined });
});

QUnit.test("Image params", function(assert) {
    const annotation = this.createAnnotations([{ x: 10, y: 20, type: "image", image: { url: "some_url", width: 10, height: 10, location: "some_location" } }])[0];

    annotation.draw(this.widget, this.group);

    assert.deepEqual(this.renderer.image.firstCall.args, [0, 0, 10, 10, "some_url", "some_location"]);
});

QUnit.test("Merge common and item options", function(assert) {
    const annotation = this.createAnnotations([{ x: 10, y: 20, type: "image", image: { url: "some_url", width: 10 } }], { image: { height: 10 } })[0];

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
    const annotation = this.createAnnotations([itemOptions], { image: { height: 10 } }, customizeAnnotation)[0];

    annotation.draw(this.widget, this.group);

    assert.deepEqual(this.renderer.image.firstCall.args, [0, 0, 10, 10, "customized_url", "center"]);
    assert.equal(customizeAnnotation.callCount, 1);
    assert.equal(customizeAnnotation.getCall(0).args[0], itemOptions);
});

QUnit.test("Draw image inside a plaque with borders and arrow", function(assert) {
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url", width: 20, height: 13 }, font: { color: "red" } }], {
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
        },
        font: { size: 20 }
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    assert.equal(this.renderer.g.callCount, 4);
    const wrapperGroup = this.renderer.g.getCall(0).returnValue;
    assert.equal(wrapperGroup.append.firstCall.args[0], this.group);
    assert.deepEqual(wrapperGroup.css.lastCall.args[0], { "font-size": 20, fill: "red" });

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
        opacity: 0.5
    }]);
    const cloudGroup = this.renderer.g.getCall(2).returnValue;
    assert.deepEqual(cloudGroup.attr.firstCall.args, [{ filter: "shadowFilter.id" }]);

    assert.deepEqual(plaque.append.firstCall.args, [cloudGroup]);
    assert.equal(plaque.sharp.callCount, 1);
    checkCloudPath(assert, plaque, [80, 140, 120, 140, 120, 145, 140, 160, 120, 175, 120, 180, 80, 180], [90, 100, 160]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.append.firstCall.args, [annotationGroup]);
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 1 - 10, 160 - 2 - 5]);

    assert.equal(this.renderer.image.callCount, 1);
    assert.strictEqual(this.renderer.image.firstCall.returnValue.append.firstCall.args[0].element, contentGroup.element);
});

QUnit.test("Get size from annotation setting if it less than image size", function(assert) {
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url", width: 50, height: 50 } }], {
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
    const annotation = this.createAnnotations([{ x: 0, y: 0, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
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
        opacity: 0.5
    }]);
});

QUnit.test("Draw annotation with anchor and x/y", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 290, y: 200, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ x: 300, y: 50, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
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

    checkCloudPath(assert, plaque, [280, 30, 320, 30, 320, 55, 450, 60, 320, 65, 320, 70, 280, 70], [90, 300, 50]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [300 - 1 - 10, 50 - 2 - 5]);
});

QUnit.test("Draw annotation with anchor and only x", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 290, y: 200, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ x: 300, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
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
    checkCloudPath(assert, plaque, [280, 140, 320, 140, 320, 165, 340, 170, 320, 175, 320, 180, 280, 180], [90, 300, 160]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [300 - 1 - 10, 160 - 2 - 5]);
});

QUnit.test("Draw annotation with anchor and only y", function(assert) {
    const annotation = this.createAnnotations([{ y: 50, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
        border: {
            width: 1,
            visible: true
        },
        arrowLength: 20,
        arrowWidth: 30,
        paddingLeftRight: 10,
        paddingTopBottom: 15,
        shadow: {
            offsetX: 3,
            offsetY: 4,
            blur: 5,
        }
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    checkCloudPath(assert, plaque, [80, 30, 120, 30, 120, 35, 250, 50, 120, 65, 120, 70, 80, 70], [90, 100, 50]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 1 - 10, 50 - 2 - 5]);
});

QUnit.test("Draw annotation with x/y and without anchor", function(assert) {
    this.widget._getAnnotationCoords.returns({});
    const annotation = this.createAnnotations([{ x: 300, y: 50, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
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
    checkCloudPath(assert, plaque, [280, 30, 320, 30, 320, 70, 280, 70], [0, 300, 50]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [300 - 1 - 10, 50 - 2 - 5]);
});

QUnit.test("Draw annotation with offsetX/offsetY with anchor", function(assert) {
    this.widget._getAnnotationCoords.returns({
        offsetX: 10,
        offsetY: -20,
        x: 100,
        y: 200
    });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
        arrowLength: 20,
        arrowWidth: 30,
        paddingLeftRight: 10,
        paddingTopBottom: 15
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 1 - 10 + 10, 160 - 2 - 5 + 20]);
});

QUnit.test("Draw annotation with offsetX/offsetY and without anchor", function(assert) {
    this.widget._getAnnotationCoords.returns({
        offsetX: 10,
        offsetY: -20,
    });
    const annotation = this.createAnnotations([{ x: 300, y: 50, type: "image", image: { url: "some_url", width: 20, height: 13 } }], {
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
    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [300 - 1 - 10 + 10, 50 - 2 - 5 - 20]);
});

QUnit.module("Check plaque path", environment);

QUnit.test("Arrow on the top, left side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 120, y: 240, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [100, 220, 140, 220, 140, 220, 160, 220, 140, 230, 140, 260, 100, 260], [270, 120, 240]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [120 - 10, 240 - 10]);
});

QUnit.test("Arrow on the top, center", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 100, y: 240, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [80, 220, 120, 220, 120, 230, 140, 240, 120, 250, 120, 260, 80, 260], [270, 100, 240]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 10, 240 - 10]);
});

QUnit.test("Arrow on the top, right side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 80, y: 240, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [60, 220, 100, 220, 100, 250, 120, 260, 100, 260, 100, 260, 60, 260], [270, 80, 240]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [80 - 10, 240 - 10]);
});

QUnit.test("Arrow on the bottom, left side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 120, y: 160, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [100, 140, 140, 140, 140, 170, 160, 180, 140, 180, 140, 180, 100, 180], [90, 120, 160]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [120 - 10, 160 - 10]);
});

QUnit.test("Arrow on the bottom, center", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 100, y: 160, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [80, 140, 120, 140, 120, 150, 140, 160, 120, 170, 120, 180, 80, 180], [90, 100, 160]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 10, 160 - 10]);
});

QUnit.test("Arrow on the bottom, right side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 80, y: 160, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [60, 140, 100, 140, 100, 140, 120, 140, 100, 150, 100, 180, 60, 180], [90, 80, 160]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [80 - 10, 160 - 10]);
});

QUnit.test("Arrow on the left, top side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 60, y: 220, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [40, 200, 80, 200, 80, 200, 100, 200, 80, 210, 80, 240, 40, 240], [0, 60, 220]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [60 - 10, 220 - 10]);
});

QUnit.test("Arrow on the left, center", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 60, y: 200, type: "image", image: { url: "some_url" } }], {
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

    checkCloudPath(assert, plaque, [40, 180, 80, 180, 80, 190, 100, 200, 80, 210, 80, 220, 40, 220], [0, 60, 200]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [60 - 10, 200 - 10]);
});

QUnit.test("Arrow on the left, bottom side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 60, y: 180, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [40, 160, 80, 160, 80, 190, 100, 200, 80, 200, 80, 200, 40, 200], [0, 60, 180]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [60 - 10, 180 - 10]);
});

QUnit.test("Arrow on the right, top side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 140, y: 220, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [120, 200, 160, 200, 160, 230, 180, 240, 160, 240, 160, 240, 120, 240], [180, 140, 220]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [140 - 10, 220 - 10]);
});

QUnit.test("Arrow on the left, center", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 140, y: 200, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [120, 180, 160, 180, 160, 190, 180, 200, 160, 210, 160, 220, 120, 220], [180, 140, 200]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [140 - 10, 200 - 10]);
});

QUnit.test("Arrow on the left, bottom side", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 140, y: 180, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [120, 160, 160, 160, 160, 160, 180, 160, 160, 170, 160, 200, 120, 200], [180, 140, 180]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [140 - 10, 180 - 10]);
});

QUnit.test("Arrow on top-left corner", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 140, y: 240, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [120, 220, 150, 220, 180, 200, 160, 230, 160, 260, 120, 260], [270, 140, 240]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [140 - 10, 240 - 10]);
});

QUnit.test("Arrow on top-right corner", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 60, y: 240, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [40, 220, 70, 220, 100, 200, 80, 230, 80, 260, 40, 260], [0, 60, 240]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [60 - 10, 240 - 10]);
});

QUnit.test("Arrow on bottom-right corner", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 60, y: 160, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [40, 140, 70, 140, 100, 120, 80, 150, 80, 180, 40, 180], [90, 60, 160]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [60 - 10, 160 - 10]);
});

QUnit.test("Arrow on bottom-left corner", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 140, y: 160, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [120, 140, 150, 140, 180, 120, 160, 150, 160, 180, 120, 180], [180, 140, 160]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [140 - 10, 160 - 10]);
});

QUnit.test("Anchor is inside plaque", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 100, y: 200, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [80, 180, 120, 180, 120, 220, 80, 220], [0, 100, 200]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 10, 200 - 10]);
});

QUnit.test("Arrow on the left, center. Arrow width is bigger than annotation height", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 60, y: 200, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [40, 180, 80, 180, 80, 180, 100, 200, 80, 220, 80, 220, 40, 220], [0, 60, 200]);
    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [60 - 10, 200 - 10]);
});

QUnit.test("Arrow on the bottom, center. Arrow width is bigger than annotation width", function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ x: 100, y: 160, type: "image", image: { url: "some_url" } }], {
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
    checkCloudPath(assert, plaque, [80, 140, 120, 140, 120, 140, 140, 160, 120, 180, 120, 180, 80, 180], [90, 100, 160]);
    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [100 - 10, 160 - 10]);
});

QUnit.module("Check plaque path on pane bounds", {
    beforeEach() {
        environment.beforeEach.call(this);
    },
    createAnnotations(items, options) {
        return createAnnotations(this.widget, items, $.extend(true, {
            argument: 0,
            border: {
                width: 1,
                visible: true
            },
            arrowLength: 20,
            arrowWidth: 20,
            paddingLeftRight: 10,
            paddingTopBottom: 10,
            shadow: {
                offsetX: 3,
                offsetY: 4,
                blur: 5
            }
        }, options));
    }
});

QUnit.test("Out of right bound - draw plaque from right border", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 440, y: 200, canvas: { left: 50, top: 50, right: 50, bottom: 50, width: 500, height: 500 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        shadow: {
            offsetX: 4,
            offsetY: 0,
            blur: 5
        }
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    checkCloudPath(assert, plaque, [395, 140, 425, 140, 455, 135, 435, 150, 435, 180, 395, 180], [90, 415, 160]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [420 - 15, 160 - 10]);
});

QUnit.test("Out of left bound - draw plaque from left border", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 60, y: 200, canvas: { left: 50, top: 50, right: 50, bottom: 50, width: 500, height: 500 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        shadow: {
            offsetX: 1,
            offsetY: 0,
            blur: 10
        }
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    checkCloudPath(assert, plaque, [70, 140, 100, 140, 120, 120, 110, 150, 110, 180, 70, 180], [180, 90, 160]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [80, 160 - 10]);
});

QUnit.test("Plaque width more than canvas - draw plaque in center", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 5, y: 200, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 20, height: 500 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }])[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    checkCloudPath(assert, plaque, [-10, 140, 30, 140, 30, 155, 50, 165, 30, 175, 30, 180, -10, 180], [90, 10, 160]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [10 - 10, 160 - 10]);
});

QUnit.test("Out of top bound - draw plaque under anchor", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 200, y: 90, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        shadow: {
            offsetX: 0,
            offsetY: 1,
            blur: 10
        }
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    checkCloudPath(assert, plaque, [180, 110, 220, 110, 220, 120, 240, 130, 220, 140, 220, 150, 180, 150], [270, 200, 130]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [200 - 10, 130 - 10]);
});

QUnit.test("Out of top bound, but does not fit under anchor - draw plaque from top border", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 200, y: 50, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 500, height: 115 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        shadow: {
            offsetX: 0,
            offsetY: 4,
            blur: 5
        }
    })[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    checkCloudPath(assert, plaque, [180, 0, 220, 0, 220, 10, 230, 20, 220, 30, 220, 40, 180, 40], [90, 200, 20]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [200 - 10, 20 - 10]);
});

QUnit.test("Plaque height more than canvas - draw plaque from top border", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 200, y: 10, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 500, height: 30 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }])[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    checkCloudPath(assert, plaque, [180, 0, 220, 0, 220, 40, 180, 40], [0, 200, 20]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [200 - 10, 20 - 10]);
});

QUnit.test("Round x, y", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 200, y: 10, canvas: { left: 0, top: 0, right: 0, bottom: 0, width: 500, height: 30 } });
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 20 };
    const annotation = this.createAnnotations([{
        type: "image", image: { url: "some_url" },
        x: 201.3,
        y: 20.6
    }])[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    checkCloudPath(assert, plaque, [181, 1, 221, 1, 221, 41, 181, 41], [0, 201, 21]);

    const contentGroup = this.renderer.g.getCall(3).returnValue;
    assert.deepEqual(contentGroup.move.firstCall.args, [201 - 10, 21 - 10]);
});

QUnit.module("Text annotaion", environment);

QUnit.test("Draw text inside plaque", function(assert) {
    const annotation = this.createAnnotations([{ x: 0, y: 0, type: "text", text: "some text", font: {}, cssClass: "annotation_class" } ], {})[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    const annotationGroup = this.renderer.g.getCall(1).returnValue;
    assert.deepEqual(annotationGroup.attr.firstCall.args, [{ class: "dxc-text-annotation" }]);

    assert.strictEqual(this.renderer.text.callCount, 1);
    const text = this.renderer.text.firstCall.returnValue;
    assert.deepEqual(text.append.firstCall.args[0].element, this.renderer.g.getCall(3).returnValue.element);
    assert.deepEqual(this.renderer.text.firstCall.args, ["some text"]);
    assert.strictEqual(text.attr.lastCall.args[0]["class"], "annotation_class");
    assert.ok(!text.setMaxSize.called);
});

QUnit.test("Draw text with width/height", function(assert) {
    const annotation = this.createAnnotations([{
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
    checkCloudPath(assert, plaque, [-95, -60, 95, -60, 200, -100, 95, -60, 95, 60, -95, 60], [90, 0, 0]);
});

QUnit.test("Do not call setMax size is less than 0", function(assert) {
    const annotation = this.createAnnotations([{
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
    const annotation = this.createAnnotations([{
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
    checkCloudPath(assert, plaque, [-100, -50, 100, -50, 200, -100, 100, -50, 100, 50, -100, 50], [90, 0, 0]);
});

QUnit.module("Custom annotaion", environment);

QUnit.test("Use functional template to draw custom annotation", function(assert) {
    const template = sinon.spy();
    const annotation = this.createAnnotations([{ x: 0, y: 0, type: "custom", template, data: { isCustomData: true } } ], {})[0];
    this.renderer.g.reset();

    annotation.draw(this.widget, this.group);

    const annotationGroup = this.renderer.g.getCall(1).returnValue;
    assert.deepEqual(annotationGroup.attr.firstCall.args, [{ class: "dxc-custom-annotation" }]);

    assert.equal(template.callCount, 1);
    assert.deepEqual(template.getCall(0).args, [{ argument: 0, x: 0, y: 0, type: "custom", template, data: { isCustomData: true } }, this.renderer.g.getCall(3).returnValue.element]);
});

QUnit.test("No template option - do not create annotations", function(assert) {
    const annotations = this.createAnnotations([{ x: 0, y: 0, type: "custom" } ], {});

    assert.equal(annotations.length, 0);
});

QUnit.module("Tooltip", environment);

QUnit.test("customizeTooltip in item", function(assert) {
    const customizeTooltip = function() { return 2; };
    const items = [{ x: 0, y: 0, opt_1: "opt_1", type: "image", image: { url: "some_url" }, customizeTooltip }];
    const annotation = this.createAnnotations(items, { customizeTooltip: function() { return 1; } })[0];

    annotation.draw(this.widget, this.group);

    // assert
    assert.equal(annotation.options.customizeTooltip, customizeTooltip);
});

QUnit.module("Misc", environment);

QUnit.test("Do not create annotation with wrong type", function(assert) {
    const annotations = this.createAnnotations([
        { type: "image" },
        { type: "wrongtype" },
        { type: "text" }
    ], {});

    assert.equal(annotations.length, 2);
    assert.equal(annotations[0].type, "image");
    assert.equal(annotations[1].type, "text");
});

QUnit.module("Plaque with cornerRadius", environment);

QUnit.test("Draw plaque w/o arrow", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 100, y: 100, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url", width: 40, height: 20 } }], {
        x: 100,
        y: 100,
        paddingLeftRight: 10,
        paddingTopBottom: 10,
        cornerRadius: 5,
        arrowWidth: 10
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(plaque.attr.lastCall.args[0].d, "M80,90a 5 5 0 0 1 5 -5L115,85a 5 5 0 0 1 5 5L120,110a 5 5 0 0 1 -5 5L85,115a 5 5 0 0 1 -5 -5Z");
});

QUnit.test("Corner radius can't be greater than half of height", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 100, y: 100, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        x: 100,
        y: 100,
        width: 40,
        height: 20,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        cornerRadius: 50,
        arrowWidth: 10
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(plaque.attr.lastCall.args[0].d.slice(7, 27), "a 10 10 0 0 1 10 -10");
});

QUnit.test("Corner radius can't be greater than half of width", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 100, y: 100, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        x: 100,
        y: 100,
        width: 40,
        height: 100,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        cornerRadius: 50,
        arrowWidth: 10
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(plaque.attr.lastCall.args[0].d.slice(6, 26), "a 20 20 0 0 1 20 -20");
});

function roundPathCoords(cloud) {
    return cloud.attr.lastCall.args[0].d.replace(/\.\d+/g, d => d.slice(0, 3));
}

QUnit.test("Arrow bettween arcs", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 300, y: 100, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        x: 100,
        y: 100,
        width: 50,
        height: 50,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        cornerRadius: 5,
        arrowWidth: 10
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(roundPathCoords(plaque), "M75,80a 5 5 0 0 1 5 -5L120,75a 5 5 0 0 1 5 5L125,95,300,100,125,105L125,120a 5 5 0 0 1 -5 5L80,125a 5 5 0 0 1 -5 -5Z");
});

QUnit.test("Arrow start on top arc, arrow end beetween arcs", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 300, y: 80, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        x: 100,
        y: 100,
        width: 50,
        height: 100,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        cornerRadius: 30,
        arrowWidth: 90
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(roundPathCoords(plaque), "M75,75a 25 25 0 0 1 25 -25L100,50a 25 25 0 0 1 13.50 3.96L113.50,53.96,300,80,125,125L125,125a 25 25 0 0 1 -25 25L100,150a 25 25 0 0 1 -25 -25Z");
});

QUnit.test("Both arrrow coordinates on top arc", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 300, y: 60, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        x: 100,
        y: 100,
        width: 50,
        height: 100,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        cornerRadius: 30,
        arrowWidth: 20
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(roundPathCoords(plaque), "M75,75a 25 25 0 0 1 25 -25L100,50a 25 25 0 0 1 13.50 3.96L113.50,53.96,300,60,124.50,70.06A 25 25 0 0 1 125 75L125,125a 25 25 0 0 1 -25 25L100,150a 25 25 0 0 1 -25 -25Z");
});

QUnit.test("Arrow starts on top arc and ends on bottom arc", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 300, y: 100, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        cornerRadius: 50,
        arrowWidth: 20
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(roundPathCoords(plaque), "M50,100a 50 50 0 0 1 50 -50L100,50a 50 50 0 0 1 48.98 40L148.98,90,300,100,148.98,110A 50 50 0 0 1 100 150L100,150a 50 50 0 0 1 -50 -50Z");
});

QUnit.test("Arrow starts on bottom arc and ends on bottom arc", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 300, y: 140, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        cornerRadius: 20,
        arrowWidth: 20
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(roundPathCoords(plaque), "M50,70a 20 20 0 0 1 20 -20L130,50a 20 20 0 0 1 20 20L150,130,300,140,130,150A 20 20 0 0 1 130 150L70,150a 20 20 0 0 1 -20 -20Z");
});

QUnit.test("Arrow starts from bottom arc", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 300, y: 140, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        cornerRadius: 20,
        arrowWidth: 20
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(roundPathCoords(plaque), "M50,70a 20 20 0 0 1 20 -20L130,50a 20 20 0 0 1 20 20L150,130,300,140,130,150A 20 20 0 0 1 130 150L70,150a 20 20 0 0 1 -20 -20Z");
});

QUnit.test("Arrow on bottom arc", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 300, y: 150, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        cornerRadius: 50,
        arrowWidth: 10
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(roundPathCoords(plaque), "M50,100a 50 50 0 0 1 50 -50L100,50a 50 50 0 0 1 50 50L150,100a 50 50 0 0 1 -28.20 45L121.79,145,300,150,100,150A 50 50 0 0 1 100 150L100,150a 50 50 0 0 1 -50 -50Z");
});

QUnit.test("Arrow in the corner", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 300, y: 160, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        cornerRadius: 20,
        arrowWidth: 10
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(roundPathCoords(plaque), "M50,70a 20 20 0 0 1 20 -20L130,50a 20 20 0 0 1 10.20 2.79L160,-100,147.20,59.79A 20 20 0 0 1 150 70L150,130a 20 20 0 0 1 -20 20L70,150a 20 20 0 0 1 -20 -20Z");
});

QUnit.test("Arrow in the corner. Arrow width greater than arc length", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 300, y: 160, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        cornerRadius: 20,
        arrowWidth: 40
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(roundPathCoords(plaque), "M50,70a 20 20 0 0 1 20 -20L130,50,160,-100,150,70L150,130a 20 20 0 0 1 -20 20L70,150a 20 20 0 0 1 -20 -20Z");
});

QUnit.test("Arrow in the corner. Arrow width is 0", function(assert) {
    this.widget._getAnnotationCoords.returns({ x: 300, y: 160, canvas: { left: 50, top: 25, right: 50, bottom: 50, width: 500, height: 500 } });
    const annotation = this.createAnnotations([{ type: "image", image: { url: "some_url" } }], {
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        paddingLeftRight: 0,
        paddingTopBottom: 0,
        cornerRadius: 20,
        arrowWidth: 0
    })[0];
    annotation.draw(this.widget, this.group);

    // assert
    const plaque = this.renderer.path.getCall(0).returnValue;
    assert.equal(roundPathCoords(plaque), "M50,70a 20 20 0 0 1 20 -20L130,50a 20 20 0 0 1 14.14 5.85L160,-100,144.14,55.85A 20 20 0 0 1 150 70L150,130a 20 20 0 0 1 -20 20L70,150a 20 20 0 0 1 -20 -20Z");
});
