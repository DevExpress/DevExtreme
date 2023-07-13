const $ = require('jquery');
const common = require('./commonParts/common.js');
const createSankey = common.createSankey;
const layoutBuilder = common.layoutBuilder;
const spiesLayoutBuilder = common.spiesLayoutBuilder;
const environment = common.environment;
const find = common.find;
const rendererModule = require('viz/core/renderers/renderer');
const paletteModule = require('viz/palette');
const themeModule = require('viz/themes');

themeModule.registerTheme({
    name: 'test-theme',
    sankey: {
        node: {
            border: {
                visible: true,
                color: 'black'
            }
        }
    } }, 'generic.light');

QUnit.module('Initialization', environment);

QUnit.test('Create empty widget', function(assert) {
    const sankey = createSankey({});

    assert.ok(sankey);
    assert.equal(rendererModule.Renderer.firstCall.args[0].cssClass, 'dxs dxs-sankey', 'rootClass prefix rootClass');
    assert.equal(this.linksGroup().append.lastCall.args[0], this.renderer.root, 'links group added to root');
    assert.equal(this.nodesGroup().append.lastCall.args[0], this.renderer.root, 'nodes group added to root');
    assert.equal(this.labelsGroup().append.lastCall.args[0], this.renderer.root, 'labels group added to root');
});

QUnit.test('Default size', function(assert) {
    $('#test-container').hide();
    const sankey = createSankey({});

    assert.deepEqual(sankey.getSize(), { width: 400, height: 400 });
});

QUnit.test('Base sankey not fail when tooltip api is called', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }]
    });

    sankey.getAllLinks()[0].showTooltip();
    sankey.hideTooltip();

    sankey.getAllNodes()[0].showTooltip();
    sankey.hideTooltip();

    sankey.getAllNodes()[1].showTooltip();
    sankey.hideTooltip();

    assert.ok(sankey);
});

QUnit.module('DataSource processing', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        Object.keys(spiesLayoutBuilder).forEach(function(spyKey) {
            spiesLayoutBuilder[spyKey].reset();
        });
    }
}));

QUnit.test('Process values from dataSource and pass them to layout builder', function(assert) {
    const data = [{ source: 'A', target: 'B', weight: 1 }, { source: 'B', target: 'C', weight: 1 }];
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: data
    });

    assert.ok(spiesLayoutBuilder.computeLayout.calledOnce);
    assert.deepEqual(spiesLayoutBuilder.computeLayout.lastCall.args[0][0], ['A', 'B', 1]);
    assert.deepEqual(spiesLayoutBuilder.computeLayout.lastCall.args[0][1], ['B', 'C', 1]);
    assert.equal(spiesLayoutBuilder.computeLayout.lastCall.args[0].length, data.length);
});

QUnit.test('Process values from dataSource with custom sourceField, targetField, weightField and pass them to layout builder', function(assert) {
    const data = [{ src: 'A', destination: 'B', value: 1 }, { src: 'B', destination: 'C', value: 1 }];
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: data,
        sourceField: 'src',
        targetField: 'destination',
        weightField: 'value',
    });

    assert.ok(spiesLayoutBuilder.computeLayout.calledOnce);
    assert.deepEqual(spiesLayoutBuilder.computeLayout.lastCall.args[0][0], ['A', 'B', 1]);
    assert.deepEqual(spiesLayoutBuilder.computeLayout.lastCall.args[0][1], ['B', 'C', 1]);
    assert.equal(spiesLayoutBuilder.computeLayout.lastCall.args[0].length, data.length);
});


