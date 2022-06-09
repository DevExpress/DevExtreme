const $ = require('jquery');
const DxSankey = require('viz/sankey/sankey');
const { setTooltipCustomOptions } = require('viz/sankey/tooltip');
const { plugin: pluginTooltip } = require('viz/core/tooltip');
const vizMocks = require('../../helpers/vizMocks.js');
const rendererModule = require('viz/core/renderers/renderer');

QUnit.module('Initialization tooltip', {
    beforeEach: function() {
        $('#qunit-fixture').append('<div id="test-sankey-with-tooltip-container"></div>');

        const that = this;
        this.renderer = new vizMocks.Renderer();

        sinon.stub(rendererModule, 'Renderer', function() {
            return that.renderer;
        });

        DxSankey.addPlugin(pluginTooltip);
        setTooltipCustomOptions(DxSankey);
    },

}, () => {
    QUnit.test('Format option applies to weights values in default tooltip templates', function(assert) {
        const dataRow = { source: 'A', target: 'Z', weight: 100 };
        const sankey = new DxSankey($('#test-sankey-with-tooltip-container'), {
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
});
