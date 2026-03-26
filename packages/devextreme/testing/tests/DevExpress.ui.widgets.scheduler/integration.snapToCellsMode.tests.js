import 'fluent_blue_light.css!';

import fx from 'common/core/animation/fx';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
import { waitAsync } from '../../helpers/scheduler/waitForAsync.js';

import '__internal/scheduler/m_scheduler';

QUnit.testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach() {
        fx.off = true;
    },
    afterEach() {
        fx.off = false;
    },
};

QUnit.module('Integration: snapToCellsMode', moduleConfig, () => {
    QUnit.test('default snapToCellsMode on day view', async function(assert) {
        const scheduler = await createWrapper({
            width: 800,
            height: 600,
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2026, 2, 15),
            cellDuration: 30,
            startDayHour: 9,
            endDayHour: 18,
            dataSource: [{
                text: 'short',
                startDate: new Date(2026, 2, 15, 10, 0),
                endDate: new Date(2026, 2, 15, 10, 10),
            }],
        });
        await waitAsync(0);

        const cellH = scheduler.workSpace.getCellHeight();
        const appH = scheduler.appointments.getAppointmentHeight(0);

        assert.ok(
            appH < cellH * 0.45,
            `default snapToCellsMode: height ${appH} should be clearly less than cell height ${cellH}`,
        );
    });

    QUnit.test('root snapToCellsMode overrides default snapToCellsMode on day view', async function(assert) {
        const scheduler = await createWrapper({
            width: 800,
            height: 600,
            views: ['day'],
            currentView: 'day',
            currentDate: new Date(2026, 2, 15),
            cellDuration: 30,
            startDayHour: 9,
            endDayHour: 18,
            dataSource: [{
                text: 'short',
                startDate: new Date(2026, 2, 15, 10, 0),
                endDate: new Date(2026, 2, 15, 10, 10),
            }],
            snapToCellsMode: 'always',
        });
        await waitAsync(0);

        const cellH = scheduler.workSpace.getCellHeight();
        const appH = scheduler.appointments.getAppointmentHeight(0);

        assert.ok(
            appH > cellH * 0.85,
            `height ${appH} should be most of cell height ${cellH}`,
        );
    });

    QUnit.test('views[].snapToCellsMode overrides default snapToCellsMode on day view', async function(assert) {
        const scheduler = await createWrapper({
            width: 800,
            height: 600,
            views: [{ type: 'day', snapToCellsMode: 'always' }],
            currentView: 'day',
            currentDate: new Date(2026, 2, 15),
            cellDuration: 30,
            startDayHour: 9,
            endDayHour: 18,
            dataSource: [{
                text: 'short',
                startDate: new Date(2026, 2, 15, 10, 0),
                endDate: new Date(2026, 2, 15, 10, 10),
            }],
        });
        await waitAsync(0);

        const cellH = scheduler.workSpace.getCellHeight();
        const appH = scheduler.appointments.getAppointmentHeight(0);

        assert.ok(
            appH > cellH * 0.85,
            `views[].snapToCellsMode always: height ${appH} should be most of cell height ${cellH}`,
        );
    });
});