QUnit.test('Trigger error on invalid source data', function(assert) {
    const invalidDataSets = [
        [{ source: 'A', target: 'B', weight: 1 }, { source: 'A', target: 'C' }],
        [{ source: 'A', target: 'B', weight: 0 }, { source: 'A', target: 'C', weight: 1 }],
        [{ source: 'A', target: 1, weight: 1 }, { source: 'A', target: 'C', weight: 1 }],
        [{ source: 'A', target: 'B', weight: 1 }, { source: 1, target: 'C', weight: 1 }],
        [{ source: 'A', target: 'B', weight: 1 }, { source: 'A', target: 'C', weight: -5 }],
        ['ABCD', { source: 'A', target: 'C', weight: 1 }]
    ];
    const expectedErrorCodes = [
        'E2007', 'E2009', 'E2008', 'E2008', 'E2009', 'E2007'
    ];
    const spy = sinon.spy();

    invalidDataSets.forEach(function(data, dataIdx) {
        spy.reset();
        createSankey({
            layoutBuilder: layoutBuilder,
            dataSource: data,
            onIncidentOccurred: spy
        });
        assert.ok(spy.called);
        assert.equal(spy.getCall(0).args[0].target.id, expectedErrorCodes[dataIdx]);
        assert.equal(spy.getCall(0).args[0].target.type, 'error');
        assert.equal(spy.getCall(0).args[0].target.widget, 'dxSankey');
    });
});

QUnit.test('Trigger "cycle detected" error on invalid source data', function(assert) {
    const invalidDataSets = [
        [{ source: 'A', target: 'B', weight: 1 }, { source: 'B', target: 'A', weight: 1 }],
        [{ source: 'A', target: 'B', weight: 1 }, { source: 'B', target: 'C', weight: 1 }, { source: 'C', target: 'D', weight: 1 }, { source: 'D', target: 'A', weight: 1 }]
    ];
    const spy = sinon.spy();

    invalidDataSets.forEach(function(data) {
        spy.reset();
        createSankey({
            layoutBuilder: layoutBuilder,
            dataSource: data,
            onIncidentOccurred: spy
        });
        assert.ok(spy.called);
        assert.equal(spy.getCall(0).args[0].target.id, 'E2006');
        assert.equal(spy.getCall(0).args[0].target.type, 'error');
        assert.equal(spy.getCall(0).args[0].target.widget, 'dxSankey');
    });
});

QUnit.test('Empty data source, warning shouldn\'t fire', function(assert) {
    const spy = sinon.stub();
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [],
        onIncidentOccurred: spy
    });

    assert.ok(!spy.called);
});

QUnit.test('Sort nodes in all cascades by default', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            { source: 'A', target: 'M', weight: 1 }, { source: 'A', target: 'M', weight: 1 }, { source: 'B', target: 'M', weight: 1 }, { source: 'B', target: 'M', weight: 1 }, { source: 'C', target: 'M', weight: 1 }, { source: 'C', target: 'N', weight: 1 },
            { source: 'M', target: 'X', weight: 1 }, { source: 'N', target: 'X', weight: 1 }, { source: 'N', target: 'Y', weight: 1 }, { source: 'N', target: 'Z', weight: 1 }
        ],
    });
    assert.deepEqual(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[0].map(function(node) { return node._name; }), ['A', 'B', 'C']);
    assert.deepEqual(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[1].map(function(node) { return node._name; }), ['M', 'N']);
    assert.deepEqual(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[2].map(function(node) { return node._name; }), ['X', 'Y', 'Z']);
});

QUnit.test('Sort nodes in all cascades by sortData option', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            { source: 'A', target: 'M', weight: 1 }, { source: 'A', target: 'M', weight: 1 }, { source: 'B', target: 'M', weight: 1 }, { source: 'B', target: 'M', weight: 1 }, { source: 'C', target: 'M', weight: 1 }, { source: 'C', target: 'N', weight: 1 },
            { source: 'M', target: 'X', weight: 1 }, { source: 'N', target: 'X', weight: 1 }, { source: 'N', target: 'Y', weight: 1 }, { source: 'N', target: 'Z', weight: 1 }
        ],
        sortData: {
            'A': 3, 'B': 2, 'C': 1, 'M': 2, 'N': 1, 'X': 2, 'Y': 3, 'Z': 1
        }
    });

    assert.deepEqual(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[0].map(function(node) { return node._name; }), ['C', 'B', 'A']);
    assert.deepEqual(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[1].map(function(node) { return node._name; }), ['N', 'M']);
    assert.deepEqual(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[2].map(function(node) { return node._name; }), ['Z', 'X', 'Y']);
});

QUnit.module('Layout building', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        Object.keys(spiesLayoutBuilder).forEach(function(spyKey) {
            spiesLayoutBuilder[spyKey].reset();
        });
    }
}));

QUnit.test('Number of cascades with simplest dataSource possible', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            { source: 'A', target: 'Z', weight: 1 }
        ]
    });

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades.length, 2);
});


