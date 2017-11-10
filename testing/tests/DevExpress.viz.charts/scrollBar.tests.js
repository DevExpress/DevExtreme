"use strict";

var $ = require("jquery"),
    vizMocks = require("../../helpers/vizMocks.js"),
    ScrollBar = require("viz/chart_components/scroll_bar").ScrollBar,
    translator2DModule = require("viz/translators/translator2d"),
    Translator = vizMocks.stubClass(translator2DModule.Translator2D);

var canvas = {
        top: 10,
        bottom: 15,
        left: 20,
        right: 25,
        width: 600,
        height: 400
    },
    range = {
        min: 10,
        max: 100,
        minVisible: 30,
        maxVisible: 90,
        categories: [],
        visibleCategories: [],
        stick: false,
        inverted: true
    },
    environment = {
        beforeEach: function() {
            this.renderer = new vizMocks.Renderer();

            this.group = this.renderer.g();

            sinon.stub(translator2DModule, "Translator2D", function() {
                var stub = new Translator();
                stub.getScale = sinon.stub().returns(1);
                stub.stub("getCanvasVisibleArea");
                return stub;
            });

            this.options = {
                rotated: false,
                color: "fill",
                width: 10,
                offset: 5,
                opacity: 0.5,
                visible: true
            };
        },

        afterEach: function() {
            this.renderer.dispose();
            this.renderer = null;
            this.options = null;
            translator2DModule.Translator2D.restore();
        }

    };

QUnit.module("dxChart scrollBar", environment);

QUnit.test("create scrollBar", function(assert) {
    var group = new vizMocks.Element(),
        //act
        scrollBar = new ScrollBar(this.renderer, group);
    //assert
    assert.ok(scrollBar);
    assert.ok(translator2DModule.Translator2D.calledOnce);
    assert.deepEqual(translator2DModule.Translator2D.lastCall.args, [{}, {}, {}]);

    assert.equal(this.renderer.rect.callCount, 1);
    assert.deepEqual(this.renderer.rect.firstCall.args, []);

    assert.equal(group.children.length, 1);
    assert.equal(group.children[0].typeOfNode, "rect");
});

QUnit.test("init scrollBar", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group);
    scrollBar.update(this.options).updateSize(canvas);
    //act
    scrollBar.init(range);
    //Assert
    assert.ok(translator2DModule.Translator2D.calledOnce);
    var scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    assert.ok(scrollTranslator.update.calledOnce);

    assert.deepEqual(scrollTranslator.update.lastCall.args, [{
        categories: [],
        inverted: true,
        max: 100,
        maxVisible: null,
        min: 10,
        minVisible: null,
        visibleCategories: null,
        stick: false
    },
        canvas,
    {
        isHorizontal: true
    }]
    );
});

QUnit.test("init scrollBar. Rotated", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group);
    this.options.rotated = true;
    scrollBar.update(this.options).updateSize(canvas);
    //act
    scrollBar.init(range);
    //Assert
    assert.ok(translator2DModule.Translator2D.calledOnce);
    var scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    assert.ok(scrollTranslator.update.calledOnce);

    assert.deepEqual(scrollTranslator.update.lastCall.args, [{
        categories: [],
        inverted: true,
        max: 100,
        maxVisible: null,
        min: 10,
        minVisible: null,
        visibleCategories: null,
        stick: false
    },
        canvas,
    {
        isHorizontal: false
    }]
    );
});

QUnit.test("update scrollBar", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group);
    //act
    scrollBar.update(this.options);
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        fill: "fill",
        rotate: -90,
        rotateX: 0,
        rotateY: 0,
        width: 10,
        opacity: 0.5
    });

    assert.deepEqual(scrollBar.getOptions(), {
        offset: 5,
        vertical: false,
        position: "top",
        width: 10
    });
});

QUnit.test("update scrollBar. Rotated", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group);
    this.options.rotated = true;
    //act
    scrollBar.update(this.options);
    //Assert

    assert.deepEqual(group.children[0]._stored_settings, {
        fill: "fill",
        rotate: 0,
        rotateX: 0,
        rotateY: 0,
        opacity: 0.5,
        width: 10
    });
    assert.deepEqual(scrollBar.getOptions(), {
        offset: 5,
        vertical: true,
        position: "right",
        width: 10
    });
});

