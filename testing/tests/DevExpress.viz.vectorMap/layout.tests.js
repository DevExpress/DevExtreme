var $ = require('jquery'),
    layoutModule = require('viz/vector_map/layout');

QUnit.module('LayoutControl', {
    beforeEach: function() {
        this.layoutControl = new layoutModule.LayoutControl();
    },
    afterEach: function() {
        this.layoutControl.dispose();
    },
    createItem: function() {
        return {
            resize: sinon.spy(),
            getLayoutOptions: sinon.stub(),
            locate: sinon.spy()
        };
    }
});

QUnit.test('instance type', function(assert) {
    assert.ok(this.layoutControl instanceof layoutModule.LayoutControl);
});

QUnit.test('add item', function(assert) {
    var item = this.createItem();

    this.layoutControl.addItem(item);

    assert.strictEqual(typeof item.updateLayout, 'function');
});

QUnit.test('remove item', function(assert) {
    var item = this.createItem();
    this.layoutControl.addItem(item);

    this.layoutControl.removeItem(item);

    assert.strictEqual(item.updateLayout, null);
});

QUnit.test('setSize', function(assert) {
    var item1 = this.createItem(),
        item2 = this.createItem(),
        item3 = this.createItem();
    this.layoutControl.addItem(item1);
    this.layoutControl.addItem(item2);
    this.layoutControl.addItem(item3);
    item1.getLayoutOptions.returns({
        width: 100, height: 50,
        horizontalAlignment: 'left',
        verticalAlignment: 'top'
    });
    item2.getLayoutOptions.returns({
        width: 80, height: 70,
        horizontalAlignment: 'right',
        verticalAlignment: 'bottom'
    });
    item3.getLayoutOptions.returns({
        width: 120, height: 30,
        horizontalAlignment: 'center',
        verticalAlignment: 'top'
    });

    this.layoutControl.setSize({ left: 10, right: 20, top: 30, bottom: 40, width: 800, height: 600 });

    assert.deepEqual(item1.resize.lastCall.args, [{ left: 10, right: 20, top: 30, bottom: 40, width: 800, height: 600 }], 'resize - 0');
    assert.deepEqual(item1.getLayoutOptions.lastCall.args, [], 'getLayoutOptions - 0');
    assert.deepEqual(item1.locate.lastCall.args, [10, 30], 'locate - 0');
    assert.deepEqual(item2.resize.lastCall.args, [{ left: 10, right: 20, top: 30, bottom: 40, width: 800, height: 600 }], 'resize - 1');
    assert.deepEqual(item2.getLayoutOptions.lastCall.args, [], 'getLayoutOptions - 1');
    assert.deepEqual(item2.locate.lastCall.args, [730, 560], 'locate - 1');
    assert.deepEqual(item3.resize.lastCall.args, [{ left: 10, right: 20, top: 30, bottom: 40, width: 800, height: 600 }], 'resize - 2');
    assert.deepEqual(item3.getLayoutOptions.lastCall.args, [], 'getLayoutOptions - 2');
    assert.deepEqual(item3.locate.lastCall.args, [350, 30], 'locate - 2');
});

QUnit.test('setSize / not rendered', function(assert) {
    var item1 = this.createItem(),
        item2 = this.createItem(),
        item3 = this.createItem();
    this.layoutControl.addItem(item1);
    this.layoutControl.addItem(item2);
    this.layoutControl.addItem(item3);
    item1.getLayoutOptions.returns(null);
    item2.getLayoutOptions.returns(null);
    item3.getLayoutOptions.returns(null);

    this.layoutControl.setSize({ left: 10, right: 20, top: 30, bottom: 40, width: 800, height: 600 });

    $.each([item1, item2, item3], function(i, item) {
        assert.deepEqual(item.resize.lastCall.args, [{ left: 10, right: 20, top: 30, bottom: 40, width: 800, height: 600 }], 'resize - ' + i);
        assert.deepEqual(item.getLayoutOptions.lastCall.args, [], 'getLayoutOptions - ' + i);
        assert.strictEqual(item.locate.lastCall, null, 'locate - ' + i);
    });
});

QUnit.test('calling updateLayout from item', function(assert) {
    var item1 = this.createItem(),
        item2 = this.createItem(),
        item3 = this.createItem();
    this.layoutControl.addItem(item1);
    this.layoutControl.addItem(item2);
    this.layoutControl.addItem(item3);
    this.layoutControl.setSize({ left: 10, right: 20, top: 30, bottom: 40, width: 800, height: 600 });
    item1.getLayoutOptions.returns({
        width: 100, height: 50,
        horizontalAlignment: 'left',
        verticalAlignment: 'top'
    });
    item2.getLayoutOptions.returns({
        width: 80, height: 70,
        horizontalAlignment: 'right',
        verticalAlignment: 'bottom'
    });
    item3.getLayoutOptions.returns({
        width: 120, height: 30,
        horizontalAlignment: 'center',
        verticalAlignment: 'top'
    });

    item1.updateLayout();

    $.each([item1, item2, item3], function(i, item) {
        assert.deepEqual(item.getLayoutOptions.lastCall.args, [], 'getLayoutOptions - ' + i);
    });
    assert.deepEqual(item1.locate.lastCall.args, [10, 30], 'locate - 0');
    assert.deepEqual(item2.locate.lastCall.args, [730, 560], 'locate - 1');
    assert.deepEqual(item3.locate.lastCall.args, [350, 30], 'locate - 2');
});