QUnit.test('Number of nodes with simplest dataSource possible', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            { source: 'A', target: 'Z', weight: 1 }
        ]
    });

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].nodes.length, 2);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[0].length, 1);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[1].length, 1);

});

QUnit.test('Number of links with simplest dataSource possible', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            { source: 'A', target: 'Z', weight: 1 }
        ]
    });

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links.length, 1);
});

QUnit.test('Number of cascades with big dataSource', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.countriesData
    });

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades.length, 4);
});

QUnit.test('Number of nodes with big dataSource', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.countriesData
    });

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].nodes.length, 4);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[0].length, 4);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[1].length, 4);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[2].length, 5);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[3].length, 3);
});

QUnit.test('Number of links with big dataSource', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.countriesData
    });

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links.length, 46);
});

QUnit.test('Node weights with simplest dataSource possible', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            { source: 'A', target: 'Z', weight: 1 }
        ]
    });
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['A'].inWeight, 0);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['A'].outWeight, 1);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['A'].maxWeight, 1);

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['Z'].inWeight, 1);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['Z'].outWeight, 0);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['Z'].maxWeight, 1);
});

QUnit.test('Node input weights with big dataSource', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.countriesData
    });
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['Brazil'].inWeight, 0);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['Canada'].inWeight, 0);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['Mexico'].inWeight, 0);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['USA'].inWeight, 0);

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['Portugal'].inWeight, 8);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['France'].inWeight, 8);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['Spain'].inWeight, 7);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['England'].inWeight, 8);

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['Angola'].inWeight, 4);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['Senegal'].inWeight, 6);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['Morocco'].inWeight, 9);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['South Africa'].inWeight, 12);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['Mali'].inWeight, 3);

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[3]['China'].inWeight, 25);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[3]['India'].inWeight, 5);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[3]['Japan'].inWeight, 15);
});

QUnit.test('Node output and max weights with big dataSource', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.countriesData
    });

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['Brazil'].outWeight, 8);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['Brazil'].maxWeight, 8);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['Canada'].outWeight, 7);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['Canada'].maxWeight, 7);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['Mexico'].outWeight, 8);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['Mexico'].maxWeight, 8);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['USA'].outWeight, 8);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['USA'].maxWeight, 8);

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['Portugal'].outWeight, 7);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['Portugal'].maxWeight, 8);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['France'].outWeight, 11);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['France'].maxWeight, 11);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['Spain'].outWeight, 5);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['Spain'].maxWeight, 7);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['England'].outWeight, 11);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['England'].outWeight, 11);

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['Angola'].outWeight, 9);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['Angola'].maxWeight, 9);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['Senegal'].outWeight, 9);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['Senegal'].maxWeight, 9);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['Morocco'].outWeight, 9);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['Morocco'].maxWeight, 9);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['South Africa'].outWeight, 9);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['South Africa'].maxWeight, 12);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['Mali'].outWeight, 9);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[2]['Mali'].maxWeight, 9);

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[3]['China'].outWeight, 0);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[3]['China'].maxWeight, 25);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[3]['India'].outWeight, 0);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[3]['India'].maxWeight, 5);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[3]['Japan'].outWeight, 0);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[3]['Japan'].maxWeight, 15);
});

QUnit.test('Links configuration with simplest dataSource possible', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            { source: 'A', target: 'Z', weight: 1 }
        ]
    });
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[0]._from._name, 'A');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[0]._to._name, 'Z');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[0]._weight, 1);
});

QUnit.test('Some links configuration with big dataSource', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.countriesData
    });
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[0]._from._name, 'Brazil');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[0]._to._name, 'Portugal');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[0]._weight, 5);

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[15]._from._name, 'Portugal');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[15]._to._name, 'Angola');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[15]._weight, 2);

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[27]._from._name, 'England');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[27]._to._name, 'Angola');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[27]._weight, 1);

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[45]._from._name, 'Mali');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[45]._to._name, 'Japan');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[45]._weight, 3);
});

QUnit.test('Passing default align option', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            { source: 'A', target: 'Z', weight: 1 }
        ]
    });
    assert.equal(spiesLayoutBuilder._computeNodes.getCall(0).args[1].nodeAlign, 'center');
});

