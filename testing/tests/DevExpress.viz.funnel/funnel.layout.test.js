var $ = require('jquery'),
    vizMocks = require('../../helpers/vizMocks.js'),
    common = require('./commonParts/common.js'),
    commonEnvironment = common.environment,
    createFunnel = common.createFunnel,
    stubAlgorithm = common.stubAlgorithm,
    legendModule = require('viz/components/legend'),
    titleModule = require('viz/core/title'),
    exportModule = require('viz/core/export'),
    labelEnvironment = require('./commonParts/label.js').labelEnvironment,
    dxFunnel = require('viz/funnel/funnel');

dxFunnel.addPlugin(legendModule.plugin);
dxFunnel.addPlugin(titleModule.plugin);
dxFunnel.addPlugin(exportModule.plugin);

function stubLegend() {
    var that = this;
    that.legend = new vizMocks.Legend();
    that.legend.stub('coordsIn').returns(true);
    that.legend.stub('getItemByCoord').withArgs(2, 3).returns({ id: 4 });
    that.legend.stub('measure').returns([100, 100]);
    sinon.stub(legendModule, 'Legend', function() {
        return that.legend;
    });
}

function stubTitle() {
    var that = this;
    that.title = new vizMocks.Title();
    that.title.stub('measure').returns([200, 50]);
    sinon.stub(titleModule, 'Title', function() {
        return that.title;
    });
}

function stubExport() {
    var that = this;
    that.export = new vizMocks.ExportMenu();
    that.export.stub('measure').returns([50, 50]);
    sinon.stub(exportModule, 'ExportMenu', function() {
        return that.export;
    });
}

function restore() {
    legendModule.Legend.restore();
    titleModule.Title.restore();
    exportModule.ExportMenu.restore();
}

QUnit.module('Layout Funnel element', $.extend({}, labelEnvironment, {
    beforeEach: function() {
        labelEnvironment.beforeEach.call(this);
        $('#test-container').css({
            width: 1000,
            height: 600
        });
        this.itemGroupNumber = 1;

        stubLegend.call(this);
        stubTitle.call(this);
        stubExport.call(this);

        this.title.stub('layoutOptions').returns({
            horizontalAlignment: 'center',
            verticalAlignment: 'top'
        });

        this.legend.stub('layoutOptions').returns({
            horizontalAlignment: 'right',
            verticalAlignment: 'top',
            side: 'horizontal'
        });
    },
    afterEach: function() {
        labelEnvironment.afterEach.call(this);
        restore();
    }
}));

QUnit.test('Tilte with legend and labels', function(assert) {
    createFunnel({
        dataSource: [{ value: 1 }],
        title: 'Title',
        legend: {
            visible: true
        },
        label: {
            visible: true,
            position: 'outside',
            horizontalAlignment: 'right'
        }
    });

    assert.deepEqual(this.title.move.lastCall.args[0], [298, 0, 498, 50], 'title rect');
    assert.deepEqual(this.legend.move.lastCall.args[0], [900, 50, 1000, 150], 'legend rect');
});

QUnit.test('Title with export button and legend', function(assert) {
    this.export.stub('layoutOptions').returns({ horizontalAlignment: 'right', verticalAlignment: 'top', weak: true });

    createFunnel({
        dataSource: [{ value: 1 }],
        label: {
            visible: false
        }
    });

    assert.deepEqual(this.title.move.lastCall.args[0], [350, 0, 550, 50], 'title rect');
    assert.deepEqual(this.export.move.lastCall.args[0], [950, 0, 1000, 50], 'export rect');
});

QUnit.test('Title, export button and labels', function(assert) {
    this.export.stub('layoutOptions').returns({ horizontalAlignment: 'right', verticalAlignment: 'top', weak: true });
    this.legend.stub('layoutOptions').returns(undefined);

    createFunnel({
        dataSource: [{ value: 1 }],
        label: {
            visible: true,
            position: 'outside',
            horizontalAlignment: 'right'
        }
    });

    assert.deepEqual(this.title.move.lastCall.args[0], [348, 0, 548, 50], 'title rect');
    assert.deepEqual(this.export.move.lastCall.args[0], [950, 0, 1000, 50], 'export rect');
});

QUnit.test('Title, export button, legend and labels', function(assert) {
    this.export.stub('layoutOptions').returns({ horizontalAlignment: 'right', verticalAlignment: 'top', weak: true });

    createFunnel({
        dataSource: [{ value: 1 }],
        label: {
            visible: true,
            position: 'outside',
            horizontalAlignment: 'right'
        }
    });

    assert.deepEqual(this.title.move.lastCall.args[0], [298, 0, 498, 50], 'title rect');
    assert.deepEqual(this.title.move.lastCall.args[1], [375, 0, 575, 50], 'title fit rect');
    assert.deepEqual(this.export.move.lastCall.args[0], [950, 0, 1000, 50], 'export rect');
});

