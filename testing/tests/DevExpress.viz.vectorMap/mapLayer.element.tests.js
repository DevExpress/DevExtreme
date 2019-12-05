var $ = require("jquery"),
    noop = require("core/utils/common").noop,
    vizMocks = require("../../helpers/vizMocks.js"),
    mapLayerModule = require("viz/vector_map/map_layer");

QUnit.module("Basic", {
    beforeEach: function() {
        this.str = { layerType: "test-layer-type" };
        this.context = {
            renderer: new vizMocks.Renderer(),
            projection: { tag: "projection" },
            root: new vizMocks.Element(),
            name: "test-name",
            layer: { tag: "layer" },
            str: this.str,
            settings: { label: {} },
            grouping: {}
        };
        this.index = 10;
        this.coordinates = { tag: "coordinates" };
        this.attributes = { tag: "attributes" };
        this.element = new mapLayerModule._TESTS_MapLayerElement(this.context, this.index, { coordinates: this.coordinates }, this.attributes);
    },

    project: function(hasSeparateLabel) {
        var element = this.element;
        element.proj = { tag: "proj" };
        this.str.project = function() { return element.proj; };
        if(hasSeparateLabel) {
            element.labelProj = { tag: "label-proj" };
            this.context.hasSeparateLabel = true;
            this.str.projectLabel = function() { return element.labelProj; };
        }
        element.project();
    },

    draw: function(labelEnabled, hasSeparateLabel) {
        var element = this.element;
        this.project(hasSeparateLabel);
        this.str.draw = function() {
            element.figure = arguments[1];
            element.figure.root = new vizMocks.Element();
        };
        this.context.settings.label.enabled = labelEnabled;
        element.draw();
    }
});

QUnit.test("Project", function(assert) {
    this.str.project = sinon.spy();
    this.str.projectLabel = sinon.spy();

    this.element.project();

    assert.deepEqual(this.str.project.lastCall.args, [this.context.projection, this.coordinates], "project");
    assert.strictEqual(this.str.projectLabel.lastCall, null, "projectLabel");
});

QUnit.test("Project with labels", function(assert) {
    this.draw(true, true);
    this.str.getStyles = this.str.refresh = this.str.setState = this.str.transformLabel = noop;
    this.element.refresh();
    var proj = { tag: "proj" };
    this.str.project = sinon.stub().returns(proj);
    this.str.projectLabel = sinon.spy();
    this.context.hasSeparateLabel = true;

    this.element.project();

    assert.deepEqual(this.str.project.lastCall.args, [this.context.projection, this.coordinates], "project");
    assert.deepEqual(this.str.projectLabel.lastCall.args, [proj], "projectLabel");
});

QUnit.test("Project with separate labels without label", function(assert) {
    this.str.project = sinon.spy();
    this.str.projectLabel = sinon.spy();
    this.context.hasSeparateLabel = true;

    this.element.project();

    assert.deepEqual(this.str.project.lastCall.args, [this.context.projection, this.coordinates], "project");
    assert.strictEqual(this.str.projectLabel.lastCall, null, "projectLabel");
});

QUnit.test("Draw", function(assert) {
    var figure;
    this.str.draw = sinon.spy(function() {
        figure = arguments[1];
        figure.root = new vizMocks.Element();
    });

    this.element.draw();

    assert.strictEqual(this.str.draw.lastCall.args.length, 3, "draw");
    assert.strictEqual(this.str.draw.lastCall.args[0], this.context, "draw - context arg");
    assert.deepEqual(this.str.draw.lastCall.args[2], { index: this.index, name: "test-name" }, "draw - data arg");
    assert.deepEqual(figure.root.append.lastCall.args, [this.context.root], "root is appended");
    assert.strictEqual(this.context.renderer.stub("text").lastCall, null, "text is not created");
});

