"use strict";

var $ = require("jquery");

require("../../helpers/vizMocks.js");

/* global
    horizontalCategoryStart,
    horizontalCategoryDelta,
    createHorizontalAxis,
    verticalStart,
    categoriesHorizontalTranslatorDataX,
    categoriesHorizontalTranslatorDataY,
    categories,
    checkTextSpecial,
    createVerticalAxis,
    renderer
*/
require("../../helpers/chartMocks.js");

function getAxisOptions(options) {
    return $.extend(true, {}, {
        minorTick: {},
        minorGrid: {},
        label: {
            overlappingBehavior: {},
            visible: true
        },
        axisType: "xyAxes",
        drawingType: "linear"
    }, options || {});
}

QUnit.module("Overlapping mode", {
    beforeEach: function() {
        this.horizontalTranslatorDataX = { translate: {}, specialCases: { "canvas_position_left": 0, "canvas_position_right": 200, "canvas_position_start": 0, "canvas_position_end": 200 } };
        this.horizontalTranslatorDataY = { translate: {}, specialCases: {} };
        this.verticalTranslatorDataX = { translate: {}, specialCases: {} };
        this.verticalTranslatorDataY = { translate: {}, specialCases: { "canvas_position_bottom": 200, "canvas_position_top": 0, "canvas_position_end": 0, "canvas_position_start": 200 } };
        this.categories = ["First", "Second", "Third", "Fourth"];
    }
});

QUnit.test("Horizontal Axis Labels Rotate", function(assert) {
    //arrange
    var
        start = horizontalCategoryStart,
        delta = horizontalCategoryDelta,
        //we put label on the top side of top-placed axis by default
        textY = verticalStart + 10,
        axis = createHorizontalAxis(categoriesHorizontalTranslatorDataX, categoriesHorizontalTranslatorDataY,
            getAxisOptions({
                categories: categories,
                label: {
                    overlappingBehavior: {
                        mode: "rotate",
                        rotationAngle: 45
                    }
                }
            }));
    axis._axisElementsGroup = renderer.g();
    renderer.stub("text");
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(renderer.text.callCount, 5, "number of rendered labels");

    var checkText = function(i) {

        checkTextSpecial(i,
            categories[i - 1],
            start + delta * (i - 1),
            textY,
            {
                align: "left",
                rotate: 45
            });
    };
    checkText(1);
    checkText(2);
    checkText(3);
    checkText(4);
});

//
QUnit.test("Horizontal Axis Labels Rotate with userAlignment", function(assert) {
    //arrange
    var
        start = horizontalCategoryStart,
        delta = horizontalCategoryDelta,
        //we put label on the top side of top-placed axis by default
        textY = verticalStart + 10,
        axis = createHorizontalAxis(categoriesHorizontalTranslatorDataX, categoriesHorizontalTranslatorDataY,
            getAxisOptions({
                categories: categories,
                label: {
                    overlappingBehavior: {
                        rotationAngle: 45,
                        mode: "rotate"
                    },
                    alignment: "right",
                    userAlignment: true
                }
            }));
    axis._axisElementsGroup = renderer.g();
    renderer.stub("text");
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(renderer.text.callCount, 5, "number of rendered labels");

    var checkText = function(i) {

        checkTextSpecial(i,
            categories[i - 1],
            start + delta * (i - 1),
            textY,
            {
                align: "right",
                rotate: 45
            });
    };
    checkText(1);
    checkText(2);
    checkText(3);
    checkText(4);
});

