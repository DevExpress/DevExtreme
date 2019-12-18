var $ = require('jquery'),
    notify = require('ui/notify'),
    viewPort = require('core/utils/view_port').value,
    fx = require('animation/fx');

QUnit.module('notify tests', {
    beforeEach: function() {
        viewPort('#qunit-fixture');

        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
});

QUnit.test('notify show/hide', function(assert) {
    assert.expect(3);

    assert.equal($('.dx-toast').length, 0);
    notify({
        message: 'Hello world',
        displayTime: 100,
        onHidden: function() {
            assert.equal($('.dx-toast').length, 0);
        }
    });
    assert.equal($('.dx-toast').length, 1);
    this.clock.tick(100);
});

QUnit.test('notify content', function(assert) {
    var expected = 'Hello word';
    assert.equal($('.dx-toast').length, 0);
    notify({
        message: expected,
        displayTime: 100,
        hidden: function() {
            assert.equal($('.dx-toast').length, 0);
        }
    });

    assert.equal($('.dx-toast-wrapper').find('.dx-toast-message').text(), expected, 'Actual message is equal to expected.');
    assert.equal($('.dx-toast-wrapper').length, 1);
    this.clock.tick(100);
});
