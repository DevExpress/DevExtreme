require('viz/tree_map/tree_map');

var $ = require('jquery'),
    vizMocks = require('../../helpers/vizMocks.js'),
    module = require('viz/core/title');

$('#qunit-fixture').append('<div id="test-container" style="width: 600px; height: 400px;"></div>');

QUnit.module('Title', {
    beforeEach: function() {
        var title = this.title = new vizMocks.Title();
        module.Title = sinon.spy(function() { return title; });
        this.$container = $('#test-container');
    },

    createWidget: function(options) {
        return this.$container.dxTreeMap(options).dxTreeMap('instance');
    }
});

QUnit.test('Creation', function(assert) {
    this.createWidget();

    var params = module.Title.lastCall.args[0];
    assert.ok(params.renderer, 'param - renderer');
    assert.ok(typeof params.incidentOccurred === 'function', 'param - incident occurred');
    assert.strictEqual(params.cssClass, 'dxtm-title', 'param - css class');
});

QUnit.test('Destruction', function(assert) {
    this.createWidget();

    this.$container.remove();

    assert.deepEqual(this.title.dispose.lastCall.args, [], 'destroyed');
});

QUnit.test('Options and canvas', function(assert) {
    this.title.stub('layoutOptions').returns({ horizontalAlignment: 'left', verticalAlignment: 'top' });
    this.title.stub('measure').returns([100, 80]);
    var widget = this.createWidget({
        title: 'Hello'
    });

    assert.deepEqual(this.title.update.lastCall.args[0], widget._themeManager.theme('title'), 'theme options');
    assert.strictEqual(this.title.update.lastCall.args[1], 'Hello', 'user options');
    assert.deepEqual(this.title.measure.lastCall.args, [[600, 400]], 'size');
});

QUnit.test('Depends on theme', function(assert) {
    var widget = this.createWidget();
    this.title.update.reset();

    widget.option('theme', 'test-theme');

    assert.strictEqual(this.title.update.callCount, 1);
});

QUnit.test('title / size is changed', function(assert) {
    this.title.stub('layoutOptions').returns({ horizontalAlignment: 'left', verticalAlignment: 'top' });
    this.title.stub('measure').returns([100, 80]);
    var widget = this.createWidget({
        title: 'title-options'
    });
    this.title.stub('update').returns(true);
    this.title.measure.reset();

    widget.option({ title: 'new-title-options' });

    assert.strictEqual(this.title.update.lastCall.args[1], 'new-title-options', 'options');
    assert.strictEqual(this.title.measure.callCount, 1, 'layout');
});

QUnit.test('title / size is not changed', function(assert) {
    this.title.stub('layoutOptions').returns({ horizontalAlignment: 'left', verticalAlignment: 'top' });
    this.title.stub('measure').returns([100, 80]);
    var widget = this.createWidget({
        title: 'title-options'
    });
    this.title.stub('update').returns(false);
    this.title.measure.reset();

    widget.option({ title: 'new-title-options' });

    assert.strictEqual(this.title.update.lastCall.args[1], 'new-title-options', 'options');
    assert.strictEqual(this.title.measure.callCount, 0, 'no layout');
});
