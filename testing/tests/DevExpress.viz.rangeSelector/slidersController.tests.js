var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    SlidersController = require("viz/range_selector/sliders_controller").SlidersController,
    rendererModule = require("viz/core/renderers/renderer"),
    translator2DModule = require("viz/translators/translator2d"),
    support = require("core/utils/support");

var environment = {
    beforeEach: function() {
        var renderer = this.renderer = new vizMocks.Renderer();

        rendererModule.Renderer = function() {
            return renderer;
        };
        this.translator = new translator2DModule.Translator2D({}, {});
        this.translator.update({ min: 10, max: 30 }, { left: 1000, width: 3000 }, { isHorizontal: true });
        this.root = new vizMocks.Element();
        this.trackersGroup = new vizMocks.Element();
        var notifications = this.notifications = [];
        this.controller = new SlidersController({
            renderer: renderer,
            translator: this.translator,
            root: this.root,
            axis: {
                getVisibleArea: function() {
                    return [900, 3100];
                }
            },
            trackersGroup: this.trackersGroup,
            updateSelectedRange: function(value, prevValue, e) {
                notifications.push([value.startValue, value.endValue, e]);
            }
        });
    },

    afterEach: function() {
        this.controller.dispose();
    },

    update: function(options) {
        options = options || {};
        this.controller.update(options.verticalRange || [15, 25],
            $.extend({ animationEnabled: true }, options.behavior),
            options.isCompactMode,
            $.extend({ color: "handle-color", opacity: "handle-opacity", width: 4 }, options.sliderHandle),
            $.extend({ color: "marker-color", invalidRangeColor: "invalid-color", paddingLeftRight: 4, paddingTopBottom: 1 }, options.sliderMarker),
            $.extend({ color: "shutter-color", opacity: "shutter-opacity" }, options.shutter),
            options.rangeBounds || {}, options.fullTicks, options.selectedRangeColor || "selected-range-color");
    },

    setCategories: function(values) {
        this.translator.update({ axisType: "discrete", categories: values, min: values[0], max: values[values.length - 1] }, { left: 1000, width: 3000 }, { isHorizontal: true });
    },

    setDateTime: function(values) {
        this.translator.update({ axisType: "continuous", dataType: "datetime", min: new Date(2011, 0, 1), max: new Date(2011, 10, 1) }, { left: 1000, width: 3000 }, { isHorizontal: true });
    },

    setInverted: function() {
        this.translator.update({ min: 10, max: 30, invert: true }, { left: 1000, width: 3000 }, { isHorizontal: true });
    },

    setRange: function(start, end, e) {
        this.controller.setSelectedRange({ startValue: start, endValue: end }, e);
    },

    areaTracker: function() {
        return this.renderer.path.getCall(0).returnValue;
    },

    selectedAreaTracker: function() {
        return this.renderer.path.getCall(1).returnValue;
    },

    shutter: function() {
        return this.renderer.path.getCall(2).returnValue;
    },

    sliderRoot: function(i) {
        return this.renderer.g.getCall(2 * i + 0).returnValue;
    },

    sliderLabelRoot: function(i) {
        return this.renderer.g.getCall(2 * i + 1).returnValue;
    },

    sliderLine: function(i) {
        return this.renderer.path.getCall(3 + 2 * i + 0).returnValue;
    },

    sliderCloud: function(i) {
        return this.renderer.path.getCall(3 + 2 * i + 1).returnValue;
    },

    sliderText: function(i) {
        return this.renderer.text.getCall(i).returnValue;
    },

    sliderTextTracker: function(i) {
        return this.renderer.rect.getCall(3 * i + 0).returnValue;
    },

    sliderBorder: function(i) {
        return this.renderer.rect.getCall(3 * i + 1).returnValue;
    },

    sliderTracker: function(i) {
        return this.renderer.rect.getCall(3 * i + 2).returnValue;
    }
};

QUnit.module("Basics", environment);

QUnit.test("Tracker elements settings", function(assert) {
    assert.deepEqual(this.areaTracker().attr.lastCall.args, [{ "class": "area-tracker", fill: "#000000", opacity: 0.0001 }], "area tracker");
    assert.deepEqual(this.selectedAreaTracker().attr.lastCall.args, [{ "class": "selected-area-tracker", fill: "#000000", opacity: 0.0001 }], "selected area tracker");
    assert.deepEqual(this.sliderTextTracker(0).attr.lastCall.args, [{ "class": "slider-marker-tracker", fill: "#000000", opacity: 0.0001 }], "slider text tracker 1");
    assert.deepEqual(this.sliderTextTracker(1).attr.lastCall.args, [{ "class": "slider-marker-tracker", fill: "#000000", opacity: 0.0001 }], "slider text tracker 2");
    assert.deepEqual(this.sliderTracker(0).attr.lastCall.args, [{ "class": "slider-tracker", fill: "#000000", opacity: 0.0001 }], "slider tracker 1");
    assert.deepEqual(this.sliderTracker(1).attr.lastCall.args, [{ "class": "slider-tracker", fill: "#000000", opacity: 0.0001 }], "slider tracker 2");
});

QUnit.test("Area trackers container", function(assert) {
    assert.deepEqual(this.areaTracker().append.lastCall.args, [this.trackersGroup], "area tracker");
    assert.deepEqual(this.selectedAreaTracker().append.lastCall.args, [this.trackersGroup], "area tracker");
});

QUnit.test("Slider tracker container", function(assert) {
    assert.deepEqual(this.sliderTracker(0).append.lastCall.args, [this.trackersGroup], "slider tracker 1");
    assert.deepEqual(this.sliderTracker(1).append.lastCall.args, [this.trackersGroup], "slider tracker 2");
});

QUnit.test("Slider text tracker container", function(assert) {
    assert.deepEqual(this.sliderTextTracker(0).append.lastCall.args, [this.sliderLabelRoot(0)], "slider text tracker 1");
    assert.deepEqual(this.sliderTextTracker(1).append.lastCall.args, [this.sliderLabelRoot(1)], "slider text tracker 2");
});

QUnit.test("Slider text initial settings", function(assert) {
    assert.deepEqual(this.sliderText(0).attr.lastCall.args, [{ "align": "left" }], "1");
    assert.deepEqual(this.sliderText(1).attr.lastCall.args, [{ "align": "left" }], "2");
});

QUnit.module("Appearance settings", environment);

QUnit.test("Slider handle settings", function(assert) {
    this.update({
        sliderHandle: { color: "red", opacity: 0.2, width: 3 }
    });

    assert.deepEqual(this.sliderLine(0).attr.getCall(0).args, [{ stroke: "red", "stroke-width": 3, "stroke-opacity": 0.2, sharp: "h", points: [0, 0, 0, 10] }], "cloud 1 settings");
    assert.deepEqual(this.sliderLine(1).attr.getCall(0).args, [{ stroke: "red", "stroke-width": 3, "stroke-opacity": 0.2, sharp: "h", points: [0, 0, 0, 10] }], "cloud 2 settings");
});

