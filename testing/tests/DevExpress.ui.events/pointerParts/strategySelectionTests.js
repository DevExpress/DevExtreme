import { getStrategy } from "events/pointer";
import TouchStrategy from "events/pointer/touch";
import MsPointerStrategy from "events/pointer/mspointer";
import MouseStrategy from "events/pointer/mouse";
import MouseAndTouchStrategy from "events/pointer/mouse_and_touch";


const { test } = QUnit;

QUnit.module("Strategy selection", () => {
    test("Use the Mouse strategy by default", function(assert) {
        const strategy = getStrategy({}, {}, {});

        assert.strictEqual(strategy, MouseStrategy);
    });

    test("Use the MouseAndTouch strategy when touch supported and device isn't a tablet or phone", function(assert) {
        const strategyDesktop = getStrategy({ touch: true }, { desktop: true }, {});
        const strategyPhone = getStrategy({ touch: true }, { tablet: true }, {});
        const strategyTablet = getStrategy({ touch: true }, { phone: true }, {});

        assert.strictEqual(strategyDesktop, MouseAndTouchStrategy);
        assert.strictEqual(strategyPhone, TouchStrategy);
        assert.strictEqual(strategyTablet, TouchStrategy);
    });

    test("Use the MsPointer strategy when PointerEvent supported and the Edge or IE11 browser using", function(assert) {
        const strategyMsie = getStrategy({ pointerEvents: true }, {}, { msie: true });
        const strategyWebkit = getStrategy({ pointerEvents: true }, {}, { webkit: true });

        assert.strictEqual(strategyMsie, MsPointerStrategy);
        assert.strictEqual(strategyWebkit, MouseStrategy, "default strategy");
    });
});
