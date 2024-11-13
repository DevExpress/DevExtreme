import $ from 'jquery';
import common, { createSankey, environment } from './commonParts/common.js';
import trackerModule from 'viz/sankey/tracker';
import tooltipModule from 'viz/core/tooltip';
import { name as clickEventName } from 'common/core/events/click';
import pointerEvents from 'common/core/events/pointer';
import { setTooltipCustomOptions } from 'viz/sankey/tooltip';
import domAdapter from '__internal/core/m_dom_adapter';


import dxSankey from 'viz/sankey/sankey';
dxSankey.addPlugin({
    name: 'tracker-test',
    init: function() {
        this._renderer.root.element = $('<div id=\'root\'>').appendTo('#test-container')[0];
    },
    dispose() {}
});
dxSankey.addPlugin(trackerModule.plugin);
dxSankey.addPlugin(tooltipModule.plugin);
setTooltipCustomOptions(dxSankey);

const trackerEnvironment = $.extend({}, environment, {
    beforeEach: function() {
        common.environment.beforeEach.apply(this, arguments);
        this.linksGroupIndex = 0;
        this.nodesGroupIndex = 1;
        this.labelsGroupIndex = 2;
    },

    afterEach: function() {
        environment.afterEach.call(this);
    },

    trigger: function(name, data, options) {
        const $target = $('<div>').appendTo(this.renderer.root.element);
        $target[0][trackerModule._TESTS_dataKey] = data;
        $target.trigger($.Event(name, options));
    }
});

QUnit.module('Initialization', trackerEnvironment);

QUnit.test('Set data for items', function(assert) {
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
    });

    const nodes = this.nodes();
    const links = this.links();

    assert.equal(nodes.length, 3);
    assert.equal(links.length, 2);

    assert.deepEqual(nodes[0].data.lastCall.args, [trackerModule._TESTS_dataKey, 0]);
    assert.deepEqual(nodes[1].data.lastCall.args, [trackerModule._TESTS_dataKey, 1]);
    assert.deepEqual(nodes[2].data.lastCall.args, [trackerModule._TESTS_dataKey, 2]);

    assert.deepEqual(this.link(0)[1].data.lastCall.args, [trackerModule._TESTS_dataKey, 3]);
    assert.deepEqual(this.link(1)[1].data.lastCall.args, [trackerModule._TESTS_dataKey, 4]);
});

QUnit.module('Events', trackerEnvironment);

QUnit.test('Node hover on. Get item by tracker data', function(assert) {
    const widget = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }]
    });

    this.trigger(pointerEvents.move, 2);

    assert.strictEqual(widget.getAllNodes()[0].isHovered(), false, 'node state');
    assert.strictEqual(widget.getAllNodes()[1].isHovered(), false, 'node state');
    assert.strictEqual(widget.getAllNodes()[2].isHovered(), true, 'node state');

    assert.strictEqual(widget.getAllLinks()[0].isAdjacentNodeHovered(), true, 'adjacent links hovered');
    assert.strictEqual(widget.getAllLinks()[1].isAdjacentNodeHovered(), true, 'adjacent links hovered');
});

QUnit.test('Link hover on. Get item by tracker data', function(assert) {
    const widget = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }]
    });

    this.trigger(pointerEvents.move, 3);

    assert.strictEqual(widget.getAllNodes()[0].isHovered(), false, 'node state');
    assert.strictEqual(widget.getAllNodes()[1].isHovered(), false, 'node state');
    assert.strictEqual(widget.getAllNodes()[2].isHovered(), false, 'node state');

    assert.strictEqual(widget.getAllLinks()[0].isHovered(), true, 'link state');
    assert.strictEqual(widget.getAllLinks()[1].isHovered(), false, 'link state');
});

QUnit.test('Hover off', function(assert) {
    const widget = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }]
    });
    this.trigger(pointerEvents.move, 2);
    assert.strictEqual(widget.getAllNodes()[2].isHovered(), true, 'node is hovered');

    this.trigger(pointerEvents.move, 3);
    assert.strictEqual(widget.getAllNodes()[1].isHovered(), false, 'node is not hovered');
    assert.strictEqual(widget.getAllLinks()[0].isHovered(), true, 'link is hovered');
});

QUnit.test('Click on node', function(assert) {
    this.renderer.offsetTemplate = { left: 40, top: 30 };
    const spy = sinon.spy();
    const widget = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        onNodeClick: spy
    });

    this.trigger(clickEventName, 2, { pageX: 400, pageY: 300 });

    assert.strictEqual(spy.callCount, 1, 'call count');
    assert.strictEqual(spy.lastCall.args[0].target, widget.getAllNodes()[2], 'target');
});

QUnit.test('Click on link', function(assert) {
    this.renderer.offsetTemplate = { left: 40, top: 30 };
    const spy = sinon.spy();
    const widget = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        node: { width: 5 },
        onLinkClick: spy
    });

    this.trigger(clickEventName, 3, { pageX: 200, pageY: 200 });

    assert.strictEqual(spy.callCount, 1, 'call count');
    assert.strictEqual(spy.lastCall.args[0].target, widget.getAllLinks()[0], 'target');

});

QUnit.module('Tooltip', trackerEnvironment);

