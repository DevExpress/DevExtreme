import $ from 'jquery';
import { environment, stubAlgorithm } from './common.js';
import labelModule from 'viz/series/points/label';
import vizMocks from '../../../helpers/vizMocks.js';

const Label = labelModule.Label;
const stubLabel = vizMocks.stubClass(Label);
import labels from 'viz/funnel/label';

import dxFunnel from 'viz/funnel/funnel';

dxFunnel.addPlugin(labels.plugin);

export const labelEnvironment = $.extend({}, environment, {
    beforeEach: function() {
        environment.beforeEach.call(this);
        this.labelGroupNumber = 1;
        this.renderer.bBoxTemplate = { x: 0, y: 0, width: 0, height: 0 };
        this.renderer.bBoxTemplate = { width: 100 };

        stubAlgorithm.getFigures.returns([[0, 0, 1, 1]]);

        this.labelBoxes = [
            {
                height: 10,
                width: 100
            }, {
                height: 10,
                width: 45
            }
        ];
        let labelBoxesIndex = 0;

        sinon.stub(labelModule, 'Label', ()=> {
            const stub = new stubLabel();
            stub.stub('getBoundingRect').returns(this.labelBoxes[(labelBoxesIndex++) % this.labelBoxes.length]);
            return stub;
        });

        $('#test-container').css({
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
