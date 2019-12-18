var noop = require('core/utils/common').noop,
    vizMocks = require('../../helpers/vizMocks.js'),
    loadingIndicatorModule = require('viz/core/loading_indicator');

QUnit.module('Common', {
    beforeEach: function() {
        this.renderer = new vizMocks.Renderer();
        this.eventTrigger = sinon.spy();
        this.notify = sinon.spy();
        this.loadingIndicator = new loadingIndicatorModule.LoadingIndicator({ renderer: this.renderer, eventTrigger: this.eventTrigger, notify: this.notify });
        this.group = this.renderer.g.lastCall.returnValue;
        this.rect = this.renderer.rect.lastCall.returnValue;
        this.text = this.renderer.text.lastCall.returnValue;
    },

    afterEach: function() {
        this.loadingIndicator.dispose();
    },

    checkAnimation: function(assert, opacity) {
        assert.deepEqual(this.rect.stopAnimation.lastCall.args, [], 'rect animation is stopped');
        assert.deepEqual(this.rect.animate.lastCall.args, [{ opacity: opacity }, { easing: 'linear', duration: 400, unstoppable: true, complete: this.rect.animate.lastCall.args[1].complete }], 'rect animation is started');
    },

    reset: function() {
        this.eventTrigger.reset();
        this.notify.reset();
        this.renderer.root.stub('attr').reset();
        this.rect.stub('animate').reset();
        this.group.stub('linkAppend').reset();
        this.group.stub('linkRemove').reset();
    }
});

QUnit.test('Construction', function(assert) {
    assert.deepEqual(this.group.attr.lastCall.args, [{ 'class': 'dx-loading-indicator' }], 'root settings');
    assert.deepEqual(this.group.linkOn.lastCall.args, [this.renderer.root, { name: 'loading-indicator', after: 'peripheral' }], 'root is linked to container');
    assert.deepEqual(this.rect.append.lastCall.args, [this.group], 'rect is appended to root');
    assert.deepEqual(this.rect.attr.lastCall.args, [{ opacity: 0 }], 'rect settings');
    assert.deepEqual(this.renderer.text.lastCall.args, [], 'text is created');
    assert.deepEqual(this.text.append.lastCall.args, [this.group], 'text is appended to root');
    assert.deepEqual(this.text.attr.lastCall.args, [{ align: 'center' }], 'text settings');
});

QUnit.test('Disposing', function(assert) {
    this.loadingIndicator.dispose();
    this.loadingIndicator.dispose = noop; // To prevent crash on `afterEach`; `dispose` is not expected to be reenterable

    assert.deepEqual(this.group.linkRemove.lastCall.args, [], 'root is removed');
    assert.deepEqual(this.group.linkOff.lastCall.args, [], 'root is unlinked');
});

QUnit.test('Show', function(assert) {
    this.loadingIndicator.show();

    assert.deepEqual(this.group.linkAppend.lastCall.args, [], 'group is appended to container');
    assert.deepEqual(this.renderer.root.css.lastCall.args, [{ 'pointer-events': 'none' }], 'renderer root style');
    this.checkAnimation(assert, 0.85);
    assert.deepEqual(this.notify.lastCall.args, [true], 'notification');
    assert.strictEqual(this.eventTrigger.lastCall, null, 'no event');
    this.rect.animate.lastCall.args[1].complete();
    assert.deepEqual(this.eventTrigger.lastCall.args, ['loadingIndicatorReady'], 'event');
});

QUnit.test('Hide', function(assert) {
    this.loadingIndicator.show();
    this.reset();

    this.loadingIndicator.hide();

    assert.strictEqual(this.group.linkRemove.lastCall, null, 'group is not removed from container');
    assert.strictEqual(this.renderer.root.attr.lastCall, null, 'renderer root settings');
    this.checkAnimation(assert, 0);
    assert.deepEqual(this.notify.lastCall.args, [false], 'notification');
    assert.strictEqual(this.eventTrigger.lastCall, null, 'no event');
    this.rect.animate.lastCall.args[1].complete();
    assert.deepEqual(this.group.linkRemove.lastCall.args, [], 'group is removed from container');
    assert.deepEqual(this.renderer.root.css.lastCall.args, [{ 'pointer-events': '' }], 'renderer root style');
    assert.deepEqual(this.eventTrigger.lastCall.args, ['loadingIndicatorReady'], 'event');
});

QUnit.test('Show when already shown', function(assert) {
    this.loadingIndicator.show();
    this.reset();

    this.loadingIndicator.show();

    assert.strictEqual(this.rect.animate.lastCall, null, 'rect is not animated');
    assert.strictEqual(this.group.linkAppend.lastCall, null, 'group is not appended to container');
    assert.strictEqual(this.notify.lastCall, null, 'no notification');
    assert.strictEqual(this.eventTrigger.lastCall, null, 'no event');
});