QUnit.test("enlargeTickInterval mode for horizontal axis", function(assert) {
    //arrange
    var axis = createHorizontalAxis(this.horizontalTranslatorDataX, this.horizontalTranslatorDataY, getAxisOptions({
        axisType: "xyAxes",
        drawingType: "linear",
        min: 0,
        max: 100,
        tickInterval: 20,
        label: {
            overlappingBehavior: { mode: "enlargeTickInterval" }
        }
    }));
    axis._axisElementsGroup = renderer.g();
    renderer.stub("text");
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.ok(!axis._textOptions.rotationAngle, "rotationAngle");
    assert.equal(axis._majorTicks.length, 5, "labels length");
    assert.equal(axis._majorTicks[0].label._stored_settings.text, "0", "label 1");
    assert.equal(axis._majorTicks[1].label._stored_settings.text, "30", "label 2");
    assert.equal(axis._majorTicks[2].label._stored_settings.text, "60", "label 3");
    assert.equal(axis._majorTicks[3].label._stored_settings.text, "90", "label 4");
    assert.equal(axis._majorTicks[4].label._stored_settings.text, "120", "label 5");
});

QUnit.test("enlargeTickInterval mode for horizontal axis after setTickValues", function(assert) {
    //arrange
    var axis = createHorizontalAxis(this.horizontalTranslatorDataX, this.horizontalTranslatorDataY, getAxisOptions({
        label: {
            overlappingBehavior: { mode: "enlargeTickInterval" }
        }
    }));
    axis.setTicks({ majorTicks: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100] });
    //act
    var tickValues = axis.getMajorTicks();
    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, 2, "arrangement step");

    assert.deepEqual(tickValues, $.map([0, 20, 40, 60, 80, 100], function(item) { return { value: item }; }));
});

QUnit.test("enlargeTickInterval mode for vertical axis is not applied", function(assert) {
    //arrange
    var axis = createVerticalAxis(this.verticalTranslatorDataY, this.verticalTranslatorDataX, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 5,
        label: {
            rotationAngle: 46,
            overlappingBehavior: { mode: "enlargeTickInterval" }
        }
    }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, 1, "useTicksAutoArrangement");
    assert.ok(!axis._textOptions.rotationAngle, "rotationAngle");
    assert.equal(axis._majorTicks.length, 6, "labels length");
});

