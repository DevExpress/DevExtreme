import $ from "jquery";
import browser from "core/utils/browser";
import { QUnitTestIfSupported, checkScrollableSizes } from '../../../helpers/scrollableTestsHelper.js';

import "ui/tree_view";
import "ui/box";
import "ui/responsive_box";

import "common.css!";

const TREEVIEW_ID = "treeView_id";
const manyExpandedItems = [{
    text: "1", expanded: true,
    items: [{
        text: "1_1", expanded: true,
        items: [{
            text: "1_1_1", expanded: true,
            items: [{ text: "1_1_1_1" }]
        }]
    }]
}];
const fewItems = [{ text: "item 1" }, { text: "item 2" }];

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
    ["standalone", "insedeResponsiveBox", "insideBox"].forEach(appendToType => {

        const testContext = `, appendTo: ${appendToType}`;

        function appendOneTreeViewTo($appendTo, { id, width, height, items }) {
            if(appendToType === "insedeResponsiveBox") {
                $appendTo.dxResponsiveBox({
                    width,
                    height,
                    dataSource: [{
                        location: { row: 0, col: 0 },
                        template: (data, index, element) => {
                            appendTreeViewTo(element, id, items);
                        }
                    }]
                });
            } else if(appendToType === "insideBox") {
                $appendTo.dxBox({
                    width,
                    height,
                    direction: "row",
                    items: [{ ratio: 1, baseSize: 0 }],
                    itemTemplate: function(data, index, element) {
                        appendTreeViewTo(element, id, items);
                    }
                });
            } else if(appendToType === "standalone") {
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
                nestedElementHeight: [50, 100]
            });
        });

        QUnit.test("content overflow_x, " + testContext, function(assert) {
            appendOneTreeViewTo(this.$container, {
                id: TREEVIEW_ID,
                width: 75,
                height: 200,
                items: manyExpandedItems
            });

            checkScrollableSizes(assert, this.$container, {
                id: TREEVIEW_ID,
                width: 75,
                height: 200,
                containerWidth: 75,
                containerScrollWidth: 75,
                containerHeight: 200,
                containerScrollHeight: 200,
                nestedElementWidth: 75,
                nestedElementHeight: [100, 150]
            });
        });

        QUnit.test("content overflow_x_y, " + testContext, function(assert) {
            appendOneTreeViewTo(this.$container, {
                id: TREEVIEW_ID,
                width: 75,
                height: 100,
                items: manyExpandedItems
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
                items: manyExpandedItems
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
    ["box", "responsiveBox"].forEach(appendToType => {
        const TODO_INCORRECT_SIZE_IN_CHROME = (browser.webkit || browser.mozilla) && (appendToType === "responsiveBox");
        const testContext = `[appendTo: ${appendToType}]`;

        function appendTreeViewsToResponsiveBox($responsiveBox, treeViewItems, responsiveBoxConfig) {
            responsiveBoxConfig.itemTemplate = function(data, index, element) {
                appendTreeViewTo(element, TREEVIEW_ID + index, treeViewItems);
            };

            $responsiveBox.dxResponsiveBox(responsiveBoxConfig);
        }

        function appendTreeViewsToBox($box, treeViewItems, boxConfig) {
            boxConfig.items = [{ ratio: 1 }, { ratio: 1 }];
            boxConfig.itemTemplate = function(data, index, element) {
                appendTreeViewTo(element, TREEVIEW_ID + index, treeViewItems);
            };

            $box.dxBox(boxConfig);
        }

        QUnit.test("no content overflow - 2 treeView in row, " + testContext, function(assert) {
            if(appendToType === "box") {
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
                nestedElementHeight: [50, 100]
            }));
        });

        QUnit.test("no content overflow - 2 treeView in col, " + testContext, function(assert) {
            if(appendToType === "box") {
                appendTreeViewsToBox(this.$container, fewItems, {
                    width: 100, height: 300,
                    direction: "col"
                });
            } else {
                appendTreeViewsToResponsiveBox(this.$container, fewItems, {
                    width: 100, height: 300,
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
                width: 100,
                height: 150,
                containerWidth: 100,
                containerScrollWidth: 100,
                containerHeight: 150,
                containerScrollHeight: 150,
                nestedElementWidth: 100,
                nestedElementHeight: [50, 100]
            }));
        });

        QUnitTestIfSupported("content overflow_x - 2 treeView in row, " + testContext, !TODO_INCORRECT_SIZE_IN_CHROME, function(assert) {
            if(appendToType === "box") {
                appendTreeViewsToBox(this.$container, manyExpandedItems, {
                    width: 100, height: 200,
                    direction: "row"
                });
            } else {
                appendTreeViewsToResponsiveBox(this.$container, manyExpandedItems, {
                    width: 100, height: 200,
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
                width: 50,
                height: 200,
                containerWidth: 50,
                containerScrollWidth: 50,
                containerHeight: 200,
                containerScrollHeight: 200,
                nestedElementWidth: 50,
                nestedElementHeight: [100, 150]
            }));
        });

        QUnit.test("content overflow_x - 2 treeView in col, " + testContext, function(assert) {
            if(appendToType === "box") {
                appendTreeViewsToBox(this.$container, manyExpandedItems, {
                    width: 50, height: 400,
                    direction: "col"
                });
            } else {
                appendTreeViewsToResponsiveBox(this.$container, manyExpandedItems, {
                    width: 50, height: 400,
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
                width: 50,
                height: 200,
                containerWidth: 50,
                containerScrollWidth: 50,
                containerHeight: 200,
                containerScrollHeight: 200,
                nestedElementWidth: 50,
                nestedElementHeight: [100, 150]
            }));
        });

        QUnitTestIfSupported("content overflow_y - 2 treeView in row, " + testContext, !TODO_INCORRECT_SIZE_IN_CHROME, function(assert) {
            if(appendToType === "box") {
                appendTreeViewsToBox(this.$container, manyExpandedItems, {
                    width: 400, height: 75,
                    direction: "row"
                });
            } else {
                appendTreeViewsToResponsiveBox(this.$container, manyExpandedItems, {
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

        QUnitTestIfSupported("content overflow_y - 2 treeView in col, " + testContext, !TODO_INCORRECT_SIZE_IN_CHROME, function(assert) {
            if(appendToType === "box") {
                appendTreeViewsToBox(this.$container, manyExpandedItems, {
                    width: 200, height: 150,
                    direction: "col"
                });
            } else {
                appendTreeViewsToResponsiveBox(this.$container, manyExpandedItems, {
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
