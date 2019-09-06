var $ = require("jquery"),
    pointerEvents = require("events/pointer"),
    trackerModule = require("viz/range_selector/tracker");

QUnit.testStart(function() {
    var markup =
        '<div id="area"></div>\
        <div id="selected-area"></div>\
        <div id="slider-1"></div>\
        <div id="slider-2"></div>';

    $("#qunit-fixture").html(markup);
});

function createHandler() {
    var handler = sinon.spy();
    handler.complete = sinon.spy();
    return handler;
}

function Controller(test) {
    this.test = test;
    test.$slider1 = $("#slider-1");
    test.$slider2 = $("#slider-2");
    test.$areaTracker = $("#area");
    test.$selectedAreaTracker = $("#selected-area");
}
Controller.prototype.getTrackerTargets = function() {
    return {
        area: this.test.$areaTracker,
        selectedArea: this.test.$selectedAreaTracker,
        sliders: [this.test.$slider1, this.test.$slider2]
    };
};

var environment = {
    beforeEach: function() {
        var controller = new Controller(this);
        this.tracker = new trackerModule.Tracker({
            renderer: {
                getRootOffset: function() { return { left: 25 }; }
            },
            controller: controller
        });
        this.init(controller);
        this.update();
    },

    afterEach: function() {
        this.tracker.dispose();
    },

    update: function(options) {
        options = options || {};
        this.tracker.update(!("enabled" in options) || options.enabled, {
            moveSelectedRangeByClick: !("moveSelectedRangeByClick" in options) || options.moveSelectedRangeByClick,
            manualRangeSelectionEnabled: !("manualRangeSelectionEnabled" in options) || options.manualRangeSelectionEnabled
        });
    },

    trigger: function($target, name, position, isTouch, isOtherButton) {
        var $event = $.Event(pointerEvents[name]);
        $event.originalEvent = $.Event(pointerEvents[name]);

        if(isTouch) {
            $event.originalEvent.touches = position.length ? $.map(position, function(pos) {
                return { pageX: pos };
            }) : [{ pageX: position }];
        } else {
            $event.pageX = position;
            $event.which = 1;
            if(isOtherButton) {
                $event.which = 2;
            }
        }
        ($target || $(document)).trigger($event);
        return $event;
    }
};

QUnit.module("Move selected area", $.extend({}, environment, {
    init: function(controller) {
        this.moveSelectedArea = controller.moveSelectedArea = sinon.spy();
    }
}));

QUnit.test("Performed", function(assert) {
    this.trigger(this.$areaTracker, "down", 200);
    var event = this.trigger(null, "up", 195);

    assert.deepEqual(this.moveSelectedArea.lastCall.args, [170, event]);
});

QUnit.test("Performed (touch)", function(assert) {
    this.trigger(this.$areaTracker, "down", 200, true);
    var event = this.trigger(null, "up", 195, true);

    assert.deepEqual(this.moveSelectedArea.lastCall.args, [170, event]);
});

QUnit.test("Canceled by pointer distance", function(assert) {
    this.trigger(this.$areaTracker, "down", 200);
    this.trigger(null, "up", 211);

    assert.strictEqual(this.moveSelectedArea.lastCall, null);
});

QUnit.test("Disabled by total option", function(assert) {
    this.update({ enabled: false });
    this.trigger(this.$areaTracker, "down", 200);
    this.trigger(null, "up", 195);

    assert.strictEqual(this.moveSelectedArea.lastCall, null);
});

QUnit.test("Disabled by option", function(assert) {
    this.update({ moveSelectedRangeByClick: false });
    this.trigger(this.$areaTracker, "down", 200);
    this.trigger(null, "up", 195);

    assert.strictEqual(this.moveSelectedArea.lastCall, null);
});

QUnit.module("Placing one slider and moving other", $.extend({}, environment, {
    init: function(controller) {
        this.placeSliderAndBeginMoving = controller.placeSliderAndBeginMoving = sinon.spy(createHandler);
    }
}));

QUnit.test("Performed", function(assert) {
    this.trigger(this.$areaTracker, "down", 200);
    var startEvent = this.trigger(null, "move", 215);
    var firstEvent = this.trigger(null, "move", 220);
    var secondEvent = this.trigger(null, "move", 225);
    var endEvent = this.trigger(null, "up", 230);

    assert.deepEqual(this.placeSliderAndBeginMoving.lastCall.args, [175, 190, startEvent]);
    var handler = this.placeSliderAndBeginMoving.lastCall.returnValue;
    assert.deepEqual(handler.getCall(0).args, [195, firstEvent]);
    assert.deepEqual(handler.getCall(1).args, [200, secondEvent]);
    assert.deepEqual(handler.complete.lastCall.args, [endEvent]);
});

