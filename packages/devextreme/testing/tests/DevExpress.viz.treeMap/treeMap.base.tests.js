const $ = require('jquery');
const common = require('./commonParts/common.js');
const themeModule = require('viz/themes');
const DataSource = require('common/data/data_source/data_source').DataSource;

function createDataSource(value) {
    return new DataSource({
        load: function() {
            return value;
        }
    });
}

const environment = $.extend({
    create: function(options) {
        return common.createWidget($.extend(true, {
            tile: {
                border: { width: 1 }
            },
            group: {
                padding: 4,
                border: { width: 2 }
            }
        }, options));
    },

    tilesGroup: function() {
        return this.renderer.g.returnValues[0];
    },

    labelsGroup: function() {
        return this.renderer.g.returnValues[1];
    }
}, common.environment);

QUnit.module('TreeMap', environment);

QUnit.test('One level hierarchy (plain)', function(assert) {
    common.createWidget({
        dataSource: [{
            value: 10
        }, {
            value: 20
        }, {
            value: 30
        }]
    });

    const container = this.tilesGroup();
    assert.strictEqual(this.renderer.simpleRect.callCount, 3, 'rects count');
    $.each(this.renderer.simpleRect.returnValues, function(i, rect) {
        assert.strictEqual(rect.append.lastCall.args[0], container, 'rect parent - ' + i);
    });
});

QUnit.test('Two level hierarchy', function(assert) {
    common.createWidget({
        dataSource: [{
            items: [{
                value: 1
            }, {
                value: 2
            }]
        }, {
            items: [{
                value: 3
            }, {
                value: 4
            }, {
                value: 5
            }]
        }]
    });

    const container = this.tilesGroup();
    assert.strictEqual(this.renderer.simpleRect.callCount, 9, 'rects count');
    $.each(this.renderer.simpleRect.returnValues, function(i, rect) {
        assert.strictEqual(rect.append.lastCall.args[0], container, 'rect parent - ' + i);
    });
});

QUnit.test('Three level hierarchy', function(assert) {
    common.createWidget({
        dataSource: [{
            items: [{
                items: [{
                    value: 10
                }]
            }, {
                items: [{
                    value: 20
                }, {
                    value: 30
                }]
            }]
        }]
    });

    const container = this.tilesGroup();
    assert.strictEqual(this.renderer.simpleRect.callCount, 9, 'rects count');
    $.each(this.renderer.simpleRect.returnValues, function(i, rect) {
        assert.strictEqual(rect.append.lastCall.args[0], container, 'rect parent - ' + i);
    });
});

QUnit.test('One level tiling', function(assert) {
    this.create({
        dataSource: [{ value: 1 }, { value: 2 }]
    });

    assert.checkTile(this.tile(0).attr.lastCall.args[0], [400.5, 0.5, 599.5, 399.5], 'tile 1');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [0.5, 0.5, 400.5, 399.5], 'tile 2');
});

QUnit.test('Two level tiling', function(assert) {
    this.create({
        dataSource: [{
            items: [{ value: 1 }, { value: 2 }]
        }, {
            value: 2
        }],
        group: {
            headerHeight: 0
        }
    });

    assert.checkTile(this.tile(0).attr.lastCall.args[0], [1, 1, 360, 399], 'tile 1 outer');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [5, 5, 355, 5], 'tile 1 inner');
    assert.checkTile(this.tile(2).attr.lastCall.args[0], [4.5, 265.5, 355.5, 395.5], 'tile 1-1');
    assert.checkTile(this.tile(3).attr.lastCall.args[0], [4.5, 4.5, 355.5, 265.5], 'tile 1-2');
    assert.checkTile(this.tile(4).attr.lastCall.args[0], [360.5, 0.5, 599.5, 399.5], 'tile 2');
});

QUnit.test('Items without value are tiled', function(assert) {
    this.create({
        dataSource: [{
            value: 3
        }, {
        }, {
            value: 2
        }, {
        }]
    });

    assert.checkTile(this.tile(0).attr.lastCall.args[0], [0.5, 0.5, 360.5, 399.5], 'tile 1');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [360.5, 400.5, 599.5, 400.5], 'tile 2');
    assert.checkTile(this.tile(2).attr.lastCall.args[0], [360.5, 0.5, 599.5, 399.5], 'tile 3');
    assert.checkTile(this.tile(3).attr.lastCall.args[0], [360.5, 400.5, 599.5, 400.5], 'tile 4');
});

QUnit.test('Two level tiling with custom group values', function(assert) {
    this.create({
        dataSource: [{
            value: 1,
            items: [{
                value: 4
            }]
        }, {
            value: 2,
            items: [{
                value: 10
            }, {
                value: 10
            }]
        }]
    });

    assert.checkTile(this.tile(0).attr.lastCall.args[0], [400, 1, 599, 399], 'tile 1 outer');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [405, 5, 595, 21], 'tile 1 inner');
    assert.checkTile(this.tile(2).attr.lastCall.args[0], [404.5, 22.5, 595.5, 395.5], 'tile 1-1');
    assert.checkTile(this.tile(3).attr.lastCall.args[0], [1, 1, 400, 399], 'tile 2 outer');
    assert.checkTile(this.tile(4).attr.lastCall.args[0], [5, 5, 395, 21], 'tile 2 inner');
    assert.checkTile(this.tile(5).attr.lastCall.args[0], [4.5, 22.5, 200.5, 395.5], 'tile 2-1');
    assert.checkTile(this.tile(6).attr.lastCall.args[0], [200.5, 22.5, 395.5, 395.5], 'tile 2-2');
});

