var $ = require('jquery'),
    renderer = require('core/renderer'),
    commons = require('./vectorMapParts/commons.js'),
    mapLayerModule = require('viz/vector_map/map_layer'),
    projectionModule = require('viz/vector_map/projection.main'),
    resizeCallbacks = require('core/utils/resize_callbacks'),
    vizMocks = require('../../helpers/vizMocks.js');

QUnit.module('Map - projection events', commons.environment);

QUnit.test('On center', function(assert) {
    var onCenterChanged = sinon.spy(),
        spy = sinon.spy(projectionModule, 'Projection');
    this.createMap({ onCenterChanged: onCenterChanged });

    spy.lastCall.args[0].centerChanged('test-center');

    assert.deepEqual(onCenterChanged.lastCall.args[0].center, 'test-center');
});

QUnit.test('On zoom', function(assert) {
    var onZoomFactorChanged = sinon.spy(),
        spy = sinon.spy(projectionModule, 'Projection');
    this.createMap({ onZoomFactorChanged: onZoomFactorChanged });

    spy.lastCall.args[0].zoomChanged('test-zoom');

    assert.deepEqual(onZoomFactorChanged.lastCall.args[0].zoomFactor, 'test-zoom');
});

QUnit.module('Map - event trigger interaction', $.extend({}, commons.environment, {
    createMap: function() {
        var spy = sinon.spy(mapLayerModule, 'MapLayerCollection');
        commons.environment.createMap.apply(this, arguments);
        this.eventTrigger = spy.lastCall.args[0].eventTrigger;
    },

    trigger: function() {
        this.eventTrigger.apply(this.eventTrigger, arguments);
    }
}));

var environmentForSize = $.extend({}, commons.environment, {
    beforeEach: function() {
        commons.environment.beforeEach.apply(this, arguments);
        vizMocks.stubIncidentOccurredCreation();
    },

    afterEach: function() {
        vizMocks.restoreIncidentOccurredCreation();
        commons.environment.afterEach.apply(this, arguments);
    },

    setContainerSize: function(width, height) {
        renderer.fn.width = commons.returnValue(width);
        renderer.fn.height = commons.returnValue(height);
    },

    checkSizes: function(assert, expected) {
        assert.deepEqual(this.layerCollection.setRect.lastCall.args, [[expected.left, expected.top, expected.width, expected.height]], 'layer collection');
        assert.deepEqual(this.projection.setSize.lastCall.args, [expected], 'projection');
        assert.deepEqual(this.layoutControl.setSize.lastCall.args, [expected], 'layout');
    }
});

QUnit.module('Map - size', environmentForSize);

QUnit.test('Option is not defined, container has no sizes', function(assert) {
    this.setContainerSize(0, 0);

    this.createMap();

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 800, height: 400 });
});

QUnit.test('Option is not defined, container has sizes', function(assert) {
    this.setContainerSize(350, 130);

    this.createMap();

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 350, height: 130 });
});

QUnit.test('Option is not defined, container has not all sizes', function(assert) {
    this.setContainerSize(200, 0);

    this.createMap();

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 200, height: 400 });
});

QUnit.test('Option is not valid, container has no sizes', function(assert) {
    this.setContainerSize(0, 0);

    this.createMap({ size: { width: 'test', height: -5 } });

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 });
});

QUnit.test('Option is partially not valid, container has sizes', function(assert) {
    this.setContainerSize(400, 300);

    this.createMap({ size: { width: 500, height: 'a' } });

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 500, height: 300 });
});

QUnit.test('Option is valid', function(assert) {
    this.setContainerSize(400, 300);

    this.createMap({ size: { width: '1000', height: '700' } });

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 1000, height: 700 });
});

QUnit.test('Option is zeros', function(assert) {
    this.setContainerSize(400, 300);

    this.createMap({ size: { width: 0, height: 0 } });

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 0, height: 0 });
});

QUnit.test('With top title without export menu', function(assert) {
    this.setContainerSize(400, 300);
    this.title.stub('layoutOptions').returns({ horizontalAlignment: 'left', verticalAlignment: 'top' });
    this.title.stub('measure').returns([200, 50]);
    this.createMap();

    this.checkSizes(assert, { left: 0, right: 0, top: 50, bottom: 0, width: 400, height: 250 });
    assert.deepEqual(this.title.measure.lastCall.args, [[400, 300]], 'title - measure');
    assert.deepEqual(this.title.move.lastCall.args[0], [0, 0, 200, 50], 'title - move');
});

