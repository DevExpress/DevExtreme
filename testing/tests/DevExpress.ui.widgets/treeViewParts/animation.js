import fx from "animation/fx";
import keyboardMock from "../../../helpers/keyboardMock.js";
import eventsEngine from "events/core/events_engine";
import { TreeViewTestWrapper } from "../../../helpers/TreeViewTestHelper.js";

const { module, test } = QUnit;
const createInstance = (options) => new TreeViewTestWrapper(options);

module("Animation", {
    beforeEach() {
        fx.off = true;
    },
    afterEach() {
        fx.off = false;
    }
}, () => {
    test("expand item should be animated if option animationEnabled is true", (assert) => {
        assert.expect(7);

        let originalAnimation = fx.animate;
        let originalStop = fx.stop;


        try {
            fx.stop = sinon.spy(($element) => {
                let $nodeContainer = treeView.getNodeContainersInNode($node, 0);
                assert.equal($element.get(0), $nodeContainer.get(0), "correct element was animated");
            });
            fx.animate = sinon.spy(($element, config) => {
                let $nodeContainer = treeView.getNodeContainersInNode($node, 0);

                config.duration = 0;

                assert.equal($element.get(0), $nodeContainer.get(0), "correct element was animated");
                assert.equal(config.from["maxHeight"], 0, "starting from zero height");
                assert.equal(config.to["maxHeight"], $nodeContainer.height(), "starting from zero height");
                assert.ok(treeView.isNodeContainerOpened($nodeContainer), "node container displayed");

                config.complete = (() => {
                    let orig = config.complete;
                    return () => {
                        orig();

                        assert.equal($nodeContainer.css("maxHeight"), "none", "max-height was reset");
                        assert.ok(treeView.isNodeContainerOpened($nodeContainer), "node container displayed");
                    };
                })();

                originalAnimation.call(this, $element, config);
            });

            const treeView = createInstance({
                items: [{
                    id: 1, text: "Item 1",
                    items: [{ id: 3, text: "Item 3" }]
                }],
                animationEnabled: true
            });

            let $node = treeView.getNodes(0);

            treeView.instance.expandItem(treeView.getItems(0).get(0));
        } finally {
            fx.animate = originalAnimation;
            fx.stop = originalStop;
        }
    });

    test("collapse item should be animated if option animationEnabled is true", (assert) => {
        assert.expect(8);

        let originalAnimation = fx.animate;
        let originalStop = fx.stop;

        try {
            fx.stop = sinon.spy(($element) => {
                assert.equal($element.get(0), $nodeContainer.get(0), "correct element was animated");
            });
            fx.animate = sinon.spy(($element, config) => {
                assert.notEqual(config.duration, 0, "not zero duration");
                config.duration = 0;

                assert.equal($element.get(0), $nodeContainer.get(0), "correct element was animated");

                assert.equal(config.from["maxHeight"], $nodeContainer.height(), "starting from real height");
                assert.equal(config.to["maxHeight"], 0, "starting to zero height");
                assert.ok(treeView.isNodeContainerOpened($nodeContainer), "node container displayed");

                config.complete = (() => {
                    var orig = config.complete;
                    return function() {
                        orig();

                        assert.equal($nodeContainer.css("maxHeight"), "none", "max-height was reset");
                        assert.ok(!treeView.isNodeContainerOpened($nodeContainer), "node container displayed");
                    };
                })();

                originalAnimation.call(this, $element, config);
            });

            const treeView = createInstance({
                items: [{
                    id: 1, text: "Item 1", expanded: true,
                    items: [{ id: 3, text: "Item 3" }]
                }],
                animationEnabled: true
            });

            let $nodeContainer = treeView.getNodeContainersInNode(treeView.getNodes(0), 0);

            treeView.instance.collapseItem(treeView.getItems(0).get(0));
        } finally {
            fx.animate = originalAnimation;
            fx.stop = originalStop;
        }
    });

    test("collapse item should not be animated if option animationEnabled is false", (assert) => {
        let originalAnimation = fx.animate;

        try {
            fx.animate = sinon.spy(($element, config) => {
                assert.equal(config.duration, 0, "not zero duration");
                originalAnimation.call(this, $element, config);
            });

            const treeView = createInstance({
                items: [{
                    id: 1, text: "Item 1", expanded: true,
                    items: [{ id: 3, text: "Item 3" }]
                }],
                animationEnabled: false
            });

            treeView.instance.collapseItem(treeView.getItems(0).get(0));
        } finally {
            fx.animate = originalAnimation;
        }
    });

    test("collapse item should not be animated if item is already collapsed", (assert) => {
        assert.expect(0);

        let originalAnimation = fx.animate;

        try {
            fx.animate = sinon.spy(($element, config) => {
                assert.ok(false, "animation was no run");
            });

            const treeView = createInstance({
                items: [{
                    id: 1, text: "Item 1", expanded: false,
                    items: [{ id: 3, text: "Item 3" }]
                }]
            });

            treeView.instance.collapseItem(treeView.getItems(0).get(0));
        } finally {
            fx.animate = originalAnimation;
        }
    });

    test("keyboard navigation should stop animation", (assert) => {
        let originalStop = fx.stop;

        try {
            const treeView = createInstance({
                items: [{
                    id: 1, text: "Item 1", expanded: false,
                    items: [{ id: 3, text: "Item 3" }]
                }],
                focusStateEnabled: true
            });

            let $node = treeView.getNodes(0),
                $item = treeView.getItems(0);

            treeView.instance.expandItem(treeView.getItems(0).get(0));

            fx.stop = sinon.spy();
            eventsEngine.trigger($item, "dxpointerdown");

            let $nodeContainer = treeView.getNodeContainersInNode($node, 0);

            keyboardMock(treeView.getElement()).keyDown("right");
            assert.ok(fx.stop.calledWith($nodeContainer.get(0)), "animation stopped");
        } finally {
            fx.stop = originalStop;
        }
    });
});