QUnit.test('Simple tiles coloring', function(assert) {
    common.createWidget({
        dataSource: [{
            val: 1, col: 'red'
        }, {
            val: 2, col: 'green'
        }, {
            val: 3
        }, {
            val: 4, col: 'blue'
        }],
        valueField: 'val',
        colorField: 'col',
        colorizer: {
            type: 'none'
        },
        tile: {
            border: {
                color: 'black',
                width: 2
            },
            color: 'grey',
            opacity: 0.1
        }
    });

    assert.deepEqual(this.tile(0).attr.getCall(0).args, [{ stroke: 'black', 'stroke-width': 2, 'stroke-opacity': 0.2, opacity: 0.1, fill: 'red' }], 'tile 1');
    assert.deepEqual(this.tile(1).attr.getCall(0).args, [{ stroke: 'black', 'stroke-width': 2, 'stroke-opacity': 0.2, opacity: 0.1, fill: 'green' }], 'tile 2');
    assert.deepEqual(this.tile(2).attr.getCall(0).args, [{ stroke: 'black', 'stroke-width': 2, 'stroke-opacity': 0.2, opacity: 0.1, fill: 'grey' }], 'tile 3');
    assert.deepEqual(this.tile(3).attr.getCall(0).args, [{ stroke: 'black', 'stroke-width': 2, 'stroke-opacity': 0.2, opacity: 0.1, fill: 'blue' }], 'tile 4');
});

QUnit.test('Headers default height', function(assert) {
    this.renderer.bBoxTemplate.height = 40;
    this.create({
        dataSource: [{
            items: [{
                value: 1
            }, {
                value: 2
            }]
        }, {
            items: [{
                value: 3
            }]
        }]
    });

    assert.checkTile(this.tile(0).attr.lastCall.args[0], [1, 1, 300, 399], 'tile 1 outer');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [5, 5, 295, 51], 'tile 1 inner');
    assert.checkTile(this.tile(2).attr.lastCall.args[0], [4.5, 281.5, 295.5, 395.5], 'tile 1-1');
    assert.checkTile(this.tile(3).attr.lastCall.args[0], [4.5, 52.5, 295.5, 281.5], 'tile 1-2');
    assert.checkTile(this.tile(4).attr.lastCall.args[0], [300, 1, 599, 399], 'tile 2 outer');
    assert.checkTile(this.tile(5).attr.lastCall.args[0], [305, 5, 595, 51], 'tile 2 inner');
    assert.checkTile(this.tile(6).attr.lastCall.args[0], [304.5, 52.5, 595.5, 395.5], 'tile 2-1');
});

QUnit.test('Default colorizing', function(assert) {
    common.createWidget({
        dataSource: [{ name: '1', value: 1 }, { name: '2', value: 2 }]
    });

    assert.strictEqual(this.tile(0).attr.firstCall.args[0].fill, '#1db2f5');
    assert.strictEqual(this.tile(1).attr.firstCall.args[0].fill, '#f5564a');
});

QUnit.test('Headers height when labels are disabled', function(assert) {
    this.renderer.bBoxTemplate.height = 40;
    this.create({
        dataSource: [{
            items: [{
                value: 1
            }, {
                value: 2
            }]
        }, {
            items: [{
                value: 3
            }]
        }],
        group: {
            label: { visible: false }
        }
    });

    assert.checkTile(this.tile(0).attr.lastCall.args[0], [1, 1, 300, 399], 'tile 1 outer');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [5, 5, 295, 51], 'tile 1 inner');
    assert.checkTile(this.tile(2).attr.lastCall.args[0], [4.5, 281.5, 295.5, 395.5], 'tile 1-1');
    assert.checkTile(this.tile(3).attr.lastCall.args[0], [4.5, 52.5, 295.5, 281.5], 'tile 1-2');
    assert.checkTile(this.tile(4).attr.lastCall.args[0], [300, 1, 599, 399], 'tile 2 outer');
    assert.checkTile(this.tile(5).attr.lastCall.args[0], [305, 5, 595, 51], 'tile 2 inner');
    assert.checkTile(this.tile(6).attr.lastCall.args[0], [304.5, 52.5, 595.5, 395.5], 'tile 2-1');
});

QUnit.test('Headers height when explicitly defined', function(assert) {
    this.create({
        dataSource: [{
            items: [{
                value: 1
            }, {
                value: 2
            }]
        }, {
            items: [{
                value: 3
            }]
        }],
        group: {
            headerHeight: 50
        }
    });

    assert.checkTile(this.tile(0).attr.lastCall.args[0], [1, 1, 300, 399], 'tile 1 outer');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [5, 5, 295, 53], 'tile 1 inner');
    assert.checkTile(this.tile(2).attr.lastCall.args[0], [4.5, 282.5, 295.5, 395.5], 'tile 1-1');
    assert.checkTile(this.tile(3).attr.lastCall.args[0], [4.5, 54.5, 295.5, 282.5], 'tile 1-2');
    assert.checkTile(this.tile(4).attr.lastCall.args[0], [300, 1, 599, 399], 'tile 2 outer');
    assert.checkTile(this.tile(5).attr.lastCall.args[0], [305, 5, 595, 53], 'tile 2 inner');
    assert.checkTile(this.tile(6).attr.lastCall.args[0], [304.5, 54.5, 595.5, 395.5], 'tile 2-1');
});

QUnit.test('Simple headers coloring', function(assert) {
    common.createWidget({
        dataSource: [{
            items: [{
                value: 1
            }, {
                value: 2
            }]
        }, {
            color: 'red',
            items: [{
                value: 3
            }]
        }],
        group: {
            border: {
                color: 'black',
                width: 2,
                opacity: 0.2
            },
            color: 'grey',
            opacity: 0.1
        }
    });

    assert.deepEqual(this.tile(0).attr.getCall(0).args, [{ stroke: 'black', 'stroke-width': 2, 'stroke-opacity': 0.2 }], 'tile 1 outer');
    assert.deepEqual(this.tile(1).attr.getCall(0).args, [{ opacity: 0.1, fill: 'grey', hatching: undefined }], 'tile 1 inner');
    assert.deepEqual(this.tile(4).attr.getCall(0).args, [{ stroke: 'black', 'stroke-width': 2, 'stroke-opacity': 0.2 }], 'tile 2 outer');
    assert.deepEqual(this.tile(5).attr.getCall(0).args, [{ opacity: 0.1, fill: 'grey', hatching: undefined }], 'tile 2 inner');
});