QUnit.test("Shutter settings", function(assert) {
    this.update({
        shutter: { color: "blue", opacity: 0.3 }
    });

    assert.deepEqual(this.shutter().attr.getCall(0).args, [{ fill: "blue", "fill-opacity": 0.3, stroke: null, "stroke-width": null }], "shutter");
});

QUnit.test("Slider marker settings", function(assert) {
    this.update({
        sliderMarker: {
            color: "yellow",
            font: { size: 9, family: "fam" }
        }
    });

    assert.deepEqual(this.sliderCloud(0).attr.getCall(0).args, [{ fill: "yellow" }], "cloud 1");
    assert.deepEqual(this.sliderCloud(1).attr.getCall(0).args, [{ fill: "yellow" }], "cloud 2");
    assert.deepEqual(this.sliderText(0).css.lastCall.args, [{ "font-size": 9, "font-family": "fam" }], "text 1");
    assert.deepEqual(this.sliderText(1).css.lastCall.args, [{ "font-size": 9, "font-family": "fam" }], "text 2");
});

QUnit.test("Slider text formatting", function(assert) {
    this.update({
        sliderMarker: {
            format: { type: "fixedPoint", precision: 3 },
            customizeText: function(arg) {
                return arg.valueText + "###";
            }
        }
    });
    this.setRange(13, 14);

    assert.deepEqual(this.sliderText(0).attr.getCall(5).args, [{ text: "13.000###" }], "text 1");
    assert.deepEqual(this.sliderText(1).attr.getCall(5).args, [{ text: "14.000###" }], "text 2");
});

QUnit.test("Slider text when no data", function(assert) {
    this.translator.update({ }, { left: 1000, width: 2000 }, { isHorizontal: true });
    this.update({
        sliderMarker: {
            format: "fixedPoint", precision: 3,
            customizeText: function(arg) {
                return arg.valueText + "###";
            }
        }
    });

    assert.deepEqual(this.sliderText(0).attr.getCall(3).args, [{ text: ". . ." }], "text 1");
    assert.deepEqual(this.sliderText(1).attr.getCall(3).args, [{ text: ". . ." }], "text 2");
});

QUnit.test("Selected range color settings", function(assert) {
    this.update({ isCompactMode: true, selectedRangeColor: "green" });

    assert.deepEqual(this.shutter().attr.getCall(0).args, [{ stroke: "green", "stroke-width": 3, sharp: "v", fill: null, "fill-opacity": null }], "shutter");
});

QUnit.test("Mode is changed to compact", function(assert) {
    this.update({ isCompactMode: false });
    this.update({ isCompactMode: true });

    assert.deepEqual(this.shutter().attr.getCall(2).args, [{ stroke: "selected-range-color", "stroke-width": 3, sharp: "v", fill: null, "fill-opacity": null }], "shutter");
});

QUnit.test("Mode is changed to non compact", function(assert) {
    this.update({ isCompactMode: true });
    this.update({ isCompactMode: false });

    assert.deepEqual(this.shutter().attr.getCall(2).args, [{ fill: "shutter-color", "fill-opacity": "shutter-opacity", stroke: null, "stroke-width": null }], "shutter");
});

QUnit.test("Selected area cursor", function(assert) {
    this.update();
    this.setRange(11, 14);

    assert.deepEqual(this.selectedAreaTracker().attr.lastCall.args, [{ points: [1100, 15, 1400, 15, 1400, 25, 1100, 25] }], "position");
    assert.deepEqual(this.selectedAreaTracker().css.lastCall.args, [{ cursor: "pointer" }], "cursor");
});

QUnit.test("Selected area cursor when range is full", function(assert) {
    this.update();
    this.setRange(10, 30);

    assert.deepEqual(this.selectedAreaTracker().attr.lastCall.args, [{ points: [1000, 15, 3000, 15, 3000, 25, 1000, 25] }], "position");
    assert.deepEqual(this.selectedAreaTracker().css.lastCall.args, [{ cursor: "default" }], "cursor");
});

QUnit.test("Selected area cursor when range is full (categories)", function(assert) {
    this.setCategories(["a", "b", "c", "d", "e"]);
    this.update();
    this.setRange("a", "e");

    assert.deepEqual(this.selectedAreaTracker().attr.lastCall.args, [{ points: [1000, 15, 3000, 15, 3000, 25, 1000, 25] }], "position");
    assert.deepEqual(this.selectedAreaTracker().css.lastCall.args, [{ cursor: "default" }], "cursor");
});

QUnit.test("Selected area cursor when range is full (no data)", function(assert) {
    this.translator.update({ }, { left: 1000, width: 3000 }, { isHorizontal: true });
    this.update();

    assert.deepEqual(this.selectedAreaTracker().attr.lastCall.args, [{ points: [1000, 15, 3000, 15, 3000, 25, 1000, 25] }], "position");
    assert.deepEqual(this.selectedAreaTracker().css.lastCall.args, [{ cursor: "default" }], "cursor");
});

QUnit.module("Positioning", environment);

QUnit.test("Total area and selected area trackers", function(assert) {
    var _touchEvents = support.touchEvents,
        _pointer = support.pointer;
    try {
        support.touchEvents = support.pointer = false;
        this.update({
            sliderHandle: { width: 14 }
        });
        this.setRange(11, 15);

        assert.deepEqual(this.areaTracker().attr.lastCall.args, [{ points: [1000, 15, 3000, 15, 3000, 25, 1000, 25] }], "area tracker");
        assert.deepEqual(this.selectedAreaTracker().attr.lastCall.args, [{ points: [1100, 15, 1500, 15, 1500, 25, 1100, 25] }], "selected area tracker");
        assert.deepEqual(this.sliderTracker(0).attr.getCall(1).args, [{ x: -7, y: 0, width: 14, height: 10, translateY: 15 }], "slider tracker 1");
        assert.deepEqual(this.sliderTracker(0).attr.getCall(2).args, [{ translateX: 1000 }], "slider tracker 1 initial position");
        assert.deepEqual(this.sliderTracker(0).animate.lastCall.args, [{ translateX: 1100 }, { duration: 250 }], "slider tracker 1 animation");
        assert.deepEqual(this.sliderTracker(1).attr.getCall(1).args, [{ x: -7, y: 0, width: 14, height: 10, translateY: 15 }], "slider tracker 2");
        assert.deepEqual(this.sliderTracker(1).attr.getCall(2).args, [{ translateX: 1000 }], "slider tracker 2 initial position");
        assert.deepEqual(this.sliderTracker(1).animate.lastCall.args, [{ translateX: 1500 }, { duration: 250 }], "slider tracker 2 animation");
    } finally {
        support.touchEvents = _touchEvents;
        support.pointer = _pointer;
    }
});