QUnit.test("setPosition by arguments. Both arguments in range", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.withArgs("40").returns(45);
    scrollTranslator.translate.withArgs("70").returns(75);
    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    //act
    scrollBar.setPosition("40", "70");
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 45,
        height: 30
    });
});

QUnit.test("setPosition by arguments. Discrete axis. stick false", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group).update(this.options).init($.extend({}, range, {
            axisType: "discrete",
            stick: false
        }), canvas),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();

    scrollTranslator.translate.withArgs("40", -1).returns(40);
    scrollTranslator.translate.withArgs("40", +1).returns(50);
    scrollTranslator.translate.withArgs("40").returns(45);


    scrollTranslator.translate.withArgs("70", -1).returns(70);
    scrollTranslator.translate.withArgs("70", +1).returns(80);
    scrollTranslator.translate.withArgs("70").returns(75);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    //act
    scrollBar.setPosition("40", "70");
    //Assert
    assert.deepEqual(group.children[0].attr.lastCall.args[0], {
        y: 40,
        height: 40
    });
});

QUnit.test("setPosition by arguments. Discrete axis. stick true", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group).update(this.options).init($.extend({}, range, {
            axisType: "discrete",
            stick: true
        }), canvas),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();

    scrollTranslator.translate.withArgs("40", -1).returns(40);
    scrollTranslator.translate.withArgs("40", +1).returns(50);
    scrollTranslator.translate.withArgs("40").returns(45);


    scrollTranslator.translate.withArgs("70", -1).returns(70);
    scrollTranslator.translate.withArgs("70", +1).returns(80);
    scrollTranslator.translate.withArgs("70").returns(75);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    //act
    scrollBar.setPosition("40", "70");
    //Assert
    assert.deepEqual(group.children[0].attr.lastCall.args[0], {
        y: 45,
        height: 30
    });
});

QUnit.test("setPosition by arguments. Stick false", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group).update(this.options).init($.extend({}, range, {
            stick: false
        }), canvas),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();

    scrollTranslator.translate.withArgs("40", -1).returns(40);
    scrollTranslator.translate.withArgs("40", +1).returns(50);
    scrollTranslator.translate.withArgs("40").returns(45);


    scrollTranslator.translate.withArgs("70", -1).returns(70);
    scrollTranslator.translate.withArgs("70", +1).returns(80);
    scrollTranslator.translate.withArgs("70").returns(75);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    //act
    scrollBar.setPosition("40", "70");
    //Assert
    assert.deepEqual(group.children[0].attr.lastCall.args[0], {
        y: 45,
        height: 30
    });
});

QUnit.test("setPosition by arguments.Stick true", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group).update(this.options).init($.extend({}, range, {
            stick: true
        }), canvas),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();

    scrollTranslator.translate.withArgs("40", -1).returns(40);
    scrollTranslator.translate.withArgs("40", +1).returns(50);
    scrollTranslator.translate.withArgs("40").returns(45);


    scrollTranslator.translate.withArgs("70", -1).returns(70);
    scrollTranslator.translate.withArgs("70", +1).returns(80);
    scrollTranslator.translate.withArgs("70").returns(75);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    //act
    scrollBar.setPosition("40", "70");
    //Assert
    assert.deepEqual(group.children[0].attr.lastCall.args[0], {
        y: 45,
        height: 30
    });
});

QUnit.test("setPosition by arguments. Both arguments are undefined", function(assert) {

    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();

    scrollTranslator.translate.withArgs("canvas_position_start").returns(10);
    scrollTranslator.translate.withArgs("canvas_position_end").returns(100);
    scrollTranslator.translate.returns(null);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });

    //act
    scrollBar.setPosition(undefined, undefined);
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 10,
        height: 90
    });
});

QUnit.test("setPosition by arguments. Both arguments out of canvas", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.returns(null);

    scrollTranslator.translate.withArgs("40").returns(5);
    scrollTranslator.translate.withArgs("70").returns(110);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });

    //act
    scrollBar.setPosition("40", "70");
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 10,
        height: 90
    });
});