QUnit.test('Tile color is taken from its group color', function(assert) {
    common.createWidget({
        dataSource: [{
            color: 'blue',
            items: [{
                value: 1, color: 'green'
            }, {
                value: 2
            }]
        }, {
            items: [{
                value: 3, color: 'grey'
            }, {
                value: 4
            }]
        }],
        colorizer: {
            type: 'none'
        },
        tile: {
            color: 'red'
        }
    });

    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, 'green', 'tile 1-1');
    assert.strictEqual(this.tile(3).attr.getCall(0).args[0].fill, 'blue', 'tile 1-2');
    assert.strictEqual(this.tile(6).attr.getCall(0).args[0].fill, 'grey', 'tile 2-1');
    assert.strictEqual(this.tile(7).attr.getCall(0).args[0].fill, 'red', 'tile 2-2');
});

QUnit.test('null data source', function(assert) {
    common.createWidget({
        dataSource: null
    });

    assert.strictEqual(this.renderer.stub('simpleRect').callCount, 0, 'tiles count');
});

QUnit.test('Degenerate data source with labels', function(assert) {
    common.createWidget({
        dataSource: [{ name: 'Tile 1' }]
    });

    assert.strictEqual(this.renderer.stub('simpleRect').callCount, 1, 'tiles count');
    assert.strictEqual(this.renderer.text.callCount, 2, 'texts count');
});

QUnit.test('Async data source', function(assert) {
    common.createWidget({
        dataSource: createDataSource($.Deferred().promise())
    });

    assert.strictEqual(this.renderer.stub('simpleRect').callCount, 0, 'tiles count');
});

QUnit.test('Async data source / success', function(assert) {
    const deferred = $.Deferred();
    common.createWidget({
        dataSource: createDataSource(deferred.promise())
    });

    deferred.resolve([{ value: 1 }, { value: 2 }, { value: 3 }]);

    assert.strictEqual(this.renderer.stub('simpleRect').callCount, 3, 'tiles count');
    let i;
    for(i = 0; i < this.tileCount(); ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 2, 'tile ' + (i + 1) + ' settings count');
    }
});

QUnit.test('Async data source / error', function(assert) {
    const deferred = $.Deferred();
    common.createWidget({
        dataSource: createDataSource(deferred.promise())
    });

    deferred.reject();

    assert.strictEqual(this.renderer.stub('simpleRect').callCount, 0, 'tiles count');
});

QUnit.test('Tiling when there is not enough space for group because of header', function(assert) {
    this.create({
        dataSource: [{
            items: [{ value: 1 }]
        }, {
            items: [{ value: 3 }]
        }, {
            items: [{ value: 8 }]
        }],
        group: { headerHeight: 150 }
    });

    assert.checkTile(this.tile(0).attr.lastCall.args[0], [400, 300, 599, 399], 'tile 1 outer');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [405, 305, 595, 395], 'tile 1 inner');
    assert.checkTile(this.tile(2).attr.lastCall.args[0], [404.5, 396.5, 595.5, 396.5], 'tile 1-1');
    assert.checkTile(this.tile(3).attr.lastCall.args[0], [400, 1, 599, 300], 'tile 2 outer');
    assert.checkTile(this.tile(4).attr.lastCall.args[0], [405, 5, 595, 153], 'tile 2 inner');
    assert.checkTile(this.tile(5).attr.lastCall.args[0], [404.5, 154.5, 595.5, 295.5], 'tile 2-1');
    assert.checkTile(this.tile(6).attr.lastCall.args[0], [1, 1, 400, 399], 'tile 3 outer');
    assert.checkTile(this.tile(7).attr.lastCall.args[0], [5, 5, 395, 153], 'tile 3 inner');
    assert.checkTile(this.tile(8).attr.lastCall.args[0], [4.5, 154.5, 395.5, 395.5], 'tile 3-1');
});

QUnit.test('Max depth', function(assert) {
    this.create({
        maxDepth: 2,
        dataSource: [{
            items: [{
                items: [{
                    value: 2
                }]
            }, {
                items: [{
                    value: 1
                }, {
                    value: 1
                }]
            }]
        }, {
            items: [{
                items: [{
                    value: 2
                }, {
                    value: 3
                }]
            }, {
                value: 3
            }]
        }],
        tile: { color: 'green' },
        group: { color: 'red' },
        colorizer: { type: 'none' }
    });

    assert.strictEqual(this.renderer.simpleRect.callCount, 8, 'rect count');
    assert.checkTile(this.tile(0).attr.lastCall.args[0], [400, 1, 599, 399], 'tile 1 outer layout');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [405, 5, 595, 21], 'tile 1 inner layout');
    assert.checkTile(this.tile(2).attr.lastCall.args[0], [404.5, 22.5, 595.5, 209.5], 'tile 1-1 layout');
    assert.checkTile(this.tile(3).attr.lastCall.args[0], [404.5, 209.5, 595.5, 395.5], 'tile 1-2 layout');
    assert.checkTile(this.tile(4).attr.lastCall.args[0], [1, 1, 400, 399], 'tile 2 outer layout');
    assert.checkTile(this.tile(5).attr.lastCall.args[0], [5, 5, 395, 21], 'tile 2 inner layout');
    assert.checkTile(this.tile(6).attr.lastCall.args[0], [4.5, 22.5, 249.5, 395.5], 'tile 2-1 layout');
    assert.checkTile(this.tile(7).attr.lastCall.args[0], [249.5, 22.5, 395.5, 395.5], 'tile 2-2 layout');
    assert.strictEqual(this.tile(1).attr.getCall(0).args[0].fill, 'red', 'tile 1 inner appearance');
    assert.strictEqual(this.tile(2).attr.getCall(0).args[0].fill, 'green', 'tile 1-1 appearance');
    assert.strictEqual(this.tile(3).attr.getCall(0).args[0].fill, 'green', 'tile 1-2 appearance');
    assert.strictEqual(this.tile(5).attr.getCall(0).args[0].fill, 'red', 'tile 2 inner appearance');
    assert.strictEqual(this.tile(6).attr.getCall(0).args[0].fill, 'green', 'tile 2-1 appearance');
    assert.strictEqual(this.tile(7).attr.getCall(0).args[0].fill, 'green', 'tile 2-2 appearance');
});