QUnit.test('Hide when already hidden', function(assert) {
    this.loadingIndicator.hide();
    this.reset();

    this.loadingIndicator.hide();

    assert.strictEqual(this.rect.animate.lastCall, null, 'rect is not animated');
    assert.strictEqual(this.group.linkRemove.lastCall, null, 'group is not removed from container');
    assert.strictEqual(this.notify.lastCall, null, 'no notification');
    assert.strictEqual(this.eventTrigger.lastCall, null, 'no event');
});

QUnit.test('Set size', function(assert) {
    this.loadingIndicator.setSize({ width: 400, height: 300 });

    assert.deepEqual(this.rect.attr.lastCall.args, [{ width: 400, height: 300 }], 'rect settings');
    assert.deepEqual(this.text.attr.lastCall.args, [{ x: 200, y: 150 }], 'text settings');
});

QUnit.test('Set options / `show` is false', function(assert) {
    var show = sinon.spy(this.loadingIndicator, 'show'),
        hide = sinon.spy(this.loadingIndicator, 'hide');
    this.loadingIndicator.setOptions({
        backgroundColor: 'red',
        font: { size: 13, color: 'blue' },
        text: 'Loading...',
        show: false,
        cssClass: 'loadingindicator_class'
    });

    assert.deepEqual(this.rect.attr.lastCall.args, [{ fill: 'red' }], 'rect settings');
    assert.deepEqual(this.text.attr.lastCall.args, [{ text: 'Loading...', 'class': 'loadingindicator_class' }], 'text settings');
    assert.deepEqual(this.text.css.lastCall.args, [{ fill: 'blue', 'font-size': 13 }], 'text css');
    assert.strictEqual(show.lastCall, null, 'show is not called');
    assert.deepEqual(hide.lastCall.args, [], 'hide is called');
});

QUnit.test('Set options / `show` is true', function(assert) {
    var show = sinon.spy(this.loadingIndicator, 'show'),
        hide = sinon.spy(this.loadingIndicator, 'hide');
    this.loadingIndicator.setOptions({
        backgroundColor: 'red', font: { size: 13, color: 'blue' }, text: 'Loading...', show: true
    });

    assert.deepEqual(this.rect.attr.lastCall.args, [{ fill: 'red' }], 'rect settings');
    assert.deepEqual(this.text.attr.lastCall.args, [{ text: 'Loading...', 'class': undefined }], 'text settings');
    assert.deepEqual(this.text.css.lastCall.args, [{ fill: 'blue', 'font-size': 13 }], 'text css');
    assert.deepEqual(show.lastCall.args, [], 'show is called');
    assert.strictEqual(hide.lastCall, null, 'hide is not called');
});

QUnit.module('Scheduling', {
    beforeEach: function() {
        var that = this;
        that.loadingIndicator = new loadingIndicatorModule.LoadingIndicator({
            renderer: new vizMocks.Renderer(),
            eventTrigger: noop,
            notify: function() {
                that.notify && that.notify.apply(that, arguments);
            }
        });
        that.hide = sinon.spy(that.loadingIndicator, 'hide');
    },

    afterEach: function() {
        this.loadingIndicator.dispose();
    }
});

QUnit.test('Fulfill scheduled hiding', function(assert) {
    this.loadingIndicator.scheduleHiding();

    this.loadingIndicator.fulfillHiding();

    assert.deepEqual(this.hide.lastCall.args, []);
});

QUnit.test('Fulfill non scheduled hiding', function(assert) {
    this.loadingIndicator.fulfillHiding();

    assert.strictEqual(this.hide.lastCall, null);
});

QUnit.test('Fulfill hiding canceled by \'show\'', function(assert) {
    this.loadingIndicator.scheduleHiding();
    this.loadingIndicator.show();

    this.loadingIndicator.fulfillHiding();

    assert.strictEqual(this.hide.lastCall, null);
});

QUnit.test('Fulfill hiding canceled by \'hide\'', function(assert) {
    this.loadingIndicator.show();
    this.loadingIndicator.scheduleHiding();
    this.loadingIndicator.hide();
    this.hide.reset();

    this.loadingIndicator.fulfillHiding();

    assert.strictEqual(this.hide.lastCall, null);
});

QUnit.test('Hiding is not scheduled on show', function(assert) {
    var loadingIndicator = this.loadingIndicator;
    this.notify = function() {
        loadingIndicator.scheduleHiding();
    };

    loadingIndicator.show();
    loadingIndicator.fulfillHiding();

    assert.strictEqual(this.hide.lastCall, null);
});

QUnit.test('Hiding is not scheduled on hide', function(assert) {
    var loadingIndicator = this.loadingIndicator;
    loadingIndicator.show();
    this.notify = function() {
        loadingIndicator.scheduleHiding();
    };

    loadingIndicator.hide();
    this.hide.reset();
    loadingIndicator.fulfillHiding();

    assert.strictEqual(this.hide.lastCall, null);
});