QUnit.test("Categories - enlargeTickInterval mode for horizontal axis", function(assert) {
    //arrange
    var axis = createHorizontalAxis({
        translate: {
            "First": 50,
            "Second": 60,
            "Third": 70,
            "Fourth": 80
        },
        specialCases: {
            "canvas_position_default": 40,
            "canvas_position_start": 40,
            "canvas_position_center": 100,
            "canvas_position_end": 60
        },
        interval: horizontalCategoryDelta
    }, {
        translate: {},
        specialCases: {}
    },
        getAxisOptions({
            categories: this.categories,
            label: {
                overlappingBehavior: { mode: "enlargeTickInterval" }
            }
        }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, 3, "useTicksAutoArrangement");
    assert.equal(axis._majorTicks.length, 2, "labels length");
    assert.equal(axis._majorTicks[0].label._stored_settings.text, "First", "label 1");
    assert.equal(axis._majorTicks[1].label._stored_settings.text, "Fourth", "label 2");
});

QUnit.test("Categories - enlargeTickInterval mode for horizontal axis single tick", function(assert) {
    //arrange
    var axis = createHorizontalAxis({
        translate: { "First": 50 },
        specialCases: {
            "canvas_position_default": 40,
            "canvas_position_start": 40,
            "canvas_position_center": 100,
            "canvas_position_end": 160
        },
        interval: horizontalCategoryDelta
    }, {
        translate: {},
        specialCases: {}
    },
        getAxisOptions({
            categories: ["First"],
            label: {
                overlappingBehavior: { mode: "enlargeTickInterval" }
            }
        }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(!axis._tickManager._appliedArrangementStep, false, "useTicksAutoArrangement");
    assert.equal(axis._majorTicks.length, 1, "labels length");
    assert.equal(axis._majorTicks[0].label._stored_settings.text, "First", "label 1");
});

QUnit.test("Categories - enlargeTickInterval mode for horizontal axis without margin", function(assert) {
    //arrange
    var axis = createHorizontalAxis({
        translate: {
            "First": 10,
            "Second": 20,
            "Third": 30,
            "Fourth": 40
        },
        specialCases: {
            "canvas_position_default": 0,
            "canvas_position_start": 0,
            "canvas_position_center": 25,
            "canvas_position_end": 20
        },
        interval: horizontalCategoryDelta
    }, {
        translate: {},
        specialCases: {}
    },
        getAxisOptions({
            categories: this.categories,
            label: {
                overlappingBehavior: { mode: "enlargeTickInterval" }
            }
        }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, 3, "useTicksAutoArrangement");
    assert.equal(axis._majorTicks.length, 2, "labels length");
    assert.equal(axis._majorTicks[0].label._stored_settings.text, "First", "label 1");
    assert.equal(axis._majorTicks[1].label._stored_settings.text, "Fourth", "label 2");
});

QUnit.test("Categories - enlargeTickInterval mode for horizontal axis", function(assert) {
    //arrange
    var axis = createHorizontalAxis({
        translate: {
            "First": 10,
            "Second": 35,
            "Third": 50,
            "Fourth": 75
        },
        specialCases: {
            "canvas_position_default": 0,
            "canvas_position_start": 0,
            "canvas_position_center": 50,
            "canvas_position_end": 30
        },
        interval: horizontalCategoryDelta
    }, {
        translate: {},
        specialCases: {}
    },
        getAxisOptions({
            categories: this.categories,
            label: {
                overlappingBehavior: { mode: "enlargeTickInterval" }
            }
        }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, 2, "useTicksAutoArrangement");
    assert.equal(axis._majorTicks.length, 2, "labels length");
    assert.equal(axis._majorTicks[0].label._stored_settings.text, "First", "label 1");
    assert.equal(axis._majorTicks[1].label._stored_settings.text, "Third", "label 2");
});

QUnit.test("Categories - enlargeTickInterval mode for horizontal inverted axis", function(assert) {
    //arrange
    var axis = createHorizontalAxis({
        translate: {
            "First": 75,
            "Second": 50,
            "Third": 25,
            "Fourth": 10
        },
        specialCases: {
            "canvas_position_default": 0,
            "canvas_position_start": 0,
            "canvas_position_center": 50,
            "canvas_position_end": 30
        },
        interval: horizontalCategoryDelta
    }, {
        translate: {},
        specialCases: {}
    },
        getAxisOptions({
            categories: this.categories,
            label: {
                overlappingBehavior: { mode: "enlargeTickInterval" }
            }
        }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, 2, "useTicksAutoArrangement");
    assert.equal(axis._majorTicks.length, 2, "labels length");
    assert.equal(axis._majorTicks[0].label._stored_settings.text, "First", "label 1");
    assert.equal(axis._majorTicks[1].label._stored_settings.text, "Third", "label 2");
});

QUnit.test("Categories - enlargeTickInterval mode for horizontal axis with single category", function(assert) {
    //arrange
    var axis = createHorizontalAxis({
        translate: {
            "First": 10
        },
        specialCases: {
            "canvas_position_default": 0,
            "canvas_position_start": 0,
            "canvas_position_center": 50,
            "canvas_position_end": 100
        },
        interval: horizontalCategoryDelta
    }, {
        translate: {},
        specialCases: {}
    },
        getAxisOptions({
            categories: ["First"],
            label: {
                overlappingBehavior: { mode: "enlargeTickInterval" }
            }
        }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, 1, "useTicksAutoArrangement");
    assert.equal(axis._majorTicks.length, 1, "labels length");
    assert.equal(axis._majorTicks[0].label._stored_settings.text, "First", "label 1");
});

QUnit.test("Categories - staggered mode for horizontal axis", function(assert) {
    //arrange
    var axis = createHorizontalAxis({
        translate: {
            "First": 10,
            "Second": 35,
            "Third": 50,
            "Fourth": 75
        },
        specialCases: {
            "canvas_position_default": 0,
            "canvas_position_start": 0,
            "canvas_position_center": 50,
            "canvas_position_end": 100
        },
        interval: horizontalCategoryDelta
    }, {
        translate: {},
        specialCases: {}
    },
        getAxisOptions({
            categories: this.categories,
            label: {
                overlappingBehavior: { mode: "stagger" }
            }
        }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, 1, "useTicksAutoArrangement");
    assert.equal(axis._majorTicks.length, 4, "labels length");
    assert.equal(axis._majorTicks[0].label._stored_settings.text, "First", "label 1");
    assert.equal(axis._majorTicks[1].label._stored_settings.text, "Second", "label 2");
});

QUnit.test("Categories - staggered mode for horizontal axis", function(assert) {
    //arrange
    var axis = createHorizontalAxis({
        translate: {
            "First": 10,
            "Second": 20,
            "Third": 30,
            "Fourth": 40
        },
        specialCases: {
            "canvas_position_default": 0,
            "canvas_position_start": 0,
            "canvas_position_center": 25,
            "canvas_position_end": 30
        },
        interval: horizontalCategoryDelta
    }, {
        translate: {},
        specialCases: {}
    },
        getAxisOptions({
            categories: this.categories,
            label: {
                overlappingBehavior: { mode: "stagger" }
            }
        }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, 2, "useTicksAutoArrangement");
    assert.equal(axis._majorTicks.length, 2, "labels length");
    assert.equal(axis._majorTicks[0].label._stored_settings.text, "First", "label 1");
    assert.equal(axis._majorTicks[1].label._stored_settings.text, "Third", "label 2");
});

QUnit.test("Categories - enlargeTickInterval mode is not used for vertical axis", function(assert) {
    //arrange
    var axis = createVerticalAxis({
        translate: {
            "First": 10,
            "Second": 20,
            "Third": 30,
            "Fourth": 40
        },
        specialCases: {
            "canvas_position_default": 0,
            "canvas_position_start": 0,
            "canvas_position_center": 25,
            "canvas_position_end": 50
        }
    },
        {
            translate: {},
            specialCases: {},
            interval: horizontalCategoryDelta
        },
        getAxisOptions({
            categories: this.categories,
            label: {
                overlappingBehavior: { mode: "enlargeTickInterval" }
            }
        }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, 1, "useTicksAutoArrangement");
    assert.equal(axis._majorTicks.length, 4, "labels length");
    assert.equal(axis._majorTicks[0].label._stored_settings.text, "First", "label 1");
    assert.equal(axis._majorTicks[1].label._stored_settings.text, "Second", "label 2");
    assert.equal(axis._majorTicks[2].label._stored_settings.text, "Third", "label 3");
    assert.equal(axis._majorTicks[3].label._stored_settings.text, "Fourth", "label 4");
});

QUnit.test("Ignore mode", function(assert) {
    var options = {
            min: 0,
            max: 100,
            type: "numeric",
            label: {
                overlappingBehavior: {
                    mode: "ignore",
                    rotationAngle: 45,
                    staggeringSpacing: 34
                }
            }
        },
        axis = createHorizontalAxis(this.horizontalTranslatorDataX, this.horizontalTranslatorDataY, getAxisOptions(options));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.ok(!axis._textOptions.rotate, "rotationAngle");
    assert.equal(axis._textOptions.align, "center", "alignment");
    assert.equal(axis._tickManager._appliedArrangementStep, undefined, "useTicksAutoArrangement");
});

QUnit.test("Rotate mode with overlappingBehavior.rotationAngle", function(assert) {
    var axis = createHorizontalAxis(this.horizontalTranslatorDataX, this.horizontalTranslatorDataY, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        label: {
            rotationAngle: 0,
            overlappingBehavior: {
                mode: "rotate",
                rotationAngle: 64
            }
        }
    }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(!axis._tickManager._appliedArrangementStep, false, "useTicksAutoArrangement");
    assert.equal(axis._textOptions.rotate, 64, "textOptions rotate");
    assert.equal(axis._textOptions.align, "left", "alignment");
    assert.equal(axis._tickManager._ticks.length, 11);
});

QUnit.test("Rotate mode with overlappingBehavior.rotationAngle. Angle is negative. T441042", function(assert) {
    var axis = createHorizontalAxis(this.horizontalTranslatorDataX, this.horizontalTranslatorDataY, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        label: {
            rotationAngle: 0,
            overlappingBehavior: {
                mode: "rotate",
                rotationAngle: -64
            }
        }
    }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(!axis._tickManager._appliedArrangementStep, false, "useTicksAutoArrangement");
    assert.equal(axis._textOptions.rotate, -64, "textOptions rotate");
    assert.equal(axis._textOptions.align, "left", "alignment");
    assert.equal(axis._tickManager._ticks.length, 11);
});

QUnit.test("Rotate angle with overlappingBehavior mode stagger", function(assert) {
    var axis = createHorizontalAxis(this.horizontalTranslatorDataX, this.horizontalTranslatorDataY, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        label: {
            overlappingBehavior: {
                mode: "stagger",
                rotationAngle: 64
            }
        }
    }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(!axis._tickManager._appliedArrangementStep, false, "useTicksAutoArrangement");
    assert.ok(!axis._textOptions.rotate, "textOptions rotate");
    assert.equal(axis._textOptions.align, "center", "alignment");
});

QUnit.test("Rotate angle with overlappingBehavior mode enlargeTickInterval", function(assert) {
    var axis = createHorizontalAxis(this.horizontalTranslatorDataX, this.horizontalTranslatorDataY, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        label: {
            overlappingBehavior: {
                mode: "enlargeTickInterval",
                rotationAngle: 64
            }
        }
    }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis.getMajorTicks().length, 5, "labels length");
    assert.ok(!axis._textOptions.rotate, "textOptions rotate");
    assert.equal(axis._textOptions.align, "center", "alignment");
});

QUnit.test("Stagger mode with overlappingBehavior.staggeringSpacing", function(assert) {
    var axis = createHorizontalAxis(this.horizontalTranslatorDataX, this.horizontalTranslatorDataY, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        marker: {},
        label: {
            overlappingBehavior: {
                mode: "stagger",
                staggeringSpacing: 30
            }
        }
    }));
    axis._stripsGroup = renderer.g();
    axis._constantLinesGroup = renderer.g();
    axis._axesContainerGroup = renderer.g();
    axis._labelAxesGroup = renderer.g();
    axis._gridContainerGroup = renderer.g();

    //act
    axis.draw(axis, {});

    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, 1, "useTicksAutoArrangement");
    assert.ok(!axis._majorTicks[0].label.stub("move").called, "label 1 is not moved");
    assert.equal(axis._majorTicks[0].label.rotate.firstCall.args[0], 0, "rotate for Label 1");
    assert.equal(axis._majorTicks[1].label.move.firstCall.args[1], 40, "label 2 is moved to 40 by vertical");
    assert.equal(axis._majorTicks[1].label.rotate.firstCall.args[0], 0, "rotate for Label 2");
    assert.equal(axis._textOptions.align, "center", "alignment");
});

QUnit.test("Stagger overlapping mode when axis is vertical", function(assert) {
    var axis = createVerticalAxis(this.verticalTranslatorDataY, this.verticalTranslatorDataX, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        label: {
            overlappingBehavior: {
                mode: "stagger",
                staggeringSpacing: 30
            }
        }
    }));
    //act
    axis.getMajorTicks();

    //assert
    assert.ok(axis._tickManager._appliedArrangementStep, 1, "useTicksAutoArrangement");
    assert.equal(axis._tickManager._options.overlappingBehavior.mode, "enlargeTickInterval", "overlapping mode");
});

QUnit.test("Rotate overlapping mode when axis is vertical", function(assert) {
    var axis = createVerticalAxis(this.verticalTranslatorDataY, this.verticalTranslatorDataX, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        label: {
            overlappingBehavior: {
                mode: "rotate",
                staggeringSpacing: 30
            }
        }
    }));
    //act
    axis.getMajorTicks();

    //assert
    assert.ok(axis._tickManager._appliedArrangementStep, 1, "useTicksAutoArrangement");
    assert.equal(axis._tickManager._options.overlappingBehavior.mode, "enlargeTickInterval", "overlapping mode");
});

QUnit.test("Auto overlapping mode when axis is vertical", function(assert) {
    var axis = createVerticalAxis(this.verticalTranslatorDataY, this.verticalTranslatorDataX, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        label: {
            overlappingBehavior: {
                mode: "auto",
                staggeringSpacing: 30
            }
        }
    }));
    //act
    axis.getMajorTicks();

    //assert
    assert.ok(axis._tickManager._appliedArrangementStep, "useTicksAutoArrangement");
    assert.equal(axis._tickManager._options.overlappingBehavior.mode, "enlargeTickInterval", "overlapping mode");
});