QUnit.test("Performed (touch)", function(assert) {
    this.trigger(this.$areaTracker, "down", 200, true);
    var startEvent = this.trigger(null, "move", 215, true);
    var firstEvent = this.trigger(null, "move", 220, true);
    var secondEvent = this.trigger(null, "move", 225, true);
    var endEvent = this.trigger(null, "up", 230, true);

    assert.deepEqual(this.placeSliderAndBeginMoving.lastCall.args, [175, 190, startEvent]);
    var handler = this.placeSliderAndBeginMoving.lastCall.returnValue;
    assert.deepEqual(handler.getCall(0).args, [195, firstEvent]);
    assert.deepEqual(handler.getCall(1).args, [200, secondEvent]);
    assert.deepEqual(handler.complete.lastCall.args, [endEvent]);
});

QUnit.test("Completed on move when non left button is pressed", function(assert) {
    this.trigger(this.$areaTracker, "down", 200);
    var startEvent = this.trigger(null, "move", 215);
    var event = this.trigger(null, "move", 220);
    var endEvent = this.trigger(null, "move", 225, false, true);

    assert.deepEqual(this.placeSliderAndBeginMoving.lastCall.args, [175, 190, startEvent]);
    var handler = this.placeSliderAndBeginMoving.lastCall.returnValue;
    assert.deepEqual(handler.getCall(0).args, [195, event]);
    assert.deepEqual(handler.complete.lastCall.args, [endEvent]);
});

QUnit.test("Disabled by total option", function(assert) {
    this.update({ enabled: false });
    this.trigger(this.$areaTracker, "down", 200);
    this.trigger(null, "move", 215);

    assert.strictEqual(this.placeSliderAndBeginMoving.lastCall, null);
});

QUnit.test("Disabled by option", function(assert) {
    this.update({ manualRangeSelectionEnabled: false });
    this.trigger(this.$areaTracker, "down", 200);
    this.trigger(null, "move", 215);

    assert.strictEqual(this.placeSliderAndBeginMoving.lastCall, null);
});

QUnit.module("Moving selected area", $.extend({}, environment, {
    init: function(controller) {
        this.beginSelectedAreaMoving = controller.beginSelectedAreaMoving = sinon.spy(createHandler);
    }
}));

QUnit.test("Performed", function(assert) {
    this.trigger(this.$selectedAreaTracker, "down", 200);
    var firstEvent = this.trigger(null, "move", 210);
    var secondEvent = this.trigger(null, "move", 250);
    var endEvent = this.trigger(null, "up", 280);

    assert.deepEqual(this.beginSelectedAreaMoving.lastCall.args, [175]);
    var handler = this.beginSelectedAreaMoving.lastCall.returnValue;
    assert.deepEqual(handler.getCall(0).args, [185, firstEvent]);
    assert.deepEqual(handler.getCall(1).args, [225, secondEvent]);
    assert.deepEqual(handler.complete.lastCall.args, [endEvent]);
});

QUnit.test("Performed (touch)", function(assert) {
    this.trigger(this.$selectedAreaTracker, "down", 200, true);
    var firstEvent = this.trigger(null, "move", 210, true);
    var secondEvent = this.trigger(null, "move", 250, true);
    var endEvent = this.trigger(null, "up", 280, true);

    assert.deepEqual(this.beginSelectedAreaMoving.lastCall.args, [175]);
    var handler = this.beginSelectedAreaMoving.lastCall.returnValue;
    assert.deepEqual(handler.getCall(0).args, [185, firstEvent]);
    assert.deepEqual(handler.getCall(1).args, [225, secondEvent]);
    assert.deepEqual(handler.complete.lastCall.args, [endEvent]);
});

QUnit.test("Completed on move when non left button is pressed", function(assert) {
    this.trigger(this.$selectedAreaTracker, "down", 200);
    var firstEvent = this.trigger(null, "move", 210);
    var endEvent = this.trigger(null, "move", 250, false, true);

    assert.deepEqual(this.beginSelectedAreaMoving.lastCall.args, [175]);
    var handler = this.beginSelectedAreaMoving.lastCall.returnValue;
    assert.deepEqual(handler.getCall(0).args, [185, firstEvent]);
    assert.deepEqual(handler.complete.lastCall.args, [endEvent]);
});

