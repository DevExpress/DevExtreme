const $ = require('jquery');
const DxSankey = require('viz/sankey/sankey');
const { setTooltipCustomOptions } = require('viz/sankey/tooltip');
const { plugin: pluginTooltip } = require('viz/core/tooltip');
const vizMocks = require('../../helpers/vizMocks.js');
const rendererModule = require('viz/core/renderers/renderer');

QUnit.module('Initialization tooltip', {
    beforeEach: function() {
        $('#qunit-fixture').append('<div id="test-container"></div>');

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

        const sankey = new DxSankey($('#test-container'), {
            node: {
                width: 15
            },
            dataSource: [{ source: 'A', target: 'Z', weight: 100 }],
            tooltip: {
                enabled: true,
                format: {
                    type: 'percent'
                }
            }
        });

        sankey.getAllLinks()[0].showTooltip();
        assert.equal($('.dxs-tooltip').text(), 'A > ZWeight: 10,000%');
    });
});
