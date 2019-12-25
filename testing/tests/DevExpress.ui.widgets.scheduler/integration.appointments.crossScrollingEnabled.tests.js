import $ from 'jquery';
import translator from 'animation/translator';
import fx from 'animation/fx';
import pointerMock from '../../helpers/pointerMock.js';
import devices from 'core/devices';
import { initTestMarkup, createWrapper } from './helpers.js';

import 'ui/scheduler/ui.scheduler';
import 'ui/switch';
import 'common.css!';
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

    test('Appointments should be rendered on the same line after navigating to the next month(T804721)', assert => {
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
            scheduler.option('currentView', view);

            testTopPosition(view, scheduler.navigator.getCaption());

            scheduler.navigator.clickOnNextButton();
            testTopPosition(view, scheduler.navigator.getCaption());

            scheduler.navigator.clickOnNextButton();
            testTopPosition(view, scheduler.navigator.getCaption());

            scheduler.navigator.clickOnPrevButton();
            testTopPosition(view, scheduler.navigator.getCaption());

            scheduler.navigator.clickOnPrevButton();
            testTopPosition(view, scheduler.navigator.getCaption());
        });
    });

    test('Appointment should have correct position while vertical dragging', assert => {
        const scheduler = createWrapper({
            currentDate: new Date(2015, 6, 10),
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

        const $appointment = scheduler.appointments.getAppointment(),
            dragDistance = -50,
            headerPanelHeight = scheduler.header.get().outerHeight(true);

        const pointer = pointerMock($appointment).start();
        const startPosition = translator.locate($appointment);

        pointer.dragStart().drag(0, dragDistance);

        const currentPosition = translator.locate($appointment);

        assert.roughEqual(startPosition.top, currentPosition.top - headerPanelHeight - dragDistance, 1.001, 'Appointment position is correct');
        pointer.dragEnd();
    });

    test('Appointments should be repainted if the \'crossScrollingEnabled\' is changed', assert => {
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

        const appointmentsInstance = scheduler.instance.getAppointmentsInstance();
        const items = appointmentsInstance.option('items');

        scheduler.option('crossScrollingEnabled', false);
        assert.notDeepEqual(appointmentsInstance.option('items'), items, 'Appointments are repainted');
    });

    if(!isMobile) {
        test('Month appointment inside grouped view should have a right resizable area after horizontal scroll end', assert => {
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
            const initialResizableAreaLeft = $appointment.dxResizable('instance').option('area').left,
                initialResizableAreaRight = $appointment.dxResizable('instance').option('area').right,
                scrollable = scheduler.workSpace.getDateTableScrollable().dxScrollable('instance');

            scrollable.scrollTo({ left: scrollOffset, top: 0 });

            assert.equal($appointment.dxResizable('instance').option('area').left, initialResizableAreaLeft - scrollOffset);
            assert.equal($appointment.dxResizable('instance').option('area').right, initialResizableAreaRight - scrollOffset);
        });

        test('Appointment should have correct position while horizontal dragging', assert => {
            const scheduler = createWrapper({
                height: 500,
                editing: true,
                currentDate: new Date(2015, 1, 9),
                currentView: 'week',
                dataSource: [{
                    text: 'a',
                    startDate: new Date(2015, 1, 9, 1),
                    endDate: new Date(2015, 1, 9, 1, 30)
                }]
            });

            const dragDistance = 150;
            const $appointment = scheduler.appointments.getAppointment();
            const timePanelWidth = scheduler.getTimePanel().outerWidth(true);

            const pointer = pointerMock($appointment).start(),
                startPosition = translator.locate($appointment);

            pointer.dragStart().drag(dragDistance, 0);

            assert.roughEqual(startPosition.left, translator.locate($appointment).left - dragDistance + timePanelWidth, 2, 'Appointment position is correct');
            pointer.dragEnd();
        });

        test('Appointment should have correct position while horizontal dragging, crossScrollingEnabled = true (T732885)', assert => {
            const scheduler = createWrapper({
                height: 500,
                editing: true,
                currentDate: new Date(2015, 1, 9),
                currentView: 'week',
                dataSource: [{
                    text: 'a',
                    startDate: new Date(2015, 1, 9, 1),
                    endDate: new Date(2015, 1, 9, 1, 30)
                }],
                crossScrollingEnabled: true,
            });

            const $appointment = scheduler.appointments.getAppointment(),
                dragDistance = 150;


            const pointer = pointerMock($appointment).start(),
                startPosition = translator.locate($appointment);

            pointer.dragStart().drag(dragDistance, 0);

            const currentPosition = translator.locate($appointment);

            assert.roughEqual(startPosition.left, currentPosition.left - dragDistance, 2, 'Appointment position is correct');
            pointer.dragEnd();
        });

        test('Appointment should have correct position while horizontal dragging in scrolled date table', assert => {
            const scheduler = createWrapper({
                height: 500,
                width: 800,
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

            const $appointment = scheduler.appointments.getAppointment(),
                scrollable = scheduler.instance.getWorkSpace().$element().find('.dx-scrollable').dxScrollable('instance'),
                scrollDistance = 400,
                dragDistance = 100;

            scrollable.scrollTo({ left: scrollDistance, top: 0 });

            const pointer = pointerMock($appointment).start(),
                startPosition = translator.locate($appointment);

            pointer.dragStart().drag(dragDistance, 0);

            const currentPosition = translator.locate($appointment);

            assert.equal(startPosition.left, currentPosition.left + scrollDistance - dragDistance, 'Appointment position is correct');
            pointer.dragEnd();
        });
    }
});