QUnit.test('Max depth option changing', function(assert) {
    const widget = common.createWidget({
        dataSource: [{
            items: [{ value: 3 }, { value: 1 }]
        }, {
            items: [{ value: 2 }]
        }]
    });
    const group = this.tilesGroup();
    this.renderer.simpleRect.resetHistory();
    group.clear.resetHistory();

    widget.option('maxDepth', 1);

    assert.strictEqual(this.renderer.simpleRect.callCount, 2, 'tiles are created');
    assert.strictEqual(group.clear.callCount, 1, 'tiles group is cleared');
    assert.deepEqual(this.tile(0).append.lastCall.args, [group], 'tile 1 is appended');
    assert.deepEqual(this.tile(1).append.lastCall.args, [group], 'tile 2 is appended');
    assert.strictEqual(this.tile(0).attr.callCount, 2, 'tile 1 settings');
    assert.strictEqual(this.tile(0).attr.callCount, 2, 'tile 2 settings');
});

QUnit.module('Option change handling', environment);

QUnit.test('Size', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]
    });
    this.resetTilesAttr();

    widget.option('size', { width: 900, height: 600 });

    let i;
    for(i = 0; i < this.tileCount(); ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 1, 'tile ' + (i + 1) + ' settings call count');
    }
    assert.checkTile(this.tile(0).attr.lastCall.args[0], [720.5, 300.5, 899.5, 599.5], 'tile 1 position');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [360.5, 300.5, 720.5, 599.5], 'tile 2 position');
    assert.checkTile(this.tile(2).attr.lastCall.args[0], [360.5, 0.5, 899.5, 300.5], 'tile 3 position');
    assert.checkTile(this.tile(3).attr.lastCall.args[0], [0.5, 0.5, 360.5, 599.5], 'tile 4 position');
});

QUnit.test('dataSource', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]
    });
    this.tilesGroup().clear.resetHistory();
    this.renderer.simpleRect.resetHistory();

    widget.option('dataSource', [{ value: 1 }, { value: 2 }]);

    assert.deepEqual(this.tilesGroup().clear.lastCall.args, [], 'tiles group is cleared');
    assert.deepEqual(this.renderer.initDefsElements.lastCall.args, [], 'hatching');
    assert.strictEqual(this.renderer.simpleRect.callCount, 2, 'tiles are created');
    let i;
    for(i = 0; i < this.tileCount(); ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 2, 'tile ' + (i + 1) + ' settings call count');
    }
});

QUnit.test('dataSource / async', function(assert) {
    const deferred = $.Deferred();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }]
    });
    this.tilesGroup().clear.resetHistory();
    this.renderer.simpleRect.resetHistory();

    widget.option('dataSource', createDataSource(deferred.promise()));
    deferred.resolve([{ value: 1 }, { value: 2 }]);

    assert.deepEqual(this.tilesGroup().clear.lastCall.args, [], 'tiles group is cleared');
    assert.strictEqual(this.renderer.simpleRect.callCount, 2, 'tiles are created');
    let i;
    for(i = 0; i < this.tileCount(); ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 2, 'tile ' + (i + 1) + ' settings call count');
    }
});

QUnit.test('dataSource / external reloading', function(assert) {
    let data = [{ value: 1 }, { value: 2 }];
    const ds = new DataSource({
        load: function() {
            return data;
        }
    });
    common.createWidget({
        dataSource: ds
    });
    this.tilesGroup().clear.resetHistory();
    this.renderer.simpleRect.resetHistory();

    data = [{ value: 1 }, { value: 2 }, { value: 3 }];
    ds.load();

    assert.deepEqual(this.tilesGroup().clear.lastCall.args, [], 'tiles group is cleared');
    assert.strictEqual(this.renderer.simpleRect.callCount, 3, 'tiles are created');
    let i;
    for(i = 0; i < this.tileCount(); ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 2, 'tile ' + (i + 1) + ' settings call count');
    }
});

QUnit.test('valueField', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 1, val: 4 }, { value: 2, val: 5 }, { value: 3 }, { value: 4, val: 6 }]
    });
    this.tilesGroup().clear.resetHistory();
    this.renderer.simpleRect.resetHistory();

    widget.option('valueField', 'val');

    assert.deepEqual(this.tilesGroup().clear.lastCall.args, [], 'tiles group is cleared');
    assert.strictEqual(this.renderer.simpleRect.callCount, 4, 'tiles are created');
    let i;
    for(i = 0; i < this.tileCount(); ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 2, 'tile ' + (i + 1) + ' settings call count');
    }
});

QUnit.test('childrenField', function(assert) {
    const widget = common.createWidget({
        dataSource: [{
            value: 4,
            items2: [{
                value: 3
            }]

        }, {
            value: 5,
            items: [{
                value: 1
            }, {
                value: 2
            }]
        }, {
        }]
    });
    this.tilesGroup().clear.resetHistory();
    this.renderer.simpleRect.resetHistory();

    widget.option('childrenField', 'items2');

    assert.deepEqual(this.tilesGroup().clear.lastCall.args, [], 'tiles group is cleared');
    assert.strictEqual(this.renderer.simpleRect.callCount, 5, 'tiles are created');
    let i;
    for(i = 1; i < this.tileCount(); ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 2, 'tile ' + (i + 1) + ' settings call count');
    }

});

