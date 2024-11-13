const $ = require('jquery');
const loading = require('__internal/scheduler/m_loading');
const viewPort = require('core/utils/view_port').value;
const fx = require('common/core/animation/fx');
const LoadPanel = require('ui/load_panel');

QUnit.module('loading tests', {
    beforeEach: function() {
        fx.off = true;
        viewPort('#qunit-fixture');
    },

    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('show loadPanel', function(assert) {
    loading.show();

    assert.equal($('.dx-loadpanel-wrapper').length, 1);
    assert.ok($('.dx-loadpanel').dxLoadPanel('instance') instanceof LoadPanel, 'instance is ok');
});

QUnit.test('hide loadPanel', function(assert) {
    loading.show({
        position: { at: 'center' }
    });

    loading.hide();
    assert.equal($('.dx-loadpanel').length, 0);
});

QUnit.test('loadPanel options are right', function(assert) {
    loading.show({
        position: { at: 'center' },
        width: 222,
        height: 90,
        message: 'Loading ...'
    });

    const loadingInstance = $('.dx-loadpanel').dxLoadPanel('instance');

    assert.equal(loadingInstance.option('width'), 222);
    assert.equal(loadingInstance.option('position.at'), 'center');
    assert.equal(loadingInstance.option('message'), 'Loading ...');
});

QUnit.test('loadPanel can be attached to container', function(assert) {
    const $container = $('<div class="container">');

    loading.show({
        container: $container
    });

    assert.equal($container.find('.dx-loadpanel').length, 1, 'loadpanel was rendered');
});
