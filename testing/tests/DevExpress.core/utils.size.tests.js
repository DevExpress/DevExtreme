"use strict";

var $ = require("jquery");
var sizeUtils = require("core/utils/size");

var testStyles = [
    "",
    "width: 40px; height: 50px;",
    "width: 50%; height: 50%;",
    "width: inherit; height: inherit;",
    "width: auto; height: auto;"
];

QUnit.module("get width and height", {
    beforeEach: function() {
        this.$parent = $("<div style='width: 100px; height: 110px'></div>").appendTo("#qunit-fixture");
        this.$element = $("<div/>");
        this.$parent.append(this.$element);
    },

    afterEach: function() {
    }
});

QUnit.test("element in parent with fixed size", function(assert) {
    var expected = [
        { width: 100, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 100, height: 0 }
    ];

    for(var i = 0; i < testStyles.length; i++) {
        this.$element.attr("style", testStyles[i]);
        assert.equal(sizeUtils.getSize(this.$element[0], "width", {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], "height", {}), expected[i].height);
    }
});

QUnit.test("invisible element in parent with fixed size", function(assert) {
    var that = this;

    var testParams = [{
        style: "display: none;",
        width: 0,
        height: 0
    }, {
        style: "width: 40px; height: 50px; display: none;",
        width: 40,
        height: 50
    }, {
        style: "width: inherit; height: inherit; display: none;",
        width: 100,
        height: 110
    }, {
        style: "width: auto; height: auto; display: none;",
        width: 0,
        height: 0
    }];

    testParams.forEach(function(params) {
        that.$element.attr("style", params.style);
        assert.equal(sizeUtils.getSize(that.$element[0], "width", {}), params.width);
        assert.equal(sizeUtils.getSize(that.$element[0], "height", {}), params.height);
    });
});