QUnit.test("Slider tracker width when slider handler width is rather small", function(assert) {
    var _touchEvents = support.touchEvents,
        _pointer = support.pointer;
    try {
        support.touchEvents = support.pointer = false;
        this.update({
            sliderHandle: { width: 2 }
        });
        this.setRange(11, 15);

        assert.deepEqual(this.sliderTracker(0).attr.getCall(1).args, [{ x: -4, y: 0, width: 8, height: 10, translateY: 15 }], "slider tracker 1");
        assert.deepEqual(this.sliderTracker(1).attr.getCall(1).args, [{ x: -4, y: 0, width: 8, height: 10, translateY: 15 }], "slider tracker 2");
    } finally {
        support.touchEvents = _touchEvents;
        support.pointer = _pointer;
    }
});

QUnit.test("Slider tracker width on touch devices", function(assert) {
    var _touchEvents = support.touchEvents,
        _pointer = support.pointer;
    try {
        support.touchEvents = support.pointer = true;
        this.update({
            sliderHandle: { width: 14 }
        });
        this.setRange(11, 15);

        assert.deepEqual(this.sliderTracker(0).attr.getCall(1).args, [{ x: -10, y: 0, width: 20, height: 10, translateY: 15 }], "slider tracker 1");
        assert.deepEqual(this.sliderTracker(1).attr.getCall(1).args, [{ x: -10, y: 0, width: 20, height: 10, translateY: 15 }], "slider tracker 2");
    } finally {
        support.touchEvents = _touchEvents;
        support.pointer = _pointer;
    }
});

QUnit.test("Sliders", function(assert) {
    this.update();
    this.setRange(11, 15);

    assert.deepEqual(this.sliderRoot(0).animate.lastCall.args, [{ translateX: 1100 }, { duration: 250 }], "slider root 1");
    assert.deepEqual(this.sliderLabelRoot(0).attr.lastCall.args, [{ translateY: -16 }], "slider label root 1");
    assert.deepEqual(this.sliderCloud(0).attr.lastCall.args, [{ points: [-27, 0, 1, 0, 1, 12, 1, 12, 1, 16, -3, 12, -27, 12] }], "slider cloud 1");
    assert.deepEqual(this.sliderText(0).attr.lastCall.args, [{ translateX: -23, translateY: -1 }], "slider text 1");
    assert.deepEqual(this.sliderTextTracker(0).attr.lastCall.args, [{ width: 28, height: 16, translateX: -27 }], "slider text tracker 1");
    assert.deepEqual(this.sliderTracker(0).animate.lastCall.args, [{ translateX: 1100 }, { duration: 250 }], "slider tracker 1");
    assert.deepEqual(this.sliderRoot(1).animate.lastCall.args, [{ translateX: 1500 }, { duration: 250 }], "slider root 2");
    assert.deepEqual(this.sliderLabelRoot(1).attr.lastCall.args, [{ translateY: -16 }], "slider label root 2");
    assert.deepEqual(this.sliderCloud(1).attr.lastCall.args, [{ points: [0, 0, 28, 0, 28, 12, 4, 12, 0, 16, 0, 12, 0, 12] }], "slider cloud 2");
    assert.deepEqual(this.sliderText(1).attr.lastCall.args, [{ translateX: 4, translateY: -1 }], "slider text 2");
    assert.deepEqual(this.sliderTextTracker(1).attr.lastCall.args, [{ width: 28, height: 16, translateX: 0 }], "slider text tracker 2");
    assert.deepEqual(this.sliderTracker(1).animate.lastCall.args, [{ translateX: 1500 }, { duration: 250 }], "slider tracker 2");
});

QUnit.test("Shutters", function(assert) {
    this.update({ sliderHandle: { width: 6 } });
    this.setRange(11, 15);

    assert.deepEqual(this.shutter().animate.lastCall.args, [{ points: [[900, 15, 1097, 15, 1097, 25, 900, 25], [3100, 15, 1503, 15, 1503, 25, 3100, 25]] }, { duration: 250 }], "shutter");
});

QUnit.test("Shutter near start", function(assert) {
    this.update({ sliderHandle: { width: 6 } });
    this.setRange(10, 11);

    assert.deepEqual(this.shutter().animate.lastCall.args, [{ points: [[900, 15, 997, 15, 997, 25, 900, 25], [3100, 15, 1103, 15, 1103, 25, 3100, 25]] }, { duration: 250 }], "shutter");
});

QUnit.test("Shutter near end", function(assert) {
    this.update({ sliderHandle: { width: 6 } });
    this.setRange(29, 30);

    assert.deepEqual(this.shutter().animate.lastCall.args, [{ points: [[900, 15, 2897, 15, 2897, 25, 900, 25], [3100, 15, 3003, 15, 3003, 25, 3100, 25]] }, { duration: 250 }], "shutter");
});

QUnit.test("Selected view", function(assert) {
    this.update({ isCompactMode: true });
    this.setRange(11, 15);

    assert.deepEqual(this.shutter().animate.lastCall.args, [{ points: [1102, 20, 1498, 20] }, { duration: 250 }], "shutter");
});

QUnit.test("Elements are moved (not animated) if animation is disabled", function(assert) {
    this.update({ behavior: { animationEnabled: false } });
    this.setRange(11, 15);

    assert.deepEqual(this.shutter().attr.lastCall.args, [{ points: [[900, 15, 1098, 15, 1098, 25, 900, 25], [3100, 15, 1502, 15, 1502, 25, 3100, 25]] }], "shutter");
    assert.deepEqual(this.sliderRoot(0).attr.lastCall.args, [{ translateX: 1100 }], "slider root 1");
    assert.deepEqual(this.sliderRoot(1).attr.lastCall.args, [{ translateX: 1500 }], "slider root 2");
});

QUnit.test("Previous animations are canceled", function(assert) {
    this.update();
    this.setRange(11, 15);

    assert.deepEqual(this.shutter().stopAnimation.lastCall.args, [], "shutter animation is stopped");
    assert.deepEqual(this.sliderRoot(0).stopAnimation.lastCall.args, [], "slider root 1");
    assert.deepEqual(this.sliderTracker(0).stopAnimation.lastCall.args, [], "slider tracker 1");
    assert.deepEqual(this.sliderRoot(1).stopAnimation.lastCall.args, [], "slider root 2");
    assert.deepEqual(this.sliderTracker(1).stopAnimation.lastCall.args, [], "slider tracker 2");
});

QUnit.module("Selected range", $.extend({}, environment, {
    check: function(assert, expected, expectedRange) {
        assert.deepEqual([
            this.sliderRoot(0).animate.lastCall.args[0].translateX,
            this.sliderRoot(1).animate.lastCall.args[0].translateX
        ], expected, "sliders");
        assert.deepEqual(this.controller.getSelectedRange(), { startValue: expectedRange[0], endValue: expectedRange[1] }, "selected range");
    }
}));

QUnit.test("basic case", function(assert) {
    this.update();

    this.setRange(15, 19);

    this.check(assert, [1500, 1900], [15, 19]);
});

QUnit.test("inversed case", function(assert) {
    this.update();

    this.setRange(19, 15);

    this.check(assert, [1500, 1900], [15, 19]);
});

