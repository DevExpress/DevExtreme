import $ from "jquery";
import browser from "core/utils/browser";
import { QUnitTestIfSupported, checkScrollableSizes, nativeVScrollBarWidth } from '../../../helpers/scrollableTestsHelper.js';

import "ui/scroll_view/ui.scrollable";
import "ui/box";
import "ui/responsive_box";

import "common.css!";

const SCROLLABLE_ID = "my_scrollable";
const PLACEMENT_STANDALONE = "standalone";
const PLACEMENT_INSIDE_BOX = "insideBox";
const PLACEMENT_INSIDE_RESPONSIVE_BOX = "insideResponsiveBox";

function appendScrollableTo(appendTo, id, nestedElementWidth, nestedElementHeight, useNativeScrolling, width, height) {
    const $scrollable = $(`
        <div id="${id}" style="background-color: orange">
            <div style="width: ${nestedElementWidth}px; height: ${nestedElementHeight}px; background-color: green"></div>
        </div>`);

    $(appendTo).append($scrollable);

    const options = { direction: "both", useNative: useNativeScrolling };
    if(width && height) {
        options.width = width;
        options.height = height;
    }
    $scrollable.dxScrollable(options);
}

QUnit.module("Size of one scrollable standalone/inside Box/inside ResponsiveBox", {
    beforeEach: function() {
        this.$container = $(`<div style="background-color: blue"></div>`);
        $("#qunit-fixture").append(this.$container);
    },
    afterEach: function() {
        this.$container.remove();
    }
},
() => {
    [false, true].forEach(useNativeScrolling => {
        [PLACEMENT_STANDALONE, PLACEMENT_INSIDE_BOX, PLACEMENT_INSIDE_RESPONSIVE_BOX].forEach(placement => {

            const testContext = `[useNativeScroller: ${useNativeScrolling}, placement: ${placement}]`;
            const scrollBarWidth = useNativeScrolling ? nativeVScrollBarWidth : 0;

            function appendOneScrollable($appendTo, { id, width, height, nestedElementWidth, nestedElementHeight }) {
                if(placement === PLACEMENT_INSIDE_RESPONSIVE_BOX) {
                    $appendTo.dxResponsiveBox({
                        width,
                        height,
                        dataSource: [{
                            location: { row: 0, col: 0 },
                            template: function(data, index, element) {
                                appendScrollableTo(element, id, nestedElementWidth, nestedElementHeight, useNativeScrolling);
                            }
                        }]
                    });
                } else if(placement === PLACEMENT_INSIDE_BOX) {
                    $appendTo.dxBox({
                        width,
                        height,
                        direction: "row",
                        items: [{ ratio: 1 }],
                        itemTemplate: function(data, index, element) {
                            appendScrollableTo(element, id, nestedElementWidth, nestedElementHeight, useNativeScrolling);
                        }
                    });
                } else if(placement === PLACEMENT_STANDALONE) {
                    appendScrollableTo($appendTo, id, nestedElementWidth, nestedElementHeight, useNativeScrolling, width, height);
                }
            }

            QUnit.test("no content overflow, " + testContext, function(assert) {
                appendOneScrollable(this.$container, {
                    id: SCROLLABLE_ID,
                    width: 150,
                    height: 100,
                    nestedElementWidth: 75,
                    nestedElementHeight: 50
                });

                checkScrollableSizes(assert, this.$container, {
                    id: SCROLLABLE_ID,
                    width: 150,
                    height: 100,
                    containerWidth: 150,
                    containerScrollWidth: 150,
                    containerHeight: 100,
                    containerScrollHeight: 100,
                    nestedElementWidth: 75,
                    nestedElementHeight: 50
                });
            });

            QUnit.test("content overflow_x, " + testContext, function(assert) {
                appendOneScrollable(this.$container, {
                    id: SCROLLABLE_ID,
                    width: 75,
                    height: 100,
                    nestedElementWidth: 150,
                    nestedElementHeight: 50
                });

                checkScrollableSizes(assert, this.$container, {
                    id: SCROLLABLE_ID,
                    width: 75,
                    height: 100,
                    containerWidth: browser.msie ? 75 - scrollBarWidth : 75,
                    containerScrollWidth: 150,
                    containerHeight: 100 - scrollBarWidth,
                    containerScrollHeight: 100 - scrollBarWidth,
                    nestedElementWidth: 150,
                    nestedElementHeight: 50
                });
            });

            QUnit.test("content overflow_x_y, " + testContext, function(assert) {
                appendOneScrollable(this.$container, {
                    id: SCROLLABLE_ID,
                    width: 75,
                    height: 100,
                    nestedElementWidth: 125,
                    nestedElementHeight: 150
                });

                checkScrollableSizes(assert, this.$container, {
                    id: SCROLLABLE_ID,
                    width: 75,
                    height: 100,
                    containerWidth: 75 - scrollBarWidth,
                    containerScrollWidth: 125,
                    containerHeight: 100 - scrollBarWidth,
                    containerScrollHeight: 150,
                    nestedElementWidth: 125,
                    nestedElementHeight: 150
                });
            });

            QUnit.test("content overflow_y, " + testContext, function(assert) {
                appendOneScrollable(this.$container, {
                    id: SCROLLABLE_ID,
                    width: 75,
                    height: 100,
                    nestedElementWidth: 50,
                    nestedElementHeight: 125
                });

                checkScrollableSizes(assert, this.$container, {
                    id: SCROLLABLE_ID,
                    width: 75,
                    height: 100,
                    containerWidth: 75 - scrollBarWidth,
                    containerScrollWidth: 75 - scrollBarWidth,
                    containerHeight: 100,
                    containerScrollHeight: 125,
                    nestedElementWidth: 50,
                    nestedElementHeight: 125
                });
            });
        });
    });
});

