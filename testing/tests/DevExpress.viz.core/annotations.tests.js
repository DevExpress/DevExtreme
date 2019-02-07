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

QUnit.module("Detect annotation type");

QUnit.test("Simple annotation", function(assert) {
    const annotation = createAnnotations({ items: [{ x: 0, y: 0 }] })[0];

    assert.equal(annotation._type, "simple");
});

QUnit.module("Simple annotation", environment);

QUnit.test("Draws a circle inside provided group", function(assert) {
    const annotation = createAnnotations({ items: [{ x: 0, y: 0 }] })[0];

    annotation.draw(this.widget, this.group);

    // assert
    assert.equal(this.renderer.circle.callCount, 1);

    const circle = this.renderer.circle.getCall(0).returnValue;
    assert.deepEqual(circle.append.getCall(0).args, [this.group]);
});

QUnit.test("Get coords from widget", function(assert) {
    const annotation = createAnnotations({ items: [{ x: 0, y: 0 }] })[0];

    annotation.draw(this.widget, this.group);

    // assert
    assert.equal(this.widget._getAnnotationCoords.callCount, 1);
    assert.deepEqual(this.widget._getAnnotationCoords.getCall(0).args, [annotation]);
    assert.deepEqual(this.renderer.circle.getCall(0).args, [100, 200, 5]);
});

QUnit.test("Get coords on every draw call", function(assert) {
    const annotation = createAnnotations({ items: [{ x: 0, y: 0 }] })[0];

    annotation.draw(this.widget, this.group);
    annotation.draw(this.widget, this.group);

    // assert
    assert.equal(this.widget._getAnnotationCoords.callCount, 2);
});

QUnit.test("Do not draw annotation if cannot get coords", function(assert) {
    const testCase = (coords, message) => {
        this.widget._getAnnotationCoords.returns(coords);

        const annotation = createAnnotations({ items: [{ some: "options" }] })[0];

        annotation.draw(this.widget, this.group);

        assert.equal(this.renderer.stub("circle").callCount, 0, message);
    };

    testCase({ x: undefined, y: undefined }, "Both values are undefined");
    testCase({ x: null, y: null }, "Both values are null");
    testCase({ x: 100, y: undefined }, "Only y is undefined");
    testCase({ x: undefined, y: 100 }, "Only x is undefined");
});