QUnit.test("Default prevention and propagation stopping on down", function(assert) {
    var $eventDown = this.trigger(this.$selectedAreaTracker, "down", 200),
        $eventMove = this.trigger(null, "move", 250);

    assert.strictEqual($eventDown.isDefaultPrevented(), true, "prevent default - down");
    assert.strictEqual($eventDown.isPropagationStopped(), true, "stop propagation - down");
    assert.strictEqual($eventMove.isDefaultPrevented(), true, "prevent default - move");
    assert.strictEqual($eventMove.isPropagationStopped(), false, "stop propagation - move");
});

QUnit.test("Disabled by total option", function(assert) {
    this.update({ enabled: false });
    this.trigger(this.$selectedAreaTracker, "down", 200);
    this.trigger(null, "move", 215);

    assert.strictEqual(this.beginSelectedAreaMoving.lastCall, null);
});

QUnit.module("Slider moving", $.extend({}, environment, {
    init: function(controller) {
        this.beginSliderMoving = controller.beginSliderMoving = sinon.spy(createHandler);
        this.foregroundSlider = controller.foregroundSlider = sinon.spy();
    }
}));

QUnit.test("Performed", function(assert) {
    this.trigger(this.$slider1, "down", 200);
    var firstEvent = this.trigger(null, "move", 210);
    var secondEvent = this.trigger(null, "move", 250);
    var endEvent = this.trigger(null, "up", 280);

    assert.deepEqual(this.beginSliderMoving.lastCall.args, [0, 175]);
    var handler = this.beginSliderMoving.lastCall.returnValue;
    assert.deepEqual(handler.getCall(0).args, [185, firstEvent]);
    assert.deepEqual(handler.getCall(1).args, [225, secondEvent]);
    assert.deepEqual(handler.complete.lastCall.args, [endEvent]);
});

QUnit.test("Performed (touch)", function(assert) {
    this.trigger(this.$slider2, "down", 200, true);
    var firstEvent = this.trigger(null, "move", 210, true);
    var secondEvent = this.trigger(null, "move", 250, true);
    var endEvent = this.trigger(null, "up", 280, true);

    assert.deepEqual(this.beginSliderMoving.lastCall.args, [1, 175]);
    var handler = this.beginSliderMoving.lastCall.returnValue;
    assert.deepEqual(handler.getCall(0).args, [185, firstEvent]);
    assert.deepEqual(handler.getCall(1).args, [225, secondEvent]);
    assert.deepEqual(handler.complete.lastCall.args, [endEvent]);
});

QUnit.test("Completed on move when non left button is pressed", function(assert) {
    this.trigger(this.$slider1, "down", 200);
    var event = this.trigger(null, "move", 210);
    var endEvent = this.trigger(null, "move", 250, false, true);

    assert.deepEqual(this.beginSliderMoving.lastCall.args, [0, 175]);
    var handler = this.beginSliderMoving.lastCall.returnValue;
    assert.deepEqual(handler.getCall(0).args, [185, event]);
    assert.deepEqual(handler.complete.lastCall.args, [endEvent]);
});

QUnit.test("Default prevention and propagation stopping on down", function(assert) {
    var $eventDown = this.trigger(this.$slider2, "down", 200),
        $eventMove = this.trigger(null, "move", 250);

    assert.strictEqual($eventDown.isDefaultPrevented(), true, "prevent default - down");
    assert.strictEqual($eventDown.isPropagationStopped(), true, "stop propagation - down");
    assert.strictEqual($eventMove.isDefaultPrevented(), true, "prevent default - move");
    assert.strictEqual($eventMove.isPropagationStopped(), false, "stop propagation - move");
});

QUnit.test("Disabled by total option", function(assert) {
    this.update({ enabled: false });
    this.trigger(this.$slider1, "down", 200);
    this.trigger(null, "move", 215);

    assert.strictEqual(this.beginSliderMoving.lastCall, null);
});

QUnit.test("Slider is foregrounded on move", function(assert) {
    this.trigger(this.$slider1, "move", 210);
    this.trigger(this.$slider2, "move", 220);

    assert.deepEqual(this.foregroundSlider.getCall(0).args, [0]);
    assert.deepEqual(this.foregroundSlider.getCall(1).args, [1]);
});
