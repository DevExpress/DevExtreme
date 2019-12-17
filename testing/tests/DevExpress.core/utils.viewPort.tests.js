var $ = require('jquery'),
    viewPortUtils = require('core/utils/view_port'),
    viewPort = viewPortUtils.value,
    viewPortChanged = viewPortUtils.changeCallback;

QUnit.module('viewPort utils', {
    beforeEach: function() {
        this._originalViewport = viewPort();
    },
    afterEach: function() {
        viewPort(this._originalViewport);
    }
});

QUnit.test('default viewPort is body when .dx-viewport element is not found', function(assert) {
    assert.equal(viewPort().get(0), $('body').get(0));
});

QUnit.test('custom viewPort element', function(assert) {
    assert.expect(3);

    var $customViewport = $('<div>').addClass('dx-custom-viewport');
    $('#qunit-fixture').append($customViewport);

    var callback = function(viewport, prevViewport) {
        assert.equal(viewport.get(0), $customViewport.get(0), 'new viewport passed');
        assert.equal(prevViewport.get(0), $('body').get(0), 'old viewport passed');
    };

    try {
        viewPortChanged.add(callback);

        viewPort($customViewport);

        assert.equal(viewPort().get(0), $customViewport.get(0), 'viewport was set');
    } finally {
        viewPortChanged.remove(callback);
    }
});

QUnit.test('when .dx-viewport is not found body should be previousViewport', function(assert) {
    $('#qunit-fixture').append($('<div class=\'dx-viewport\'>'));

    var callback = function(viewport, prevViewport) {
        assert.equal(prevViewport.get(0), $('body').get(0), 'old viewport is body');
    };

    try {
        viewPortChanged.add(callback);

        viewPort('.dx-viewport');
    } finally {
        viewPortChanged.remove(callback);
    }
});