QUnit.test('colorField', function(assert) {
    const widget = common.createWidget({
        dataSource: [{
            value: 1, color: 'a1', color2: 'b1'
        }, {
            value: 2, color: 'a2', color2: 'b2'
        }, {
            value: 3, color: 'a3', color2: 'b3'
        }, {
            value: 4, color: 'a4', color2: 'b4'
        }],
        tile: {
            border: { color: 'black', width: 3 }
        }
    });
    this.resetTilesAttr();

    widget.option('colorField', 'color2');

    let i;
    for(i = 0; i < this.tileCount(); ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 1, 'tile ' + (i + 1) + ' settings call count');
    }
    assert.deepEqual(this.tile(0).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.2, fill: 'b1' }], 'tile 1 settings');
    assert.deepEqual(this.tile(1).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.2, fill: 'b2' }], 'tile 2 settings');
    assert.deepEqual(this.tile(2).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.2, fill: 'b3' }], 'tile 3 settings');
    assert.deepEqual(this.tile(3).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 3, 'stroke-opacity': 0.2, fill: 'b4' }], 'tile 4 settings');
});

QUnit.test('tile', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 1, val: 4 }, { value: 2, val: 5 }, { value: 3 }, { value: 4, val: 6 }],
        tile: { border: { color: 'black', width: 1 }, color: 'blue' },
        colorizer: {
            type: 'none'
        }
    });
    this.resetTilesAttr();

    widget.option({
        tile: {
            color: 'yellow'
        }
    });

    let i;
    for(i = 0; i < this.tileCount(); ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 1, 'tile ' + (i + 1) + ' settings call count');
    }
    assert.deepEqual(this.tile(0).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'yellow' }], 'tile 1 settings');
    assert.deepEqual(this.tile(1).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'yellow' }], 'tile 2 settings');
    assert.deepEqual(this.tile(2).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'yellow' }], 'tile 3 settings');
    assert.deepEqual(this.tile(3).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'yellow' }], 'tile 4 settings');
});

QUnit.test('group', function(assert) {
    const widget = common.createWidget({
        dataSource: [{
            items: [{
                value: 1
            }, {
                value: 2
            }]
        }, {
            items: [{
                value: 3
            }]
        }]
    });
    this.resetTilesAttr();

    widget.option({
        group: { border: { color: 'red' }, color: 'green' }
    });

    let i;
    for(i = 0; i < this.tileCount(); ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 1, 'tile ' + (i + 1) + ' settings call count');
    }
    assert.deepEqual(this.tile(0).attr.lastCall.args, [{ stroke: 'red', 'stroke-width': 1, 'stroke-opacity': undefined }], 'tile 1 outer');
    assert.deepEqual(this.tile(1).attr.lastCall.args, [{ fill: 'green', opacity: undefined, hatching: undefined }], 'tile 1 inner');
    assert.deepEqual(this.tile(4).attr.lastCall.args, [{ stroke: 'red', 'stroke-width': 1, 'stroke-opacity': undefined }], 'tile 2 outer');
    assert.deepEqual(this.tile(5).attr.lastCall.args, [{ fill: 'green', opacity: undefined, hatching: undefined }], 'tile 2 inner');
});

QUnit.test('group / header height is changed', function(assert) {
    const widget = common.createWidget({
        dataSource: [{
            items: [{
                value: 1
            }, {
                value: 2
            }]
        }, {
            items: [{
                value: 3
            }]
        }]
    });
    this.resetTilesAttr();

    widget.option({
        group: {
            headerHeight: 5,
            border: { color: 'red', width: 3 }, color: 'green'
        }
    });

    let i;
    for(i = 0; i < this.tileCount(); ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 2, 'tile ' + (i + 1) + ' settings call count');
    }
    assert.deepEqual(this.tile(0).attr.getCall(0).args, [{ stroke: 'red', 'stroke-width': 3, 'stroke-opacity': undefined }], 'tile 1 outer appearance');
    assert.deepEqual(this.tile(1).attr.getCall(0).args, [{ fill: 'green', opacity: undefined, hatching: undefined }], 'tile 1 inner appearance');
    assert.deepEqual(this.tile(4).attr.getCall(0).args, [{ stroke: 'red', 'stroke-width': 3, 'stroke-opacity': undefined }], 'tile 2 outer appearance');
    assert.deepEqual(this.tile(5).attr.getCall(0).args, [{ fill: 'green', opacity: undefined, hatching: undefined }], 'tile 2 inner appearance');
});

QUnit.test('colorizer', function(assert) {
    const widget = common.createWidget({
        dataSource: [{
            value: 1
        }, {
            value: 2, color: 'red'
        }, {
            value: 3
        }],
        colorizer: {
            type: 'Discrete'
        }
    });
    let i;
    for(i = 0; i < 3; ++i) {
        this.tile(i).attr.resetHistory();
    }

    widget.option({ colorizer: { type: 'none' } });

    for(i = 0; i < 3; ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 1, 'tile ' + (i + 1) + ' settings call count');
    }
    assert.strictEqual(this.tile(0).attr.lastCall.args[0].fill, '#5f8b95', 'tile 1');
    assert.strictEqual(this.tile(1).attr.lastCall.args[0].fill, 'red', 'tile 2');
    assert.strictEqual(this.tile(2).attr.lastCall.args[0].fill, '#5f8b95', 'tile 3');
});

