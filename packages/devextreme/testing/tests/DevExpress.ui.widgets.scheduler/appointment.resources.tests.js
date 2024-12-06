import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import {
    initTestMarkup,
    createWrapper
} from '../../helpers/scheduler/helpers.js';

import '__internal/scheduler/m_scheduler';
import 'ui/switch';
import 'generic_light.css!';

const {
    module,
    test
} = QUnit;

QUnit.testStart(() => initTestMarkup());

const APPOINTMENT_CLASS = 'dx-scheduler-appointment';

module('Integration: Appointment resources', {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
}, () => {
    [
        'standard',
        'virtual'
    ].forEach(scrollingMode => {
        module(`Scrolling mode ${scrollingMode}`, () => {
            test('Task with resources should contain a right data attr', function(assert) {
                const data = new DataSource({
                    store: [
                        { text: 'Item 1', ownerId: 2, roomId: 1, startDate: new Date(2015, 1, 8), endDate: new Date(2015, 1, 8, 0, 30) },
                        { text: 'Item 2', ownerId: [1, 2], startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) },
                        { text: 'Item 3', startDate: new Date(2015, 1, 9) }
                    ]
                });

                const scheduler = createWrapper({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    resources: [{
                        field: 'ownerId',
                        dataSource: [{ id: 1, text: 'a', color: 'red' }, { id: 2, text: 'b', color: 'green' }],
                    }, {
                        field: 'roomId',
                        dataSource: [{ id: 1, text: 'c', color: 'blue' }, { id: 2, text: 'd', color: 'white' }]
                    }],
                    dataSource: data,
                    width: 700,
                    height: 600,
                    scrolling: { mode: scrollingMode },
                });

                this.clock.tick(300);
                scheduler.instance.focus();

                const tasks = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.ok(tasks.eq(0).attr('data-ownerid-2'));
                assert.ok(tasks.eq(0).attr('data-roomid-1'));

                assert.ok(tasks.eq(1).attr('data-ownerid-1'));
                assert.ok(tasks.eq(1).attr('data-ownerid-2'));

                assert.ok(!tasks.eq(2).attr('data-ownerid-1'));
                assert.ok(!tasks.eq(2).attr('data-ownerid-2'));
                assert.ok(!tasks.eq(2).attr('data-roomid-1'));
                assert.ok(!tasks.eq(2).attr('data-roomid-2'));
            });

            test('Task with resources should contain a right data attr if field contains a space', function(assert) {
                const data = new DataSource({
                    store: [
                        { text: 'Item 1', 'owner  Id': 2, startDate: new Date(2015, 1, 8), endDate: new Date(2015, 1, 8, 0, 30) },
                    ]
                });

                const scheduler = createWrapper({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    resources: [{
                        field: 'owner  Id',
                        dataSource: [{ id: 1, text: 'a', color: 'red' }, { id: 2, text: 'b', color: 'green' }],
                    }],
                    dataSource: data,
                    width: 700,
                    height: 600,
                    scrolling: { mode: scrollingMode },
                });

                this.clock.tick(300);
                scheduler.instance.focus();

                const tasks = scheduler.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.ok(tasks.eq(0).attr('data-owner__32____32__id-2'));
            });
        });
    });
});