QUnit.test('Export button and legend', function(assert) {
    this.export.stub('layoutOptions').returns({ horizontalAlignment: 'right', verticalAlignment: 'top', weak: true });
    this.title.stub('layoutOptions').returns(undefined);

    createFunnel({
        dataSource: [{ value: 1 }],
        label: {
            visible: false
        }
    });

    assert.deepEqual(this.export.move.lastCall.args[0], [850, 0, 900, 50], 'export rect');
});

QUnit.test('Shift title if title and export button have same position', function(assert) {
    this.export.stub('layoutOptions').returns({ horizontalAlignment: 'right', verticalAlignment: 'top', weak: true });
    this.title.stub('layoutOptions').returns({
        horizontalAlignment: 'right',
        verticalAlignment: 'top'
    });
    this.legend.layoutOptions.returns(undefined);

    createFunnel({
        dataSource: [{ value: 1 }],
        label: {
            visible: false
        }
    });
    assert.deepEqual(this.title.move.lastCall.args[0], [750, 0, 950, 50], 'title rect');
    assert.deepEqual(this.export.move.lastCall.args[0], [950, 0, 1000, 50], 'export rect');
});

QUnit.module('Adaptive Layout', $.extend({}, commonEnvironment, {
    beforeEach: function() {
        commonEnvironment.beforeEach.call(this);
        $('#test-container').css({
            width: 800,
            height: 600
        });
        this.itemGroupNumber = 1;

        stubLegend.call(this);
        stubTitle.call(this);
        stubExport.call(this);

        this.title.stub('measure').returns([150, 120]);
        this.export.stub('measure').returns([100, 150]);

        stubAlgorithm.getFigures.returns([[0, 0, 1, 1]]);
    },

    afterEach: function() {
        commonEnvironment.afterEach.call(this);
        restore();
    }
}));

QUnit.test('hide legend. horizontal alignment', function(assert) {
    this.legend.stub('layoutOptions').returns({
        horizontalAlignment: 'right',
        verticalAlignment: 'top',
        side: 'horizontal'
    });
    createFunnel({
        algorithm: 'stub',
        adaptiveLayout: {
            width: 701,
            height: 100
        },
        dataSource: [{ value: 1 }],
        legend: {
            visible: true,
            position: 'inside' // not supported, should not raise to side effects
        },
        label: {
            visible: false
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
    assert.ok(this.legend.freeSpace.called);
});

QUnit.test('hide legend. vertical alignment', function(assert) {
    this.legend.stub('layoutOptions').returns({
        horizontalAlignment: 'center',
        verticalAlignment: 'bottom',
        side: 'vertical'
    });

    createFunnel({
        algorithm: 'stub',
        adaptiveLayout: {
            height: 500
        },
        dataSource: [{ value: 1 }],
        legend: {
            visible: true
        },
        label: {
            visible: false
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
    assert.ok(this.legend.freeSpace.called);
});

QUnit.test('hide title', function(assert) {
    this.title.stub('layoutOptions').returns({
        horizontalAlignment: 'right',
        verticalAlignment: 'top'
    });

    createFunnel({
        algorithm: 'stub',
        adaptiveLayout: {
            height: 500
        },
        dataSource: [{ value: 1 }],
        label: {
            visible: false
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
    assert.ok(this.title.freeSpace.called);
});

QUnit.test('hide export menu', function(assert) {
    this.export.stub('layoutOptions').returns({
        horizontalAlignment: 'right',
        verticalAlignment: 'top'
    });

    createFunnel({
        algorithm: 'stub',
        adaptiveLayout: {
            height: 500
        },
        dataSource: [{ value: 1 }],
        label: {
            visible: false
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
    assert.ok(this.export.freeSpace.called);
});

QUnit.test('hide pair elements: title and export', function(assert) {
    this.title.stub('layoutOptions').returns({
        horizontalAlignment: 'right',
        verticalAlignment: 'top'
    });
    this.export.stub('layoutOptions').returns({
        horizontalAlignment: 'right',
        verticalAlignment: 'top',
        weak: true
    });

    createFunnel({
        algorithm: 'stub',
        adaptiveLayout: {
            height: 500
        },
        dataSource: [{ value: 1 }],
        label: {
            visible: false
        }
    });

    assert.deepEqual(this.items()[0].attr.firstCall.args[0].points, [0, 0, 800, 600]);
    assert.ok(this.export.freeSpace.called);
    assert.ok(this.title.freeSpace.called);
});

QUnit.test('Hide header if space is not enought for title end export', function(assert) {
    this.title.stub('measure').returns([150, 120]);
    this.export.stub('measure').returns([100, 150]);

    this.title.stub('layoutOptions').returns({
        horizontalAlignment: 'right',
        verticalAlignment: 'top'
    });
    this.export.stub('layoutOptions').returns({
        horizontalAlignment: 'right',
        verticalAlignment: 'top',
        weak: true
    });

    createFunnel({
        algorithm: 'stub',
        dataSource: [{ value: 1 }],
        size: {
            width: 247
        },
        export: {
            enabled: true
        },
        title: 'Title',
        label: {
            visible: false
        }
    });

    assert.ok(this.title.freeSpace.called);
    assert.ok(this.export.freeSpace.called);
});