QUnit.module("Size of two scrollables inside Box/Responsive", {
    beforeEach: function() {
        this.$container = $(`<div style="background-color: blue"></div>`);
        $("#qunit-fixture").append(this.$container);
    },
    afterEach: function() {
        this.$container.remove();
    }
},
() => {
    [false, true].forEach(useNativeScrolling => {
        [PLACEMENT_INSIDE_BOX, PLACEMENT_INSIDE_RESPONSIVE_BOX].forEach(placement => {
            const TODO_SKIP_BECAUSE_INCORRECT_SIZE_IN_CHROME = (browser.webkit || browser.mozilla) && (placement === PLACEMENT_INSIDE_RESPONSIVE_BOX);

            const testContext = `[useNativeScrolling: ${useNativeScrolling}, placement: ${placement}]`;
            const scrollBarWidth = useNativeScrolling ? nativeVScrollBarWidth : 0;

            function appendToResponsiveBox($responsiveBox, responsiveBoxConfig) {
                responsiveBoxConfig.itemTemplate = function(data, index, element) {
                    appendScrollableTo(element, SCROLLABLE_ID + index, responsiveBoxConfig.nestedElementWidth, responsiveBoxConfig.nestedElementHeight, useNativeScrolling);
                };

                $responsiveBox.dxResponsiveBox(responsiveBoxConfig);
            }

            function appendToBox($box, boxConfig) {
                boxConfig.items = [{ ratio: 1 }, { ratio: 1 }];
                boxConfig.itemTemplate = function(data, index, element) {
                    appendScrollableTo(element, SCROLLABLE_ID + index, boxConfig.nestedElementWidth, boxConfig.nestedElementHeight, useNativeScrolling);
                };

                $box.dxBox(boxConfig);
            }

            QUnit.test("no content overflow - 2 scrollable in row, " + testContext, function(assert) {
                if(placement === PLACEMENT_INSIDE_BOX) {
                    appendToBox(this.$container, {
                        width: 300, height: 100,
                        nestedElementWidth: 75, nestedElementHeight: 50,
                        direction: "row"
                    });
                } else if(placement === PLACEMENT_INSIDE_RESPONSIVE_BOX) {
                    appendToResponsiveBox(this.$container, {
                        width: 300, height: 100,
                        nestedElementWidth: 75, nestedElementHeight: 50,
                        rows: [{ ratio: 1 }],
                        cols: [{ ratio: 1 }, { ratio: 1 }],
                        dataSource: [
                            { location: { row: 0, col: 0 } },
                            { location: { row: 0, col: 1 } }
                        ]
                    });
                }

                [0, 1].forEach(index => checkScrollableSizes(assert, this.$container, {
                    id: SCROLLABLE_ID + index,
                    width: 150,
                    height: 100,
                    containerWidth: 150,
                    containerScrollWidth: 150,
                    containerHeight: 100,
                    containerScrollHeight: 100,
                    nestedElementWidth: 75,
                    nestedElementHeight: 50
                }));
            });

            QUnit.test("no content overflow - 2 scrollable in col, " + testContext, function(assert) {
                if(placement === PLACEMENT_INSIDE_BOX) {
                    appendToBox(this.$container, {
                        width: 100, height: 300,
                        nestedElementWidth: 50, nestedElementHeight: 75,
                        direction: "col"
                    });
                } else {
                    appendToResponsiveBox(this.$container, {
                        width: 100, height: 300,
                        nestedElementWidth: 50, nestedElementHeight: 75,
                        rows: [{ ratio: 1 }, { ratio: 1 }],
                        cols: [{ ratio: 1 }],
                        dataSource: [
                            { location: { row: 0, col: 0 } },
                            { location: { row: 1, col: 0 } }
                        ]
                    });
                }

                [0, 1].forEach(index => checkScrollableSizes(assert, this.$container, {
                    id: SCROLLABLE_ID + index,
                    width: 100,
                    height: 150,
                    containerWidth: 100,
                    containerScrollWidth: 100,
                    containerHeight: 150,
                    containerScrollHeight: 150,
                    nestedElementWidth: 50,
                    nestedElementHeight: 75
                }));
            });

            QUnitTestIfSupported("content overflow_x - 2 scrollable in row, " + testContext, !TODO_SKIP_BECAUSE_INCORRECT_SIZE_IN_CHROME, function(assert) {
                if(placement === PLACEMENT_INSIDE_BOX) {
                    appendToBox(this.$container, {
                        width: 150, height: 100,
                        nestedElementWidth: 125, nestedElementHeight: 50,
                        direction: "row"
                    });
                } else {
                    appendToResponsiveBox(this.$container, {
                        width: 150, height: 100,
                        nestedElementWidth: 125, nestedElementHeight: 50,
                        rows: [{ ratio: 1 }],
                        cols: [{ ratio: 1 }, { ratio: 1 }],
                        dataSource: [
                            { location: { row: 0, col: 0 } },
                            { location: { row: 0, col: 1 } }
                        ]
                    });
                }

                [0, 1].forEach(index => checkScrollableSizes(assert, this.$container, {
                    id: SCROLLABLE_ID + index,
                    width: 75,
                    height: 100,
                    containerWidth: browser.msie ? 75 - scrollBarWidth : 75,
                    containerScrollWidth: 125,
                    containerHeight: 100 - scrollBarWidth,
                    containerScrollHeight: (!browser.msie || browser.msie && useNativeScrolling && placement === PLACEMENT_INSIDE_BOX) ? 100 - scrollBarWidth : 100,
                    nestedElementWidth: 125,
                    nestedElementHeight: 50
                }));
            });

            QUnit.test("content overflow_x - 2 scrollable in col, " + testContext, function(assert) {
                if(placement === PLACEMENT_INSIDE_BOX) {
                    appendToBox(this.$container, {
                        width: 100, height: 150,
                        nestedElementWidth: 125, nestedElementHeight: 50,
                        direction: "col"
                    });
                } else {
                    appendToResponsiveBox(this.$container, {
                        width: 100, height: 150,
                        nestedElementWidth: 125, nestedElementHeight: 50,
                        rows: [{ ratio: 1 }, { ratio: 1 }],
                        cols: [{ ratio: 1 }],
                        dataSource: [
                            { location: { row: 0, col: 0 } },
                            { location: { row: 1, col: 0 } }
                        ]
                    });
                }

                [0, 1].forEach(index => checkScrollableSizes(assert, this.$container, {
                    id: SCROLLABLE_ID + index,
                    width: 100,
                    height: 75,
                    containerWidth: browser.msie ? 100 - scrollBarWidth : 100,
                    containerScrollWidth: 125,
                    containerHeight: 75 - scrollBarWidth,
                    containerScrollHeight: 75 - scrollBarWidth,
                    nestedElementWidth: 125,
                    nestedElementHeight: 50
                }));
            });

            QUnitTestIfSupported("content overflow_y - 2 scrollable in row, " + testContext, !TODO_SKIP_BECAUSE_INCORRECT_SIZE_IN_CHROME, function(assert) {
                if(placement === PLACEMENT_INSIDE_BOX) {
                    appendToBox(this.$container, {
                        width: 200, height: 75,
                        nestedElementWidth: 50, nestedElementHeight: 125,
                        direction: "row"
                    });
                } else {
                    appendToResponsiveBox(this.$container, {
                        width: 200, height: 75,
                        nestedElementWidth: 50, nestedElementHeight: 125,
                        rows: [{ ratio: 1 }],
                        cols: [{ ratio: 1 }, { ratio: 1 }],
                        dataSource: [
                            { location: { row: 0, col: 0 } },
                            { location: { row: 0, col: 1 } }
                        ]
                    });
                }

                [0, 1].forEach(index => checkScrollableSizes(assert, this.$container, {
                    id: SCROLLABLE_ID + index,
                    width: 100,
                    height: 75,
                    containerWidth: 100 - scrollBarWidth,
                    containerScrollWidth: 100 - scrollBarWidth,
                    containerHeight: 75,
                    containerScrollHeight: 125,
                    nestedElementWidth: 50,
                    nestedElementHeight: 125
                }));
            });

            QUnitTestIfSupported("content overflow_y - 2 scrollable in col, " + testContext, !TODO_SKIP_BECAUSE_INCORRECT_SIZE_IN_CHROME, function(assert) {
                if(placement === PLACEMENT_INSIDE_BOX) {
                    appendToBox(this.$container, {
                        width: 150, height: 100,
                        nestedElementWidth: 50, nestedElementHeight: 75,
                        direction: "col"
                    });
                } else {
                    appendToResponsiveBox(this.$container, {
                        width: 150, height: 100,
                        nestedElementWidth: 50, nestedElementHeight: 75,
                        rows: [{ ratio: 1 }, { ratio: 1 }],
                        cols: [{ ratio: 1 }],
                        dataSource: [
                            { location: { row: 0, col: 0 } },
                            { location: { row: 1, col: 0 } }
                        ]
                    });
                }

                [0, 1].forEach(index => checkScrollableSizes(assert, this.$container, {
                    id: SCROLLABLE_ID + index,
                    width: 150,
                    height: 50,
                    containerWidth: 150 - scrollBarWidth,
                    containerScrollWidth: 150 - scrollBarWidth,
                    containerHeight: 50,
                    containerScrollHeight: 75,
                    nestedElementWidth: 50,
                    nestedElementHeight: 75
                }));
            });
        });
    });
});
