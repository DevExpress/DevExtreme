import $ from "jquery";
import sizeUtils from "core/utils/calculated_size";

const windowHeight = $(window).height();

QUnit.module("style utils", {
    beforeEach: function() {
        this.$container = $("<div style='width: 100px; height: 100px; padding: 10px; box-sizing: border-box; margin: 5px'></div>").appendTo("#qunit-fixture");
        this.$invisibleElement = $("<div style='width: 50px; height: 50px; display: none; padding: 5px;'></div>");
        this.$container.append(this.$invisibleElement);
    },

    afterEach: function() {
    }
});

QUnit.test("check calculateMaxHeight", function(assert) {
    const checkFunc = ({ value, container, offset }, expected) => {
        assert.strictEqual(sizeUtils.calculateMaxHeight(value, container, offset), expected);
    };

    checkFunc({ value: 300, container: null, offset: 0 }, 300);
    checkFunc({ value: 300, container: null, offset: -100 }, 200);
    checkFunc({ value: "300", container: null, offset: -100 }, 200);
    checkFunc({ value: "300px", container: null, offset: -100 }, 200);
    checkFunc({ value: "100mm", container: null, offset: -50 }, "calc(100mm - 50px)");
    checkFunc({ value: "100pt", container: null, offset: -50 }, "calc(100pt - 50px)");
    checkFunc({ value: "auto", container: null, offset: -50 }, "none");
    checkFunc({ value: null, container: null, offset: -50 }, "none");

    assert.roughEqual(sizeUtils.calculateMaxHeight("50%", window, -20), windowHeight / 2 - 20, 1, "string value in percent");
});

QUnit.test("check calculateMinHeight", function(assert) {
    const checkFunc = ({ value, container, offset }, expected) => {
        assert.strictEqual(sizeUtils.calculateMinHeight(value, container, offset), expected);
    };

    checkFunc({ value: 300, container: null, offset: 0 }, 300);
    checkFunc({ value: 300, container: null, offset: -100 }, 200);
    checkFunc({ value: "300", container: null, offset: -100 }, 200);
    checkFunc({ value: "300px", container: null, offset: -100 }, 200);
    checkFunc({ value: "100mm", container: null, offset: -50 }, "calc(100mm - 50px)");
    checkFunc({ value: "100pt", container: null, offset: -50 }, "calc(100pt - 50px)");
    checkFunc({ value: "auto", container: null, offset: -50 }, 0);
    checkFunc({ value: null, container: null, offset: -50 }, 0);

    assert.roughEqual(sizeUtils.calculateMinHeight("50%", window, -20), windowHeight / 2 - 20, 1, "string value in percent");
});

QUnit.test("check getPaddingsHeight", function(assert) {
    assert.strictEqual(sizeUtils.getPaddingsHeight(null), 0, "no element");
    assert.strictEqual(sizeUtils.getPaddingsHeight(this.$container), 20, "container paddings");
    assert.strictEqual(sizeUtils.getPaddingsHeight(this.$container, true), 30, "include margins");
    assert.strictEqual(sizeUtils.getPaddingsHeight(this.$invisibleElement), 10, "element paddings");
});

QUnit.test("check getVisibleHeight", function(assert) {
    assert.strictEqual(sizeUtils.getPaddingsHeight(null), 0, "no element");
    assert.strictEqual(sizeUtils.getVisibleHeight(this.$container), 100, "container height");
    assert.strictEqual(sizeUtils.getVisibleHeight(this.$invisibleElement), 0, "invisible element height");
});
