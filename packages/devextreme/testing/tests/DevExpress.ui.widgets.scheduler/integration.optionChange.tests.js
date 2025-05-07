import $ from 'jquery';
import fx from 'common/core/animation/fx';

import '__internal/scheduler/m_scheduler';
import 'generic_light.css!';

const FIXTURE_SELECTOR = '#qunit-fixture';
const SCHEDULER_SELECTOR = '#scheduler';

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
};

QUnit.testStart(function() {
    $(FIXTURE_SELECTOR).html('<div id="scheduler"></div>');
});

QUnit.module('Integration: options change tests', moduleConfig, () => {
    QUnit.test('Should correctly update currentView and height options from agenda view', function(assert) {
        const priorityData = [{
            text: 'Test priority',
            id: 1,
            color: '#fcb65e',
        }];

        const instance = $(SCHEDULER_SELECTOR).dxScheduler({
            timeZone: 'Etc/GMT',
            dataSource: [{
                text: 'Test appointment',
                priorityId: 1,
                startDate: new Date('2021-04-27T16:00:00.000Z'),
                endDate: new Date('2021-04-27T18:30:00.000Z'),
            }],
            resources: [{
                dataSource: priorityData,
                fieldExpr: 'priorityId',
                label: 'Priority',
            }],
            groups: ['priorityId'],
            views: ['month', 'agenda'],
            currentDate: new Date('2021-04-26T16:00:00.000Z'),
            currentView: 'agenda',
            height: 600,
        }).dxScheduler('instance');

        instance.beginUpdate();
        instance.option('currentView', 'month');
        instance.option('height', 'auto');
        instance.endUpdate();

        // assert ok when console error not thrown.
        assert.ok(true, 'Options changed successfully');
    });
});