QUnit.test('layoutAlgorithm', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }]
    });
    let i;
    for(i = 0; i < 2; ++i) {
        this.tile(i).attr.resetHistory();
    }

    widget.option('layoutAlgorithm', 'strip');

    for(i = 0; i < 2; ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 1, 'tile ' + (i + 1) + ' settings call count');
    }
    assert.checkTile(this.tile(0).attr.lastCall.args[0], [400.5, 0.5, 599.5, 399.5], 'tile 1');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [0.5, 0.5, 400.5, 399.5], 'tile 2');
});

QUnit.test('Appearance is not applied twice when \'dataSource\' and some appearance option are changed', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 1, val: 4 }, { value: 2, val: 5 }, { value: 3 }, { value: 4, val: 6 }],
        tile: { border: { color: 'black', width: 1 }, color: 'blue' },
        colorizer: {
            type: 'none'
        }
    });
    let i;
    const tiles = [];
    for(i = 0; i < 4; ++i) {
        this.tile(i).attr.resetHistory();
        tiles.push(this.tile(i));
    }
    this.renderer.simpleRect.resetHistory();

    widget.option({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        tile: {
            color: 'magenta'
        }
    });

    for(i = 0; i < 4; ++i) {
        assert.strictEqual(tiles[i].attr.callCount, 0, 'previous tile ' + (i + 1) + ' settings call count');
    }
    for(i = 0; i < 3; ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 2, 'tile ' + (i + 1) + ' settings call count');
    }
    assert.deepEqual(this.tile(0).attr.getCall(0).args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'magenta' }], 'tile 1 appearance');
    assert.deepEqual(this.tile(1).attr.getCall(0).args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'magenta' }], 'tile 2 appearance');
    assert.deepEqual(this.tile(2).attr.getCall(0).args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'magenta' }], 'tile 3 appearance');
    assert.checkTile(this.tile(0).attr.getCall(1).args[0], [300.5, 267.5, 599.5, 399.5], 'tile 1 position');
    assert.checkTile(this.tile(1).attr.getCall(1).args[0], [300.5, 0.5, 599.5, 267.5], 'tile 2 position');
    assert.checkTile(this.tile(2).attr.getCall(1).args[0], [0.5, 0.5, 300.5, 399.5], 'tile 3 position');
});

QUnit.test('Positioning is not changed twice when size and \'dataSource\' are changed', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }, { value: 4 }],
        tile: { border: { color: 'black', width: 1 }, color: 'red' },
        colorizer: {
            type: 'none'
        }
    });
    let i;
    const tiles = [];
    for(i = 0; i < 4; ++i) {
        this.tile(i).attr.resetHistory();
        tiles.push(this.tile(i));
    }
    this.renderer.simpleRect.resetHistory();

    widget.option({
        size: { width: 900, height: 600 },
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }]
    });

    for(i = 0; i < 4; ++i) {
        assert.strictEqual(tiles[i].attr.callCount, 0, 'previous tile ' + (i + 1) + ' settings call count');
    }
    for(i = 0; i < 3; ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 2, 'tile ' + (i + 1) + ' settings call count');
    }
    assert.deepEqual(this.tile(0).attr.getCall(0).args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'red' }], 'tile 1 appearance');
    assert.deepEqual(this.tile(1).attr.getCall(0).args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'red' }], 'tile 2 appearance');
    assert.deepEqual(this.tile(2).attr.getCall(0).args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'red' }], 'tile 3 appearance');
    assert.checkTile(this.tile(0).attr.getCall(1).args[0], [450.5, 400.5, 899.5, 599.5], 'tile 1 position');
    assert.checkTile(this.tile(1).attr.getCall(1).args[0], [450.5, 0.5, 899.5, 400.5], 'tile 2 position');
    assert.checkTile(this.tile(2).attr.getCall(1).args[0], [0.5, 0.5, 450.5, 599.5], 'tile 3 position');
});

QUnit.test('Appearance is reapplied when \'theme\' is changed', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        tile: { border: { color: 'black', width: 1 }, color: 'white' },
        colorizer: {
            type: 'none'
        }
    });
    let i;
    for(i = 0; i < 3; ++i) {
        this.tile(i).attr.resetHistory();
    }

    widget.option('theme', 'test-theme');

    for(i = 0; i < 3; ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 1, 'tile ' + (i + 1) + ' settings call count');
    }
    assert.deepEqual(this.tile(0).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'white' }], 'tile 1 settings');
    assert.deepEqual(this.tile(1).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'white' }], 'tile 2 settings');
    assert.deepEqual(this.tile(2).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'white' }], 'tile 3 settings');
});

QUnit.test('Appearance is reapplied when current theme is updated', function(assert) {
    common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }, { value: 3 }],
        tile: { border: { color: 'black', width: 1 }, color: 'white' },
        colorizer: {
            type: 'none'
        }
    });
    let i;
    for(i = 0; i < 3; ++i) {
        this.tile(i).attr.resetHistory();
    }

    themeModule.refreshTheme();

    for(i = 0; i < 3; ++i) {
        assert.strictEqual(this.tile(i).attr.callCount, 1, 'tile ' + (i + 1) + ' settings call count');
    }
    assert.deepEqual(this.tile(0).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'white' }], 'tile 1 settings');
    assert.deepEqual(this.tile(1).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'white' }], 'tile 2 settings');
    assert.deepEqual(this.tile(2).attr.lastCall.args, [{ stroke: 'black', 'stroke-width': 1, 'stroke-opacity': 0.2, fill: 'white' }], 'tile 3 settings');
});

QUnit.test('layout labels after resize', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 1, name: '1' }]
    });

    widget.option('size', { width: 900, height: 600 });

    assert.equal(this.renderer.text.callCount, 2);
    assert.deepEqual(this.renderer.text.lastCall.returnValue.move.lastCall.args, [4, 2]);
});

QUnit.test('recreating labels after dataSource changing', function(assert) {
    const widget = common.createWidget({
        dataSource: []
    });

    widget.option('dataSource', [{ value: 1, name: '1' }]);

    assert.equal(this.renderer.text.callCount, 2);
});