QUnit.test("setPosition by arguments. min = max", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.withArgs("40").returns(45);
    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    //act
    scrollBar.setPosition("40", "40");
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 45,
        height: 2
    });
});

QUnit.test("setPosition by arguments. minSize", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.withArgs("40").returns(45);
    scrollTranslator.translate.withArgs("41").returns(46.9);
    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    //act
    scrollBar.setPosition("40", "41");
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 45,
        height: 2
    });
});

QUnit.test("Apply transform. Scale>1", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.returns(null);

    scrollTranslator.canvasLength = 90;

    scrollTranslator.translate.withArgs("40").returns(10);
    scrollTranslator.translate.withArgs("70").returns(100);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    scrollBar.setPosition("40", "70");

    //act
    scrollBar.transform(15, 2);
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 10 + (10 - 10 * 2 + 15) / 2,
        height: 90 / 2
    });
});

QUnit.test("Apply transform, Scale<1", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.returns(null);

    scrollTranslator.canvasLength = 90;

    scrollTranslator.translate.withArgs("40").returns(10);
    scrollTranslator.translate.withArgs("70").returns(100);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    scrollBar.setPosition("40", "70");

    //act
    scrollBar.transform(15, 2);
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 10 + (10 - 10 * 2 + 15) / 2,
        height: 90 / 2
    });
});

QUnit.test("apply transform, when offset!=0, scale>1", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.returns(null);
    scrollTranslator.getScale.withArgs("40", "70").returns(2);

    scrollTranslator.canvasLength = 100;

    scrollTranslator.translate.withArgs("40").returns(20);
    scrollTranslator.translate.withArgs("70").returns(70);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 110
    });
    scrollBar.setPosition("40", "70");

    //act
    scrollBar.transform(15, 2);
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 20 + (10 - 10 * 2 + 15) / (2 * 2),
        height: 100 / (2 * 2)
    });
});

QUnit.test("apply transform, when offset!=0, scale<1", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.returns(null);

    scrollTranslator.canvasLength = 100;
    scrollTranslator.getScale.withArgs("40", "70").returns(0.5);

    scrollTranslator.translate.withArgs("40").returns(20);
    scrollTranslator.translate.withArgs("70").returns(220);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 110
    });
    scrollBar.setPosition("40", "70");

    //act
    scrollBar.transform(15, 4);
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 20 + (10 - 10 * 4 + 15) / (0.5 * 4),
        height: 100 / (0.5 * 4)
    });
});

QUnit.test("Apply transform, when offset!=0, scale>1. Result scrollBar > canvas", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.returns(null);

    scrollTranslator.canvasLength = 100;

    scrollTranslator.translate.withArgs("40").returns(20);
    scrollTranslator.translate.withArgs("70").returns(70);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 110
    });
    scrollBar.setPosition("40", "70");

    //act
    scrollBar.transform(-40, 0.2);
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: 10,
        height: 100
    });
});

QUnit.test("Apply transform. Big positive translate", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.returns(null);

    scrollTranslator.canvasLength = 90;

    scrollTranslator.translate.withArgs("40").returns(10);
    scrollTranslator.translate.withArgs("70").returns(100);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    scrollBar.setPosition("40", "70");
    //act
    scrollBar.transform(1000, 1);
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: scrollTranslator.getCanvasVisibleArea().max,
        height: 2
    });
});

QUnit.test("Apply transform. Big negative translate", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group),
        scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;

    scrollTranslator.translate = sinon.stub();
    scrollTranslator.translate.returns(null);

    scrollTranslator.canvasLength = 90;

    scrollTranslator.translate.withArgs("40").returns(10);
    scrollTranslator.translate.withArgs("70").returns(100);

    scrollTranslator.getCanvasVisibleArea.returns({
        min: 10,
        max: 100
    });
    scrollBar.setPosition("40", "70");
    //act
    scrollBar.transform(-1000, 1);
    //Assert
    assert.deepEqual(group.children[0]._stored_settings, {
        y: scrollTranslator.getCanvasVisibleArea().min,
        height: 2
    });
});

