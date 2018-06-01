"use strict";

var $ = require("jquery"),
    common = require("./commonParts/common.js"),
    createSankey = common.createSankey,
    layoutBuilder = common.layoutBuilder,
    spiesLayoutBuilder = common.spiesLayoutBuilder,
    environment = common.environment,
    rendererModule = require("viz/core/renderers/renderer"),
    // paletteModule = require("viz/palette"),
    themeModule = require("viz/themes");

themeModule.registerTheme({
    name: "test-theme",
    sankey: {
        nodes: {
            border: {
                visible: true,
                color: "black"
            }
        }
    } }, "generic.light");


QUnit.module("Initialization", environment);

QUnit.test("Create empty widget", function(assert) {
    var sankey = createSankey({});

    assert.ok(sankey);
    assert.equal(rendererModule.Renderer.firstCall.args[0].cssClass, "dxs dxs-sankey", "rootClass prefix rootClass");
    assert.equal(this.itemsGroup().append.lastCall.args[0], this.renderer.root, "items group added to root");
});

QUnit.test("Default size", function(assert) {
    $("#test-container").hide();
    var sankey = createSankey({});

    assert.deepEqual(sankey.getSize(), { width: 400, height: 400 });
});

QUnit.test("Base sankey not fail when tooltip api is called", function(assert) {
    var sankey = createSankey({
        dataSource: common.testData.valid
    });

    // TODO: fix this test
    sankey.getAllItems().links[0].showTooltip();
    sankey.hideTooltip();

    sankey.getAllItems().nodes[0].showTooltip();
    sankey.hideTooltip();

    sankey.getAllItems().nodes[1].showTooltip();
    sankey.hideTooltip();

    assert.ok(sankey);
});

QUnit.module("DataSource processing", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        for(let spyKey of Object.keys(spiesLayoutBuilder)) {
            spiesLayoutBuilder[spyKey].reset();
        }
    }
}));

QUnit.test("Get values from dataSource", function(assert) {
    var data = [['A', 'B', 1], ['B', 'C', 1]];
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: data
    });

    assert.ok(spiesLayoutBuilder.computeLayout.calledOnce);
    assert.equal(spiesLayoutBuilder.computeLayout.lastCall.args[0][0], data[0]);
    assert.equal(spiesLayoutBuilder.computeLayout.lastCall.args[0][1], data[1]);
    assert.equal(spiesLayoutBuilder.computeLayout.lastCall.args[0].length, data.length);
});

QUnit.test("Trigger error on invalid source data", function(assert) {
    var invalidDataSets = [
        [['A', 'B', 1], ['A', 'C']],
        [['A', 'B', 0], ['A', 'C', 1]],
        [['A', 1, 1], ['A', 'C', 1]],
        [['A', 'B', 1], [1, 'C', 1]],
        [['A', 'B', 1], ['A', 'C', -5]],
        ['ABCD', ['A', 'C', 1]],
        ],
        spy = sinon.spy();

    invalidDataSets.forEach(function(data) {
        spy.reset();
        createSankey({
            layoutBuilder: layoutBuilder,
            dataSource: data,
            onIncidentOccurred: spy
        });
        assert.ok(spy.called);
        assert.equal(spy.getCall(0).args[0], "E2402");
    });

    // TODO: understand wht Funnel provides additional params in call as follows
    /*
    assert.equal(spy.getCall(0).args[0].target.id, "E2402");
    assert.equal(spy.getCall(0).args[0].target.text, "Provided data can not be displayed");
    assert.equal(spy.getCall(0).args[0].target.type, "error");
    assert.equal(spy.getCall(0).args[0].target.widget, "dxSankey");
    */
});

QUnit.test("Trigger \"cycle detected\" error on invalid source data", function(assert) {
    var invalidDataSets = [
        [['A', 'B', 1], ['B', 'A', 1]],
        [['A', 'B', 1], ['B', 'C', 1], ['C', 'D', 1], ['D', 'A', 1]]
        ],
        spy = sinon.spy();

    invalidDataSets.forEach(function(data) {
        spy.reset();
        createSankey({
            layoutBuilder: layoutBuilder,
            dataSource: data,
            onIncidentOccurred: spy
        });
        assert.ok(spy.called);
        assert.equal(spy.getCall(0).args[0], "E2401");
    });
});

