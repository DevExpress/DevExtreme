const common = require('./commonParts/common.js');
const $ = require('jquery');

require('viz/tree_map/api');
require('viz/tree_map/tracker');

QUnit.module('T438413, two widgets', common.environment);

QUnit.test('After change options that reset nodes (e.g. maxDepth)', function(assert) {
    const widget = common.createWidget({
        dataSource: [{
            items: [{
                value: 1
            }, {
                value: 2
            }]
        }]
    });
    const args = this.tile(3).data.lastCall.args;
    const renderer = this.renderer;

    common.createRenderer();
    $('<div>').css({ width: 600, height: 400 }).appendTo('#qunit-fixture').dxTreeMap({
        dataSource: []
    });
    this.renderer = renderer;

    this.renderer.simpleRect.reset();
    widget.option({ maxDepth: 2 });

    assert.deepEqual(this.tile(3).data.lastCall.args, args);
});

QUnit.test('Change valueField option', function(assert) {
    const widget = common.createWidget({
        dataSource: [{
            items: [{
                value: 1
            }, {
                value: 2
            }]
        }]
    });
    const renderer = this.renderer;

    common.createRenderer();
    $('<div>').css({ width: 600, height: 400 }).appendTo('#qunit-fixture').dxTreeMap({
        dataSource: []
    });
    this.renderer = renderer;
    widget.option({ valueField: 'value' });

    assert.ok(widget.getRootNode());
});
