import config from 'core/config';
import { getDefaultAlignment } from 'core/utils/position.js';

const { module: testModule, test } = QUnit;

testModule('getDefaultAlignment', function() {
    test('getDefaultAlignment should return an alignment depending on the global "rtlEnabled" config or passed value', function(assert) {
        const originalConfig = config();

        try {
            config({
                rtlEnabled: false
            });

            assert.strictEqual(getDefaultAlignment(), 'left', '"isRtlEnabled" argument is undefined, global "rtlEnabled" config is false');
            assert.strictEqual(getDefaultAlignment(true), 'right', '"isRtlEnabled" argument is true, global "rtlEnabled" config is false');
            assert.strictEqual(getDefaultAlignment(false), 'left', '"isRtlEnabled" argument is false, global "rtlEnabled" config is false');

            config({
                rtlEnabled: true
            });

            assert.strictEqual(getDefaultAlignment(), 'right', '"isRtlEnabled" argument is undefined, global "rtlEnabled" config is true');
            assert.strictEqual(getDefaultAlignment(true), 'right', '"isRtlEnabled" argument is true, global "rtlEnabled" config is true');
            assert.strictEqual(getDefaultAlignment(false), 'left', '"isRtlEnabled" argument is false, global "rtlEnabled" config is true');

        } finally {
            config(originalConfig);
        }
    });
});
