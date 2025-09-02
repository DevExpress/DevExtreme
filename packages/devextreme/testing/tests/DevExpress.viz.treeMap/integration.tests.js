import common from './commonParts/common.js';

// The following list is to be manually kept synchronized with the registry
import 'viz/tree_map/tree_map';

QUnit.module('Integration', common.environment);

QUnit.test('Customize on initialized event', function(assert) {
    common.createWidget({
        dataSource: [{
            value: 1
        }, {
            value: 2
        }],
        onNodesInitialized: function(e) {
            e.root.getChild(1).customize({
                color: 'red'
            });
        }
    });

    assert.strictEqual(this.tile(1).attr.getCall(0).args[0].fill, 'red', 'settings');
});
