import $ from 'jquery';
import translator from 'common/core/animation/translator';
import fx from 'common/core/animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import devices from '__internal/core/m_devices';
import { initTestMarkup, createWrapper } from '../../helpers/scheduler/helpers.js';

import '__internal/scheduler/m_scheduler';
import 'ui/switch';
import 'generic_light.css!';

QUnit.testStart(() => initTestMarkup());

const { module, test } = QUnit;

const config = {
    beforeEach() {
        fx.off = true;
    },

    afterEach() {
        fx.off = false;
    }
};

module('crossScrollingEnabled = true', config, () => {
    const isMobile = devices.current().deviceType !== 'desktop';

    test('Appointments should be rendered on the same line after navigating to the next month(T804721)', function(assert) {
        const expectedTop = 26;
        const views = ['timelineMonth', 'timelineWeek'];

        const data = [{
            text: 'Event 1',
            recurrenceRule: 'FREQ=DAILY',
            startDate: new Date(2019, 1, 1, 14, 0),
            endDate: new Date(2019, 1, 1, 12, 30),
        }];

        const scheduler = createWrapper({
            dataSource: data,
            views: views,
            currentView: views[0],
            currentDate: new Date(2019, 2, 1),
            crossScrollingEnabled: true,
            height: 600
        });

        const testTopPosition = (view, navigatorDate) => {
            scheduler.appointments.getAppointments().each((index, element) => {
                const currentTop = translator.locate($(element)).top;
                assert.equal(currentTop, expectedTop, `current appointment top position should be equal ${expectedTop} in ${view} type, ${navigatorDate} date`);
            });
        };

        views.forEach(view => {
            const { navigator } = scheduler.header;
            scheduler.option('currentView', view);

            testTopPosition(view, navigator.caption.getElement());

            navigator.nextButton.click();
            testTopPosition(view, navigator.caption.getElement());

            navigator.nextButton.click();
            testTopPosition(view, navigator.caption.getElement());

            navigator.prevButton.click();
            testTopPosition(view, navigator.caption.getElement());

            navigator.prevButton.click();
            testTopPosition(view, navigator.caption.getElement());
        });
    });

    test('Appointment should have correct position while vertical dragging', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 6, 10),
            _draggingMode: 'default',
            editing: true,
            views: ['month'],
            currentView: 'month',
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 6, 10, 0),
                endDate: new Date(2015, 6, 10, 0, 30),
                ownerId: 1
            }],
            groups: ['ownerId'],
            resources: [
                {
                    field: 'ownerId',
                    dataSource: [
                        { id: 1, text: 'one' },
                        { id: 2, text: 'two' },
                        { id: 3, text: 'three' },
                        { id: 4, text: 'four' }
                    ]
                }
            ],
            width: 800,
            height: 600,
            crossScrollingEnabled: true
        });

        const $appointment = scheduler.appointments.getAppointment();
        const dragDistance = -50;

        const pointer = pointerMock($appointment).start();
        const startPosition = $appointment.offset();

        pointer.down().move(0, dragDistance);

        const $draggedAppointment = $(scheduler.appointments.getAppointment().get(0)).parent();
        const currentPosition = translator.locate($draggedAppointment);

        assert.roughEqual(startPosition.top, currentPosition.top - dragDistance, 1.001, 'Appointment position is correct');
        pointer.up();
    });

    test('Appointments should be repainted if the \'crossScrollingEnabled\' is changed', function(assert) {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 6, 10),
            dataSource: [{
                text: 'a',
                startDate: new Date(2015, 6, 10, 0),
                endDate: new Date(2015, 6, 10, 4),
                ownerId: 1
            }],
            crossScrollingEnabled: true
        });

        const $apptBeforeRepaint = scheduler.appointments.getAppointment();
        $apptBeforeRepaint.attr('test', 'true');

        scheduler.option('crossScrollingEnabled', false);

        const $apptAfterRepaint = scheduler.appointments.getAppointment();
        const customTestAttr = $apptAfterRepaint.attr('test');
        assert.equal(customTestAttr, undefined, 'Appointments are repainted');
    });

    if(!isMobile) {
        test('Month appointment inside grouped view should have a right resizable area after horizontal scroll end', function(assert) {
            const scheduler = createWrapper({
                currentDate: new Date(2015, 6, 10),
                views: ['month'],
                editing: true,
                currentView: 'month',
                dataSource: [{
                    text: 'a',
                    startDate: new Date(2015, 6, 10, 0),
                    endDate: new Date(2015, 6, 10, 0, 30),
                    ownerId: 1
                }],
                groups: ['ownerId'],
                resources: [
                    {
                        field: 'ownerId',
                        dataSource: [
                            { id: 1, text: 'one' },
                            { id: 2, text: 'two' },
                            { id: 3, text: 'three' },
                            { id: 4, text: 'four' }
                        ]
                    }
                ],
                width: 800,
                height: 600,
                crossScrollingEnabled: true
            });

            const scrollOffset = 100;
            const $appointment = scheduler.appointments.getAppointment();
            const initialResizableAreaLeft = $appointment.dxResizable('instance').option('area').left;
            const initialResizableAreaRight = $appointment.dxResizable('instance').option('area').right;
            const scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');

            scrollable.scrollTo({ left: scrollOffset, top: 0 });

            assert.equal($appointment.dxResizable('instance').option('area').left, initialResizableAreaLeft - scrollOffset);
            assert.equal($appointment.dxResizable('instance').option('area').right, initialResizableAreaRight - scrollOffset);
        });

        test('Appointment should have correct position while horizontal dragging', function(assert) {
            const dragDistance = 150;

            const scheduler = createWrapper({
                height: 500,
                _draggingMode: 'default',
                editing: true,
                currentDate: new Date(2015, 1, 9),
                currentView: 'week',
                dataSource: [{
                    text: 'a',
                    startDate: new Date(2015, 1, 9, 1),
                    endDate: new Date(2015, 1, 9, 1, 30)
                }]
            });

            const $appointment = scheduler.appointments.getAppointment();
            const pointer = pointerMock($appointment).start();
            const startPosition = $appointment.offset();

            pointer.down().move(dragDistance, 0);

            const $draggedAppointment = $(scheduler.appointments.getAppointment().get(0)).parent();
            const currentPosition = translator.locate($draggedAppointment);

            assert.roughEqual(startPosition.left, currentPosition.left - dragDistance, 2, 'Appointment position is correct');
            pointer.up();
        });

        test('Appointment should have correct position while horizontal dragging, crossScrollingEnabled = true (T732885)', function(assert) {
            const scheduler = createWrapper({
                height: 500,
                _draggingMode: 'default',
                editing: true,
                currentDate: new Date(2015, 1, 9),
                currentView: 'week',
                dataSource: [{
                    text: 'a',
                    startDate: new Date(2015, 1, 9, 1),
                    endDate: new Date(2015, 1, 9, 1, 30)
                }],
                crossScrollingEnabled: true
            });

            const $appointment = scheduler.appointments.getAppointment();
            const dragDistance = 150;

            const pointer = pointerMock($appointment).start();
            const startPosition = $appointment.offset();

            pointer.down().move(dragDistance, 0);

            const $draggedAppointment = $(scheduler.appointments.getAppointment().get(0)).parent();
            const currentPosition = translator.locate($draggedAppointment);

            assert.roughEqual(startPosition.left, currentPosition.left - dragDistance, 2, 'Appointment position is correct');
            pointer.up();
        });

        test('Appointment should have correct position while horizontal dragging in scrolled date table', function(assert) {
            const scheduler = createWrapper({
                height: 500,
                width: 800,
                _draggingMode: 'default',
                editing: true,
                currentDate: new Date(2015, 1, 9),
                currentView: 'week',
                groups: ['room'],
                resources: [
                    { field: 'room', dataSource: [{ id: 1, text: '1' }, { id: 2, text: '2' }, { id: 3, text: '3' }] }
                ],
                dataSource: [{
                    text: 'a',
                    startDate: new Date(2015, 1, 9, 1),
                    endDate: new Date(2015, 1, 9, 1, 30),
                    room: 2
                }],
                crossScrollingEnabled: true
            });

            const $appointment = scheduler.appointments.getAppointment();
            const scrollable = scheduler.instance.getWorkSpace().$element().find('.dx-scrollable').dxScrollable('instance');
            const startPosition = $appointment.offset();

            scrollable.scrollTo({ left: 400, top: 0 });

            const pointer = pointerMock($appointment).start();
            pointer.down().move(100, 0);

            const $draggedAppointment = $(scheduler.appointments.getAppointment().get(0)).parent();
            const currentPosition = translator.locate($draggedAppointment);

            assert.equal(currentPosition.left, startPosition.left - 400 + 100, 'Appointment position is correct');
            pointer.up();
        });
    }
});