QUnit.test("Inverted scale", function(assert) {
    this.setInverted();
    this.update();

    this.setRange(15, 19);

    this.check(assert, [2100, 2500], [19, 15]);
});

QUnit.test("values are not defined", function(assert) {
    this.update();

    this.setRange(undefined, undefined);

    this.check(assert, [1000, 3000], [10, 30]);
});

QUnit.test("values are not defined. Logarithmic", function(assert) {
    this.translator.update({
        min: 0.01,
        max: 10000,
        axisType: "logarithmic",
        base: 10,
        breaks: [{
            from: 1,
            to: 10,
            cumulativeWidth: 0
        }]
    }, { left: 1000, width: 3000 }, { isHorizontal: true, breaksSize: 0 });

    this.update();

    this.setRange(undefined, undefined);

    this.check(assert, [1000, 3000], [0.01, 10000]);
});

QUnit.test("values are not defined. Categories", function(assert) {
    this.setCategories(["a", "b", "c", "d", "e"]);

    this.update();

    this.setRange(undefined, undefined);

    this.check(assert, [1000, 3000], ["a", "e"]);
});

QUnit.test("values are not valid", function(assert) {
    this.update();

    this.setRange("A", "B");

    this.check(assert, [1000, 3000], [10, 30]);
});

QUnit.test("values are out of range", function(assert) {
    this.update();

    this.setRange(5, 15);

    this.check(assert, [1000, 1500], [10, 15]);
});

QUnit.test("categories", function(assert) {
    this.setCategories(["a", "b", "c", "d", "e"]);
    this.update();

    this.setRange("b", "c");

    this.check(assert, [1400, 2200], ["b", "c"]);
});

QUnit.test("inversed categories", function(assert) {
    this.setCategories(["a", "b", "c", "d", "e"]);
    this.update();

    this.setRange("c", "b");

    this.check(assert, [1400, 2200], ["b", "c"]);
});

QUnit.test("notification is not performed first time", function(assert) {
    this.update();

    this.setRange(16, 19);

    assert.deepEqual(this.notifications, []);
});

QUnit.test("notification", function(assert) {
    this.update();
    this.setRange(0, 1);

    this.setRange(16, 19, { firstEvent: true });
    this.setRange(25, 20, { secondEvent: true });

    assert.deepEqual(this.notifications, [[16, 19, { firstEvent: true }], [20, 25, { secondEvent: true }]]);
});

QUnit.test("'minRange' is ignored", function(assert) {
    this.update({ rangeBounds: { minRange: 5 } });

    this.setRange(20, 22);

    this.check(assert, [2000, 2200], [20, 22]);
});

QUnit.test("'maxRange' is ignored", function(assert) {
    this.update({ rangeBounds: { maxRange: 10 } });

    this.setRange(12, 28);

    this.check(assert, [1200, 2800], [12, 28]);
});

QUnit.test("translator range is empty", function(assert) {
    this.translator.update({ }, { left: 1000, width: 3000 }, { isHorizontal: true });
    this.update();

    this.setRange(11, 12);

    assert.deepEqual([
        this.sliderRoot(0).attr.lastCall.args[0].translateX,
        this.sliderRoot(1).attr.lastCall.args[0].translateX
    ], [1000, 3000], "sliders");
    assert.deepEqual(this.controller.getSelectedRange(), { startValue: undefined, endValue: undefined }, "selected range");
});

QUnit.test("number-like string values", function(assert) {
    this.update();

    this.setRange("15", "20");

    this.check(assert, [1500, 2000], [15, 20]);
});

QUnit.test("data-like string values", function(assert) {
    this.translator.update({
        min: new Date("01/01/2010"),
        max: new Date("01/13/2010"),
        dataType: "datetime"
    },
    { left: 1000, width: 3000 }, { isHorizontal: true });
    this.update();

    this.setRange("01/02/2010", "01/05/2010");

    this.check(assert, [1167, 1667], [new Date("01/02/2010"), new Date("01/05/2010")]);
});

QUnit.test("Start value in the scale break - start should be end of break", function(assert) {
    this.translator.update({
        min: 10,
        max: 30,
        breaks: [{
            from: 12,
            to: 17,
            cumulativeWidth: 0
        }]
    }, { left: 1000, width: 3000 }, { isHorizontal: true, breaksSize: 0 });

    this.update();

    this.setRange(15, 25);

    this.check(assert, [1267, 2333], [17, 25]);
});

QUnit.test("End value in the scale break - end should be start of break", function(assert) {
    this.translator.update({
        min: 10,
        max: 30,
        breaks: [{
            from: 12,
            to: 17,
            cumulativeWidth: 0
        }]
    }, { left: 1000, width: 3000 }, { isHorizontal: true, breaksSize: 0 });

    this.update();

    this.setRange(11, 15);

    this.check(assert, [1133, 1267], [11, 12]);
});

QUnit.test("Datetime. Start value in the scale break - start should be end of break", function(assert) {
    this.translator.update({
        min: new Date(2017, 2, 2),
        max: new Date(2017, 10, 2),
        axisType: "continuous",
        dataType: "datetime",
        breaks: [{
            from: new Date(2017, 4, 2),
            to: new Date(2017, 6, 2),
            cumulativeWidth: 0
        }]
    }, { left: 1000, width: 3000 }, { isHorizontal: true, breaksSize: 0 });

    this.update();

    this.setRange(new Date(2017, 5, 2), new Date(2017, 8, 2));

    this.check(assert, [1663, 2337], [new Date(2017, 6, 2), new Date(2017, 8, 2)]);
});

QUnit.test("Logarithmic. Start value in the scale break - start should be end of break", function(assert) {
    this.translator.update({
        min: 0.01,
        max: 10000,
        axisType: "logarithmic",
        base: 10,
        breaks: [{
            from: 1,
            to: 10,
            cumulativeWidth: 0
        }]
    }, { left: 1000, width: 3000 }, { isHorizontal: true, breaksSize: 0 });

    this.update();

    this.setRange(5, 100);

    this.check(assert, [1800, 2200], [10, 100]);
});

QUnit.test("date values. semidiscrete. getSelectedRange returns correct date type values", function(assert) {
    this.translator.update({
        min: new Date("01/01/2010"),
        max: new Date("12/31/2010"),
        axisType: "semidiscrete",
        dataType: "datetime"
    }, { left: 1000, width: 3000 }, { isHorizontal: true, interval: { "months": 1 } });

    this.update();

    this.setRange(new Date("02/01/2010"), new Date("05/01/2010"));

    assert.deepEqual(this.controller.getSelectedRange(), {
        startValue: new Date("02/01/2010"),
        endValue: new Date("05/01/2010")
    });
});