QUnit.test("Transform", function(assert) {
    this.draw();
    this.str.transform = sinon.spy();
    this.str.transformLabel = sinon.spy();

    this.element.transform();

    assert.deepEqual(this.str.transform.lastCall.args, [this.element.figure, this.context.projection, this.element.proj], "transform");
    assert.strictEqual(this.str.transformLabel.lastCall, null, "transformLabel");
});

QUnit.test("Transform with separate labels", function(assert) {
    this.draw(true, true);
    this.str.getStyles = this.str.refresh = this.str.setState = this.str.transformLabel = noop;
    this.str.projectLabel = sinon.stub().returns("label-proj");
    this.element.refresh();
    this.str.transform = sinon.spy();
    this.str.transformLabel = sinon.spy();

    this.element.transform();

    assert.deepEqual(this.str.transform.lastCall.args, [this.element.figure, this.context.projection, this.element.proj], "transform");
    assert.deepEqual(this.str.transformLabel.lastCall.args, [{
        root: this.element.figure.root, text: this.context.renderer.text.lastCall.returnValue, size: [0, 0], value: ""
    }, this.context.projection, "label-proj"], "transformLabel");
});

QUnit.test("Transform with separate labels without label", function(assert) {
    this.draw();
    this.str.transform = sinon.spy();
    this.str.transformLabel = sinon.spy();
    this.context.hasSeparateLabel = true;

    this.element.transform();

    assert.deepEqual(this.str.transform.lastCall.args, [this.element.figure, this.context.projection, this.element.proj], "transform");
    assert.strictEqual(this.str.transformLabel.lastCall, null, "transformLabel");
});

QUnit.test("Refresh", function(assert) {
    var styles = { tag: "styles" };
    this.draw();
    this.str.getStyles = sinon.stub().returns(styles);
    this.str.refresh = sinon.spy();
    this.str.setState = sinon.spy();

    this.element.refresh();

    assert.strictEqual(this.str.getStyles.lastCall.args.length, 1, "getStyles");
    var settings = this.str.getStyles.lastCall.args[0];
    assert.deepEqual(this.str.refresh.lastCall.args, [this.context, this.element.figure, { index: this.index, name: "test-name" }, this.element.proxy, settings], "refresh");
    assert.deepEqual(this.str.setState.lastCall.args, [this.element.figure, styles, 0], "setState");
});

QUnit.test("Refresh with label", function(assert) {
    var styles = { tag: "styles" };
    this.draw(true);
    this.str.getStyles = sinon.stub().returns(styles);
    this.str.refresh = sinon.spy();
    this.str.setState = sinon.spy();
    this.element.proxy.attribute("text", "Hello");
    $.extend(this.context.settings.label, {
        dataField: "text",
        stroke: "red", "stroke-width": 2, "stroke-opacity": 0.3,
        font: { size: 10, family: "fam" }
    });
    this.context.dataKey = "test-key";
    this.str.projectLabel = sinon.spy();
    this.str.transformLabel = sinon.spy();

    this.element.refresh();

    assert.strictEqual(this.str.getStyles.lastCall.args.length, 1, "getStyles");
    var settings = this.str.getStyles.lastCall.args[0],
        text = this.context.renderer.text.lastCall.returnValue;
    assert.deepEqual(this.str.refresh.lastCall.args, [this.context, this.element.figure, { index: this.index, name: "test-name" }, this.element.proxy, settings], "refresh");
    assert.deepEqual(this.str.setState.lastCall.args, [this.element.figure, styles, 0], "setState");
    assert.deepEqual(text.attr.getCall(1).args, [{ text: "Hello", x: 0, y: 0 }], "text settings 1");
    assert.deepEqual(text.attr.getCall(2).args, [{ align: "center", stroke: "red", "stroke-width": 2, "stroke-opacity": 0.3 }], "text settings 2");
    assert.deepEqual(text.css.lastCall.args, [{ "font-size": 10, "font-family": "fam" }], "text styles");
    assert.deepEqual(text.data.lastCall.args, ["test-key", { index: this.index, name: "test-name" }], "text data");
    assert.deepEqual(text.append.lastCall.args, [this.element.figure.root], "text is appended");
    assert.strictEqual(this.str.projectLabel.callCount, 0, "label is not projected");
    assert.strictEqual(this.str.transformLabel.callCount, 0, "label is not transformed");
});

