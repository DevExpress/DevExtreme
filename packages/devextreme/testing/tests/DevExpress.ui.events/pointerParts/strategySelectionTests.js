import { getStrategy } from 'events/pointer';
// import TouchStrategy from 'events/pointer/touch';
// import MouseStrategy from 'events/pointer/mouse';
import MouseAndTouchStrategy from 'events/pointer/mouse_and_touch';

const { test } = QUnit;

QUnit.module('Strategy selection', () => {
    test('Use the Mouse strategy by default', function(assert) {
        const strategy = getStrategy({}, {}, {});

        assert.strictEqual(strategy, MouseAndTouchStrategy);
    });

    test('Use the MouseAndTouch strategy when touch supported and device isn\'t a tablet or phone', function(assert) {
        const strategyDesktop = getStrategy({ touch: true }, { desktop: true }, {});
        const strategyPhone = getStrategy({ touch: true }, { tablet: true }, {});
        const strategyTablet = getStrategy({ touch: true }, { phone: true }, {});

        assert.strictEqual(strategyDesktop, MouseAndTouchStrategy);
        assert.strictEqual(strategyPhone, MouseAndTouchStrategy);
        assert.strictEqual(strategyTablet, MouseAndTouchStrategy);
    });
});