QUnit.module("Clouds processing", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.sliderText(0).getBBox = function() {
            return { x: 0, y: -14, width: 200, height: 18 };
        };
        this.sliderText(1).getBBox = function() {
            return { x: 0, y: -14, width: 150, height: 18 };
        };
    },

    check: function(assert, rootPositions, cloudsPoints, textPositions, trackerPositions) {
        assert.deepEqual(this.sliderRoot(0).animate.lastCall.args, [{ translateX: rootPositions[0] }, { duration: 250 }], "group 1");
        assert.deepEqual(this.sliderRoot(1).animate.lastCall.args, [{ translateX: rootPositions[1] }, { duration: 250 }], "group 2");
        assert.deepEqual(this.sliderCloud(0).attr.lastCall.args, [{ points: cloudsPoints[0] }], "cloud 1");
        assert.deepEqual(this.sliderCloud(1).attr.lastCall.args, [{ points: cloudsPoints[1] }], "cloud 2");
        assert.deepEqual(this.sliderText(0).attr.lastCall.args, [{ translateX: textPositions[0], translateY: 15 }], "text 1");
        assert.deepEqual(this.sliderText(1).attr.lastCall.args, [{ translateX: textPositions[1], translateY: 15 }], "text 2");
        assert.deepEqual(this.sliderTextTracker(0).attr.lastCall.args, [{ translateX: trackerPositions[0], width: 208, height: 24 }], "text tracker 1");
        assert.deepEqual(this.sliderTextTracker(1).attr.lastCall.args, [{ translateX: trackerPositions[1], width: 158, height: 24 }], "text tracker 2");
    }
}));

QUnit.test("Normal case", function(assert) {
    this.update();
    this.setRange(19, 23);

    this.check(assert, [1900, 2300], [
        [-207, 0, 1, 0, 1, 20, 1, 20, 1, 24, -3, 20, -207, 20],
        [0, 0, 158, 0, 158, 20, 4, 20, 0, 24, 0, 20, 0, 20]
    ], [-203, 4], [-207, 0]);
});

QUnit.test("Boundary case", function(assert) {
    this.update();
    this.setRange(10, 30);

    this.check(assert, [1000, 3000], [
        [0, 0, 208, 0, 208, 20, 4, 20, 0, 24, 0, 20, 0, 20],
        [-157, 0, 1, 0, 1, 20, 1, 20, 1, 24, -3, 20, -157, 20]
    ], [4, -153], [0, -157]);
});

QUnit.test("Values are equal", function(assert) {
    this.update();
    this.setRange(22, 22);

    this.check(assert, [2200, 2200], [
        [-207, 0, 1, 0, 1, 20, 1, 20, 1, 24, -3, 20, -207, 20],
        [0, 0, 158, 0, 158, 20, 4, 20, 0, 24, 0, 20, 0, 20]
    ], [-203, 4], [-207, 0]);
});

QUnit.test("Values are equal (categories)", function(assert) {
    this.setCategories(["a", "b", "c", "d", "e"]);
    this.update();
    this.setRange("b", "b");

    this.check(assert, [1400, 1800], [
        [-207, 0, 1, 0, 1, 20, 1, 20, 1, 24, -3, 20, -207, 20],
        [0, 0, 158, 0, 158, 20, 4, 20, 0, 24, 0, 20, 0, 20]
    ], [-203, 4], [-207, 0]);
});

QUnit.test("Both values are at start", function(assert) {
    this.update();
    this.setRange(10, 10);

    this.check(assert, [1000, 1000], [
        [0, 0, 208, 0, 208, 20, 4, 20, 0, 24, 0, 20, 0, 20],
        [0, 0, 158, 0, 158, 20, 4, 20, 0, 24, 0, 20, 0, 20]
    ], [4, 4], [0, 0]);
});

QUnit.test("Both values are at end", function(assert) {
    this.update();
    this.setRange(30, 30);

    this.check(assert, [3000, 3000], [
        [-207, 0, 1, 0, 1, 20, 1, 20, 1, 24, -3, 20, -207, 20],
        [-157, 0, 1, 0, 1, 20, 1, 20, 1, 24, -3, 20, -157, 20]
    ], [-203, -153], [-207, -157]);
});

QUnit.test("Overlapping near start", function(assert) {
    this.update();
    this.setRange(11, 12);

    this.check(assert, [1100, 1200], [
        [-100, 0, 108, 0, 108, 20, 4, 20, 0, 24, -4, 20, -100, 20],
        [0, 0, 158, 0, 158, 20, 4, 20, 0, 24, 0, 20, 0, 20]
    ], [-96, 4], [-100, 0]);
    assert.deepEqual(this.sliderBorder(0).append.lastCall.args, [this.sliderLabelRoot(0)], "border is appended 1");
    assert.deepEqual(this.sliderBorder(1).append.lastCall.args, [this.sliderLabelRoot(1)], "border is appended 2");
    // TODO: Investigate why heights are different
    assert.deepEqual(this.sliderBorder(0).attr.lastCall.args, [{ x: 108, height: 20 }], "border 1");
    assert.deepEqual(this.sliderBorder(1).attr.lastCall.args, [{ x: -1, height: 24 }], "border 2");
});

QUnit.test("Overlapping near end", function(assert) {
    this.update();
    this.setRange(29, 29.5);

    this.check(assert, [2900, 2950], [
        [-207, 0, 1, 0, 1, 20, 1, 20, 1, 24, -3, 20, -207, 20],
        [-107, 0, 51, 0, 51, 20, 5, 20, 1, 24, -3, 20, -107, 20]
    ], [-203, -103], [-207, -107]);
    assert.deepEqual(this.sliderBorder(0).append.lastCall.args, [this.sliderLabelRoot(0)], "border is appended 1");
    assert.deepEqual(this.sliderBorder(1).append.lastCall.args, [this.sliderLabelRoot(1)], "border is appended 2");
    // TODO: Investigate why heights are different
    assert.deepEqual(this.sliderBorder(0).attr.lastCall.args, [{ x: 1, height: 24 }], "border 1");
    assert.deepEqual(this.sliderBorder(1).attr.lastCall.args, [{ x: -108, height: 20 }], "border 2");
});

var environmentForMethods = $.extend({}, environment, {
    check: function(assert, values, positions) {
        assert.deepEqual(this.controller.getSelectedRange(), { startValue: values[0], endValue: values[1] }, "selected range");
        assert.deepEqual(this.sliderRoot(0).animate.lastCall.args, [{ translateX: positions[0] }, { duration: 250 }], "slider 1");
        assert.deepEqual(this.sliderRoot(1).animate.lastCall.args, [{ translateX: positions[1] }, { duration: 250 }], "slider 2");
    },

    checkMoves: function(assert, moves) {
        var attr1 = this.sliderRoot(0).attr,
            attr2 = this.sliderRoot(1).attr,
            ii = moves.length,
            base = attr1.callCount - ii,
            i;
        for(i = 0; i < ii; ++i) {
            assert.deepEqual(attr1.getCall(base + i).args, [{ translateX: moves[i][0] }], "slider 1 - " + i);
            assert.deepEqual(attr2.getCall(base + i).args, [{ translateX: moves[i][1] }], "slider 2 - " + i);
        }
    },

    checkSliderMoves: function(assert, index, moves) {
        var attr = this.sliderRoot(index).attr,
            ii = moves.length,
            base = attr.callCount - ii,
            i;
        for(i = 0; i < ii; ++i) {
            assert.deepEqual(attr.getCall(base + i).args, [{ translateX: moves[i] }], "slider " + (index + 1) + " - " + i);
        }
    },

    checkSliderAnimated: function(assert, index, pos) {
        var animate = this.sliderRoot(index).animate;
        assert.deepEqual(animate.getCall(animate.callCount - 1).args, [{ translateX: pos }, { duration: 250 }], "slider " + (index + 1) + " - animated");
    }
});

