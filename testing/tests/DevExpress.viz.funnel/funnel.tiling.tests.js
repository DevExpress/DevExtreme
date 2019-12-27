const common = require('./commonParts/common.js');
const createFunnel = common.createFunnel;
const environment = common.environment;

QUnit.module('Algorithms', environment);

QUnit.test('Funnel. Normalize values', function(assert) {
    const funnel = createFunnel({
        dataSource: [
            {
                value: 430
            },
            {
                value: 201
            },
            {
                value: 300
            },
            {
                value: 45
            }
        ]
    });
    const items = funnel.getAllItems();

    assert.equal(items.length, 4);
    assert.equal(items[0].percent, 1);
    assert.roughEqual(items[1].percent, 0.69, 0.01);
    assert.roughEqual(items[2].percent, 0.46, 0.01);
    assert.roughEqual(items[3].percent, 0.1, 0.01);
});

QUnit.test('Funnel. Drawing', function(assert) {
    createFunnel({
        dataSource: [
            {
                value: 430
            },
            {
                value: 201
            },
            {
                value: 300
            },
            {
                value: 45
            }
        ]
    });

    const items = this.items();

    assert.equal(items.length, 4);
    assert.checkItem(items[0].attr.firstCall.args[0].points, [0, 0, 1000, 0, 848.8, 100, 151.1, 100]);
    assert.checkItem(items[1].attr.firstCall.args[0].points, [151.1, 100, 848.8, 100, 733.7, 200, 266.2, 200]);
    assert.checkItem(items[2].attr.firstCall.args[0].points, [266.2, 200, 733.7, 200, 552.3, 300, 447.6, 300]);
    assert.checkItem(items[3].attr.firstCall.args[0].points, [447.6, 300, 552.3, 300, 552.3, 400, 447.6, 400]);
});

QUnit.test('Pyramid. Normalize values', function(assert) {
    const funnel = createFunnel({
        algorithm: 'dynamicHeight',
        dataSource: [
            {
                value: 430
            },
            {
                value: 201
            },
            {
                value: 300
            },
            {
                value: 45
            }
        ]
    });
    const items = funnel.getAllItems();

    assert.equal(items.length, 4);
    assert.roughEqual(items[0].percent, 0.44, 0.01);
    assert.roughEqual(items[1].percent, 0.3, 0.01);
    assert.roughEqual(items[2].percent, 0.2, 0.01);
    assert.roughEqual(items[3].percent, 0.04, 0.01);
});

QUnit.test('Pyramid. Drawing', function(assert) {
    createFunnel({
        algorithm: 'dynamicHeight',
        dataSource: [
            {
                value: 430
            },
            {
                value: 201
            },
            {
                value: 300
            },
            {
                value: 45
            }
        ]
    });
    const items = this.items();

    assert.equal(items.length, 4);
    assert.checkItem(items[0].attr.firstCall.args[0].points, [0, 0, 1000, 0, 779.7, 176.2, 220.2, 176.2]);
    assert.checkItem(items[1].attr.firstCall.args[0].points, [220.2, 176.2, 779.7, 176.2, 626, 299.1, 373.9, 299.1]);
    assert.checkItem(items[2].attr.firstCall.args[0].points, [373.9, 299.1, 626, 299.1, 523, 381.5, 476.9, 381.5]);
    assert.checkItem(items[3].attr.firstCall.args[0].points, [476.9, 381.5, 523, 381.5, 500, 400, 500, 400]);
});

QUnit.test('Normalize algorithm name', function(assert) {
    createFunnel({
        algorithm: 'dynamicHeIGht',
        dataSource: [
            {
                value: 430
            },
            {
                value: 201
            },
            {
                value: 300
            },
            {
                value: 45
            }
        ]
    });
    const items = this.items();

    assert.equal(items.length, 4);
    assert.checkItem(items[0].attr.firstCall.args[0].points, [0, 0, 1000, 0, 779.7, 176.2, 220.2, 176.2]);
    assert.checkItem(items[1].attr.firstCall.args[0].points, [220.2, 176.2, 779.7, 176.2, 626, 299.1, 373.9, 299.1]);
    assert.checkItem(items[2].attr.firstCall.args[0].points, [373.9, 299.1, 626, 299.1, 523, 381.5, 476.9, 381.5]);
    assert.checkItem(items[3].attr.firstCall.args[0].points, [476.9, 381.5, 523, 381.5, 500, 400, 500, 400]);
});

