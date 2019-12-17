var common = require('./commonParts/common.js'),
    $ = require('jquery');

require('viz/tree_map/api');
require('viz/tree_map/tracker');

QUnit.module('T438413, two widgets', common.environment);

QUnit.test('After change options that reset nodes (e.g. maxDepth)', function(assert) {
    var widget = common.createWidget({
            dataSource: [{
                items: [{
                    value: 1
                }, {
                    value: 2
                }]
            }]
        }),
        args = this.tile(3).data.lastCall.args,
        renderer = this.renderer;

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
    var widget = common.createWidget({
            dataSource: [{
                items: [{
                    value: 1
                }, {
                    value: 2
                }]
            }]
        }),
        renderer = this.renderer;

    common.createRenderer();
    $('<div>').css({ width: 600, height: 400 }).appendTo('#qunit-fixture').dxTreeMap({
        dataSource: []
    });
    this.renderer = renderer;
    widget.option({ valueField: 'value' });

    assert.ok(widget.getRootNode());
});