QUnit.test('setSize / suspended', function(assert) {
    var item1 = this.createItem(),
        item2 = this.createItem(),
        item3 = this.createItem();
    this.layoutControl.addItem(item1);
    this.layoutControl.addItem(item2);
    this.layoutControl.addItem(item3);

    this.layoutControl.suspend();
    this.layoutControl.setSize({ left: 10, right: 20, top: 30, bottom: 40, width: 800, height: 600 });

    $.each([item1, item2, item3], function(i, item) {
        assert.strictEqual(item.resize.lastCall, null, 'resize - ' + i);
        assert.strictEqual(item.getLayoutOptions.lastCall, null, 'getLayoutOptions - ' + i);
        assert.strictEqual(item.locate.lastCall, null, 'locate - ' + i);
    });
});

QUnit.test('updateLayout / suspended', function(assert) {
    var item1 = this.createItem(),
        item2 = this.createItem(),
        item3 = this.createItem();
    this.layoutControl.addItem(item1);
    this.layoutControl.addItem(item2);
    this.layoutControl.addItem(item3);
    item1.getLayoutOptions.returns({ horizontalAlignment: 'left', verticalAlignment: 'top' });
    item2.getLayoutOptions.returns({ horizontalAlignment: 'left', verticalAlignment: 'top' });
    item3.getLayoutOptions.returns({ horizontalAlignment: 'left', verticalAlignment: 'top' });
    this.layoutControl.setSize({ left: 10, right: 20, top: 30, bottom: 40, width: 800, height: 600 });

    this.layoutControl.suspend();
    item1.updateLayout();

    $.each([item1, item2, item3], function(i, item) {
        assert.strictEqual(item.resize.callCount, 1, 'resize - ' + i);
        assert.strictEqual(item.getLayoutOptions.callCount, 1, 'getLayoutOptions - ' + i);
        assert.strictEqual(item.locate.callCount, 1, 'locate - ' + i);
    });
});

QUnit.module('Layout', {
    doTest: function(assert, itemDefs, size, expected, message) {
        var layoutControl = new layoutModule.LayoutControl();
        var items = $.map(itemDefs, function(def) {
            var parts = def.split('-');
            var item = {
                getLayoutOptions: function() {
                    return { horizontalAlignment: parts[0], verticalAlignment: parts[1], width: Number(parts[2]), height: Number(parts[3]) };
                },
                resize: function(size) {
                    if(size === null) {
                        this.location = null;
                    }
                },
                locate: function(x, y) {
                    this.location = [x, y];
                }
            };
            layoutControl.addItem(item);
            return item;
        });
        layoutControl.setSize({ left: 0, right: 0, top: 0, bottom: 0, width: size[0], height: size[1] });
        var result = [];
        $.each(items, function(_, item) {
            layoutControl.removeItem(item);
            result.push(item.location);
        });
        layoutControl.dispose();
        assert.deepEqual(result, expected, message);
    }
});

QUnit.test('common', function(assert) {
    this.doTest(assert, ['left-top-100-50', 'right-bottom-80-70', 'center-top-60-30'], [300, 200], [[0, 0], [220, 130], [120, 0]]);
});

QUnit.test('space of neighbour empty cell is occupied / horizontal', function(assert) {
    this.doTest(assert, ['left-top-100-50', 'right-top-50-30'], [200, 100], [[0, 0], [150, 0]], 'edge');
    this.doTest(assert, ['center-bottom-100-20', 'center-top-40-30'], [200, 100], [[50, 80], [80, 0]], 'center');
});

QUnit.test('space of neighbour empty cell is occupied / vertical', function(assert) {
    this.doTest(assert, ['right-bottom-50-100'], [150, 150], [[100, 50]], 'edge');
});

QUnit.test('free space of neighbour non empty cell is occupied / horizontal', function(assert) {
    this.doTest(assert, ['left-bottom-80-40', 'center-bottom-40-10'], [200, 100], [[0, 60], [80, 90]], 'edge');
    this.doTest(assert, ['right-top-40-10', 'center-top-80-40'], [200, 100], [[160, 0], [53, 0]], 'center');
    this.doTest(assert, ['left-bottom-60-20', 'center-bottom-80-30'], [200, 100], [[0, 80], [67, 70]], 'center, left shifted');
    this.doTest(assert, ['center-top-80-30', 'right-top-60-20'], [200, 100], [[53, 0], [140, 0]], 'center, right shifter');
});

QUnit.test('free space of neighbour non empty cell is occupied / vertical', function(assert) {
    this.doTest(assert, ['left-top-20-70', 'left-bottom-60-20'], [200, 100], [[0, 0], [0, 80]]);
});

QUnit.test('item is hidden / horizontal', function(assert) {
    this.doTest(assert, ['left-top-100-20', 'center-top-60-20'], [200, 100], [null, [70, 0]]);
});

QUnit.test('item is hidden / vertical', function(assert) {
    this.doTest(assert, ['center-top-40-40', 'center-bottom-20-80'], [200, 100], [[80, 0], null]);
});