QUnit.test('recreating labels after labelField changing', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 1, name: '1' }, { value: 2, newName: '2' }]
    });

    this.renderer.text.resetHistory();
    widget.option('labelField', 'newName');

    assert.equal(this.renderer.text.callCount, 1);
    assert.deepEqual(this.renderer.text.lastCall.args, ['2']);
    assert.deepEqual(this.renderer.text.lastCall.returnValue.move.lastCall.args, [4, 2]);
});

QUnit.test('layoutDirection changing', function(assert) {
    const widget = common.createWidget({
        size: { width: 100, height: 100 },
        dataSource: [{ value: 10 }, { value: 7 }, { value: 3 }]
    });
    let i;

    for(i = 0; i < 3; i++) {
        this.tile(i).attr.resetHistory();
    }

    widget.option('layoutDirection', 'leftBottomRightTop');

    for(i = 0; i < 3; i++) {
        assert.strictEqual(this.tile(i).attr.callCount, 1, 'tile ' + (i + 1) + ' settings call count');
    }

    assert.checkTile(this.tile(0).attr.lastCall.args[0], [0.5, 0.5, 50.5, 99.5], 'tile 1');
    assert.checkTile(this.tile(1).attr.lastCall.args[0], [50.5, 30.5, 99.5, 99.5], 'tile 2');
    assert.checkTile(this.tile(2).attr.lastCall.args[0], [50.5, 0.5, 99.5, 30.5], 'tile 3');
});

QUnit.test('Passing \'wordWrap\' and \'overflow\' options to texts for tiles', function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 5 };
    common.createWidget({
        tile: {
            label: {
                wordWrap: 'wordWrap_1',
                textOverflow: 'overflow_1'
            }
        },
        size: {
            width: 30
        },
        dataSource: [{ name: 'Label', value: 10 }]
    });

    assert.ok(this.renderer.text.lastCall.returnValue.setMaxSize.calledOnce);
    assert.deepEqual(this.renderer.text.lastCall.returnValue.setMaxSize.lastCall.args, [20, 396, { hideOverflowEllipsis: true, wordWrap: 'wordWrap_1', textOverflow: 'overflow_1' }]);
});

QUnit.test('Passing \'overflow\' option to texts for group', function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 20, height: 5 };
    common.createWidget({
        size: {
            width: 30
        },
        group: {
            label: {
                textOverflow: 'overflow_1'
            }
        },
        dataSource: [{ name: 'groupName', items: [{ name: 'Label', value: 10 }] }]
    });

    assert.ok(this.renderer.text.getCall(1).returnValue.setMaxSize.calledOnce);
    assert.deepEqual(this.renderer.text.getCall(1).returnValue.setMaxSize.lastCall.args, [12, 9, { textOverflow: 'overflow_1', wordWrap: 'none' }]);
});

QUnit.module('labels', environment);

QUnit.test('clear labels group on creation', function(assert) {
    common.createWidget({
        dataSource: [{ value: 1, name: '1' }]
    });

    const labelsGroup = this.labelsGroup();

    assert.equal(labelsGroup.clear.callCount, 1);
});

QUnit.test('simple labels creation', function(assert) {
    common.createWidget({
        tile: {
            label: {
                font: {
                    color: 'someColor',
                    size: 'someSize'
                }
            }
        },
        dataSource: [{
            value: 1,
            name: 'text_0'
        }, {
            value: 2,
            name: 'text_1'
        }]
    });

    const labelsGroup = this.labelsGroup();

    assert.equal(this.renderer.text.callCount, 3);
    assert.strictEqual(this.renderer.text.getCall(1).args[0], 'text_0');
    assert.strictEqual(this.renderer.text.getCall(2).args[0], 'text_1');
    $.each(this.renderer.text.returnValues.slice(1, 2), function(i, text) {
        assert.strictEqual(text.append.lastCall.args[0], labelsGroup, 'text appended - ' + i);
        assert.strictEqual(text.css.lastCall.args[0].fill, 'someColor');
        assert.strictEqual(text.css.lastCall.args[0]['font-size'], 'someSize');
        assert.deepEqual(text.attr.firstCall.args[0], {
            filter: 'shadowFilter.id'
        });
    });
});

QUnit.test('invisible labels', function(assert) {
    common.createWidget({
        dataSource: [{ value: 1, name: 'text' }],
        tile: {
            label: {
                visible: false
            }
        }
    });

    assert.equal(this.renderer.text.callCount, 1);
});

QUnit.test('treeMap without texts', function(assert) {
    common.createWidget({
        dataSource: [{ value: 1 }]
    });

    assert.equal(this.renderer.text.callCount, 1);
});

QUnit.test('texts location', function(assert) {
    this.create({
        dataSource: [{
            value: 1,
            name: '1'
        }, {
            items: [{
                value: 2,
                name: '2'
            }, {
                value: 2,
                name: '3'
            }]
        }]
    });

    assert.deepEqual(this.renderer.text.getCall(1).returnValue.move.lastCall.args, [484, 2]);
    assert.deepEqual(this.renderer.text.getCall(2).returnValue.move.lastCall.args, [8, 24]);
    assert.deepEqual(this.renderer.text.getCall(3).returnValue.move.lastCall.args, [244, 24]);
});

QUnit.test('texts changing', function(assert) {
    const widget = common.createWidget({
        dataSource: [{
            value: 2,
            name: '2'
        }],
        tile: {
            label: {
                font: {
                    color: 'color',
                    size: 'size'
                }
            }
        }
    });

    widget.option({
        tile: {
            label: {
                font: {
                    color: 'newcolor',
                    size: 'newsize'
                }
            }
        }
    });

    assert.strictEqual(this.renderer.text.lastCall.returnValue.css.lastCall.args[0].fill, 'newcolor');
    assert.strictEqual(this.renderer.text.lastCall.returnValue.css.lastCall.args[0]['font-size'], 'newsize');
});