QUnit.test("Disposing", function(assert) {
    var group = new vizMocks.Element(),
        scrollBar = new ScrollBar(this.renderer, group);

    //act
    scrollBar.dispose();
    //Assert
    assert.ok(!this.renderer.stub("dispose").called);

    assert.ok(!group.children.length);
});

QUnit.module("Scroll moving", {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.group = new vizMocks.Element();
        this.scrollBar = new ScrollBar(this.renderer, this.group).update(this.options);

        this.scrollTranslator = translator2DModule.Translator2D.lastCall.returnValue;
        this.scrollTranslator.translate = sinon.stub();
        this.scrollTranslator.getCanvasVisibleArea.returns({
            min: 10,
            max: 100
        });
        this.scrollTranslator.canvasLength = 90;

        this.startEventsHandler = sinon.stub();
        this.moveEventsHandler = sinon.stub();

        $(this.group.children[0].element).on("dxc-scroll-start", this.startEventsHandler);
        $(this.group.children[0].element).on("dxc-scroll-move", this.moveEventsHandler);


    },
    afterEach: function() {
        environment.afterEach.call(this);
        this.scrollBar.dispose();
        this.scrollBar = null;
        $(this.group.element).removeData();
        this.group = null;
        this.scrollTranslator = null;

        this.startEventsHandler = null;
        this.moveEventsHandler = null;
    }
});

QUnit.test("pointer move without down", function(assert) {

    $(this.group.children[0].element).trigger(new $.Event("dxpointermove", { pageX: 100, pageY: 200 }));

    assert.ok(!this.startEventsHandler.called);
    assert.ok(!this.moveEventsHandler.called);
});

QUnit.test("pointer down on scroll", function(assert) {
    $(this.group.children[0].element).trigger(new $.Event("dxpointerdown", { pageX: 100, pageY: 200 }));

    assert.ok(this.startEventsHandler.calledOnce);
    assert.deepEqual(this.startEventsHandler.lastCall.args[0].pointers, [{
        pageX: 100,
        pageY: 200
    }]);

});

QUnit.test("move scroll when scale = 1", function(assert) {
    var preventDefault = sinon.stub();

    this.scrollTranslator.translate.withArgs(40).returns(10);
    this.scrollTranslator.translate.withArgs(70).returns(100);

    this.scrollBar.setPosition(40, 70);
    //act
    $(this.group.children[0].element).trigger(new $.Event("dxpointerdown", { pageX: 100, pageY: 200 }));
    $(document).trigger(new $.Event("dxpointermove", { pageX: 130, pageY: 270 }));
    $(document).trigger(new $.Event("dxpointermove", { pageX: 80, pageY: 120, preventDefault: preventDefault }));
    //assert
    assert.ok(this.startEventsHandler.calledOnce);
    assert.deepEqual(this.startEventsHandler.lastCall.args[0].pointers, [{
        pageX: 100,
        pageY: 200
    }]);

    assert.deepEqual(this.moveEventsHandler.firstCall.args[0].pointers, [{
        pageX: 100 - 30,
        pageY: 200 - 70
    }]);
    assert.deepEqual(this.moveEventsHandler.lastCall.args[0].pointers, [{
        pageX: 100 + 20,
        pageY: 200 + 80
    }]);
    assert.ok(!preventDefault.called);
    this.moveEventsHandler.lastCall.args[0].preventDefault();
    assert.ok(preventDefault.calledOnce);
    assert.equal(this.moveEventsHandler.callCount, 2);


});