QUnit.test('Pyramid. Drawing with neckWidth', function(assert) {
    createFunnel({
        algorithm: 'dynamicHeight',
        neckWidth: 0.2,
        dataSource: [
            {
                value: 430
            },
            {
                value: 201
            },
            {
                value: 300
            },
            {
                value: 45
            }
        ]
    });
    const items = this.items();

    assert.equal(items.length, 4);
    assert.checkItem(items[0].attr.firstCall.args[0].points, [0, 0, 1000, 0, 823.7, 176.2, 176.2, 176.2]);
    assert.checkItem(items[1].attr.firstCall.args[0].points, [176.2, 176.2, 823.7, 176.2, 700.8, 299.1, 299.1, 299.1]);
    assert.checkItem(items[2].attr.firstCall.args[0].points, [299.1, 299.1, 700.8, 299.1, 618.4, 381.5, 381.5, 381.5]);
    assert.checkItem(items[3].attr.firstCall.args[0].points, [381.5, 381.5, 618.4, 381.5, 600, 400, 400, 400]);
});

QUnit.test('Pyramid. Drawing with neckHeight', function(assert) {
    createFunnel({
        algorithm: 'dynamicHeight',
        neckWidth: 0.2,
        neckHeight: 0.18,
        dataSource: [
            {
                value: 430
            },
            {
                value: 201
            },
            {
                value: 300
            },
            {
                value: 45
            }
        ]
    });

    const items = this.items();

    assert.equal(items.length, 4);
    assert.checkItem(items[0].attr.firstCall.args[0].points, [0, 0, 1000, 0, 785, 176.2, 214.9, 176.2]);
    assert.checkItem(items[1].attr.firstCall.args[0].points, [214.9, 176.2, 785, 176.2, 635.1, 299.1, 364.8, 299.1]);
    assert.checkItem(items[2].attr.firstCall.args[0].points, [364.8, 299.1, 635.1, 299.1, 600, 328, 600, 381.5, 400, 381.5, 400, 328]);
    assert.checkItem(items[3].attr.firstCall.args[0].points, [400, 381.5, 600, 381.5, 600, 400, 400, 400]);
});

QUnit.test('Pyramid. Update neckWidth and neckHeight', function(assert) {
    const funnel = createFunnel({
        algorithm: 'dynamicHeight',
        neckWidth: 0.2,
        neckHeight: 0.18,
        dataSource: [
            {
                value: 430
            },
            {
                value: 201
            },
            {
                value: 300
            },
            {
                value: 45
            }
        ]
    });

    funnel.option({ neckWidth: 0.3, neckHeight: 0.4 });

    const items = this.items();

    assert.equal(items.length, 4);
    assert.checkItem(items[0].attr.firstCall.args[0].points, [0, 0, 1000, 0, 743, 176.2, 257, 176.2]);
    assert.checkItem(items[1].attr.firstCall.args[0].points, [257, 176.2, 743, 176.2, 650, 240, 650, 299.1, 350, 299.1, 350, 240]);
    assert.checkItem(items[2].attr.firstCall.args[0].points, [350, 299.1, 650, 299.1, 650, 381.5, 350, 381.5]);
    assert.checkItem(items[3].attr.firstCall.args[0].points, [350, 381.5, 650, 381.5, 650, 400, 350, 400]);
});

QUnit.test('Update option from funnel to pyramid', function(assert) {
    const funnel = createFunnel({
        dataSource: [
            {
                value: 430
            },
            {
                value: 201
            },
            {
                value: 300
            },
            {
                value: 45
            }
        ]
    });

    funnel.option({ algorithm: 'dynamicHeight' });

    const items = this.items();

    assert.equal(items.length, 4);
    assert.checkItem(items[0].attr.firstCall.args[0].points, [0, 0, 1000, 0, 779.7, 176.2, 220.2, 176.2]);
    assert.checkItem(items[1].attr.firstCall.args[0].points, [220.2, 176.2, 779.7, 176.2, 626, 299.1, 373.9, 299.1]);
    assert.checkItem(items[2].attr.firstCall.args[0].points, [373.9, 299.1, 626, 299.1, 523, 381.5, 476.9, 381.5]);
    assert.checkItem(items[3].attr.firstCall.args[0].points, [476.9, 381.5, 523, 381.5, 500, 400, 500, 400]);
});