QUnit.test("Empty data source, warning shouldn't fire", function(assert) {
    var spy = sinon.stub();
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [],
        onIncidentOccurred: spy
    });

    assert.ok(!spy.called);
});

QUnit.test("Sort nodes in all cascades by default", function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            ['A', 'M', 1], ['A', 'M', 1], ['B', 'M', 1], ['B', 'M', 1], ['C', 'M', 1], ['C', 'N', 1],
            ['M', 'X', 1], ['N', 'X', 1], ['N', 'Y', 1], ['N', 'Z', 1]
        ],
    });
    assert.deepEqual(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[0].map(function(node) { return node._name; }), ['A', 'B', 'C']);
    assert.deepEqual(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[1].map(function(node) { return node._name; }), ['M', 'N']);
    assert.deepEqual(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[2].map(function(node) { return node._name; }), ['X', 'Y', 'Z']);
});

QUnit.test("Sort nodes in all cascades by sortData option", function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            ['A', 'M', 1], ['A', 'M', 1], ['B', 'M', 1], ['B', 'M', 1], ['C', 'M', 1], ['C', 'N', 1],
            ['M', 'X', 1], ['N', 'X', 1], ['N', 'Y', 1], ['N', 'Z', 1]
        ],
        sortData: {
            'A': 3, 'B': 2, 'C': 1, 'M': 2, 'N': 1, 'X': 2, 'Y': 3, 'Z': 1
        }
    });

    assert.deepEqual(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[0].map(function(node) { return node._name; }), ['C', 'B', 'A']);
    assert.deepEqual(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[1].map(function(node) { return node._name; }), ['N', 'M']);
    assert.deepEqual(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[2].map(function(node) { return node._name; }), ['Z', 'X', 'Y']);
});

QUnit.module("Layout building", $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        for(let spyKey of Object.keys(spiesLayoutBuilder)) {
            spiesLayoutBuilder[spyKey].reset();
        }
    }
}));

QUnit.test("Number of cascades with simplest dataSource possible", function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            ['A', 'Z', 1]
        ]
    });

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades.length, 2);
});


QUnit.test("Number of nodes with simplest dataSource possible", function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            ['A', 'Z', 1]
        ]
    });

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].nodes.length, 2);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[0].length, 1);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].nodes[1].length, 1);

});

QUnit.test("Number of links with simplest dataSource possible", function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            ['A', 'Z', 1]
        ]
    });

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links.length, 1);
});

QUnit.test("Number of cascades with big dataSource", function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.countriesData
    });

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades.length, 4);
});

QUnit.test("Number of nodes with big dataSource", function(assert) {
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

QUnit.test("Number of links with big dataSource", function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: common.testData.countriesData
    });

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links.length, 46);
});

QUnit.test("Node weights with simplest dataSource possible", function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            ['A', 'Z', 1]
        ]
    });
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['A'].inWeight, 0);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['A'].outWeight, 1);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[0]['A'].maxWeight, 1);

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['Z'].inWeight, 1);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['Z'].outWeight, 0);
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].cascades[1]['Z'].maxWeight, 1);
});

QUnit.test("Node input weights with big dataSource", function(assert) {
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

QUnit.test("Node output and max weights with big dataSource", function(assert) {
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

QUnit.test("Links configuration with simplest dataSource possible", function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            ['A', 'Z', 1]
        ]
    });
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[0]._from._name, 'A');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[0]._to._name, 'Z');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[0]._weight, 1);
});

QUnit.test("Some links configuration with big dataSource", function(assert) {
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

    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[45]._from._name, 'Morocco');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[45]._to._name, 'Japan');
    assert.equal(spiesLayoutBuilder.computeLayout.returnValues[0].links[45]._weight, 3);
});

// + TODO: test for options.sortData being applied
// TODO: tests from local sankey files
// + TODO: tests for number of cascades and number of nodes
// + TODO: tests for number of links
// + TODO: tests for computing the input weights, output weights
// + test for links
// TODO: test for color from options
// TODO: test align by default, if <String>, if <Array> (passing params to layoutBuilder)
// TODO: a few test of coordinates of nodes

// Drawing tests