QUnit.test("Refresh with label when labels are disabled", function(assert) {
    var styles = { tag: "styles" };
    this.draw(true);
    this.str.getStyles = sinon.stub().returns(styles);
    this.str.refresh = sinon.spy();
    this.str.setState = sinon.spy();
    this.element.proxy.attribute("text", "Hello");
    $.extend(this.context.settings.label, {
        dataField: "text",
        stroke: "red", "stroke-width": 2, "stroke-opacity": 0.3,
        font: { size: 10, family: "fam" }
    });
    this.context.dataKey = "test-key";
    this.str.projectLabel = sinon.spy();
    this.str.transformLabel = sinon.spy();
    this.element.refresh();
    var text = this.context.renderer.text.lastCall.returnValue;

    this.context.settings.label.enabled = false;
    this.element.refresh();

    assert.deepEqual(text.remove.lastCall.args, [], "text is removed");
});

QUnit.test("Refresh with label when labels are disabled and particular label is enabled", function(assert) {
    var styles = { tag: "styles" };
    this.draw(true);
    this.str.getStyles = sinon.stub().returns(styles);
    this.str.refresh = sinon.spy();
    this.str.setState = sinon.spy();
    this.element.proxy.attribute("text", "Hello");
    $.extend(this.context.settings.label, {
        enabled: false,
        dataField: "text",
        stroke: "red", "stroke-width": 2, "stroke-opacity": 0.3,
        font: { size: 10, family: "fam" }
    });
    this.context.dataKey = "test-key";
    this.element.update({ label: { enabled: true } });

    this.element.refresh();

    assert.strictEqual(this.context.renderer.stub("text").lastCall, null);
});

QUnit.test("Refresh with separate labels", function(assert) {
    this.context.labelRoot = new vizMocks.Element();
    this.draw(true, true);
    this.str.getStyles = this.str.refresh = this.str.setState = noop;
    this.element.proxy.attribute("text", "Hello");
    this.context.settings.label.dataField = "text";
    this.str.projectLabel = sinon.spy();
    this.str.transformLabel = sinon.spy();

    this.element.refresh();

    assert.deepEqual(this.context.renderer.text.lastCall.returnValue.append.lastCall.args, [this.context.labelRoot], "text is appended");
    assert.strictEqual(this.str.projectLabel.callCount, 1, "label is projected");
    assert.strictEqual(this.str.transformLabel.callCount, 1, "label is transformed");
});

QUnit.test("Refresh with label when text is in proxy", function(assert) {
    this.draw(true);
    this.str.getStyles = this.str.refresh = this.str.setState = noop;
    this.element.proxy.text = "Hello 2";

    this.element.refresh();

    assert.deepEqual(this.context.renderer.text.lastCall.returnValue.attr.getCall(1).args[0].text, "Hello 2", "text");
});

QUnit.test("Refresh with label when text is not defined", function(assert) {
    this.draw(true);
    this.str.getStyles = this.str.refresh = this.str.setState = noop;

    this.element.refresh();

    assert.strictEqual(this.context.renderer.text.lastCall.returnValue.stub("append").lastCall, null, "text is not appended");
});