QUnit.test("Ignore overlapping mode when axis is vertical", function(assert) {
    var axis = createVerticalAxis(this.verticalTranslatorDataY, this.verticalTranslatorDataX, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        label: {
            overlappingBehavior: {
                mode: "ignore",
                staggeringSpacing: 30
            }
        }
    }));
    //act
    axis.getMajorTicks();

    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, undefined, "useTicksAutoArrangement");
    assert.equal(axis._tickManager._options.overlappingBehavior.mode, "ignore", "overlapping mode");
});

QUnit.test("EnlargeTickInterval overlapping mode when axis is vertical", function(assert) {
    var axis = createVerticalAxis(this.verticalTranslatorDataY, this.verticalTranslatorDataX, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        label: {
            overlappingBehavior: {
                mode: "enlargeTickInterval",
                staggeringSpacing: 30
            }
        }
    }));
    //act
    axis.getMajorTicks();

    //assert
    assert.equal(axis._tickManager._appliedArrangementStep, 1, "useTicksAutoArrangement");
    assert.equal(axis._tickManager._options.overlappingBehavior.mode, "enlargeTickInterval", "overlapping mode");
});

QUnit.test("Rotate mode. Angle is small, width of tick is taken into account", function(assert) {
    var axis = createHorizontalAxis(this.horizontalTranslatorDataX, this.horizontalTranslatorDataY, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        label: {
            overlappingBehavior: {
                mode: "rotate",
                rotationAngle: 20
            }
        }
    }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis._textOptions.rotate, 20, "textOptions rotate");
    assert.equal(axis._textOptions.align, "left", "alignment");
    assert.equal(axis._tickManager._ticks.length, 6);
});

