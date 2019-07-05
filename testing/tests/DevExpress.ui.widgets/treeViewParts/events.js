/* global DATA, internals, initTree, makeSlowDataSource, stripFunctions */

import $ from "jquery";
import commonUtils from "core/utils/common";
import typeUtils from "core/utils/type";
import holdEvent from "events/hold";
import devices from "core/devices";
import fx from "animation/fx";
import contextMenuEvent from "events/contextmenu";
import dblclickEvent from "events/dblclick";

const checkEventArgs = function(assert, e) {
    assert.ok(e.component);
    assert.ok(e.element);
    assert.ok(e.itemData);
    assert.ok(e.itemElement);
    assert.ok(typeUtils.isDefined(e.itemIndex));
    assert.ok(e.event);
    assert.ok(e.node);
};

QUnit.module("Events", {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test("onItemSelectionChanged event with unselected item", function(assert) {
    var handler = sinon.spy(function() { return; });
    var data = $.extend(true, [], DATA[5]);
    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;

    var $treeView = initTree({
        items: data,
        showCheckBoxesMode: "normal",
        onItemSelectionChanged: handler
    });

    var checkboxes = $treeView.find(".dx-checkbox");
    $(checkboxes[4]).trigger("dxclick");

    assert.ok(handler.calledOnce);

    var args = stripFunctions(handler.getCall(0).args[0].itemData);

    assert.equal(handler.getCall(0).args[0].node.text, "Third level item 2");

    assert.deepEqual(args, {
        id: 122,
        text: "Third level item 2",
        selected: true,
        expanded: true
    });
});

QUnit.test("onItemSelectionChanged event with selected item", function(assert) {
    var data = $.extend(true, [], DATA[5]),
        handler = sinon.spy(function() { return; });

    data[0].items[1].items[0].expanded = true;
    data[0].items[1].items[1].expanded = true;
    data[0].items[1].items[1].selected = true;

    var $treeView = initTree({
        items: data,
        showCheckBoxesMode: "normal",
        onItemSelectionChanged: handler
    });

    var checkboxes = $treeView.find(".dx-checkbox");
    $(checkboxes[4]).trigger("dxclick");

    var args = stripFunctions(handler.getCall(0).args[0].itemData);

    assert.ok(handler.calledOnce);
    assert.deepEqual(args, {
        id: 122,
        text: "Third level item 2",
        selected: false,
        expanded: true
    });
});

QUnit.test("onItemSelectionChanged should use correct set of arguments when item selected via api", function(assert) {
    var handler = sinon.spy(),
        items = [{ text: "Item 1" }],
        $treeView = initTree({
            items: items,
            showCheckBoxesMode: "normal",
            onItemSelectionChanged: handler
        }),
        instance = $treeView.dxTreeView("instance"),
        nodes = instance.getNodes();

    instance.selectItem(1);

    var args = handler.getCall(0).args[0];

    assert.deepEqual(args.itemData, items[0], "itemData is correct");
    assert.strictEqual(args.component, instance, "component is correct");
    assert.ok($(args.element).hasClass("dx-treeview"), "element is correct");
    assert.strictEqual(args.model, undefined, "model is not defined in jquery approach");
    assert.deepEqual(args.node, nodes[0], "node is correct");
    assert.strictEqual(args.event, undefined, "jquery event is not defined when api used");
});

QUnit.test("onItemSelectionChanged should use correct set of arguments without checkboxes", function(assert) {
    var handler = sinon.spy(),
        items = [{ text: "Item 1" }],
        $treeView = initTree({
            items: items,
            showCheckBoxesMode: "none",
            selectByClick: true,
            onItemSelectionChanged: handler
        }),
        instance = $treeView.dxTreeView("instance"),
        nodes = instance.getNodes(),
        $item = $treeView.find(".dx-treeview-item").eq(0);

    $item.trigger("dxclick");

    var args = handler.getCall(0).args[0];

    assert.deepEqual(args.itemData, items[0], "itemData is correct");
    assert.strictEqual(args.component, instance, "component is correct");
    assert.ok($(args.element).hasClass("dx-treeview"), "element is correct");
    assert.strictEqual(args.model, undefined, "model is not defined in jquery approach");
    assert.deepEqual(args.node, nodes[0], "node is correct");
    assert.deepEqual(args.event.target, $item.get(0), "jquery event has correct target");
});

QUnit.test("onSelectAllValueChanged event should be rised after select by the selectAll method", function(assert) {
    var handler = sinon.spy(),
        treeView = initTree({
            items: [{ text: "item 1" }],
            showCheckBoxesMode: "selectAll",
            selectionMode: "multiple",
            onSelectAllValueChanged: handler
        }).dxTreeView("instance");

    treeView.selectAll();

    assert.equal(handler.callCount, 1, "event has been rised on select");
    assert.equal(handler.getCall(0).args[0].value, true, "value is correct on select");

    treeView.unselectAll();
    assert.equal(handler.callCount, 2, "event has been rised on deselect");
    assert.equal(handler.getCall(1).args[0].value, false, "value is correct on deselect");
});

QUnit.test("onSelectAllValueChanged event should be rised after all item selected", function(assert) {
    var handler = sinon.spy(),
        treeView = initTree({
            items: [{ text: "item 1" }],
            showCheckBoxesMode: "selectAll",
            selectionMode: "multiple",
            onSelectAllValueChanged: handler
        }).dxTreeView("instance");

    treeView.selectItem(1);

    assert.equal(handler.callCount, 1, "event has been rised on select");
    assert.equal(handler.getCall(0).args[0].value, true, "value is correct on select");

    treeView.unselectItem(1);
    assert.equal(handler.callCount, 2, "event has been rised on deselect");
    assert.equal(handler.getCall(1).args[0].value, false, "value is correct on deselect");
});

QUnit.test("onSelectAllValueChanged event should not be rised after all item selected without selectAll checkbox", function(assert) {
    var handler = sinon.spy(),
        treeView = initTree({
            items: [{ text: "item 1" }],
            showCheckBoxesMode: "normal",
            selectionMode: "multiple",
            onSelectAllValueChanged: handler
        }).dxTreeView("instance");

    treeView.selectAll();
    treeView.unselectAll();
    treeView.selectItem(1);
    treeView.unselectItem(1);

    assert.equal(handler.callCount, 0, "event has never been rised");
});

QUnit.test("onSelectAllValueChanged event should be rised after selectAll checked", function(assert) {
    var handler = sinon.spy(),
        $treeView = initTree({
            items: [{ text: "item 1" }],
            showCheckBoxesMode: "selectAll",
            selectionMode: "multiple",
            onSelectAllValueChanged: handler
        }),
        $selectAll = $treeView.find(".dx-treeview-select-all-item");

    $selectAll.trigger("dxclick");

    assert.equal(handler.callCount, 1, "event has been rised on select");
    assert.equal(handler.getCall(0).args[0].value, true, "value is correct on select");

    $selectAll.trigger("dxclick");
    assert.equal(handler.callCount, 2, "event has been rised on deselect");
    assert.equal(handler.getCall(1).args[0].value, false, "value is correct on deselect");
});

QUnit.test("'onSelectionChanged' should be fired when item is selected", function(assert) {
    var onSelectionChangedHandler = sinon.spy(function() { return; }),
        $treeView = initTree({
            items: [{ id: 1, text: "Item 1" }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "normal",
            onSelectionChanged: onSelectionChangedHandler
        }),
        $item = $treeView.find(".dx-checkbox").eq(0);

    $item.trigger("dxclick");
    var args = onSelectionChangedHandler.getCall(0).args[0];

    assert.ok(onSelectionChangedHandler.calledOnce);

    var nodes = args.component.getNodes();

    assert.ok(nodes[0].selected);
    assert.ok(!nodes[1].selected);
});

QUnit.test("'onSelectionChanged' should be fired when item is unselected", function(assert) {
    var onSelectionChangedHandler = sinon.spy(function() { return; }),
        $treeView = initTree({
            items: [{ id: 1, text: "Item 1", selected: true }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "normal",
            onSelectionChanged: onSelectionChangedHandler
        }),
        $item = $treeView.find(".dx-checkbox").eq(0);

    $item.trigger("dxclick");
    var args = onSelectionChangedHandler.getCall(0).args[0];

    assert.ok(onSelectionChangedHandler.calledOnce);

    var nodes = args.component.getNodes();

    assert.ok(!nodes[0].selected);
    assert.ok(!nodes[1].selected);
});

QUnit.test("'onSelectionChanged' should be fired when item selection is toggled via API", function(assert) {
    var i = 0,
        $treeView = initTree({
            items: [{ id: 1, text: "Item 1", selected: true }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "normal",
            onSelectionChanged: function() { i++; }
        }),
        treeView = $treeView.dxTreeView("instance"),
        $item = $treeView.find("." + internals.ITEM_CLASS).eq(0).get(0);

    treeView.unselectItem($item);
    assert.equal(i, 1, "event was fired");

    var nodes = treeView.getNodes();
    assert.ok(!nodes[0].selected);

    treeView.selectItem($item);
    assert.equal(i, 2, "event was fired");

    nodes = treeView.getNodes();
    assert.ok(nodes[0].selected);
});

QUnit.test("'onSelectionChanged' should be fired when 'selectAll' item is selected", function(assert) {
    var onSelectionChangedHandler = sinon.spy(function() { return; }),
        treeView = initTree({
            items: [{ id: 1, text: "Item 1" }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "selectAll",
            onSelectionChanged: onSelectionChangedHandler
        }).dxTreeView("instance");

    $(treeView._$selectAllItem).trigger("dxclick");
    var args = onSelectionChangedHandler.getCall(0).args[0];

    assert.ok(onSelectionChangedHandler.calledOnce);

    var nodes = args.component.getNodes();

    assert.ok(nodes[0].selected);
    assert.ok(nodes[1].selected);
});

QUnit.test("'onSelectionChanged' should be fired when 'selectAll' item is unselected", function(assert) {
    var onSelectionChangedHandler = sinon.spy(function() { return; }),
        treeView = initTree({
            items: [{ id: 1, text: "Item 1", selected: true }, { id: 2, text: "Item 2", selected: true }],
            showCheckBoxesMode: "selectAll",
            onSelectionChanged: onSelectionChangedHandler
        }).dxTreeView("instance");

    $(treeView._$selectAllItem).trigger("dxclick");
    var args = onSelectionChangedHandler.getCall(0).args[0];

    assert.ok(onSelectionChangedHandler.calledOnce);

    var nodes = args.component.getNodes();

    assert.ok(!nodes[0].selected);
    assert.ok(!nodes[1].selected);
});

QUnit.test("'onSelectionChanged' should be fired once for children selection", function(assert) {
    var onSelectionChangedHandler = sinon.spy(function() { return; }),
        $treeView = initTree({
            items: [{ id: 1, text: "Item 1", expanded: true, items: [{ id: 3, text: "Nested item" }] }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "normal",
            onSelectionChanged: onSelectionChangedHandler
        }),
        $item = $treeView.find(".dx-checkbox").eq(0);

    $item.trigger("dxclick");
    var args = onSelectionChangedHandler.getCall(0).args[0];

    assert.ok(onSelectionChangedHandler.calledOnce);

    var nodes = args.component.getNodes();

    assert.ok(nodes[0].selected);
    assert.ok(nodes[0].items[0].selected);
    assert.ok(nodes[0].items[0].parent.selected);
    assert.ok(!nodes[1].selected);
});

QUnit.test("'onSelectionChanged' should be fired once for children unselection", function(assert) {
    var onSelectionChangedHandler = sinon.spy(function() { return; }),
        $treeView = initTree({
            items: [{ id: 1, text: "Item 1", selected: true, expanded: true, items: [{ id: 3, text: "Nested item", selected: true }] }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "normal",
            onSelectionChanged: onSelectionChangedHandler
        }),
        $item = $treeView.find(".dx-checkbox").eq(0);

    $item.trigger("dxclick");
    var args = onSelectionChangedHandler.getCall(0).args[0];
    assert.ok(onSelectionChangedHandler.calledOnce);

    var nodes = args.component.getNodes();

    assert.ok(!nodes[0].selected);
    assert.ok(!nodes[0].items[0].selected);
    assert.ok(!nodes[0].items[0].parent.selected);
    assert.ok(!nodes[1].selected);
});

QUnit.test("'onSelectionChanged' should have right arguments for nested items (unselect)", function(assert) {
    var items = [{
        "id": 1,
        "text": "Autos",
        "items": [{
            "id": 12,
            "text": "Nissan",
            "items": [{
                "id": 121,
                "text": "Almera",
                "expanded": true,
                "items": [{
                    "id": 1211,
                    "selected": true,
                    "text": "Welcome"
                }, {
                    "id": 1212,
                    "selected": true,
                    "text": "Comfort"
                }, {
                    "id": 1213,
                    "selected": true,
                    "text": "Comfort Plus"
                }
                ]
            },
            {
                "id": 122,
                "text": "Tiida"
            }
            ]
        }
        ]
    }
    ];
    var onSelectionChangedHandler = sinon.spy(function() { return; }),
        $treeView = initTree({
            items: items,
            showCheckBoxesMode: "normal",
            onSelectionChanged: onSelectionChangedHandler
        }),
        $item = $treeView.find(".dx-checkbox").eq(2);

    $item.trigger("dxclick");
    var args = onSelectionChangedHandler.getCall(0).args[0];
    assert.ok(onSelectionChangedHandler.calledOnce);

    var nodes = args.component.getNodes();

    assert.ok(!nodes[0].selected);

    assert.ok(!nodes[0].items[0].selected);
    assert.ok(!nodes[0].items[0].parent.selected);

    assert.ok(!nodes[0].items[0].items[0].selected);
    assert.ok(!nodes[0].items[0].items[0].parent.selected);

    assert.ok(!nodes[0].items[0].items[1].selected);
    assert.ok(!nodes[0].items[0].items[1].parent.selected);

    assert.ok(!nodes[0].items[0].items[0].items[0].selected);
    assert.ok(!nodes[0].items[0].items[0].items[0].parent.selected);

    assert.ok(!nodes[0].items[0].items[0].items[1].selected);
    assert.ok(!nodes[0].items[0].items[0].items[1].parent.selected);

    assert.ok(!nodes[0].items[0].items[0].items[2].selected);
    assert.ok(!nodes[0].items[0].items[0].items[2].parent.selected);
});

QUnit.test("'onSelectionChanged' should have right arguments for nested items (select)", function(assert) {
    var items = [{
        "id": 1,
        "text": "Autos",
        "items": [{
            "id": 12,
            "text": "Nissan",
            "items": [{
                "id": 121,
                "text": "Almera",
                "expanded": true,
                "items": [{
                    "id": 1211,
                    "text": "Welcome"
                }, {
                    "id": 1212,
                    "text": "Comfort"
                }, {
                    "id": 1213,
                    "text": "Comfort Plus"
                }
                ]
            },
            {
                "id": 122,
                "text": "Tiida"
            }
            ]
        }
        ]
    }
    ];
    var onSelectionChangedHandler = sinon.spy(function() { return; }),
        $treeView = initTree({
            items: items,
            showCheckBoxesMode: "normal",
            onSelectionChanged: onSelectionChangedHandler
        }),
        $item = $treeView.find(".dx-checkbox").eq(2);

    $item.trigger("dxclick");
    var args = onSelectionChangedHandler.getCall(0).args[0];
    assert.ok(onSelectionChangedHandler.calledOnce);

    var nodes = args.component.getNodes();

    assert.ok(Object.prototype.hasOwnProperty.call(nodes[0], "selected"));
    assert.strictEqual(nodes[0].selected, undefined);

    assert.ok(Object.prototype.hasOwnProperty.call(nodes[0].items[0], "selected"));
    assert.strictEqual(nodes[0].items[0].selected, undefined);
    assert.ok(Object.prototype.hasOwnProperty.call(nodes[0].items[0].parent, "selected"));
    assert.strictEqual(nodes[0].items[0].parent.selected, undefined);

    assert.ok(nodes[0].items[0].items[0].selected);
    assert.ok(Object.prototype.hasOwnProperty.call(nodes[0].items[0].items[0].parent, "selected"));

    assert.ok(!nodes[0].items[0].items[1].selected);
    assert.ok(Object.prototype.hasOwnProperty.call(nodes[0].items[0].items[1].parent, "selected"));

    assert.ok(nodes[0].items[0].items[0].items[0].selected);
    assert.ok(nodes[0].items[0].items[0].items[0].parent.selected);
    assert.ok(nodes[0].items[0].items[0].items[1].selected);
    assert.ok(nodes[0].items[0].items[0].items[1].parent.selected);
    assert.ok(nodes[0].items[0].items[0].items[2].selected);
    assert.ok(nodes[0].items[0].items[0].items[2].parent.selected);
});

QUnit.test("'onSelectionChanged' should be fired if selectNodesRecursive = false", function(assert) {
    var handler = sinon.spy(commonUtils.noop),
        $treeView = initTree({
            items: [{ id: 1, text: "Item 1" }, { id: 2, text: "Item 2" }],
            onSelectionChanged: handler,
            selectNodesRecursive: false,
            showCheckBoxesMode: "normal"
        }),
        $checkBox = $treeView.find(".dx-checkbox").eq(0);

    $checkBox.trigger("dxclick");

    assert.ok(handler.calledOnce);
});

QUnit.test("onItemClick", function(assert) {
    var clickHandler = sinon.spy(),
        $treeView = initTree({
            items: [{ id: 1, text: "Item 1" }, { id: 2, text: "Item 2" }],
            showCheckBoxesMode: "normal",
            onItemClick: clickHandler
        }),
        $item = $treeView.find("." + internals.ITEM_CLASS).eq(0);

    $item.trigger("dxclick");
    var args = clickHandler.getCall(0).args[0];

    assert.ok(clickHandler.calledOnce);
    assert.equal(args.node.key, 1);
    assert.equal(args.node.text, "Item 1");
    assert.strictEqual(args.node.parent, null);
});

QUnit.test("onItemClick should not be fired when clicking on expander icon", function(assert) {
    var clickHandler = sinon.spy(),
        $treeView = initTree({
            items: [{ id: 1, text: "Item 1", items: [{ id: 11, text: "Item 11" }] }],
            showCheckBoxesMode: "normal",
            onItemClick: clickHandler
        }),
        $expander = $treeView.find(".dx-treeview-toggle-item-visibility").eq(0);

    $expander.trigger("dxclick");

    assert.equal(clickHandler.callCount, 0, "onItemClick was not fired");
});

QUnit.test("onItemClick should work correct with string keys including several underscore symbols", function(assert) {
    var clickHandler = sinon.spy(),
        $treeView = initTree({
            items: [{ id: "1", expanded: true, text: "Item 1", items: [{ id: "1_1_1_2", text: "Item 11" }] }],
            onItemClick: clickHandler
        }),
        $item = $treeView.find("." + internals.ITEM_CLASS).eq(1);

    $item.trigger("dxclick");

    assert.equal(clickHandler.callCount, 1, "onItemClick was fired once");
});

QUnit.test("onItemClick should not be fired when clicking on the checkbox", function(assert) {
    var clickHandler = sinon.spy(commonUtils.noop),
        $treeView = initTree({
            items: [{ id: 1, text: "Item 1", items: [{ id: 11, text: "Item 11" }] }],
            showCheckBoxesMode: "normal",
            onItemClick: clickHandler
        }),
        $checkBox = $treeView.find(".dx-checkbox").eq(0);

    $checkBox.trigger("dxclick");

    assert.equal(clickHandler.callCount, 0, "onItemClick was not fired");
});


QUnit.test("T177595", function(assert) {
    var handle = sinon.spy(commonUtils.noop);
    var $treeView = initTree({
        items: [{ id: 1, text: "Item 1" }, { id: 2, text: "Item 2" }],
        showCheckBoxesMode: "normal",
        selectNodesRecursive: false,
        onItemSelectionChanged: handle
    });

    $treeView.find(".dx-checkbox").eq(0).trigger("dxclick");

    var args = handle.getCall(0).args[0];

    assert.ok(args.itemData.selected);
    assert.ok(args.node.selected);
});

QUnit.test("T184799: expand item", function(assert) {
    var currentDevice = devices.current();
    if(currentDevice.phone || currentDevice.tablet) {
        assert.ok(true);
    } else {
        var handler = sinon.spy(commonUtils.noop);
        var treeView = initTree({
            items: [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Nested items" }] }, { id: 2, text: "Item 2" }],
            onItemExpanded: handler
        }).dxTreeView("instance");

        var $rootItem = $(treeView.$element()).find("." + internals.ITEM_CLASS).eq(0);

        $rootItem.trigger(dblclickEvent.name);
        this.clock.tick(0);

        var args = handler.getCall(0).args[0];

        assert.ok(treeView.option("items")[0].expanded);
        assert.ok(treeView.getNodes()[0].expanded);
        assert.ok($rootItem.parent().find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).hasClass(internals.TOGGLE_ITEM_VISIBILITY_OPENED_CLASS));
        assert.ok(handler.calledOnce);
        assert.ok(args.itemData.expanded);
        assert.ok(args.node.expanded);
        assert.equal(args.itemData.text, "Item 1");
        assert.equal(args.node.text, "Item 1");
        assert.equal(treeView.$element().find("." + internals.ITEM_CLASS).length, 3);
    }
});

QUnit.test("double click should be detached if expand by click is enabled", function(assert) {
    var items = [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Nested items" }] }, { id: 2, text: "Item 2" }],
        $treeView = initTree({
            items: items,
            expandEvent: "click"
        }),
        $rootItem = $treeView.find("." + internals.ITEM_CLASS).eq(0);

    $rootItem.trigger(dblclickEvent.name);

    assert.notOk(items[0].expanded, "item is still collapsed");
});

QUnit.test("double click should be attached again if expand by click is disabled", function(assert) {
    var items = [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Nested items" }] }, { id: 2, text: "Item 2" }],
        $treeView = initTree({
            items: items,
            expandEvent: "click"
        }),
        instance = $treeView.dxTreeView("instance"),
        $rootItem = $treeView.find("." + internals.ITEM_CLASS).eq(0);

    instance.option("expandEvent", "dblclick");

    $rootItem.trigger(dblclickEvent.name);

    assert.ok(items[0].expanded, "item is expanded");
});

QUnit.test("double click should be detached if expand by click is enabling dynamically", function(assert) {
    var items = [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Nested items" }] }, { id: 2, text: "Item 2" }],
        $treeView = initTree({
            items: items,
            expandEvent: "dblclick"
        }),
        instance = $treeView.dxTreeView("instance"),
        $rootItem = $treeView.find("." + internals.ITEM_CLASS).eq(0);

    instance.option("expandEvent", "click");

    $rootItem.trigger(dblclickEvent.name);

    assert.notOk(items[0].expanded, "item is collapsed");
});

QUnit.test("dblclick should be used as expand event if unclear value is specified", function(assert) {
    var items = [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Nested items" }] }, { id: 2, text: "Item 2" }],
        $treeView = initTree({
            items: items,
            expandEvent: "dblclick"
        }),
        instance = $treeView.dxTreeView("instance"),
        $rootItem = $treeView.find("." + internals.ITEM_CLASS).eq(0);

    instance.option("expandEvent", "undefinedEvent");

    $rootItem.trigger(dblclickEvent.name);

    assert.ok(items[0].expanded, "item is expanded");
});

QUnit.test("double click should expand an item after widget repainted", function(assert) {
    var items = [{ id: 1, text: "Item 1", items: [{ id: 3, text: "Nested items" }] }],
        $treeView = initTree({
            items: items,
            expandEvent: "dblclick"
        }),
        instance = $treeView.dxTreeView("instance");

    instance.repaint();

    var $rootItem = $treeView.find("." + internals.ITEM_CLASS).eq(0);
    $rootItem.trigger(dblclickEvent.name);

    assert.ok(items[0].expanded, "item is expanded");
});

QUnit.test("T184799: collapse item", function(assert) {
    var currentDevice = devices.current();
    if(currentDevice.phone || currentDevice.tablet) {
        assert.ok(true);
    } else {
        var handler = sinon.spy(commonUtils.noop);
        var treeView = initTree({
            items: [{ id: 1, text: "Item 1", expanded: true, items: [{ id: 3, text: "Nested items" }] }, { id: 2, text: "Item 2" }],
            onItemCollapsed: handler
        }).dxTreeView("instance");

        var $rootItem = $(treeView.$element()).find("." + internals.ITEM_CLASS).eq(0);

        $rootItem.trigger(dblclickEvent.name);

        var args = handler.getCall(0).args[0];

        assert.ok(!treeView.option("items")[0].expanded);
        assert.ok(!treeView.getNodes()[0].expanded);
        assert.ok(!$rootItem.parent().find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).hasClass(internals.TOGGLE_ITEM_VISIBILITY_OPENED_CLASS));
        assert.ok(handler.calledOnce);
        assert.ok(!args.itemData.expanded);
        assert.ok(!args.node.expanded);
        assert.equal(args.itemData.text, "Item 1");
        assert.equal(args.node.text, "Item 1");
        assert.equal(treeView.$element().find("." + internals.ITEM_CLASS).length, 3);
    }
});

QUnit.test("Select event handler has correct arguments", function(assert) {
    var treeView = initTree({
            items: [{ id: 1, text: "Item 1", items: [{ id: 2, text: "Nested items" }] }],
            showCheckBoxesMode: "normal",
            onItemSelectionChanged: function(e) {
                checkEventArgs(assert, e);
            }
        }),
        $item = treeView.find(".dx-checkbox").eq(0);

    assert.ok(treeView);
    $item.trigger("dxclick");
});

QUnit.test("Click event handler has correct arguments", function(assert) {
    var treeView = initTree({
            items: [{ id: 1, text: "Item 1", items: [{ id: 2, text: "Nested items" }] }],
            onItemClick: function(e) {
                checkEventArgs(assert, e);
            }
        }),
        $item = treeView.find("." + internals.ITEM_CLASS).eq(0);

    assert.ok(treeView);
    $item.trigger("dxclick");
});

QUnit.test("Collapse event handler has correct arguments", function(assert) {
    var treeView = initTree({
            items: [{ id: 1, text: "Item 1", expanded: true, items: [{ id: 2, text: "Nested items" }] }],
            onItemCollapsed: function(e) {
                checkEventArgs(assert, e);
            }
        }),
        $icon = treeView.find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0);

    assert.ok(treeView);
    $icon.trigger("dxclick");
});

QUnit.test("onItemExpanded should be called after animation completed", function(assert) {
    try {
        fx.off = false;
        var onItemExpanded = sinon.stub(),
            treeView = initTree({
                items: [{ id: 1, text: "Item 1", items: [{ id: 2, text: "Nested items" }] }],
                onItemExpanded: onItemExpanded
            }).dxTreeView("instance");

        treeView.expandItem(1);
        this.clock.tick(50);
        assert.equal(onItemExpanded.callCount, 0, "handler was not called yet");

        this.clock.tick(450);
        assert.equal(onItemExpanded.callCount, 1, "handler was called after animation completed");
    } finally {
        fx.off = true;
    }
});

QUnit.test("onItemExpanded event should not be called when the expandAll is called", function(assert) {
    const itemExpandedHandler = sinon.stub();
    const treeView = initTree({
        items: [{
            id: 1,
            text: "Item 1",
            items: [{
                id: 2,
                text: "Nested items"
            }]
        }],
        onItemExpanded: itemExpandedHandler
    }).dxTreeView("instance");

    treeView.expandAll();

    assert.equal(itemExpandedHandler.callCount, 0, "the expandItem event never called");
});

QUnit.test("Expand event handler has correct arguments", function(assert) {
    var treeView = initTree({
            items: [{ id: 1, text: "Item 1", items: [{ id: 2, text: "Nested items" }] }],
            onItemExpanded: function(e) {
                checkEventArgs(assert, e);
            }
        }),
        $icon = treeView.find("." + internals.TOGGLE_ITEM_VISIBILITY_CLASS).eq(0);

    assert.ok(treeView);
    $icon.trigger("dxclick");
});

QUnit.test("ContextMenu event handler has correct arguments", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, text: "Item 1", items: [{ id: 2, text: "Nested items" }] }],
            onItemContextMenu: function(e) {
                checkEventArgs(assert, e);
            }
        }),
        $item = $treeView.find("." + internals.ITEM_CLASS).eq(0);

    assert.ok($treeView);
    $item.trigger(contextMenuEvent.name);
});

QUnit.test("itemContextMenu should be fired when showing contextMenu", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, text: "Item 1", items: [{ id: 2, text: "Nested items" }] }]
        }),
        treeView = $treeView.dxTreeView("instance"),
        $item = $treeView.find("." + internals.ITEM_CLASS).eq(0);

    treeView.on("itemContextMenu", function() {
        assert.ok(true, "onItemContextMenu was fired");
    });

    $item.trigger(contextMenuEvent.name);
});

