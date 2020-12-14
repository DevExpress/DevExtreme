import $ from 'jquery';
import config from 'core/config';
import { getDefaultAlignment, getBoundingRect } from 'core/utils/position.js';

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

testModule('getBoundingRect', {
    beforeEach() {
        this.$element = $('<div>').css({
            width: 200,
            height: 500,
            left: 150,
            right: 250
        });

        this.$element.appendTo($('#qunit-fixture'));
    }
}, function() {
    test('getBoundingRect should return the result of element.getBoundingClientRect() if element is public element', function(assert) {
        const rect = getBoundingRect(this.$element.get(0));
        assert.deepEqual(rect, this.$element.get(0).getBoundingClientRect(), 'result rect is correct');
    });

    test('getBoundingRect should return the object with window width and height if element is window', function(assert) {
        const rect = getBoundingRect(window);
        const windowSizes = {
            width: window.outerWidth,
            height: window.outerHeight
        };

        assert.deepEqual(rect, windowSizes, 'result rect is correct');
    });

    test('getBoundingRect should return the object with all properties equal to 0 if element is not in DOM', function(assert) {
        const rect = getBoundingRect(document.createElement('div'));

        ['width', 'height', 'top', 'bottom', 'left', 'right'].forEach(prop => {
            assert.strictEqual(rect[prop], 0, `${prop} is correct`);
        });
    });
});
