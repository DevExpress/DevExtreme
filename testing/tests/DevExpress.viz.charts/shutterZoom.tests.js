var pointerMock = require('../../helpers/pointerMock.js'),
    vizMocks = require('../../helpers/vizMocks.js'),
    shutterPlugin = require('viz/chart_components/shutter_zoom');

QUnit.module('Shutter zoom plugin', {
    initWidget: function(options) {
        this.eventSpy = sinon.spy();
        this.renderer = new vizMocks.Renderer();
        this.renderer.offsetTemplate = { left: 10, top: 5 };

        var chartMock = {
            option: function(name) {
                return options[name];
            },
            _renderer: this.renderer,
            _eventTrigger: this.eventSpy,
            _argumentAxes: [{
                getTranslator: function() {
                    return {
                        from: function(val) {
                            return {
                                100: 0,
                                200: 1,
                                300: 2,
                                400: 3,
                                500: 4,
                                600: 5,
                                700: 6,
                                800: 7,
                                900: 8,
                                1000: 9,
                                1100: 10
                            }[val];
                        }
                    };
                }
            }],
            _canvas: { width: 1200, height: 600 },
            panes: [{
                canvas: { left: 100, top: 50, right: 100, bottom: 300 }
            }, {
                canvas: { left: 100, top: 300, right: 100, bottom: 50 }
            }]
        };

        shutterPlugin.init.call(chartMock);

        this.pointer = pointerMock(chartMock._renderer.root.element).start();
        return chartMock;
    }
});

QUnit.test('Create detached shutter rect with given options on init', function(assert) {
    // act
    this.initWidget({
        shutterZoom: {
            enabled: true,
            fill: 'red',
            'stroke-width': 10,
            stroke: 'blue',
            opacity: 0.5
        }
    });

    // assert
    var rect = this.renderer.rect.lastCall.returnValue;
    assert.deepEqual(rect.attr.lastCall.args, [{
        enabled: true,
        fill: 'red',
        'stroke-width': 10,
        stroke: 'blue',
        opacity: 0.5
    }]);
    assert.strictEqual(rect.stub('append').callCount, 0);
});

QUnit.test('Append shutter rect with right size on start dragging', function(assert) {
    this.initWidget({
        shutterZoom: {
            enabled: true,
            fill: 'red',
            'stroke-width': 10,
            stroke: 'blue',
            opacity: 0.5
        }
    });

    // act
    this.pointer.down(300 + 10, 250 + 5).dragStart();

    // assert
    var rect = this.renderer.rect.lastCall.returnValue;
    assert.deepEqual(rect.attr.lastCall.args, [{
        x: 100,
        y: 50,
        width: 1000,
        height: 500
    }]);
    assert.deepEqual(rect.append.lastCall.args, [this.renderer.root]);
});

QUnit.test('Change shutter rect x and width on dragging', function(assert) {
    this.initWidget({
        shutterZoom: {
            enabled: true,
            fill: 'red',
            'stroke-width': 10,
            stroke: 'blue',
            opacity: 0.5
        }
    });

    // act
    this.pointer.down(300 + 10, 250 + 5).dragStart().drag(400, 50);

    // assert
    var rect = this.renderer.rect.lastCall.returnValue;
    assert.deepEqual(rect.attr.lastCall.args, [{
        x: 300,
        width: 400
    }]);
});

QUnit.test('Change shutter rect with right x and width on dragging when cursor moves out of canvas', function(assert) {
    this.initWidget({
        shutterZoom: {
            enabled: true,
            fill: 'red',
            'stroke-width': 10,
            stroke: 'blue',
            opacity: 0.5
        }
    });

    // act
    this.pointer.down(300 + 10, 250 + 5).dragStart().drag(1000, 50);

    // assert
    var rect = this.renderer.rect.lastCall.returnValue;
    assert.deepEqual(rect.attr.lastCall.args, [{
        x: 300,
        width: 800
    }]);
});

QUnit.test('Change shutter rect y and height on dragging if chart is rotated', function(assert) {
    this.initWidget({
        rotated: true,
        shutterZoom: {
            enabled: true,
            fill: 'red',
            'stroke-width': 10,
            stroke: 'blue',
            opacity: 0.5
        }
    });

    // act
    this.pointer.down(300 + 10, 200 + 5).dragStart().drag(5, 100);

    // assert
    var rect = this.renderer.rect.lastCall.returnValue;
    assert.deepEqual(rect.attr.lastCall.args, [{
        y: 200,
        height: 100
    }]);
});

QUnit.test('Change shutter rect with right y and height on dragging if chart is rotated when cursor moves out of canvas', function(assert) {
    this.initWidget({
        rotated: true,
        shutterZoom: {
            enabled: true,
            fill: 'red',
            'stroke-width': 10,
            stroke: 'blue',
            opacity: 0.5
        }
    });

    // act
    this.pointer.down(300 + 10, 200 + 5).dragStart().drag(5, 500);

    // assert
    var rect = this.renderer.rect.lastCall.returnValue;
    assert.deepEqual(rect.attr.lastCall.args, [{
        y: 200,
        height: 350
    }]);
});

