import $ from 'jquery';
import fx from 'animation/fx';
import Color from 'color';
import { DataSource } from 'data/data_source/data_source';
import {
    SchedulerTestWrapper,
    initTestMarkup
} from '../../helpers/scheduler/helpers.js';

import 'ui/scheduler/ui.scheduler';
import 'ui/switch';
import 'generic_light.css!';

const {
    module,
    test
} = QUnit;

initTestMarkup();

const APPOINTMENT_CLASS = 'dx-scheduler-appointment';

module('Integration: Appointment resources', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler($.extend(options,
                {
                    height: options && options.height || 600
                })
            ).dxScheduler('instance');

            this.clock.tick(300);
            this.instance.focus();

            this.scheduler = new SchedulerTestWrapper(this.instance);
        };
        this.getAppointmentColor = function($task, checkedProperty) {
            checkedProperty = checkedProperty || 'backgroundColor';
            return new Color($task.css(checkedProperty)).toHex();
        };
        this.clock = sinon.useFakeTimers();
        this.tasks = [
            {
                text: 'Task 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: 'Task 2',
                startDate: new Date(2015, 1, 9, 11, 0),
                endDate: new Date(2015, 1, 9, 12, 0)
            }
        ];
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
        module(`Scrolling mode ${scrollingMode}`, {
            beforeEach: function() {
                const createInstance = this.createInstance.bind(this);
                this.createInstance = options => {
                    options = options || {};
                    $.extend(
                        true,
                        options,
                        {
                            scrolling: {
                                mode: scrollingMode
                            }
                        }
                    );

                    createInstance(options);

                    if(scrollingMode === 'virtual') {
                        const virtualScrollingDispatcher = this.instance.getWorkSpace().virtualScrollingDispatcher;
                        if(virtualScrollingDispatcher) {
                            virtualScrollingDispatcher.renderer.getRenderTimeout = () => -1;
                        }
                    }
                };

                this.scrollTo = args => this.instance.getWorkSpace().getScrollable().scrollTo(args);
            }
        }, () => {
            test('Task with resources should contain a right data attr', function(assert) {
                const data = new DataSource({
                    store: [
                        { text: 'Item 1', ownerId: 2, roomId: 1, startDate: new Date(2015, 1, 8), endDate: new Date(2015, 1, 8, 0, 30) },
                        { text: 'Item 2', ownerId: [1, 2], startDate: new Date(2015, 1, 9), endDate: new Date(2015, 1, 9, 0, 30) },
                        { text: 'Item 3', startDate: new Date(2015, 1, 9) }
                    ]
                });

                this.createInstance({
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
                    width: 700
                });

                const tasks = this.instance.$element().find('.' + APPOINTMENT_CLASS);

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

                this.createInstance({
                    currentDate: new Date(2015, 1, 9),
                    currentView: 'week',
                    resources: [{
                        field: 'owner  Id',
                        dataSource: [{ id: 1, text: 'a', color: 'red' }, { id: 2, text: 'b', color: 'green' }],
                    }],
                    dataSource: data,
                    width: 700
                });

                const tasks = this.instance.$element().find('.' + APPOINTMENT_CLASS);

                assert.ok(tasks.eq(0).attr('data-owner__32____32__id-2'));
            });
        });
    });
});
