import $ from 'jquery';
import notify from 'ui/notify';
import fx from 'animation/fx';
import hideToasts from 'ui/toast/hide_toasts';

QUnit.testStart(function() {
    const markup =
        '<div id="container"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('hideToasts', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();

        notify({
            container: '#container',
            position: 'bottom left',
            displayTime: 100,
        });

        notify({
            position: 'bottom right',
            displayTime: 100,
        });

    },

    afterEach: function() {
        this.clock.tick(100);
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('without argument hides all Toasts', function(assert) {
        assert.equal($('.dx-toast').length, 2);

        hideToasts();

        assert.equal($('.dx-toast').length, 0);
    });

    QUnit.test('with argument defined as string hides Toasts with corresponding container', function(assert) {
        assert.equal($('.dx-toast').length, 2);

        hideToasts('#container');

        assert.equal($('.dx-toast').length, 1);
    });

    QUnit.test('with argument defined as jQuery element hides Toasts with corresponding container', function(assert) {
        assert.equal($('.dx-toast').length, 2);

        hideToasts($('#container'));

        assert.equal($('.dx-toast').length, 1);
    });

    QUnit.test('with argument defined as html element hides Toasts with corresponding container', function(assert) {
        assert.equal($('.dx-toast').length, 2);

        hideToasts($('#container').get(0));

        assert.equal($('.dx-toast').length, 1);
    });

    QUnit.test('with argument defined as unexisted element hides nothing', function(assert) {
        assert.equal($('.dx-toast').length, 2);

        hideToasts($('#containerr').get(0));

        assert.equal($('.dx-toast').length, 2);
    });
});