QUnit.test("move scroll when scale != 1", function(assert) {
    this.scrollTranslator.translate.withArgs(40).returns(30);
    this.scrollTranslator.translate.withArgs(70).returns(75);
    this.scrollTranslator.getScale.withArgs(40, 70).returns(2);

    this.scrollBar.setPosition(40, 70);
    //act
    $(this.group.children[0].element).trigger(new $.Event("dxpointerdown", { pageX: 100, pageY: 200 }));
    $(document).trigger(new $.Event("dxpointermove", { pageX: 130, pageY: 270 }));
    $(document).trigger(new $.Event("dxpointermove", { pageX: 80, pageY: 120 }));
    //assert
    assert.ok(this.startEventsHandler.calledOnce);
    assert.deepEqual(this.startEventsHandler.lastCall.args[0].pointers, [{
        pageX: 100,
        pageY: 200
    }]);

    assert.deepEqual(this.moveEventsHandler.firstCall.args[0].pointers, [{
        pageX: 100 - 60,
        pageY: 200 - 140
    }]);
    assert.deepEqual(this.moveEventsHandler.lastCall.args[0].pointers, [{
        pageX: 100 + 40,
        pageY: 200 + 160
    }]);

    assert.equal(this.moveEventsHandler.callCount, 2);
});

QUnit.test("scroll moving after pointerup", function(assert) {
    this.scrollTranslator.translate.withArgs(40).returns(10);
    this.scrollTranslator.translate.withArgs(70).returns(100);

    this.scrollBar.setPosition(40, 70);
    $(this.group.children[0].element).trigger(new $.Event("dxpointerdown", { pageX: 100, pageY: 200 }));
    $(document).trigger(new $.Event("dxpointermove", { pageX: 130, pageY: 270 }));

    //act
    $(document).trigger(new $.Event("dxpointerup", { pageX: 130, pageY: 270 }));
    $(document).trigger(new $.Event("dxpointermove", { pageX: 80, pageY: 120 }));
    //assert
    assert.ok(this.moveEventsHandler.calledOnce);

    assert.deepEqual(this.moveEventsHandler.firstCall.args[0].pointers, [{
        pageX: 100 - 30,
        pageY: 200 - 70
    }]);
});

QUnit.module("scrollBar layouting", {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.getOptions = function(options) {
            return $.extend(true, {}, this.options, options);
        };
        this.panes = [{ name: "pane1", canvas: { left: 10, top: 100, right: 15, bottom: 150, width: 20, height: 200 } },
            { name: "pane2", canvas: { left: 70, right: 75, bottom: 350, top: 700, width: 80, height: 800 } }];
    },
    afterEach: function() {
        environment.afterEach.call(this);
    }
});

QUnit.test("Set position for horizontal scrollBar", function(assert) {
    var scrollBar = new ScrollBar(this.renderer, this.group);
    //act
    var pos1 = scrollBar.update(this.getOptions({})).getOptions().position,
        pos2 = scrollBar.update(this.getOptions({ position: "top" })).getOptions().position,
        pos3 = scrollBar.update(this.getOptions({ position: "bottom" })).getOptions().position,
        pos4 = scrollBar.update(this.getOptions({ position: "left" })).getOptions().position,
        pos5 = scrollBar.update(this.getOptions({ position: "right" })).getOptions().position,
        pos6 = scrollBar.update(this.getOptions({ position: "invalid" })).getOptions().position;

    //Assert
    assert.strictEqual(pos1, "top");
    assert.strictEqual(pos2, "top");
    assert.strictEqual(pos3, "bottom");
    assert.strictEqual(pos4, "top");
    assert.strictEqual(pos5, "top");
    assert.strictEqual(pos6, "top");
});

QUnit.test("Set position for vertical scrollBar", function(assert) {
    this.options.rotated = true;
    var scrollBar = new ScrollBar(this.renderer, this.group);
    //act
    var pos1 = scrollBar.update(this.getOptions({})).getOptions().position,
        pos2 = scrollBar.update(this.getOptions({ position: "top" })).getOptions().position,
        pos3 = scrollBar.update(this.getOptions({ position: "bottom" })).getOptions().position,
        pos4 = scrollBar.update(this.getOptions({ position: "left" })).getOptions().position,
        pos5 = scrollBar.update(this.getOptions({ position: "right" })).getOptions().position,
        pos6 = scrollBar.update(this.getOptions({ position: "invalid" })).getOptions().position;

    //Assert
    assert.strictEqual(pos1, "right");
    assert.strictEqual(pos2, "right");
    assert.strictEqual(pos3, "right");
    assert.strictEqual(pos4, "left");
    assert.strictEqual(pos5, "right");
    assert.strictEqual(pos6, "right");
});

