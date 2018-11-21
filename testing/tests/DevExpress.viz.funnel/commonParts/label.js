var $ = require("jquery"),
    common = require("./common.js"),
    labelModule = require("viz/series/points/label"),
    vizMocks = require("../../../helpers/vizMocks.js"),
    environment = common.environment,
    stubAlgorithm = common.stubAlgorithm,
    Label = labelModule.Label,
    stubLabel = vizMocks.stubClass(Label),
    labels = require("viz/funnel/label");

var dxFunnel = require("viz/funnel/funnel");
dxFunnel.addPlugin(labels.plugin);

exports.labelEnvironment = $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.labelGroupNumber = 1;
        this.renderer.bBoxTemplate = { x: 0, y: 0, width: 0, height: 0 };
        this.renderer.bBoxTemplate = { width: 100 };

        stubAlgorithm.getFigures.returns([[0, 0, 1, 1]]);

        var labelBoxes = [
                {
                    height: 10,
                    width: 100
                }, {
                    height: 10,
                    width: 45
                }
            ],
            labelBoxesIndex = 0;

        sinon.stub(labelModule, "Label", function() {
            var stub = new stubLabel();
            stub.stub("getBoundingRect").returns(labelBoxes[(labelBoxesIndex++) % labelBoxes.length]);
            return stub;
        });

        $("#test-container").css({
            width: 800,
            height: 600
        });
    },
    afterEach: function() {
        environment.afterEach.call(this);
        labelModule.Label.restore();
    },

    labelGroup: function() {
        return this.renderer.g.getCall(this.labelGroupNumber).returnValue;
    }
});