QUnit.test('Passing string align option', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        alignment: 'bottom',
        dataSource: [
            { source: 'A', target: 'Z', weight: 1 }
        ]
    });
    assert.equal(spiesLayoutBuilder._computeNodes.getCall(0).args[1].nodeAlign, 'bottom');
});

QUnit.test('Passing array align option', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        alignment: ['top', 'bottom'],
        dataSource: [
            { source: 'A', target: 'Z', weight: 1 }
        ]
    });
    assert.deepEqual(spiesLayoutBuilder._computeNodes.getCall(0).args[1].nodeAlign, ['top', 'bottom']);
});

QUnit.module('Returning correct layout data', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        Object.keys(spiesLayoutBuilder).forEach(function(spyKey) {
            spiesLayoutBuilder[spyKey].reset();
        });
    }
}));

QUnit.test('Returning all nodes in getAllNodes', function(assert) {
    const sankey = createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.countriesData
    });
    const nodes = sankey.getAllNodes();

    assert.equal(nodes.length, 16);
});

QUnit.test('Returning all links data in getAllLinks', function(assert) {
    const sankey = createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.countriesData
    });
    const links = sankey.getAllLinks();

    assert.equal(links.length, 46);
});

QUnit.test('Returning correct links[].connection data in getAllLinks', function(assert) {
    const sankey = createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.simpleData
    });
    const links = sankey.getAllLinks();

    assert.equal(links.length, common.testData.simpleData.length);
    common.testData.simpleData.forEach(function(linkData) {
        const output = find(links, function(i) {
            return i.connection.source === linkData.source && i.connection.target === linkData.target && i.connection.weight === linkData.weight;
        });
        assert.notStrictEqual(typeof output, 'undefined');
    });
});

QUnit.test('Returning correct nodes[].linksIn and nodes[].linksOut data in getAllNodes', function(assert) {
    const sankey = createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.simpleData
    });
    const nodes = sankey.getAllNodes();
    const expected = { 'A': [0, 1], 'B': [0, 2], 'C': [0, 1], 'M': [2, 1], Y: [3, 0] };

    assert.equal(nodes.length, 5);
    ['A', 'B', 'C', 'M', 'Y'].forEach(function(nodeName) {
        const node = find(nodes, function(node) { return node.title === nodeName; });
        assert.equal(node.linksIn.length, expected[nodeName][0]);
        assert.equal(node.linksOut.length, expected[nodeName][1]);
    });
});

// Drawing tests

QUnit.module('Drawing', $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        $('#test-container').css({
            width: 1000,
            height: 400
        });
    }
}));

QUnit.test('Draw Links', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.simpleData
    });

    const links = this.links();
    assert.equal(links.length, 5);
    assert.equal(this.linksGroup().clear.callCount, 1);

    assert.equal(this.renderer.path.callCount, 10, '5x2 paths drawn');

    assert.equal(this.renderer.path.args[0][1], 'area');
    assert.equal(this.renderer.path.args[1][1], 'area');
    assert.equal(this.renderer.path.args[2][1], 'area');
    assert.equal(this.renderer.path.args[3][1], 'area');
    assert.equal(this.renderer.path.args[4][1], 'area');
    assert.equal(this.renderer.path.args[5][1], 'area');
    assert.equal(this.renderer.path.args[6][1], 'area');
    assert.equal(this.renderer.path.args[7][1], 'area');
    assert.equal(this.renderer.path.args[8][1], 'area');
    assert.equal(this.renderer.path.args[9][1], 'area');

    assert.equal(this.link(0)[0].attr.firstCall.args[0].d, 'M 15 0 C 306 0 694 30 985 30 L 985 73 C 694 73 306 42 15 42 Z');
    assert.equal(this.link(0)[1].attr.firstCall.args[0].d, 'M 15 0 C 306 0 694 30 985 30 L 985 73 C 694 73 306 42 15 42 Z');

    assert.equal(this.link(1)[0].attr.firstCall.args[0].d, 'M 15 72 C 156 72 344 94 485 94 L 485 264 C 344 264 156 242 15 242 Z');
    assert.equal(this.link(1)[1].attr.firstCall.args[0].d, 'M 15 72 C 156 72 344 94 485 94 L 485 264 C 344 264 156 242 15 242 Z');

    assert.equal(this.link(2)[0].attr.firstCall.args[0].d, 'M 15 242 C 306 242 694 73 985 73 L 985 158 C 694 158 306 327 15 327 Z');
    assert.equal(this.link(2)[1].attr.firstCall.args[0].d, 'M 15 242 C 306 242 694 73 985 73 L 985 158 C 694 158 306 327 15 327 Z');

    assert.equal(this.link(3)[0].attr.firstCall.args[0].d, 'M 15 357 C 156 357 344 264 485 264 L 485 306 C 344 306 156 399 15 399 Z');
    assert.equal(this.link(3)[1].attr.firstCall.args[0].d, 'M 15 357 C 156 357 344 264 485 264 L 485 306 C 344 306 156 399 15 399 Z');

    assert.equal(this.link(4)[0].attr.firstCall.args[0].d, 'M 500 94 C 645.5 94 839.5 158 985 158 L 985 370 C 839.5 370 645.5 306 500 306 Z');
    assert.equal(this.link(4)[1].attr.firstCall.args[0].d, 'M 500 94 C 645.5 94 839.5 158 985 158 L 985 370 C 839.5 370 645.5 306 500 306 Z');
});

