require('viz/tree_map/tree_map');

const $ = require('jquery');
const vizMocks = require('../../helpers/vizMocks.js');
const loadingIndicatorModule = require('viz/core/loading_indicator');
const DataSource = require('common/data/data_source/data_source').DataSource;

$('#qunit-fixture').append('<div id="test-container"></div>');

$('#test-container').css({
    width: '600px',
    height: '400px'
});

QUnit.module('Loading indicator', {
    beforeEach: function() {
        const loadingIndicator = this.loadingIndicator = new vizMocks.LoadingIndicator();
        loadingIndicatorModule.DEBUG_set_LoadingIndicator(sinon.spy(function() { return loadingIndicator; }));

        this.$container = $('#test-container');
    },

    createWidget: function(options) {
        return this.$container.dxTreeMap(options).dxTreeMap('instance');
    }
});

QUnit.test('Show', function(assert) {
    const widget = this.createWidget({
        loadingIndicator: { text: 'Some text' }
    });

    widget.showLoadingIndicator();

    const params = loadingIndicatorModule.LoadingIndicator.lastCall.args[0];
    assert.ok(params.renderer, 'param - renderer');
    assert.strictEqual(typeof params.eventTrigger, 'function', 'param - event trigger');
    assert.strictEqual(typeof params.notify, 'function', 'param - notify');
    assert.deepEqual(this.loadingIndicator.setSize.lastCall.args, [{ width: 600, height: 400, left: 0, top: 0, right: 0, bottom: 0 }], 'canvas');
    assert.deepEqual(this.loadingIndicator.setOptions.lastCall.args[0].text, 'Some text', 'options');
    assert.deepEqual(this.loadingIndicator.show.lastCall.args, [], 'show');
});

QUnit.test('Show when container is not visible', function(assert) {
    this.$container.hide();
    const widget = this.createWidget();

    widget.showLoadingIndicator();

    assert.deepEqual(this.loadingIndicator.setSize.lastCall.args, [{ width: 600, height: 400, left: 0, top: 0, right: 0, bottom: 0 }], 'canvas');
    assert.deepEqual(this.loadingIndicator.show.lastCall.args, [], 'show');
});

QUnit.test('Notification callback / true', function(assert) {
    const widget = this.createWidget();
    const spy = widget._stopCurrentHandling = sinon.spy();

    loadingIndicatorModule.LoadingIndicator.lastCall.args[0].notify(true);

    assert.strictEqual(widget.option('loadingIndicator.show'), true, 'option state');
    assert.deepEqual(spy.lastCall.args, [], 'current handlings are stopped');
});

QUnit.test('Notification callback / false', function(assert) {
    const widget = this.createWidget();

    loadingIndicatorModule.LoadingIndicator.lastCall.args[0].notify(false);

    assert.strictEqual(widget.option('loadingIndicator.show'), false, 'option state');
});

QUnit.test('Hide', function(assert) {
    const widget = this.createWidget();

    widget.hideLoadingIndicator();

    assert.deepEqual(this.loadingIndicator.hide.lastCall.args, [], 'hide');
});

QUnit.test('_scheduleLoadingIndicatorHiding', function(assert) {
    const widget = this.createWidget();

    widget._scheduleLoadingIndicatorHiding();

    assert.deepEqual(this.loadingIndicator.scheduleHiding.lastCall.args, [], 'scheduled');
});

QUnit.test('_fulfillLoadingIndicatorHiding', function(assert) {
    const widget = this.createWidget();

    widget._fulfillLoadingIndicatorHiding();

    assert.deepEqual(this.loadingIndicator.fulfillHiding.lastCall.args, [], 'fulfilled');
});

QUnit.test('\'loadingIndicator\' option', function(assert) {
    const widget = this.createWidget();
    widget.showLoadingIndicator();

    widget.option('loadingIndicator', { backgroundColor: 'red' });

    assert.deepEqual(this.loadingIndicator.setOptions.lastCall.args[0].backgroundColor, 'red', 'options');
    assert.strictEqual(this.loadingIndicator.stub('hide').lastCall, null, 'not hidden'); // Why hidden?
});

QUnit.test('Hidden when theme is changed', function(assert) {
    const widget = this.createWidget();
    widget.showLoadingIndicator();

    widget.option('theme', 'test-theme');

    assert.deepEqual(this.loadingIndicator.scheduleHiding.lastCall.args, [], 'schedule');
    assert.deepEqual(this.loadingIndicator.fulfillHiding.lastCall.args, [], 'fulfilled');
});

QUnit.test('Hidden when option is set to the same value', function(assert) {
    const widget = this.createWidget({
        theme: 'test-theme'
    });
    widget.showLoadingIndicator();
    this.loadingIndicator.scheduleHiding.reset();
    this.loadingIndicator.fulfillHiding.reset();
    widget.option('theme', 'test-theme');
    assert.deepEqual(this.loadingIndicator.scheduleHiding.lastCall.args, [], 'schedule');
    assert.deepEqual(this.loadingIndicator.fulfillHiding.lastCall.args, [], 'fulfilled');
});

QUnit.test('Hidden when data source is changed', function(assert) {
    const widget = this.createWidget();
    widget.showLoadingIndicator();

    widget.option('dataSource', [{ value: 1 }]);

    assert.deepEqual(this.loadingIndicator.scheduleHiding.lastCall.args, [], 'schedule');
    assert.deepEqual(this.loadingIndicator.fulfillHiding.lastCall.args, [], 'fulfilled');
});

QUnit.test('Hiding is scheduled on any option change', function(assert) {
    const widget = this.createWidget();

    widget.option('test-option', 'test-value');

    assert.deepEqual(this.loadingIndicator.scheduleHiding.lastCall.args, []);
});

QUnit.test('Depends on theme', function(assert) {
    const widget = this.createWidget();
    this.loadingIndicator.setOptions.reset();

    widget.option('theme', 'test-theme');

    assert.strictEqual(this.loadingIndicator.setOptions.callCount, 1);
});

QUnit.test('Do not show loading indicator if data source loading and loadingIndicator is disabled', function(assert) {
    this.createWidget({
        dataSource: new DataSource({
            store: []
        }),
        loadingIndicator: {
            enabled: false
        }
    });

    assert.equal(this.loadingIndicator.stub('show').callCount, 0);
});

QUnit.test('Show loading indicator if data source loading', function(assert) {
    this.createWidget({
        dataSource: new DataSource({
            store: []
        }),
        loadingIndicator: {
            enabled: true
        }
    });

    assert.equal(this.loadingIndicator.show.callCount, 1);
});

QUnit.test('Show loading indicator on each loading of data', function(assert) {
    const data = new DataSource({
        store: []
    });

    this.createWidget({
        dataSource: data,
        loadingIndicator: {
            enabled: true
        }
    });

    this.loadingIndicator.show.reset();

    const N = 10;
    for(let i = 0; i < N; i++) {
        data.load();
    }

    assert.equal(this.loadingIndicator.show.callCount, N);
});