QUnit.test('Detach shutter rect on end dragging', function(assert) {
    this.initWidget({
        shutterZoom: {
            enabled: true,
            fill: 'red',
            'stroke-width': 10,
            stroke: 'blue',
            opacity: 0.5
        }
    });

    // act
    this.pointer.down(300 + 10, 250 + 5).dragStart().drag(400, 50).dragEnd();

    // assert
    var rect = this.renderer.rect.lastCall.returnValue;
    assert.strictEqual(rect.remove.callCount, 1);
});

QUnit.test('Fire zoomStart event on start dragging', function(assert) {
    this.initWidget({
        shutterZoom: {
            enabled: true
        }
    });

    // act
    this.pointer.down(300 + 10, 250 + 5).dragStart();

    // assert
    assert.deepEqual(this.eventSpy.firstCall.args, ['zoomStart']);
});

QUnit.test('Fire zoomEnd event on end dragging', function(assert) {
    this.initWidget({
        shutterZoom: {
            enabled: true
        }
    });

    // act
    this.pointer.down(300 + 10, 250 + 5).dragStart().drag(400, 50).dragEnd();

    // assert
    assert.deepEqual(this.eventSpy.lastCall.args, ['zoomEnd', { rangeStart: 2, rangeEnd: 6 }]);
});

QUnit.test('Fire zoomEnd event on end dragging, rotated', function(assert) {
    this.initWidget({
        rotated: true,
        shutterZoom: {
            enabled: true
        }
    });

    // act
    this.pointer.down(300 + 10, 100 + 5).dragStart().drag(400, 200).dragEnd();

    // assert
    assert.deepEqual(this.eventSpy.lastCall.args, ['zoomEnd', { rangeStart: 0, rangeEnd: 2 }]);
});

QUnit.test('Fire zoomEnd event with ordered params when drag from end to start', function(assert) {
    this.initWidget({
        shutterZoom: {
            enabled: true
        }
    });

    // act
    this.pointer.down(700 + 10, 250 + 5).dragStart().drag(-400, 50).dragEnd();

    // assert
    assert.deepEqual(this.eventSpy.lastCall.args, ['zoomEnd', { rangeStart: 2, rangeEnd: 6 }]);
});

QUnit.test('Do nothing if start dragging out of canvas on left', function(assert) {
    this.initWidget({
        shutterZoom: {
            enabled: true
        }
    });

    // act
    this.pointer.down(50, 250).dragStart();

    // assert
    assert.strictEqual(this.eventSpy.callCount, 0);
    assert.strictEqual(this.pointer.lastEvent().cancel, true);
    assert.strictEqual(this.renderer.rect.lastCall.returnValue.stub('append').callCount, 0);
});

QUnit.test('Do nothing if start dragging out of canvas on right', function(assert) {
    this.initWidget({
        shutterZoom: {
            enabled: true
        }
    });

    // act
    this.pointer.down(1150, 250).dragStart();

    // assert
    assert.strictEqual(this.eventSpy.callCount, 0);
    assert.strictEqual(this.pointer.lastEvent().cancel, true);
    assert.strictEqual(this.renderer.rect.lastCall.returnValue.stub('append').callCount, 0);
});

QUnit.test('Do nothing if start dragging out of canvas on top', function(assert) {
    this.initWidget({
        shutterZoom: {
            enabled: true
        }
    });

    // act
    this.pointer.down(300, 25).dragStart();

    // assert
    assert.strictEqual(this.eventSpy.callCount, 0);
    assert.strictEqual(this.pointer.lastEvent().cancel, true);
    assert.strictEqual(this.renderer.rect.lastCall.returnValue.stub('append').callCount, 0);
});

QUnit.test('Do nothing if start dragging out of canvas on bottom', function(assert) {
    this.initWidget({
        shutterZoom: {
            enabled: true
        }
    });

    // act
    this.pointer.down(700, 575).dragStart();

    // assert
    assert.strictEqual(this.eventSpy.callCount, 0);
    assert.strictEqual(this.pointer.lastEvent().cancel, true);
    assert.strictEqual(this.renderer.rect.lastCall.returnValue.stub('append').callCount, 0);
});

QUnit.test('Do not draw anything nor triger events if shutterZoom is disabled', function(assert) {
    this.initWidget({
        shutterZoom: {
            enabled: false
        }
    });

    // act
    this.pointer.down(50, 250).dragStart();

    // assert
    assert.strictEqual(this.eventSpy.callCount, 0);
    assert.strictEqual(this.renderer.stub('rect').callCount, 0);
});

QUnit.test('Dispose shutter an widget dispose', function(assert) {
    var chart = this.initWidget({
        shutterZoom: {
            enabled: true,
            fill: 'red',
            'stroke-width': 10,
            stroke: 'blue',
            opacity: 0.5
        }
    });
    this.pointer.down(300 + 10, 250 + 5).dragStart().drag(400, 50);

    // act
    shutterPlugin.dispose.call(chart);

    // assert
    var rect = this.renderer.rect.lastCall.returnValue;
    assert.strictEqual(rect.dispose.callCount, 1);
});