QUnit.test("element with padding, marging, border without params", function(assert) {
    var expected, i;

    expected = [
        { width: 80, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 80, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        this.$element.attr("style", testStyles[i] + " padding: 10px;");
        assert.equal(sizeUtils.getSize(this.$element[0], "width", {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], "height", {}), expected[i].height);

        this.$element.attr("style", testStyles[i] + " margin: 10px;");
        assert.equal(sizeUtils.getSize(this.$element[0], "width", {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], "height", {}), expected[i].height);
    }

    expected = [
        { width: 96, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 96, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        this.$element.attr("style", testStyles[i] + " border: 2px solid black;");
        assert.equal(sizeUtils.getSize(this.$element[0], "width", {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], "height", {}), expected[i].height);
    }
});

QUnit.test("element with padding, marging, border with params", function(assert) {
    this.$element.attr("style", "width: 40px; height: 50px; padding: 5px; margin: 10px; border: 2px solid black;");

    assert.equal(sizeUtils.getSize(this.$element[0], "width", {}), 40);
    assert.equal(sizeUtils.getSize(this.$element[0], "height", {}), 50);

    assert.equal(sizeUtils.getSize(this.$element[0], "width", { paddings: true }), 50);
    assert.equal(sizeUtils.getSize(this.$element[0], "height", { paddings: true }), 60);

    assert.equal(sizeUtils.getSize(this.$element[0], "width", { borders: true }), 44);
    assert.equal(sizeUtils.getSize(this.$element[0], "height", { borders: true }), 54);

    assert.equal(sizeUtils.getSize(this.$element[0], "width", { borders: true, margins: true }), 64);
    assert.equal(sizeUtils.getSize(this.$element[0], "height", { borders: true, margins: true }), 74);

    assert.equal(sizeUtils.getSize(this.$element[0], "width", { paddings: true, borders: true, margins: true }), 74);
    assert.equal(sizeUtils.getSize(this.$element[0], "height", { paddings: true, borders: true, margins: true }), 84);
});

QUnit.test("element with box-sizing = border-box", function(assert) {
    var expected, i;

    expected = [
        { width: 100, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 100, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        this.$element.attr("style", testStyles[i] + " box-sizing: border-box;");
        assert.equal(sizeUtils.getSize(this.$element[0], "width", {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], "height", {}), expected[i].height);
    }

    expected = [
        { width: 80, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 55 },
        { width: 100, height: 110 },
        { width: 80, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        this.$element.attr("style", testStyles[i] + " margin: 10px; box-sizing: border-box;");
        assert.equal(sizeUtils.getSize(this.$element[0], "width", {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], "height", {}), expected[i].height);
    }

    expected = [
        { width: 80, height: 0 },
        { width: 20, height: 30 },
        { width: 30, height: 35 },
        { width: 80, height: 90 },
        { width: 80, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        this.$element.attr("style", testStyles[i] + " padding: 10px; box-sizing: border-box;");
        assert.equal(sizeUtils.getSize(this.$element[0], "width", {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], "height", {}), expected[i].height);
    }

    expected = [
        { width: 96, height: 0 },
        { width: 36, height: 46 },
        { width: 46, height: 51 },
        { width: 96, height: 106 },
        { width: 96, height: 0 }
    ];

    for(i = 0; i < testStyles.length; i++) {
        this.$element.attr("style", testStyles[i] + " border: 2px solid black; box-sizing: border-box;");
        assert.equal(sizeUtils.getSize(this.$element[0], "width", {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$element[0], "height", {}), expected[i].height);
    }
});

QUnit.test("element with box-sizing = border-box and parent is invisible", function(assert) {
    this.$parent.attr("style", "width: 100px; height: 110px; display: none;");
    this.$element.attr("style", "width: 100%; height: 100%; box-sizing: border-box;");
    assert.equal(sizeUtils.getSize(this.$element[0], "width", {}), 100);
    assert.equal(sizeUtils.getSize(this.$element[0], "height", {}), 100);

    this.$parent.attr("style", "width: 100px; height: 110px; display: none;");
    this.$element.attr("style", "width: 100%; height: 100%; padding: 10px; box-sizing: border-box;");
    assert.equal(sizeUtils.getSize(this.$element[0], "width", {}), 100);
    assert.equal(sizeUtils.getSize(this.$element[0], "height", {}), 100);

    this.$parent.attr("style", "width: 100px; height: 110px; display: none;");
    this.$element.attr("style", "width: 40px; height: 50px; padding: 10px; box-sizing: border-box;");
    assert.equal(sizeUtils.getSize(this.$element[0], "width", {}), 20);
    assert.equal(sizeUtils.getSize(this.$element[0], "height", {}), 30);
});

QUnit.test("element is not in a DOM", function(assert) {
    this.$freeElement = $("<div/>");

    var expected = [
        { width: 0, height: 0 },
        { width: 40, height: 50 },
        { width: 50, height: 50 },
        { width: 0, height: 0 },
        { width: 0, height: 0 }
    ];

    for(var i = 0; i < testStyles.length; i++) {
        this.$freeElement.attr("style", testStyles[i]);
        assert.equal(sizeUtils.getSize(this.$freeElement[0], "width", {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$freeElement[0], "height", {}), expected[i].height);

        this.$freeElement.attr("style", testStyles[i] + " display: none;");
        assert.equal(sizeUtils.getSize(this.$freeElement[0], "width", {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$freeElement[0], "height", {}), expected[i].height);

        this.$freeElement.attr("style", testStyles[i] + " box-sizing: border-box;");
        assert.equal(sizeUtils.getSize(this.$freeElement[0], "width", {}), expected[i].width);
        assert.equal(sizeUtils.getSize(this.$freeElement[0], "height", {}), expected[i].height);
    }
});


QUnit.module("getBorderAdjustment", {
    beforeEach: function() {
        this.$parent = $("<div style='width: 100px; height: 110px'></div>").appendTo("#qunit-fixture");
        this.$element = $("<div/>");
        this.$parent.append(this.$element);
    },

    afterEach: function() {
    }
});

QUnit.test("element in parent with fixed size", function(assert) {
    this.$element.attr("style", "width: 40px; height: 50px; border: 1px solid black;");
    assert.equal(sizeUtils.getBorderAdjustment(this.$element[0], "width"), 2);
    assert.equal(sizeUtils.getBorderAdjustment(this.$element[0], "heigth"), 2);

    this.$element.attr("style", "width: 40px; height: 50px; border-left: 2px solid black; border-top: 3px solid black;");
    assert.equal(sizeUtils.getBorderAdjustment(this.$element[0], "width"), 2);
    assert.equal(sizeUtils.getBorderAdjustment(this.$element[0], "heigth"), 3);
});

QUnit.test("element with box-sizing = border-box", function(assert) {
    this.$element.attr("style", "width: 40px; height: 50px; border: 1px solid black; box-sizing: border-box;");
    assert.equal(sizeUtils.getBorderAdjustment(this.$element[0], "width"), 0);
    assert.equal(sizeUtils.getBorderAdjustment(this.$element[0], "heigth"), 0);
});
