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

QUnit.test("Sort nodes by default", function(assert) {
    createSankey({
        layoutBuilder: layoutBuilder,
        dataSource: [
            ['A', 'M', 1],
            ['A', 'M', 1],
            ['B', 'M', 1],
            ['B', 'M', 1],
            ['C', 'M', 1],
            ['C', 'N', 1],
            ['M', 'X', 1],
            ['N', 'X', 1]
        ],
    });
    // TODO: finish it

});

// TODO: test for options.sortData being applied
// TODO: tests from local sankey files
// TODO: tests for number of cascades and number of nodes
// TODO: tests for number of links
// TODO: tests for computing the input weights, output weights
// TODO: test for color from options
// TODO: test align by default, if <String>, if <Array> (passing params to layoutBuilder)
// TODO: a few test of coordinates of nodes

// Drawing tests