QUnit.test("Options merging", function(assert) {
    var settings;
    this.str.getStyles = function() { settings = arguments[0]; };
    this.context.settings = {
        p1: "p1", p2: "p2",
        label: {
            p3: "p3", p4: "p4",
            font: {
                p5: "p5", p6: "p6"
            }
        }
    };
    this.element.update({
        p2: "P2", p3: "P3",
        label: {
            p4: "P4", p5: "p5",
            font: {
                p6: "P6", p7: "P7"
            }
        }
    });
    this.draw();
    this.str.refresh = this.str.setState = noop;

    this.element.refresh();

    assert.deepEqual(settings, {
        p1: "p1", p2: "P2", p3: "P3",
        label: {
            p3: "p3", p4: "P4", p5: "p5",
            font: {
                p5: "p5", p6: "P6", p7: "P7"
            }
        }
    });
});

QUnit.test("Options and palette", function(assert) {
    var settings;
    this.str.getStyles = function() { settings = arguments[0]; };
    this.context.settings = {
        _colors: ["a", "b", "c"],
        color: "Z",
        label: {}
    };
    this.element.update({
        paletteIndex: 2
    });
    this.draw();
    this.str.refresh = this.str.setState = noop;

    this.element.refresh();

    assert.strictEqual(settings.color, "c");
});

QUnit.test("Options and palette and option", function(assert) {
    var settings;
    this.str.getStyles = function() { settings = arguments[0]; };
    this.context.settings = {
        _colors: ["a", "b", "c"],
        color: "Z",
        label: {}
    };
    this.element.update({
        paletteIndex: 2,
        color: "d"
    });
    this.draw();
    this.str.refresh = this.str.setState = noop;

    this.element.refresh();

    assert.strictEqual(settings.color, "d");
});

QUnit.test("Options and grouping", function(assert) {
    var settings,
        callback1 = sinon.stub().withArgs("test-field-1").returns(3),
        callback2 = sinon.stub().withArgs("test-field-2").returns(5);
    this.str.getStyles = function() { settings = arguments[0]; };
    this.context.grouping = {
        prop1: {
            callback: callback1,
            field: "test-field-1",
            partition: [1, 2, 5],
            values: ["A", "B"]
        },
        prop2: {
            callback: callback2,
            field: "test-field-2",
            partition: [2, 6, 8],
            values: ["C", "D"]
        }
    };
    this.element.update();
    this.draw();
    this.str.refresh = this.str.setState = noop;

    this.element.refresh();

    assert.strictEqual(settings.prop1, "B");
    assert.strictEqual(settings.prop2, "C");
});

QUnit.test("measureLabel and adjustLabel", function(assert) {
    this.draw(true);
    this.str.getStyles = this.str.refresh = this.str.setState = noop;
    this.element.proxy.attribute("text", "Hello");
    this.context.settings.label.dataField = "text";
    this.element.refresh();
    var text = this.context.renderer.text.lastCall.returnValue;
    text.getBBox = sinon.stub().returns({ width: 20, height: 16, y: 3 });
    this.str.getLabelOffset = sinon.stub().returns([30, 40]);

    this.element.measureLabel();
    this.element.adjustLabel();

    assert.deepEqual(text.getBBox.lastCall.args, [], "measure");
    assert.deepEqual(text.attr.lastCall.args, [{ x: 30, y: 29 }], "adjust");
});

QUnit.test("Update when not drawn", function(assert) {
    this.element.update();

    assert.ok(true, "no error");
});

QUnit.test("Update when drawn", function(assert) {
    this.draw();
    this.str.getStyles = this.str.refresh = this.str.setState = noop;
    var refresh = sinon.spy(this.element, "refresh");

    this.element.update();

    assert.deepEqual(refresh.lastCall.args, []);
});