QUnit.test("Hold event handler has correct arguments", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, text: "Item 1", items: [{ id: 2, text: "Nested items" }] }],
            onItemHold: function(e) {
                checkEventArgs(assert, e);
            }
        }),
        $item = $treeView.find("." + internals.ITEM_CLASS).eq(0);

    assert.ok($treeView);
    $item.trigger(holdEvent.name);
});

QUnit.test("itemHold should be fired when holding item", function(assert) {
    var $treeView = initTree({
            items: [{ id: 1, text: "Item 1", items: [{ id: 2, text: "Nested items" }] }]
        }),
        treeView = $treeView.dxTreeView("instance"),
        $item = $treeView.find("." + internals.ITEM_CLASS).eq(0);

    treeView.on("itemHold", function() {
        assert.ok(true, "onItemHold was fired");
    });

    $item.trigger(holdEvent.name);
});

QUnit.test("Rendered event handler has correct arguments", function(assert) {
    var treeView = initTree({
        items: [{ id: 1, text: "Item 1", expanded: true, items: [{ id: 3, text: "Nested item" }] }, { id: 2, text: "Item 2" }],
        onItemRendered: function(e) {
            assert.ok(e.component);
            assert.ok(e.element);
            assert.ok(e.itemData);
            assert.ok(e.itemElement);
            assert.ok(typeUtils.isDefined(e.itemIndex));
            assert.ok(e.node);
        }
    });

    assert.ok(treeView);
});

QUnit.test("Fire contentReady event if new dataSource is empty", function(assert) {
    var contentReadyHandler = sinon.stub();

    initTree({
        dataSource: [],
        onContentReady: contentReadyHandler
    }).dxTreeView("instance");

    assert.ok(contentReadyHandler.calledOnce);
});

QUnit.test("Fire contentReady event when search", function(assert) {
    var contentReadyHandler = sinon.spy(),
        instance = initTree({
            items: $.extend(true, [], DATA[0]),
            onContentReady: contentReadyHandler
        }).dxTreeView("instance");

    assert.strictEqual(contentReadyHandler.callCount, 1, "onContentReady was first time");

    instance.option("searchValue", "2");

    assert.strictEqual(contentReadyHandler.callCount, 2, "onContentReady was second time");
});

QUnit.test("ContentReady event rise once when the data source is remote by first rendering", function(assert) {
    var contentReadyHandler = sinon.spy();

    initTree({
        dataSource: makeSlowDataSource([{
            id: 1,
            text: "Item 1",
            parentId: 0
        }]),
        onContentReady: contentReadyHandler
    }).dxTreeView("instance");

    this.clock.tick(300);

    assert.strictEqual(contentReadyHandler.callCount, 1, "onContentReady was first time");
});