QUnit.test("Rotate mode. Angle is 180, width of tick is taken into account. T441042", function(assert) {
    var axis = createHorizontalAxis(this.horizontalTranslatorDataX, this.horizontalTranslatorDataY, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        label: {
            overlappingBehavior: {
                mode: "rotate",
                rotationAngle: 180
            }
        }
    }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis._textOptions.rotate, 180, "textOptions rotate");
    assert.equal(axis._textOptions.align, "left", "alignment");
    assert.equal(axis._tickManager._ticks.length, 6);
});

QUnit.test("Rotate mode. Angle is 90, width of tick is taken into account. T441042", function(assert) {
    var axis = createHorizontalAxis(this.horizontalTranslatorDataX, this.horizontalTranslatorDataY, getAxisOptions({
        min: 0,
        max: 100,
        tickInterval: 1,
        label: {
            overlappingBehavior: {
                mode: "rotate",
                rotationAngle: 90
            }
        }
    }));
    axis._axisElementsGroup = renderer.g();
    //act
    axis._initAllTicks();
    axis._drawLabels();
    //assert
    assert.equal(axis._textOptions.rotate, 90, "textOptions rotate");
    assert.equal(axis._textOptions.align, "left", "alignment");
    assert.equal(axis._tickManager._ticks.length, 11);
});