QUnit.test("setPane", function(assert) {
    var scrollBar = new ScrollBar(this.renderer, this.group);

    var p1 = scrollBar.update(this.getOptions({ position: "top" })).setPane(this.panes).pane,
        p2 = scrollBar.update(this.getOptions({ position: "bottom" })).setPane(this.panes).pane;

    assert.strictEqual(p1, "pane1");
    assert.strictEqual(p2, "pane2");
});

QUnit.test("setPane. Rotated", function(assert) {
    this.options.rotated = true;
    var scrollBar = new ScrollBar(this.renderer, this.group);

    var p1 = scrollBar.update(this.getOptions({ position: "left" })).setPane(this.panes).pane,
        p2 = scrollBar.update(this.getOptions({ position: "right" })).setPane(this.panes).pane;

    assert.strictEqual(p1, "pane1");
    assert.strictEqual(p2, "pane2");
});

QUnit.test("getMargins", function(assert) {
    var scrollBar = new ScrollBar(this.renderer, this.group),
        pane = {
            name: "testPane"
        };
    var b1 = scrollBar.update(this.getOptions({ position: "top" })).setPane([pane]).getMargins(),
        b2 = scrollBar.update(this.getOptions({ position: "bottom" })).setPane([pane]).getMargins();

    assert.deepEqual(b1, {
        top: 15,
        bottom: 0,
        left: 0,
        right: 0
    }, "top scrollBar");
    assert.deepEqual(b2, {
        top: 0,
        bottom: 15,
        left: 0,
        right: 0
    }, "bottom scrollBar");
});

QUnit.test("getMargins. Rotated", function(assert) {
    this.options.rotated = true;
    var scrollBar = new ScrollBar(this.renderer, this.group),
        pane = {
            name: "testPane"
        };
    var b1 = scrollBar.update(this.getOptions({ position: "right" })).setPane([pane]).getMargins(),
        b2 = scrollBar.update(this.getOptions({ position: "left" })).setPane([pane]).getMargins();

    assert.deepEqual(b1, {
        top: 0,
        bottom: 0,
        left: 0,
        right: 15
    }, "top scrollBar");
    assert.deepEqual(b2, {
        top: 0,
        bottom: 0,
        left: 15,
        right: 0
    }, "bottom scrollBar");
});

QUnit.test("UpdateSize", function(assert) {
    var scrollBar = new ScrollBar(this.renderer, this.group);

    scrollBar.update(this.getOptions({ position: "top" })).setPane(this.panes).updateSize(this.panes[0].canvas);
    scrollBar.update(this.getOptions({ position: "bottom" })).setPane(this.panes).updateSize(this.panes[1].canvas);

    assert.deepEqual(this.group.children[0].attr.getCall(1).args, [{
        translateX: 0,
        translateY: 95
    }], "top scrollBar");

    assert.deepEqual(this.group.children[0].attr.getCall(3).args, [{
        translateX: 0,
        translateY: 465
    }], "top scrollBar");
});

QUnit.test("Apply layout. Rotated", function(assert) {
    this.options.rotated = true;
    var scrollBar = new ScrollBar(this.renderer, this.group);

    scrollBar.update(this.getOptions({ position: "right" })).setPane(this.panes).updateSize(this.panes[1].canvas);
    scrollBar.update(this.getOptions({ position: "left" })).setPane(this.panes).updateSize(this.panes[0].canvas);

    assert.deepEqual(this.group.children[0].attr.getCall(1).args, [{
        translateX: 10,
        translateY: 0
    }], "right scrollBar");

    assert.deepEqual(this.group.children[0].attr.getCall(3).args, [{
        translateX: -5,
        translateY: 0
    }], "left scrollBar");
});

QUnit.test("getMultipleAxesSpacing", function(assert) {
    this.options.rotated = true;
    var scrollBar = new ScrollBar(this.renderer, this.group),
        //act
        res = scrollBar.getMultipleAxesSpacing();

    assert.strictEqual(res, 0);
});