QUnit.test('Show tooltip on hovered node', function(assert) {
    const widget = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        tooltip: {
            enabled: true
        }
    });

    sinon.spy(widget.getAllNodes()[2], 'showTooltip');

    this.trigger(pointerEvents.move, 2);

    assert.ok(widget.getAllNodes()[2].showTooltip.called);
});

QUnit.test('Show tooltip on hovered link', function(assert) {
    const widget = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        tooltip: {
            enabled: true
        }
    });

    sinon.spy(widget.getAllLinks()[0], 'showTooltip');

    this.trigger(pointerEvents.move, 3);

    assert.ok(widget.getAllLinks()[0].showTooltip.called);
});

QUnit.test('Show custom tooltip (text) on hovered node', function(assert) {
    const stub = sinon.stub().returns({ text: 'custom text' });
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        tooltip: {
            enabled: true,
            customizeNodeTooltip: stub
        }
    });

    this.trigger(pointerEvents.move, 2);
    assert.ok(stub.called);
    assert.deepEqual(stub.getCall(0).args[0], { title: 'Z', label: 'Z', weightIn: 2, weightOut: 0 });
});

QUnit.test('Show custom tooltip (text) on hovered link', function(assert) {
    const stub = sinon.stub().returns({ text: 'custom text' });
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        tooltip: {
            enabled: true,
            customizeLinkTooltip: stub
        }
    });

    this.trigger(pointerEvents.move, 3);
    assert.ok(stub.called);
    assert.deepEqual(stub.getCall(0).args[0], { source: 'A', target: 'Z', weight: 1 });
});

QUnit.test('Show custom tooltip (html) on hovered node', function(assert) {
    const stub = sinon.stub().returns({ html: 'custom html' });
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        tooltip: {
            enabled: true,
            customizeNodeTooltip: stub
        }
    });

    this.trigger(pointerEvents.move, 2);
    assert.ok(stub.called);
    assert.deepEqual(stub.getCall(0).args[0], { title: 'Z', label: 'Z', weightIn: 2, weightOut: 0 });
});

QUnit.test('Show custom tooltip (html) on hovered link', function(assert) {
    const stub = sinon.stub().returns({ html: 'custom html' });
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        tooltip: {
            enabled: true,
            customizeLinkTooltip: stub
        }
    });

    this.trigger(pointerEvents.move, 3);
    assert.ok(stub.called);
    assert.deepEqual(stub.getCall(0).args[0], { source: 'A', target: 'Z', weight: 1 });
});


QUnit.test('Tooltip with template. Hover node - call node template', function(assert) {
    const nodeTooltipTemplate = sinon.spy();
    const linkTooltipTemplate = sinon.spy();
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        tooltip: {
            enabled: true,
            nodeTooltipTemplate,
            linkTooltipTemplate
        }
    });

    this.trigger(pointerEvents.move, 2, { pageX: 100, pageY: 100 });
    assert.equal(nodeTooltipTemplate.callCount, 1);
    assert.deepEqual(nodeTooltipTemplate.getCall(0).args[0], { title: 'Z', label: 'Z', weightIn: 2, weightOut: 0 });
    assert.ok(domAdapter.isNode(nodeTooltipTemplate.getCall(0).args[1].get(0)));

    assert.equal(linkTooltipTemplate.callCount, 0);
});

QUnit.test('Show custom tooltip (text) on hovered link', function(assert) {
    const nodeTooltipTemplate = sinon.spy();
    const linkTooltipTemplate = sinon.spy();
    createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        tooltip: {
            enabled: true,
            linkTooltipTemplate,
            nodeTooltipTemplate
        }
    });

    this.trigger(pointerEvents.move, 3, { pageX: 100, pageY: 100 });
    assert.equal(linkTooltipTemplate.callCount, 1);
    assert.deepEqual(linkTooltipTemplate.getCall(0).args[0], { source: 'A', target: 'Z', weight: 1 });
    assert.ok(domAdapter.isNode(linkTooltipTemplate.getCall(0).args[1].get(0)));

    assert.equal(nodeTooltipTemplate.callCount, 0);
});

QUnit.test('Set skip template in tooltip cusomizeObject if templates are not defined', function(assert) {
    const customizeLinkTooltip = sinon.spy(() => ({ html: 'html' }));
    const sankey = createSankey({
        dataSource: [{ source: 'A', target: 'Z', weight: 1 }, { source: 'B', target: 'Z', weight: 1 }],
        tooltip: {
            enabled: true,
            customizeLinkTooltip
        }
    });

    this.trigger(pointerEvents.move, 3, { pageX: 100, pageY: 100 });

    assert.equal(sankey._tooltip._textHtml.html(), 'html');
});

QUnit.test('Format option applies to weights values in default tooltip templates', function(assert) {
    const dataRow = { source: 'A', target: 'Z', weight: 100 };
    const sankey = createSankey({
        node: {
            width: 15
        },
        dataSource: [dataRow],
        tooltip: {
            enabled: true,
            format: {
                type: 'percent'
            }
        }
    });

    const tooltipRenderedData = sankey._tooltip._customizeTooltip({ type: 'link', info: dataRow });
    const tooltipEl = $(`<div>${tooltipRenderedData.html}</div>`);
    assert.equal(tooltipEl.text(), 'A > ZWeight: 10,000%');
});
