import $ from 'jquery';
import notify from 'ui/notify';
import fx from 'common/core/animation/fx';
import hideToasts from 'ui/toast/hide_toasts';

QUnit.testStart(function() {
    const markup = '<div id="container"></div>';

    $('#qunit-fixture').html(markup);
});

QUnit.module('hideToasts', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
        this.getToastCount = () => $('.dx-toast').length;
        this.containerSelector = '#container';
        const displayTime = 100;

        notify({
            container: '#container',
            position: 'bottom left',
            displayTime,
        });

        notify({
            position: 'bottom right',
            displayTime,
        });

    },

    afterEach: function() {
        this.clock.tick(100);
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    QUnit.test('without argument hides all Toasts', function(assert) {
        assert.equal(this.getToastCount(), 2);

        hideToasts();

        assert.equal(this.getToastCount(), 0);
    });

    QUnit.skipInShadowDomMode('with string parameter hides Toasts with corresponding container', function(assert) {
        assert.equal(this.getToastCount(), 2);

        hideToasts(this.containerSelector);

        assert.equal(this.getToastCount(), 1);
    });

    QUnit.skipInShadowDomMode('with jQuery element parameter hides Toasts with corresponding container', function(assert) {
        assert.equal(this.getToastCount(), 2);

        hideToasts($(this.containerSelector));

        assert.equal(this.getToastCount(), 1);
    });

    QUnit.skipInShadowDomMode('with html element parameter hides Toasts with corresponding container', function(assert) {
        assert.equal(this.getToastCount(), 2);

        hideToasts($(this.containerSelector).get(0));

        assert.equal(this.getToastCount(), 1);
    });

    QUnit.test('with unexisted element parameter hides nothing', function(assert) {
        assert.equal(this.getToastCount(), 2);

        hideToasts($('#containerr').get(0));

        assert.equal(this.getToastCount(), 2);
    });
});