QUnit.test('Draw Nodes', function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.simpleData
    });

    const nodes = this.nodes();
    const expected = {
        A: { x: 0, y: 0, height: 42, width: 15, _name: 'A' },
        B: { x: 0, y: 72, height: 255, width: 15, _name: 'B' },
        C: { x: 0, y: 357, height: 42, width: 15, _name: 'C' },
        M: { x: 485, y: 94, height: 212, width: 15, _name: 'M' },
        Y: { x: 985, y: 30, height: 340, width: 15, _name: 'Y' }
    };
    assert.equal(nodes.length, 5, 'Number of nodes');
    assert.equal(this.nodesGroup().clear.callCount, 1, 'Existing nodes cleared');

    ['A', 'B', 'C', 'M', 'Y'].forEach(function(nodeName) {
        const node = find(nodes, function(node) { return node.attr.firstCall.args[0]._name === nodeName; });
        assert.deepEqual(node.attr.firstCall.args[0], expected[nodeName], 'Node ' + nodeName + ': params match');
    });
});

QUnit.test('Resize', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
    });
    this.nodesGroup().clear.reset();

    sankey.option('size', { width: 900, height: 600 });

    const nodes = this.nodes();

    assert.equal(nodes.length, 2);
    assert.equal(this.nodesGroup().clear.callCount, 1, 'Cleared on resize');
    assert.equal(nodes[0].attr.firstCall.args[0].height, 600, 'Node resized');
    assert.equal(nodes[1].attr.firstCall.args[0].height, 600, 'Node resized');
    assert.equal(nodes[1].attr.firstCall.args[0].x, 900 - 15, 'Node repositioned');
});

QUnit.test('Palette', function(assert) {
    sinon.spy(paletteModule, 'createPalette');

    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        palette: ['green', 'red'],
        paletteExtensionMode: 'blend'
    });

    const nodes = this.nodes();

    assert.deepEqual(nodes[0].smartAttr.lastCall.args[0].fill, 'green');
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0].fill, 'red');
    assert.deepEqual(nodes[2].smartAttr.lastCall.args[0].fill, '#804000');

    assert.deepEqual(paletteModule.createPalette.lastCall.args[1], {
        count: 3,
        useHighlight: true,
        extensionMode: 'blend'
    }, 'useHighlight');

    // teardown
    paletteModule.createPalette.restore();
});

QUnit.test('Sankey fires drawn event', function(assert) {
    const drawn = sinon.spy();
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        onDrawn: drawn
    });

    assert.equal(drawn.callCount, 1);
});

QUnit.test('Sankey fires once drawn event if asynchronus dataSource ', function(assert) {
    const drawn = sinon.spy();
    const d = $.Deferred();

    createSankey({
        dataSource: {
            load: function() {
                return d;
            }
        },
        onDrawn: drawn
    });

    d.resolve([{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }]);

    assert.equal(drawn.callCount, 2);
});


QUnit.module('Align options applying', environment);

