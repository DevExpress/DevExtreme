import $ from "jquery";
import ContextMenu from "ui/context_menu";

import "ui/button";
import "common.css!";

QUnit.testStart(() => {
    const markup = '\
        <div id="simpleMenu"></div>\
        <div id="menuTarget"></div>';

    $("#qunit-fixture").html(markup);
});

QUnit.module("Context menu", () => {
    // T755681
    QUnit.test("Context menu should shown in the same position when item was added in runtime", (assert) => {
        assert.expect(15);

        const done = assert.async();
        const menuTargetSelector = "#menuTarget";
        const items = [{ text: "item 1" }];
        let onPositioningHandler = sinon.spy();

        const checkOverlayPosition = (assert, component, expectedTarget) => {
            const position = component._overlay.option("position");
            assert.equal(position.at, "top left", "at of overlay position");
            assert.equal(position.my, "top left", "my of overlay position");
            assert.equal(position.of.pageX, 120, "pageX of overlay position");
            assert.equal(position.of.pageY, 50, "pageX of overlay position");
            assert.equal(position.of.target, expectedTarget.get(0), "target of overlay position");

            if(!isFirstShown) {
                assert.strictEqual(onPositioningHandler.callCount, 2, "onPositioning.callCount");
                done();
            }
            isFirstShown = false;
        };

        let isItemAdded = false;
        let isFirstShown = true;
        const instance = new ContextMenu($("#simpleMenu"), {
            items: items,
            target: menuTargetSelector,
            onShowing: (e) => {
                if(!isItemAdded) {
                    setTimeout(() => {
                        isItemAdded = true;
                        items.push({ text: "item 2" });
                        e.component.option("items", items);
                    }, 500);
                    assert.ok(e.jQEvent, "event is defined");
                    assert.ok(true, "item added");
                } else {
                    assert.ok(!e.jQEvent, "event is not defined");
                    assert.strictEqual(e.component.option("items").length, 2, "items.length");
                }
            },
            onPositioning: onPositioningHandler
        });

        var $target = $(menuTargetSelector);
        new Promise((resolve) => {
            instance.option("onShown", (e) => {
                checkOverlayPosition(assert, e.component, $target);
                resolve();
            });

            $target.trigger($.Event("dxcontextmenu", {
                pageX: 120,
                pageY: 50
            }));
        });
    });

    QUnit.test("Context menu should shown in the same position after repaint()", (assert) => {
        assert.expect(5);

        const menuTargetSelector = "#menuTarget";
        const instance = new ContextMenu($("#simpleMenu"), {
            items: [{ text: "item 1" }],
            target: menuTargetSelector,
        });

        $(menuTargetSelector).trigger($.Event("dxcontextmenu", {
            pageX: 120,
            pageY: 50
        }));

        var $target = $(menuTargetSelector);
        new Promise((resolve) => {
            instance.option("onShown", (e) => {
                const position = e.component._overlay.option("position");
                assert.equal(position.at, "top left", "at of overlay position");
                assert.equal(position.my, "top left", "my of overlay position");
                assert.equal(position.of.pageX, 120, "pageX of overlay position");
                assert.equal(position.of.pageY, 50, "pageX of overlay position");
                assert.equal(position.of.target, $target.get(0), "target of overlay position");
                resolve();
            });

            instance.repaint();
        });
    });

    QUnit.test("Add item on positioning", (assert) => {
        const menuTargetSelector = "#menuTarget";
        const instance = new ContextMenu($("#simpleMenu"), {
            items: [{ text: "item 1" }],
            target: menuTargetSelector,
            onPositioning: (actionArgs) => {
                actionArgs.component.option("items").push({ text: "item 2" });
            }
        });

        $(menuTargetSelector).trigger($.Event("dxcontextmenu", {
            pageX: 120,
            pageY: 50
        }));

        assert.strictEqual(instance.option("items").length, 2, "items.length");
    });
});

