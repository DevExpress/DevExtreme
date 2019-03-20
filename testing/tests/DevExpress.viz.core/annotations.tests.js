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

        const annotation = createAnnotations({ items: [{ image: { url: "some_url" } }] })[0];

        annotation.draw(this.widget, this.group);

        assert.equal(this.renderer.stub("circle").callCount, 0, message);
    };

    testCase({ x: undefined, y: undefined }, "Both values are undefined");
    testCase({ x: null, y: null }, "Both values are null");
    testCase({ x: 100, y: undefined }, "Only y is undefined");
    testCase({ x: undefined, y: 100 }, "Only x is undefined");
});

QUnit.test("Get tooltip params", function(assert) {
    const annotation = createAnnotations({ items: [{ x: 0, y: 0, image: { url: "some_url" } }] })[0];

    annotation.draw(this.widget, this.group);

    // assert
    assert.deepEqual(annotation.getTooltipParams(), { x: 100, y: 200 });
});

QUnit.test("Get tooltip format object", function(assert) {
    const options = { items: [{ x: 0, y: 0, opt_1: "opt_1", image: { url: "some_url" } }] };
    const annotation = createAnnotations(options)[0];

    annotation.draw(this.widget, this.group);

    // assert
    assert.deepEqual(annotation.getTooltipFormatObject(), options.items[0]);
});

QUnit.test("Draw image inside provided group", function(assert) {
    const annotation = createAnnotations({ items: [{ x: 0, y: 0, image: { url: "some_url" } }] })[0];

    annotation.draw(this.widget, this.group);

    assert.equal(this.renderer.image.callCount, 1);
    assert.deepEqual(this.renderer.image.firstCall.returnValue.append.firstCall.args, [this.group]);
});

QUnit.test("Image params", function(assert) {
    const annotation = createAnnotations({ items: [{ x: 10, y: 20, image: { url: "some_url", width: 10, height: 10, location: "some_location" } }] })[0];

    annotation.draw(this.widget, this.group);

    assert.deepEqual(this.renderer.image.firstCall.args, [95, 195, 10, 10, "some_url", "some_location"]);
});

QUnit.test("Merge common and partial options", function(assert) {
    const annotation = createAnnotations({ imageOptions: { height: 10 }, items: [{ x: 10, y: 20, image: { url: "some_url", width: 10 } }] })[0];

    annotation.draw(this.widget, this.group);

    assert.deepEqual(this.renderer.image.firstCall.args, [95, 195, 10, 10, "some_url", undefined]);
});

QUnit.module("Text annotaion", environment);

QUnit.test("Draw text inside provided group", function(assert) {
    const annotation = createAnnotations({ items: [{ x: 0, y: 0, label: { text: "some text" } }] })[0];

    annotation.draw(this.widget, this.group);

    assert.strictEqual(this.renderer.text.callCount, 1);
    assert.deepEqual(this.renderer.text.firstCall.returnValue.append.firstCall.args, [this.group]);
});

QUnit.test("Label params", function(assert) {
    const annotation = createAnnotations({ items: [{ x: 0, y: 0, label: { text: "some text", font: { size: 20 } } }] })[0];

    annotation.draw(this.widget, this.group);

    assert.deepEqual(this.renderer.text.firstCall.args, ["some text", 100, 200]);
    assert.deepEqual(this.renderer.text.firstCall.returnValue.css.firstCall.args, [{ "font-size": 20 }]);
});

QUnit.test("Merge common and partial options", function(assert) {
    const annotation = createAnnotations({
        labelOptions: { font: { color: "red" } }, items: [{
            x: 0, y: 0,
            label: {
                text: "some text",
                font: { size: 20 }
            }
        }]
    })[0];

    annotation.draw(this.widget, this.group);

    assert.deepEqual(this.renderer.text.firstCall.returnValue.css.firstCall.args, [{ "font-size": 20, "fill": "red" }]);
});