QUnit.test('With top title with export menu', function(assert) {
    this.setContainerSize(400, 300);
    this.title.stub('layoutOptions').returns({ horizontalAlignment: 'left', verticalAlignment: 'top' });
    this.title.stub('measure').returns([200, 50]);
    this.exportMenu.stub('layoutOptions').returns({ horizontalAlignment: 'right', verticalAlignment: 'top', weak: true });
    this.exportMenu.stub('measure').returns([40, 40]);

    this.createMap({
        'export': {
            enabled: true
        }
    });

    this.checkSizes(assert, { left: 0, right: 0, top: 50, bottom: 0, width: 400, height: 250 });
    assert.deepEqual(this.title.measure.lastCall.args, [[360, 300]], 'title - measure');
    assert.deepEqual(this.title.move.lastCall.args, [[0, 0, 200, 50], [0, 0, 200, 50]], 'title - move');
    assert.deepEqual(this.exportMenu.measure.lastCall.args, [[400, 300]], 'export menu - measure');
    assert.deepEqual(this.exportMenu.move.lastCall.args, [[360, 0, 400, 50]], 'export menu - move');
});

QUnit.test('With bottom title and exportMenu', function(assert) {
    this.setContainerSize(400, 300);
    this.title.stub('layoutOptions').returns({ horizontalAlignment: 'center', verticalAlignment: 'bottom' });
    this.title.stub('measure').returns([200, 50]);
    this.exportMenu.stub('layoutOptions').returns({ horizontalAlignment: 'left', verticalAlignment: 'top', weak: true });
    this.exportMenu.stub('measure').returns([40, 40]);

    this.createMap({
        'export': {
            enabled: true
        }
    });

    this.checkSizes(assert, { left: 0, right: 0, top: 40, bottom: 0, width: 400, height: 210 });
    assert.deepEqual(this.title.measure.lastCall.args[0], [400, 260], 'title - measure');
    assert.deepEqual(this.title.move.lastCall.args[0], [100, 250, 300, 300], 'title - move');
    assert.deepEqual(this.exportMenu.measure.lastCall.args, [[400, 300]], 'export menu - measure');
    assert.deepEqual(this.exportMenu.move.lastCall.args[0], [0, 0, 40, 40], 'export menu - move');
});

QUnit.module('Map - resizing', $.extend({}, environmentForSize, {
    beforeEach: function() {
        environmentForSize.beforeEach.apply(this, arguments);
        this.clock = sinon.useFakeTimers();
    },

    afterEach: function() {
        this.clock.restore();
        environmentForSize.afterEach.apply(this, arguments);
    },

    emulateResize: function() {
        resizeCallbacks.fire();
        this.clock.tick(100);
    }
}));

QUnit.test('Not resized if container size is not changed', function(assert) {
    this.setContainerSize(400, 200);
    this.createMap();

    this.emulateResize();

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 200 });
});

QUnit.test('Resized if container size is changed', function(assert) {
    this.setContainerSize(400, 200);
    this.createMap();
    this.setContainerSize(500, 100);

    this.emulateResize();

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 500, height: 100 });
});

QUnit.test('Not resized if container size is changed but size option is defined', function(assert) {
    this.setContainerSize(400, 200);
    this.createMap({ size: { width: 300, height: 500 } });
    this.setContainerSize(500, 100);

    this.emulateResize();

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 300, height: 500 });
});

QUnit.test('Resizing via *render* method - resized', function(assert) {
    this.setContainerSize(400, 200);
    this.createMap();
    this.setContainerSize(300, 500);

    this.map.render();

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 300, height: 500 });
});

QUnit.test('Resizing via *render* method - not resized', function(assert) {
    this.setContainerSize(400, 200);
    this.createMap();

    this.map.render();

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 400, height: 200 });
});

QUnit.test('resize via option', function(assert) {
    this.createMap();
    var invalidate = sinon.stub(this.map, '_invalidate');

    this.map.option('size', { width: 100, height: 200 });

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 100, height: 200 });
    assert.strictEqual(invalidate.lastCall, null, 'not invalidated');
});

QUnit.test('Resized with top title', function(assert) {
    this.setContainerSize(400, 200);
    this.title.stub('layoutOptions').returns({ horizontalAlignment: 'left', verticalAlignment: 'top' });
    this.title.stub('measure').returns([500, 50]);

    this.createMap();
    this.setContainerSize(500, 100);

    this.emulateResize();

    this.checkSizes(assert, { left: 0, right: 0, top: 50, bottom: 0, width: 500, height: 50 });
});

QUnit.test('Resized with bottom title', function(assert) {
    this.setContainerSize(400, 200);
    this.title.stub('layoutOptions').returns({ horizontalAlignment: 'left', verticalAlignment: 'bottom' });
    this.title.stub('measure').returns([500, 50]);

    this.createMap();
    this.setContainerSize(500, 100);

    this.emulateResize();

    this.checkSizes(assert, { left: 0, right: 0, top: 0, bottom: 0, width: 500, height: 50 });
});