QUnit.test("Set hovered", function(assert) {
    var styles = { tag: "styles" },
        trigger = sinon.spy();
    this.context.params = { eventTrigger: trigger };
    this.context.hover = true;
    this.str.getStyles = function() { return styles; };
    this.str.refresh = this.str.setState = noop;
    this.str.setState = sinon.spy();
    this.draw();
    this.element.refresh();

    this.element.setHovered(true);

    assert.deepEqual(this.str.setState.lastCall.args, [this.element.figure, styles, 1], "setState");
    assert.deepEqual(this.element.figure.root.toForeground.lastCall.args, [], "toForeground");
    assert.deepEqual(trigger.lastCall.args, ["hoverChanged", { target: this.element.proxy, state: true }], "event");

    this.element.setHovered(false);

    assert.deepEqual(this.str.setState.lastCall.args, [this.element.figure, styles, 0], "setState");
    assert.deepEqual(this.element.figure.root.toBackground.lastCall.args, [], "toBackground");
    assert.deepEqual(trigger.lastCall.args, ["hoverChanged", { target: this.element.proxy, state: false }], "event");
});

QUnit.test("Set selected", function(assert) {
    var styles = { tag: "styles" },
        trigger = sinon.spy();
    this.context.params = { eventTrigger: trigger };
    this.context.selection = { state: {} };
    this.str.getStyles = function() { return styles; };
    this.str.refresh = this.str.setState = noop;
    this.str.setState = sinon.spy();
    this.draw();
    this.element.refresh();

    this.element.setSelected(true);

    assert.deepEqual(this.str.setState.lastCall.args, [this.element.figure, styles, 2], "setState");
    assert.deepEqual(this.element.figure.root.toForeground.lastCall.args, [], "toForeground");
    assert.deepEqual(trigger.lastCall.args, ["selectionChanged", { target: this.element.proxy, state: true }], "event");

    this.element.setSelected(false);

    assert.deepEqual(this.str.setState.lastCall.args, [this.element.figure, styles, 0], "setState");
    assert.deepEqual(this.element.figure.root.toBackground.lastCall.args, [], "toBackground");
    assert.deepEqual(trigger.lastCall.args, ["selectionChanged", { target: this.element.proxy, state: false }], "event");
});

QUnit.test("Set selected when not drawn", function(assert) {
    var trigger = sinon.spy();
    this.context.params = { eventTrigger: trigger };
    this.context.selection = { state: {} };

    this.element.setSelected(true);
    this.element.setSelected(false);

    assert.strictEqual(trigger.lastCall, null);
});

QUnit.test("Proxy fields", function(assert) {
    assert.strictEqual(this.element.proxy.layer, this.context.layer, "layer");
    assert.strictEqual(this.element.proxy.index, this.index, "index");
    assert.strictEqual(this.element.proxy.data, this.data, "data");
});

QUnit.test("Proxy.coordinates", function(assert) {
    assert.strictEqual(this.element.proxy.coordinates(), this.coordinates);
});

QUnit.test("Proxy.attribute", function(assert) {
    assert.strictEqual(this.element.proxy.attribute("prop1"), undefined, "getter");
    assert.strictEqual(this.element.proxy.attribute("prop1", "test-1"), this.element.proxy, "return value - setter");
    assert.deepEqual(this.element.proxy.attribute(), { prop1: "test-1", tag: "attributes" }, "getter - all");
    assert.strictEqual(this.element.proxy.attribute("prop1"), "test-1", "getter");
});

QUnit.test("Proxy.selected getter", function(assert) {
    var stub = sinon.stub(this.element, "isSelected").returns("val");
    assert.strictEqual(this.element.proxy.selected(), "val");
    assert.deepEqual(stub.lastCall.args, []);
});

QUnit.test("Proxy.selected setter", function(assert) {
    var spy = sinon.spy(this.element, "setSelected");
    assert.strictEqual(this.element.proxy.selected("a", "b"), this.element.proxy);
    assert.deepEqual(spy.lastCall.args, ["a", "b"]);
});

QUnit.test("Proxy.applySettings", function(assert) {
    var spy = sinon.spy(this.element, "update");
    assert.strictEqual(this.element.proxy.applySettings({ tag: "settings" }), this.element.proxy);
    assert.deepEqual(spy.lastCall.args, [{ tag: "settings" }]);
});