QUnit.module("Methods - move selected area", environmentForMethods);

QUnit.test("Common", function(assert) {
    this.update();
    this.setRange(11, 14);

    this.controller.moveSelectedArea(2100, { isEvent: true });

    this.check(assert, [19.5, 22.5], [1950, 2250]);
    assert.deepEqual(this.notifications, [[19.5, 22.5, { isEvent: true }]], "notification");
});

QUnit.test("Categories 1", function(assert) {
    this.setCategories(["a", "b", "c", "d", "e"]);
    this.update();
    this.setRange("b", "c");

    this.controller.moveSelectedArea(2100, { isEvent: true });

    this.check(assert, ["c", "d"], [1800, 2600]);
    assert.deepEqual(this.notifications, [["c", "d", { isEvent: true }]], "notification");
});

QUnit.test("Categories 2", function(assert) {
    this.setCategories(["a", "b", "c", "d", "e"]);
    this.update();
    this.setRange("b", "c");

    this.controller.moveSelectedArea(1500, { isEvent: true });

    this.check(assert, ["a", "b"], [1000, 1800]);
    assert.deepEqual(this.notifications, [["a", "b", { isEvent: true }]], "notification");
});

QUnit.test("Docking", function(assert) {
    this.update({
        behavior: { snapToTicks: true },
        fullTicks: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    });
    this.setRange(11, 14);

    this.controller.moveSelectedArea(2100, { isEvent: true });

    this.check(assert, [20, 22], [2000, 2200]);
    assert.deepEqual(this.notifications, [[20, 22, { isEvent: true }]], "notification");
});

QUnit.test("Docking with DateTime (irregular scale, from small range to big)", function(assert) {
    this.setDateTime();
    this.update({
        behavior: { snapToTicks: true },
        fullTicks: [new Date(2011, 0, 1), new Date(2011, 1, 1), new Date(2011, 2, 1), new Date(2011, 3, 1), new Date(2011, 4, 1), new Date(2011, 5, 1), new Date(2011, 6, 1), new Date(2011, 7, 1), new Date(2011, 8, 1), new Date(2011, 9, 1), new Date(2011, 10, 1), new Date(2011, 11, 1), new Date(2012, 0, 1)]
    });
    this.setRange(new Date(2011, 1, 1), new Date(2011, 2, 1));

    this.controller.moveSelectedArea(1400, { isEvent: true });

    this.check(assert, [new Date(2011, 2, 1), new Date(2011, 3, 1)], [1388, 1592]);
    assert.deepEqual(this.notifications, [[new Date(2011, 2, 1), new Date(2011, 3, 1), { isEvent: true }]], "notification");
});

QUnit.test("Docking with DateTime (irregular scale, from big range to small)", function(assert) {
    this.translator.update({
        axisType: "continuous",
        dataType: "datetime",
        min: new Date(2011, 0, 1),
        max: new Date(2011, 0, 10)
    }, { left: 1000, width: 3000 }, { isHorizontal: true });

    this.update({
        behavior: { snapToTicks: true },
        fullTicks: [
            new Date(2011, 0, 1),
            new Date(2011, 0, 2),
            new Date(2011, 0, 3),
            new Date(2011, 0, 4),
            new Date(2011, 0, 5),
            new Date(2011, 0, 6),
            new Date(2011, 0, 7),
            new Date(2011, 0, 8),
            new Date(2011, 0, 9),
            new Date(2011, 0, 10),
            new Date(2011, 0, 11),
            new Date(2011, 0, 12),
            new Date(2011, 0, 13)]
    });
    this.setRange(new Date(2011, 0, 1), new Date(2011, 0, 2));

    this.controller.moveSelectedArea(1800, { isEvent: true });

    this.check(assert, [new Date(2011, 0, 4), new Date(2011, 0, 5)], [1667, 1889]);
    assert.deepEqual(this.notifications, [[new Date(2011, 0, 4), new Date(2011, 0, 5), { isEvent: true }]], "notification");
});

QUnit.test("Close to start", function(assert) {
    this.update();
    this.setRange(11, 14);

    this.controller.moveSelectedArea(1150);

    this.check(assert, [10, 13], [1000, 1300]);
});

QUnit.test("Close to end", function(assert) {
    this.update();
    this.setRange(11, 14);

    this.controller.moveSelectedArea(2900);

    this.check(assert, [27, 30], [2700, 3000]);
});

QUnit.module("Methods - selected area moving", environmentForMethods);

QUnit.test("Common", function(assert) {
    this.update();
    this.setRange(11, 15);

    var handler = this.controller.beginSelectedAreaMoving(1200);
    handler(1300);
    handler(1500);
    handler.complete({ isEvent: true });

    this.checkMoves(assert, [[1200, 1600], [1400, 1800]]);
    this.check(assert, [14, 18], [1400, 1800]);
    assert.deepEqual(this.notifications, [[14, 18, { isEvent: true }]], "notification");
});

QUnit.test("Docking", function(assert) {
    this.update({
        behavior: { snapToTicks: true },
        fullTicks: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    });
    this.setRange(11, 15);

    var handler = this.controller.beginSelectedAreaMoving(1200);
    handler(1340);
    handler(1560);
    handler.complete({ isEvent: true });

    this.checkMoves(assert, [[1240, 1640], [1460, 1860]]);
    this.check(assert, [14, 18], [1400, 1800]);
    assert.deepEqual(this.notifications, [[14, 18, { isEvent: true }]], "notification");
});

QUnit.test("Docking with DateTime (irregular scale, from small range to big)", function(assert) {
    this.setDateTime();
    this.update({
        behavior: { snapToTicks: true },
        fullTicks: [new Date(2011, 0, 1), new Date(2011, 1, 1), new Date(2011, 2, 1), new Date(2011, 3, 1), new Date(2011, 4, 1), new Date(2011, 5, 1), new Date(2011, 6, 1), new Date(2011, 7, 1), new Date(2011, 8, 1), new Date(2011, 9, 1), new Date(2011, 10, 1), new Date(2011, 11, 1), new Date(2012, 0, 1)]
    });
    this.setRange(new Date(2011, 1, 1), new Date(2011, 2, 1));

    var handler = this.controller.beginSelectedAreaMoving(1300);
    handler(1350);
    handler(1400);
    handler.complete({ isEvent: true });

    this.checkMoves(assert, [[1254, 1438], [1304, 1488]]);
    this.check(assert, [new Date(2011, 2, 1), new Date(2011, 3, 1)], [1388, 1592]);
    assert.deepEqual(this.notifications, [[new Date(2011, 2, 1), new Date(2011, 3, 1), { isEvent: true }]], "notification");
});