QUnit.test('texts positions correcting after font options changing', function(assert) {
    const widget = common.createWidget({
        dataSource: [{ value: 2, name: '2' }],
        tile: {
            label: {
                font: {
                    size: 10
                }
            }
        }
    });

    this.renderer.bBoxTemplate = { height: 396, width: 10, x: 0, y: 10 };

    widget.option({ tile: { label: { font: { size: 30 } } } });

    assert.deepEqual(this.renderer.text.lastCall.args, ['2']);
    assert.deepEqual(this.renderer.text.lastCall.returnValue.move.lastCall.args, [5, -6]);
});

QUnit.test('custom textField', function(assert) {
    common.createWidget({
        labelField: 'myLabel',
        dataSource: [{ value: 2, myLabel: 2 }]
    });

    assert.equal(this.renderer.text.callCount, 2);
});

QUnit.test('label in header', function(assert) {
    this.create({
        dataSource: [{
            name: '1',
            items: [{ value: 1 }, { value: 2 }]
        }],
        group: {
            label: {
                font: {
                    color: 'someColor'
                }
            }
        }
    });

    assert.equal(this.renderer.text.callCount, 2);
    assert.deepEqual(this.renderer.text.getCall(1).args, ['1']);
    assert.deepEqual(this.renderer.text.getCall(1).returnValue.move.lastCall.args, [8, 6]);
    assert.strictEqual(this.renderer.text.getCall(1).returnValue.css.lastCall.args[0].fill, 'someColor');
});

QUnit.test('draw only header labels', function(assert) {
    common.createWidget({
        dataSource: [{ items: [{ value: 2 }], name: 'header' }, { value: 2 }],
        label: {
            visible: false
        }
    });

    assert.equal(this.renderer.text.callCount, 2);
    assert.strictEqual(this.renderer.text.lastCall.args[0], 'header');
});

QUnit.test('toggle visibility by \'visible\' option - 1', function(assert) {
    const widget = common.createWidget({
        dataSource: [{
            value: 1, name: 'tile 1'
        }, {
            value: 2, name: 'tile 2'
        }]
    });
    this.renderer.text.resetHistory();

    widget.option({
        tile: {
            label: { visible: false }
        }
    });

    assert.strictEqual(this.renderer.text.callCount, 0, 'text count');
});

QUnit.test('toggle visibility by \'visible\' option - 2', function(assert) {
    const widget = common.createWidget({
        dataSource: [{
            name: 'tile 1',
            items: [{
                value: 1
            }]
        }, {
            name: 'tile 2',
            items: [{
                value: 2
            }]
        }]
    });
    this.renderer.text.resetHistory();

    widget.option({
        group: {
            label: { visible: false }
        }
    });

    assert.strictEqual(this.renderer.text.callCount, 0, 'text count');
});

// T378407
QUnit.test('creation widget on non-appended container', function(assert) {
    common.createWidget({
        dataSource: [{ value: 1, name: 'text' }]
    });

    assert.equal(this.renderer.lock.callCount, 1);
    assert.equal(this.renderer.unlock.callCount, 1);
});

QUnit.test('ellipsis mode, change width from small to big - reapply ellipsis', function(assert) {
    this.renderer.bBoxTemplate = { x: 0, y: 0, width: 10, height: 5 };
    const widget = common.createWidget({
        size: {
            width: 30
        },
        dataSource: [{ name: 'g', value: 1 }]
    });
    this.renderer.text.lastCall.returnValue.stub('setMaxSize').resetHistory();

    widget.option({
        size: {
            width: 40
        }
    });

    assert.equal(this.renderer.text.lastCall.returnValue.stub('setMaxSize').called, true);
});

QUnit.module('\'onDrawn\' event', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.apply(this, arguments);
        this.renderer.onEndAnimation = function(callback) {
            callback();
        };
    }
}));

QUnit.test('Common data source', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: [{ value: 1 }, { value: 2 }],
        onDrawn: spy
    });

    assert.strictEqual(spy.callCount, 1, 'event');
    assert.strictEqual(widget.isReady(), true, 'ready');
});

QUnit.test('Empty data source', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: null,
        onDrawn: spy
    });

    assert.strictEqual(spy.callCount, 1, 'event');
    assert.strictEqual(widget.isReady(), true, 'ready');
});

QUnit.test('Async data source - waiting', function(assert) {
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: createDataSource($.Deferred().promise()),
        onDrawn: spy
    });

    assert.strictEqual(spy.callCount, 0, 'event');
    assert.strictEqual(widget.isReady(), false, 'ready');
});

QUnit.test('Async data source - loaded', function(assert) {
    const deferred = $.Deferred();
    const spy = sinon.spy();
    const widget = common.createWidget({
        dataSource: createDataSource(deferred.promise()),
        onDrawn: spy
    });
    deferred.resolve([]);

    assert.strictEqual(spy.callCount, 1, 'event');
    assert.strictEqual(widget.isReady(), true, 'ready');
});

QUnit.module('rtl support', $.extend({},
    environment,
    {
        create: function(options) {
            $.extend(options, {
                rtlEnabled: true
            });
            environment.create.apply(this, arguments);
        }
    }
));

QUnit.test('position of labels', function(assert) {
    this.create({
        dataSource: [{
            value: 1,
            name: '1'
        }, {
            name: 'header',
            items: [{
                value: 2
            }, {
                value: 2,
                name: '3'
            }]
        }]
    });

    assert.deepEqual(this.renderer.text.getCall(1).returnValue.move.lastCall.args, [574, 2]);
    assert.deepEqual(this.renderer.text.getCall(2).returnValue.move.lastCall.args, [450, 6]);
    assert.deepEqual(this.renderer.text.getCall(3).returnValue.move.lastCall.args, [450, 24]);
});
