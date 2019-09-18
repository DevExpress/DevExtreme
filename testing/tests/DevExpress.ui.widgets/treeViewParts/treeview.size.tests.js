import $ from "jquery";
import { QUnitTestIfSupported, checkScrollableSizes } from '../../../helpers/scrollableTestsHelper.js';

import "ui/tree_view";
import "ui/box";
import "ui/responsive_box";

import "common.css!";

const TREEVIEW_ID = "treeView_id";
const PLACEMENT_STANDALONE = "standalone";
const PLACEMENT_INSIDE_BOX = "insideBox";
const PLACEMENT_INSIDE_RESPONSIVE_BOX = "insideResponsiveBox";

const fewItems = [{ text: "item 1" }, { text: "item 2" }];
const itemsOverflowX = [{
    text: "1111", expanded: true,
    items: [{
        text: "1111_1111"
    }]
}];

const itemsOverflowY = [{
    text: "a", expanded: true,
    items: [{
        text: "b", expanded: true,
        items: [{
            text: "c", expanded: true,
            items: [{
                text: "d"
            }]
        }]
    }]
}];

const itemsOverflowXY = [{
    text: "1111", expanded: true,
    items: [{
        text: "1111_1111", expanded: true,
        items: [{
            text: "1111_1111_1111", expanded: true,
            items: [
                { text: "1111_1111_1111_" }
            ]
        }]
    }]
}];

function appendTreeViewTo(appendToElement, id, items, width, height) {
    const $treeView = $(`<div id="${id}" style="background-color: orange"></div>`);

    $(appendToElement).append($treeView);

    const options = { items };
    if(width && height) {
        options.width = width;
        options.height = height;
    }
    $treeView.dxTreeView(options);
}

QUnit.module("Size of one TreeView standalone/inside Box/inside ResponsiveBox", {
    beforeEach: function() {
        this.$container = $(`<div style="background-color: blue"></div>`);
        $("#qunit-fixture").append(this.$container);
    },
    afterEach: function() {
        this.$container.remove();
    }
},
() => {
    [PLACEMENT_STANDALONE, PLACEMENT_INSIDE_RESPONSIVE_BOX, PLACEMENT_INSIDE_BOX].forEach(placement => {

        const testContext = `placement: ${placement}`;

        function appendOneTreeViewTo($appendTo, { id, width, height, items }) {
            if(placement === PLACEMENT_INSIDE_RESPONSIVE_BOX) {
                $appendTo.dxResponsiveBox({
                    _layoutStrategy: "flex",
                    width,
                    height,
                    dataSource: [{
                        location: { row: 0, col: 0 },
                        template: (data, index, element) => {
                            appendTreeViewTo(element, id, items);
                        }
                    }]
                });
            } else if(placement === PLACEMENT_INSIDE_BOX) {
                $appendTo.dxBox({
                    _layoutStrategy: "flex",
                    width,
                    height,
                    direction: "row",
                    items: [{ ratio: 1, baseSize: 0 }],
                    itemTemplate: function(data, index, element) {
                        appendTreeViewTo(element, id, items);
                    }
                });
            } else if(placement === PLACEMENT_STANDALONE) {
                appendTreeViewTo($appendTo, id, items, width, height);
            }
        }

        QUnit.test("no content overflow, " + testContext, function(assert) {
            appendOneTreeViewTo(this.$container, {
                id: TREEVIEW_ID,
                width: 150,
                height: 100,
                items: [
                    { text: "item 1" },
                    { text: "item 2" }
                ]
            });

            checkScrollableSizes(assert, this.$container, {
                id: TREEVIEW_ID,
                width: 150,
                height: 100,
                containerWidth: 150,
                containerScrollWidth: 150,
                containerHeight: 100,
                containerScrollHeight: 100,
                nestedElementWidth: 150,
                nestedElementHeight: [50, 100],
                useNativeScrolling: true
            });
        });

        QUnit.test("content overflow_x, " + testContext, function(assert) {
            appendOneTreeViewTo(this.$container, {
                id: TREEVIEW_ID,
                width: 75,
                height: 100,
                items: itemsOverflowX
            });

            checkScrollableSizes(assert, this.$container, {
                id: TREEVIEW_ID,
                width: 75,
                height: 100,
                containerWidth: 75,
                containerScrollWidth: 75,
                containerHeight: 100,
                containerScrollHeight: 100,
                nestedElementWidth: 75,
                nestedElementHeight: [50, 90],
                useNativeScrolling: true
            });
        });

        QUnit.test("content overflow_x_y, " + testContext, function(assert) {
            appendOneTreeViewTo(this.$container, {
                id: TREEVIEW_ID,
                width: 75,
                height: 100,
                items: itemsOverflowXY
            });

            checkScrollableSizes(assert, this.$container, {
                id: TREEVIEW_ID,
                width: 75,
                height: 100,
                containerWidth: 75,
                containerScrollWidth: 75,
                containerHeight: 100,
                containerScrollHeight: [100, 150],
                nestedElementWidth: 75,
                nestedElementHeight: [100, 150]
            });
        });

        QUnit.test("content overflow_y, " + testContext, function(assert) {
            appendOneTreeViewTo(this.$container, {
                id: TREEVIEW_ID,
                width: 200,
                height: 100,
                items: itemsOverflowY
            });

            checkScrollableSizes(assert, this.$container, {
                id: TREEVIEW_ID,
                width: 200,
                height: 100,
                containerWidth: 200,
                containerScrollWidth: 200,
                containerHeight: 100,
                containerScrollHeight: [100, 150],
                nestedElementWidth: 200,
                nestedElementHeight: [100, 150]
            });
        });
    });
});