QUnit.test('Largest cascade occupies full chart height', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Y', weight: 1 }, { source: 'B', target: 'Y', weight: 1 }, { source: 'B', target: 'M', weight: 1 }, { source: 'C', target: 'M', weight: 1 }, { source: 'M', target: 'Y', weight: 1 }]
    });
    const size = sankey.getSize();
    const nodes = sankey.getAllNodes();
    let cascadeHeight = 0;

    ['A', 'B', 'C'].forEach(function(nodeName) {
        const node = find(nodes, function(node) { return node.title === nodeName; });
        cascadeHeight += node.rect.height + (nodeName !== 'C' ? 30 : 0);
    });

    assert.equal(cascadeHeight, size.height, 'Biggest cascade takes full height of chart');
});

QUnit.test('Default align option', function(assert) {
    const sankey = createSankey({
        dataSource: common.testData.simpleData
    });
    const size = sankey.getSize();
    const nodes = sankey.getAllNodes();

    ['M', 'Y'].forEach(function(nodeName) {
        const node = find(nodes, function(node) { return node.title === nodeName; });
        assert.equal(node.rect.y + node.rect.height / 2, size.height / 2, nodeName + ' aligned to middle');
    });
});

QUnit.test('Align option as <String>', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Y', weight: 1 }, { source: 'B', target: 'Y', weight: 1 }, { source: 'B', target: 'M', weight: 1 }, { source: 'C', target: 'M', weight: 1 }, { source: 'M', target: 'Y', weight: 1 }],
        alignment: 'bottom'
    });
    const size = sankey.getSize();
    const nodes = sankey.getAllNodes();

    ['C', 'M', 'Y'].forEach(function(nodeName) {
        const node = find(nodes, function(node) { return node.title === nodeName; });
        assert.equal(node.rect.y + node.rect.height, size.height, nodeName + ' aligned to bottom');
    });
});

QUnit.test('Align option as <Array>', function(assert) {
    const sankey = createSankey({
        dataSource: common.testData.simpleData,
        alignment: ['top', 'top', 'top']
    });
    const nodes = sankey.getAllNodes();

    ['A', 'M', 'Y'].forEach(function(nodeName) {
        const node = find(nodes, function(node) { return node.title === nodeName; });
        assert.equal(node.rect.y, 0, nodeName + ' aligned to top');
    });

});

QUnit.test('Default alignment value for cascade which is not mentioned in options.alignment', function(assert) {
    const sankey = createSankey({
        dataSource: [
            { source: 'A', target: 'Z', weight: 1 },
            { source: 'B', target: 'Z', weight: 1 }
        ],
        alignment: ['top']
    });
    const nodes = sankey.getAllNodes();
    const node = find(nodes, function(node) { return node.title === 'Z'; });

    // 'Z' is expected to be centered
    assert.equal(node.rect.y, 15, 'Z aligned to center');
});

QUnit.module('Update options', environment);

QUnit.test('Update styles of nodes', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }]
    });

    sankey.option({ node: { border: { visible: true, width: 3, color: 'red', opacity: 0.1 } } });

    const nodes = this.nodes();
    assert.deepEqual(nodes[0].smartAttr.lastCall.args[0]['stroke-width'], 3);
    assert.deepEqual(nodes[0].smartAttr.lastCall.args[0]['stroke-opacity'], 0.1);
    assert.deepEqual(nodes[0].smartAttr.lastCall.args[0]['stroke'], 'red');

    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0]['stroke-width'], 3);
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0]['stroke-opacity'], 0.1);
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0]['stroke'], 'red');
});

QUnit.test('Update styles of links', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }]
    });

    sankey.option({ link: { border: { visible: true, width: 2, color: 'green', opacity: 0.2 } } });

    assert.deepEqual(this.link(0)[0].smartAttr.lastCall.args[0]['stroke-width'], 2, 'stroke-width applied');
    assert.deepEqual(this.link(0)[0].smartAttr.lastCall.args[0]['stroke-opacity'], 0.2, 'stroke-opacity applied');
    assert.deepEqual(this.link(0)[0].smartAttr.lastCall.args[0]['stroke'], 'green', 'stroke applied');
});