QUnit.test("Docking with DateTime (irregular scale, from big range to small)", function(assert) {
    this.setDateTime();
    this.update({
        behavior: { snapToTicks: true },
        fullTicks: [new Date(2011, 0, 1), new Date(2011, 1, 1), new Date(2011, 2, 1), new Date(2011, 3, 1), new Date(2011, 4, 1), new Date(2011, 5, 1), new Date(2011, 6, 1), new Date(2011, 7, 1), new Date(2011, 8, 1), new Date(2011, 9, 1), new Date(2011, 10, 1), new Date(2011, 11, 1), new Date(2012, 0, 1)]
    });
    this.setRange(new Date(2011, 0, 1), new Date(2011, 1, 1));

    var handler = this.controller.beginSelectedAreaMoving(1100);
    handler(1155);
    handler(1210);
    handler.complete({ isEvent: true });

    this.checkMoves(assert, [[1055, 1259], [1110, 1314]]);
    this.check(assert, [new Date(2011, 1, 1), new Date(2011, 2, 1)], [1204, 1388]);
    assert.deepEqual(this.notifications, [[new Date(2011, 1, 1), new Date(2011, 2, 1), { isEvent: true }]], "notification");
});

QUnit.test("Categories", function(assert) {
    this.setCategories(["a", "b", "c", "d", "e"]);
    this.update();
    this.setRange("b", "c");

    var handler = this.controller.beginSelectedAreaMoving(1200);
    handler(1300);
    handler(1500);
    handler.complete({ isEvent: true });

    this.checkMoves(assert, [[1500, 2300], [1700, 2500]]);
    this.check(assert, ["c", "d"], [1800, 2600]);
    assert.deepEqual(this.notifications, [["c", "d", { isEvent: true }]], "notification");
});

QUnit.test("Notifications on moving, callValueChanged", function(assert) {
    this.update({
        behavior: { callValueChanged: "OnMoving", snapToTicks: true },
        fullTicks: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    });
    this.setRange(11, 15);

    var handler = this.controller.beginSelectedAreaMoving(1200);
    handler(1340, { firstEvent: true });
    handler(1560, { secondEvent: true });
    handler.complete();

    assert.deepEqual(this.notifications, [[12, 16, { firstEvent: true }], [14, 18, { secondEvent: true }]], "notifications");
});

QUnit.test("Close to start", function(assert) {
    this.update();
    this.setRange(11, 15);

    var handler = this.controller.beginSelectedAreaMoving(1200);
    handler(1100);
    handler(900);
    handler(1150);

    this.checkMoves(assert, [[1000, 1400], [1050, 1450]]);
});

QUnit.test("Close to end", function(assert) {
    this.update();
    this.setRange(11, 15);

    var handler = this.controller.beginSelectedAreaMoving(1200);
    handler(2700);
    handler(2900);
    handler(2600);

    this.checkMoves(assert, [[2600, 3000], [2500, 2900]]);
});

QUnit.module("Methods - slider moving", environmentForMethods);

QUnit.test("Common", function(assert) {
    this.update();
    this.setRange(11, 15);

    var handler = this.controller.beginSliderMoving(1, 1600);
    handler(1800);
    handler(1900);
    handler.complete({ isEvent: true });

    this.checkSliderMoves(assert, 1, [1700, 1800]);
    this.check(assert, [11, 18], [1100, 1800]);
    assert.deepEqual(this.notifications, [[11, 18, { isEvent: true }]], "notification");
});

QUnit.test("Docking", function(assert) {
    this.update({
        behavior: { snapToTicks: true },
        fullTicks: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    });
    this.setRange(11, 15);

    var handler = this.controller.beginSliderMoving(0, 1000);
    handler(900);
    handler(1250);
    handler.complete({ isEvent: true });

    this.checkSliderMoves(assert, 0, [1000, 1350]);
    this.check(assert, [14, 15], [1400, 1500]);
    assert.deepEqual(this.notifications, [[14, 15, { isEvent: true }]], "notification");
});

QUnit.test("Categories", function(assert) {
    this.setCategories(["a", "b", "c", "d", "e"]);
    this.update();
    this.setRange("b", "c");

    var handler = this.controller.beginSliderMoving(1, 2300);
    handler(1900);
    handler(2500);
    handler.complete({ isEvent: true });

    this.checkSliderMoves(assert, 1, [1800, 2400]);
    this.check(assert, ["b", "d"], [1400, 2600]);
    assert.deepEqual(this.notifications, [["b", "d", { isEvent: true }]], "notification");
});

QUnit.test("Categories and snapping to axis ticks", function(assert) {
    // Since strings are comparable such special category names are required for the test.
    var categories = ["C", "P", "A", "R", "F"];
    this.setCategories(categories);
    this.update({
        behavior: { snapToTicks: true },
        fullTicks: categories
    });
    this.setRange("R", "F");

    var handler = this.controller.beginSliderMoving(0, 2100);
    handler(1300);
    handler.complete();

    this.check(assert, ["P", "F"], [1400, 3000]);
});

QUnit.test("Notifications on moving, callValueChanged option", function(assert) {
    this.update({
        behavior: { callValueChanged: "OnMoving", snapToTicks: true },
        fullTicks: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    });
    this.setRange(11, 15);

    var handler = this.controller.beginSliderMoving(1, 1600);
    handler(1700, { firstEvent: true });
    handler(2150, { secondEvent: true });
    handler.complete();

    this.checkSliderMoves(assert, 1, [1600, 2050]);
    this.check(assert, [11, 20], [1100, 2000]);
    assert.deepEqual(this.notifications, [[11, 16, { firstEvent: true }], [11, 20, { secondEvent: true }]], "notification");
});

QUnit.test("Swapping", function(assert) {
    this.update({ behavior: { allowSlidersSwap: true } });
    this.setRange(11, 15);

    var handler = this.controller.beginSliderMoving(0, 1000);
    handler(1100);
    handler(1350);
    handler(1450);
    handler(1550);
    handler(1700);
    handler.complete();

    this.checkSliderMoves(assert, 0, [1200, 1450, 1500]);
    this.checkSliderMoves(assert, 1, [1600]);
    this.check(assert, [15, 16], [1500, 1600]);
});

QUnit.test("Disabled swapping", function(assert) {
    this.update({ behavior: { allowSlidersSwap: true } });
    this.setRange(11, 15);

    var handler = this.controller.beginSliderMoving(1, 1600);
    handler(1400);
    handler(1250);
    handler(1000);
    handler.complete();

    this.checkSliderMoves(assert, 1, [1300, 1150]);
    this.check(assert, [11, 11.5], [1100, 1150]);
});