QUnit.module("Size of two TreeViews inside Box/ResponsiveBox", {
    beforeEach: function() {
        this.$container = $(`<div></div>`);
        $("#qunit-fixture").append(this.$container);
    },
    afterEach: function() {
        this.$container.remove();
    }
},
() => {
    [PLACEMENT_INSIDE_BOX, PLACEMENT_INSIDE_RESPONSIVE_BOX].forEach(placement => {
        const TODO_SKIP_BECAUSE_INCORRECT_SIZE = (placement === PLACEMENT_INSIDE_RESPONSIVE_BOX);
        const testContext = `[placement: ${placement}]`;

        function appendTreeViewsToResponsiveBox($responsiveBox, treeViewItems, responsiveBoxConfig) {
            responsiveBoxConfig._layoutStrategy = "flex";
            responsiveBoxConfig.itemTemplate = function(data, index, element) {
                appendTreeViewTo(element, TREEVIEW_ID + index, treeViewItems);
            };

            $responsiveBox.dxResponsiveBox(responsiveBoxConfig);
        }

        function appendTreeViewsToBox($box, treeViewItems, boxConfig) {
            boxConfig._layoutStrategy = "flex";
            boxConfig.items = [{ ratio: 1 }, { ratio: 1 }];
            boxConfig.itemTemplate = function(data, index, element) {
                appendTreeViewTo(element, TREEVIEW_ID + index, treeViewItems);
            };

            $box.dxBox(boxConfig);
        }

        QUnit.test("no content overflow - 2 treeView in row, " + testContext, function(assert) {
            if(placement === PLACEMENT_INSIDE_BOX) {
                appendTreeViewsToBox(this.$container, fewItems, {
                    width: 300, height: 100,
                    direction: "row"
                });
            } else {
                appendTreeViewsToResponsiveBox(this.$container, fewItems, {
                    width: 300, height: 100,
                    rows: [{ ratio: 1 }],
                    cols: [{ ratio: 1 }, { ratio: 1 }],
                    dataSource: [
                        { location: { row: 0, col: 0 } },
                        { location: { row: 0, col: 1 } }
                    ]
                });
            }

            [0, 1].forEach(index => checkScrollableSizes(assert, this.$container, {
                id: TREEVIEW_ID + index,
                width: 150,
                height: 100,
                containerWidth: 150,
                containerScrollWidth: 150,
                containerHeight: 100,
                containerScrollHeight: 100,
                nestedElementWidth: 150,
                nestedElementHeight: [50, 100],
                useNativeScrolling: true
            }));
        });

        QUnit.test("no content overflow - 2 treeView in col, " + testContext, function(assert) {
            if(placement === PLACEMENT_INSIDE_BOX) {
                appendTreeViewsToBox(this.$container, fewItems, {
                    width: 75, height: 200,
                    direction: "col"
                });
            } else {
                appendTreeViewsToResponsiveBox(this.$container, fewItems, {
                    width: 75, height: 200,
                    rows: [{ ratio: 1 }, { ratio: 1 }],
                    cols: [{ ratio: 1 }],
                    dataSource: [
                        { location: { row: 0, col: 0 } },
                        { location: { row: 1, col: 0 } }
                    ]
                });
            }

            [0, 1].forEach(index => checkScrollableSizes(assert, this.$container, {
                id: TREEVIEW_ID + index,
                width: 75,
                height: 100,
                containerWidth: 75,
                containerScrollWidth: 75,
                containerHeight: 100,
                containerScrollHeight: 100,
                nestedElementWidth: 75,
                nestedElementHeight: [50, 100],
                useNativeScrolling: true
            }));
        });

        QUnitTestIfSupported("content overflow_x - 2 treeView in row, " + testContext, !TODO_SKIP_BECAUSE_INCORRECT_SIZE, function(assert) {
            if(placement === PLACEMENT_INSIDE_BOX) {
                appendTreeViewsToBox(this.$container, itemsOverflowX, {
                    width: 150, height: 100,
                    direction: "row"
                });
            } else {
                appendTreeViewsToResponsiveBox(this.$container, itemsOverflowX, {
                    width: 150, height: 100,
                    rows: [{ ratio: 1 }],
                    cols: [{ ratio: 1 }, { ratio: 1 }],
                    dataSource: [
                        { location: { row: 0, col: 0 } },
                        { location: { row: 0, col: 1 } }
                    ]
                });
            }

            [0, 1].forEach(index => checkScrollableSizes(assert, this.$container, {
                id: TREEVIEW_ID + index,
                width: 75,
                height: 100,
                containerWidth: 75,
                containerScrollWidth: 75,
                containerHeight: 100,
                containerScrollHeight: 100,
                nestedElementWidth: 75,
                nestedElementHeight: [50, 100],
                useNativeScrolling: true
            }));
        });

        QUnit.test("content overflow_x - 2 treeView in col, " + testContext, function(assert) {
            if(placement === PLACEMENT_INSIDE_BOX) {
                appendTreeViewsToBox(this.$container, itemsOverflowX, {
                    width: 75, height: 200,
                    direction: "col"
                });
            } else {
                appendTreeViewsToResponsiveBox(this.$container, itemsOverflowX, {
                    width: 75, height: 200,
                    rows: [{ ratio: 1 }, { ratio: 1 }],
                    cols: [{ ratio: 1 }],
                    dataSource: [
                        { location: { row: 0, col: 0 } },
                        { location: { row: 1, col: 0 } }
                    ]
                });
            }

            [0, 1].forEach(index => checkScrollableSizes(assert, this.$container, {
                id: TREEVIEW_ID + index,
                width: 75,
                height: 100,
                containerWidth: 75,
                containerScrollWidth: 75,
                containerHeight: 100,
                containerScrollHeight: 100,
                nestedElementWidth: 75,
                nestedElementHeight: [50, 100],
                useNativeScrolling: true
            }));
        });

        QUnitTestIfSupported("content overflow_y - 2 treeView in row, " + testContext, !TODO_SKIP_BECAUSE_INCORRECT_SIZE, function(assert) {
            if(placement === PLACEMENT_INSIDE_BOX) {
                appendTreeViewsToBox(this.$container, itemsOverflowY, {
                    width: 400, height: 75,
                    direction: "row"
                });
            } else {
                appendTreeViewsToResponsiveBox(this.$container, itemsOverflowY, {
                    width: 400, height: 75,
                    rows: [{ ratio: 1 }],
                    cols: [{ ratio: 1 }, { ratio: 1 }],
                    dataSource: [
                        { location: { row: 0, col: 0 } },
                        { location: { row: 0, col: 1 } }
                    ]
                });
            }

            [0, 1].forEach(index => checkScrollableSizes(assert, this.$container, {
                id: TREEVIEW_ID + index,
                width: 200,
                height: 75,
                containerWidth: 200,
                containerScrollWidth: 200,
                containerHeight: 75,
                containerScrollHeight: [100, 150],
                nestedElementWidth: 200,
                nestedElementHeight: [100, 150]
            }));
        });

        QUnitTestIfSupported("content overflow_y - 2 treeView in col, " + testContext, !TODO_SKIP_BECAUSE_INCORRECT_SIZE, function(assert) {
            if(placement === PLACEMENT_INSIDE_BOX) {
                appendTreeViewsToBox(this.$container, itemsOverflowY, {
                    width: 200, height: 150,
                    direction: "col"
                });
            } else {
                appendTreeViewsToResponsiveBox(this.$container, itemsOverflowY, {
                    width: 200, height: 150,
                    rows: [{ ratio: 1 }, { ratio: 1 }],
                    cols: [{ ratio: 1 }],
                    dataSource: [
                        { location: { row: 0, col: 0 } },
                        { location: { row: 1, col: 0 } }
                    ]
                });
            }

            [0, 1].forEach(index => checkScrollableSizes(assert, this.$container, {
                id: TREEVIEW_ID + index,
                width: 200,
                height: 75,
                containerWidth: 200,
                containerScrollWidth: 200,
                containerHeight: 75,
                containerScrollHeight: [100, 150],
                nestedElementWidth: 200,
                nestedElementHeight: [100, 150]
            }));
        });
    });
});