QUnit.test('Update color of nodes', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }]
    });

    sankey.option({ node: { color: 'green' } });

    const nodes = this.nodes();
    assert.deepEqual(nodes[0].smartAttr.lastCall.args[0]['fill'], 'green', 'fill applied');
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0]['fill'], 'green', 'fill applied');
});

QUnit.test('Update color of links', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }]
    });
    sankey.option({ link: { color: 'gray' } });

    assert.deepEqual(this.link(0)[0].smartAttr.lastCall.args[0]['fill'], 'gray', 'fill applied');
});

QUnit.test('Update palette', function(assert) {
    sinon.spy(paletteModule, 'createPalette');

    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }],
        palette: ['red', 'blue']
    });

    sankey.option({ palette: ['green', 'orange'] });

    const nodes = this.nodes();

    assert.deepEqual(nodes[0].smartAttr.lastCall.args[0].fill, 'green');
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0].fill, 'orange');
});

QUnit.test('Update paletteExtenstionMode', function(assert) {
    const sankey = createSankey({
        algorithm: 'stub',
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        palette: ['green', 'red']
    });

    sankey.option({ paletteExtensionMode: 'alternate' });

    const nodes = this.nodes();

    assert.deepEqual(nodes[0].smartAttr.lastCall.args[0].fill, 'green');
    assert.deepEqual(nodes[1].smartAttr.lastCall.args[0].fill, 'red');
    assert.deepEqual(nodes[2].smartAttr.lastCall.args[0].fill, '#32b232');
});

QUnit.test('SortData option', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        sortData: { A: 1, B: 2 }
    });

    sankey.option({ sortData: { A: 2, B: 1 } });
    const nodesSorted = sankey.getAllNodes();

    assert.equal(nodesSorted[0].title, 'B');
    assert.equal(nodesSorted[1].title, 'A');
});

QUnit.test('Align option updated as <String>', function(assert) {
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Y', weight: 1 }, { source: 'B', target: 'Y', weight: 1 }, { source: 'B', target: 'M', weight: 1 }, { source: 'C', target: 'M', weight: 1 }, { source: 'M', target: 'Y', weight: 1 }],
        alignment: 'top'
    });
    const size = sankey.getSize();

    sankey.option({ alignment: 'bottom' });
    const nodes = sankey.getAllNodes();

    ['C', 'M', 'Y'].forEach(function(nodeName) {
        const node = find(nodes, function(node) { return node.title === nodeName; });
        assert.equal(node.rect.y + node.rect.height, size.height, 'aligned to bottom');
    });
});

QUnit.test('Align option updated as <Array>', function(assert) {
    const sankey = createSankey({
        dataSource: common.testData.simpleData,
        alignment: 'bottom'
    });

    sankey.option({ alignment: ['top', 'top', 'top'] });
    const nodes = sankey.getAllNodes();

    ['A', 'M', 'Y'].forEach(function(nodeName) {
        const node = find(nodes, function(node) { return node.title === nodeName; });
        assert.equal(node.rect.y, 0, 'aligned to top');
    });
});

QUnit.test('Redrawn on nodes.padding option updated', function(assert) {
    const drawn = sinon.spy();
    const sankey = createSankey({
        dataSource: common.testData.simpleData,
        onDrawn: drawn
    });

    sankey.option({ node: { padding: 50 } });

    assert.equal(drawn.callCount, 2, 'Drawn twice');
    assert.equal(spiesLayoutBuilder.computeLayout.lastCall.args[2].nodePadding, 50, 'New node padding applied');
});

QUnit.test('layout.overlap utility method', function(assert) {

    assert.equal(layoutBuilder.overlap(
        { x: 10, y: 10, width: 10, height: 15 },
        { x: 50, y: 50, width: 20, height: 25 }
    ), false);

    assert.equal(layoutBuilder.overlap(
        { x: 10, y: 10, width: 20, height: 10 },
        { x: 15, y: 15, width: 10, height: 10 }
    ), true);

    assert.equal(layoutBuilder.overlap(
        { x: 10, y: 10, width: 20, height: 10 },
        { x: 30, y: 10, width: 10, height: 10 }
    ), true);

    assert.equal(layoutBuilder.overlap( // touching on y-axis is not overlapping
        { x: 10, y: 10, width: 20, height: 10 },
        { x: 10, y: 30, width: 10, height: 10 }
    ), false);

});