QUnit.test("Inverted scale", function(assert) {
    this.setInverted();
    this.update();
    this.setRange(15, 11);

    var handler = this.controller.beginSliderMoving(0, 2400);
    handler(2200);
    handler(2000);
    handler.complete();

    this.checkSliderMoves(assert, 0, [2300, 2100]);
    this.check(assert, [19, 11], [2100, 2900]);
});

QUnit.test("Min range restriction", function(assert) {
    this.update({ rangeBounds: { minRange: 2 } });
    this.setRange(21, 25);

    var handler = this.controller.beginSliderMoving(0, 2000);
    handler(2100);
    handler(2300);
    handler.complete();

    this.checkSliderMoves(assert, 0, [2400]);
    this.check(assert, [22, 25], [2200, 2500]);
    var lineAttr = this.sliderLine(0).attr;
    assert.deepEqual(lineAttr.getCall(lineAttr.callCount - 2).args, [{ stroke: "invalid-color" }], "line color is set to invalid");
    assert.deepEqual(lineAttr.getCall(lineAttr.callCount - 1).args, [{ stroke: "handle-color" }], "line color is set to valid");
    var cloudAttr = this.sliderCloud(0).attr;
    assert.deepEqual(cloudAttr.getCall(cloudAttr.callCount - 4).args, [{ fill: "invalid-color" }], "cloud color is set to invalid");
    assert.deepEqual(cloudAttr.getCall(cloudAttr.callCount - 2).args, [{ fill: "marker-color" }], "cloud color is set to valid");
});

QUnit.test("Max range restriction", function(assert) {
    this.update({ rangeBounds: { maxRange: 8 } });
    this.setRange(15, 17);

    var handler = this.controller.beginSliderMoving(1, 1800);
    handler(2300);
    handler(2700);
    handler.complete();

    this.checkSliderMoves(assert, 1, [2200, 2600]);
    this.check(assert, [15, 22], [1500, 2200]);
    var lineAttr = this.sliderLine(1).attr;
    assert.deepEqual(lineAttr.getCall(lineAttr.callCount - 2).args, [{ stroke: "invalid-color" }], "line color is set to invalid");
    assert.deepEqual(lineAttr.getCall(lineAttr.callCount - 1).args, [{ stroke: "handle-color" }], "line color is set to valid");
    var cloudAttr = this.sliderCloud(1).attr;
    assert.deepEqual(cloudAttr.getCall(cloudAttr.callCount - 4).args, [{ fill: "invalid-color" }], "cloud color is set to invalid");
    assert.deepEqual(cloudAttr.getCall(cloudAttr.callCount - 2).args, [{ fill: "marker-color" }], "cloud color is set to valid");
});

QUnit.module("Methods - placing one slider and moving other", environmentForMethods);

QUnit.test("Left slider", function(assert) {
    this.update();
    this.setRange(11, 15);

    var handler = this.controller.placeSliderAndBeginMoving(2100, 1900);
    handler(1800);
    handler.complete({ isEvent: true });

    this.checkSliderAnimated(assert, 1, 2100);
    assert.deepEqual(this.sliderRoot(0).stopAnimation.lastCall.args, [], "slider 0 animation is stopped");
    assert.deepEqual(this.shutter().stopAnimation.lastCall.args, [], "shutter animation is stopped");
    this.checkSliderMoves(assert, 0, [1800]);
    this.check(assert, [18, 21], [1800, 2100]);
    assert.deepEqual(this.notifications, [[18, 21, { isEvent: true }]], "notification");
});

QUnit.test("Right slider", function(assert) {
    this.update();
    this.setRange(11, 15);

    var handler = this.controller.placeSliderAndBeginMoving(1900, 2100);
    handler(2300);
    handler.complete({ isEvent: true });

    this.checkSliderAnimated(assert, 0, 1900);
    assert.deepEqual(this.sliderRoot(1).stopAnimation.lastCall.args, [], "slider 1 animation is stopped");
    assert.deepEqual(this.shutter().stopAnimation.lastCall.args, [], "shutter animation is stopped");
    this.checkSliderMoves(assert, 1, [2300]);
    this.check(assert, [19, 23], [1900, 2300]);
    assert.deepEqual(this.notifications, [[19, 23, { isEvent: true }]], "notification");
});

QUnit.test("Docking", function(assert) {
    this.update({
        behavior: { snapToTicks: true },
        fullTicks: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    });
    this.setRange(11, 15);

    this.controller.placeSliderAndBeginMoving(1950, 2250).complete();

    this.checkSliderAnimated(assert, 0, 2000);
    this.check(assert, [20, 22], [2000, 2200]);
});

QUnit.test("Categories 1", function(assert) {
    this.setCategories(["a", "b", "c", "d", "e"]);
    this.update();
    this.setRange("a", "b");

    this.controller.placeSliderAndBeginMoving(2300, 1700).complete();

    this.checkSliderAnimated(assert, 1, 2600);
    this.check(assert, ["c", "d"], [1800, 2600]);
});

QUnit.test("Categories 2", function(assert) {
    this.setCategories(["a", "b", "c", "d", "e"]);
    this.update();
    this.setRange("a", "b");

    this.controller.placeSliderAndBeginMoving(1500, 2500).complete();

    this.checkSliderAnimated(assert, 0, 1400);
    this.check(assert, ["b", "d"], [1400, 2600]);
});

QUnit.test("Notifications on moving, callValueChanged option", function(assert) {
    this.update({
        behavior: { callValueChanged: "OnMoving", snapToTicks: true },
        fullTicks: [10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30]
    });
    this.setRange(11, 13);

    var handler = this.controller.placeSliderAndBeginMoving(1450, 2150, { firstEvent: true });
    handler(1550, { secondEvent: true });
    handler.complete();

    this.check(assert, [14, 16], [1400, 1600]);
    assert.deepEqual(this.notifications, [[14, 22, { firstEvent: true }], [14, 16, { secondEvent: true }]]);
});

QUnit.test("Inverted scale", function(assert) {
    this.setInverted();
    this.update();
    this.setRange(20, 18);

    this.controller.placeSliderAndBeginMoving(1500, 1800).complete();

    this.check(assert, [25, 22], [1500, 1800]);
});

QUnit.test("Min range restriction", function(assert) {
    this.update({ rangeBounds: { minRange: 2 } });
    this.setRange(21, 25);

    this.controller.placeSliderAndBeginMoving(1200, 1300).complete();

    this.check(assert, [12, 14], [1200, 1400]);
});

QUnit.test("Min range restriction near start", function(assert) {
    this.update({ rangeBounds: { minRange: 2 } });
    this.setRange(21, 25);

    this.controller.placeSliderAndBeginMoving(1100, 1050).complete();

    this.check(assert, [10, 12], [1000, 1200]);
});

QUnit.test("Min range restriction near end", function(assert) {
    this.update({ rangeBounds: { minRange: 2 } });
    this.setRange(21, 25);

    this.controller.placeSliderAndBeginMoving(2850, 2900).complete();

    this.check(assert, [28, 30], [2800, 3000]);
});
