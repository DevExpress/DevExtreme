import $ from 'jquery';
import translator from 'common/core/animation/translator';
import fx from 'common/core/animation/fx';
import { createWrapper } from '../../helpers/scheduler/helpers.js';
import themes from 'ui/themes';
import { CompactAppointmentsHelper } from '__internal/scheduler/m_compact_appointments_helper';
import Widget from 'ui/widget/ui.widget';
import Color from 'color';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import AppointmentAdapter from '__internal/scheduler/m_appointment_adapter';

import '__internal/scheduler/m_scheduler';
import 'generic_light.css!';

const { test, module, testStart } = QUnit;

testStart(() => {
    $('#qunit-fixture').html(
        '<div id="ddAppointments"></div>\
        <div id="scheduler"></div>');
});

const ADAPTIVE_COLLECTOR_DEFAULT_SIZE = 28;
const ADAPTIVE_COLLECTOR_BOTTOM_OFFSET = 40;
const ADAPTIVE_COLLECTOR_RIGHT_OFFSET = 5;
const COMPACT_THEME_ADAPTIVE_COLLECTOR_RIGHT_OFFSET = 1;

const baseConfig = {
    beforeEach: function() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },
    afterEach: function() {
        fx.off = false;
        this.clock.restore();
    }
};

module('Integration: collector', baseConfig, () => {
    test('Start date should be equal targetedAppointmentData.startDate in appointment popup form in case recurrent appointment (T882652)', function(assert) {
        const data = [{
            text: '1',
            startDate: new Date(2017, 4, 16, 9, 30),
            endDate: new Date(2017, 4, 16, 11),

        }, {
            text: '2',
            startDate: new Date(2017, 4, 16, 9, 30),
            endDate: new Date(2017, 4, 16, 11),

        }, {
            text: 'Recurrence',
            startDate: new Date(2017, 4, 1, 9, 30),
            endDate: new Date(2017, 4, 1, 11),
            recurrenceRule: 'FREQ=DAILY'
        }];

        const scheduler = createWrapper({
            dataSource: data,
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2017, 4, 25),
            height: 600,
            onAppointmentFormOpening: e => {
                const startDate = e.form.getEditor('startDate').option('value');
                assert.equal(startDate.getDate(), 16, 'Recurrence appointment date should be display equal targetedAppointmentData date in form');
            }
        });

        scheduler.appointments.compact.click();
        assert.equal(scheduler.tooltip.getDateText(),
            'May 16 9:30 AM - 11:00 AM', 'Recurrence appointment date should be display equal targetedAppointmentData date in tooltip');

        scheduler.tooltip.clickOnItem();
        scheduler.appointmentPopup.dialog.clickEditAppointment();
    });
});

module('Integration: Appointments Collector Base Tests', baseConfig, () => {
    const createWidget = () => {
        return new (Widget.inherit({
            option(options) {
                if(options === 'appointmentCollectorTemplate') {
                    return 'appointmentCollector';
                }
                return this.callBase(options);
            },
            _getAppointmentTemplate(template) {
                return this._getTemplateByOption(template);
            },
            createAppointmentAdapter(date) {
                const schedulerMock = {
                    fire: (methodName, fieldName, appointment) => appointment[fieldName]
                };
                return new AppointmentAdapter(schedulerMock, date);
            }
        }))($('<div>'));
    };

    const renderAppointmentsCollectorContainer = ({ widgetMock, items, options, color }) => {
        const helper = new CompactAppointmentsHelper(widgetMock);
        items = items || { data: [{ text: 'a', startDate: new Date(2015, 1, 1) }], colors: [], settings: [] };

        return helper.render({
            ...options,
            $container: $('#ddAppointments'),
            coordinates: { top: 0, left: 0 },
            items,
            buttonWidth: 200,
            buttonColor: $.Deferred().resolve(color)
        });
    };

    test('Appointment collector should be rendered with right class', function(assert) {
        const widgetMock = createWidget();

        const $collector = renderAppointmentsCollectorContainer({ widgetMock });
        assert.ok($collector.hasClass('dx-scheduler-appointment-collector'), 'Container is rendered');
        assert.ok($collector.dxButton('instance'), 'Container is button');
    });

    test('Appointment collector should not be painted if items have different colors', function(assert) {
        const widgetMock = createWidget();
        const color = '#0000ff';

        const $collector = renderAppointmentsCollectorContainer({
            widgetMock,
            items: {
                data: [
                    { text: 'a', startDate: new Date(2015, 1, 1) },
                    { text: 'b', startDate: new Date(2015, 1, 1) }
                ],
                colors: ['#fff000', '#000fff'],
                settings: []
            },
            color
        });

        assert.notEqual(new Color($collector.css('backgroundColor')).toHex(), color, 'Color is OK');
    });

    test('Appointment collector should have a correct markup', function(assert) {
        const widgetMock = createWidget();
        const $button = renderAppointmentsCollectorContainer({ widgetMock });
        const $collectorContent = $button.find('.dx-scheduler-appointment-collector-content');

        assert.equal($collectorContent.length, 1, 'Content is OK');
        assert.equal($collectorContent.html().toLowerCase(), '<span>1 more</span>', 'Markup is OK');
    });
});

module('Integration: Appointments Collector, adaptivityEnabled = false', baseConfig, () => {
    const tasks = [
        { startDate: new Date(2019, 2, 4), text: 'a', endDate: new Date(2019, 2, 4, 0, 30) },
        { startDate: new Date(2019, 2, 4), text: 'b', endDate: new Date(2019, 2, 4, 0, 30) },
        { startDate: new Date(2019, 2, 4), text: 'c', endDate: new Date(2019, 2, 4, 0, 30) },
        { startDate: new Date(2019, 2, 4), text: 'd', endDate: new Date(2019, 2, 4, 0, 30) },
        { startDate: new Date(2019, 2, 4), text: 'e', endDate: new Date(2019, 2, 4, 0, 30) },
        { startDate: new Date(2019, 2, 4), text: 'f', endDate: new Date(2019, 2, 4, 0, 30) }
    ];

    const createInstance = options => {
        return createWrapper({
            dataSource: tasks,
            views: ['month', 'week'],
            width: 840,
            currentView: 'month',
            height: 1000,
            currentDate: new Date(2019, 2, 4),
            ...options
        });
    };

    const getAppointmentColor = ($task, checkedProperty) => {
        checkedProperty = checkedProperty || 'backgroundColor';
        return new Color($task.css(checkedProperty)).toHex();
    };

    const checkItemDataInDropDownTemplate = (assert, dataSource, currentDate) => {
        const scheduler = createInstance({
            dataSource: dataSource,
            height: 600,
            maxAppointmentsPerCell: 1,
            currentDate: currentDate,
            currentView: 'month',
            views: ['month'],
            dropDownAppointmentTemplate(itemData) {
                assert.ok(dataSource.indexOf(itemData) > -1, 'appointment data contains in the data source');
            }
        });

        scheduler.appointments.compact.click();
    };

    test('Appointment collector should have correct coordinates on month view', function(assert) {
        const scheduler = createInstance();

        assert.equal(scheduler.appointments.compact.getButtonCount(), 0, 'Collector wasn\'t rendered');
        assert.equal(scheduler.appointments.getAppointmentCount(), 6, 'Six appointments were rendered');

        scheduler.instance.addAppointment({ startDate: new Date(2019, 2, 4), text: 'd', endDate: new Date(2019, 2, 4, 0, 30) });

        assert.equal(scheduler.appointments.compact.getButtonCount(), 1, 'Collector was rendered');
        assert.equal(scheduler.appointments.getAppointmentCount(), 6, 'Five appointments were rendered');

        const $collector = scheduler.appointments.compact.getButton(0);

        const collectorCoordinates = translator.locate($collector);
        const expectedCoordinates = scheduler.workSpace.getCell(8).position();

        assert.roughEqual(collectorCoordinates.left, expectedCoordinates.left, 1.001, 'Left coordinate is OK');
        assert.roughEqual(collectorCoordinates.top, expectedCoordinates.top, 1.001, 'Top coordinate is OK');
    });

    test('Appointment collector should have correct size in material-based themes', function(assert) {
        const origIsMaterialBased = themes.isMaterialBased;

        try {
            themes.isMaterialBased = () => true;

            const scheduler = createInstance({
                currentDate: new Date(2019, 2, 4),
                views: ['month'],
                width: 840,
                height: 500,
                currentView: 'month',
                firstDayOfWeek: 1
            });

            assert.roughEqual(scheduler.appointments.compact.getButtonWidth(), 63, 1, 'Collector width is ok');
            assert.roughEqual(scheduler.appointments.compact.getButtonHeight(), 20, 1, 'Collector height is ok');
        } finally {
            themes.isMaterialBased = origIsMaterialBased;
        }
    });

    test('DropDown appointment button should have correct coordinates on weekView, not in allDay panel', function(assert) {
        const WEEK_VIEW_BUTTON_OFFSET = 5;

        const scheduler = createInstance({
            currentDate: new Date(2019, 2, 4),
            views: ['week'],
            width: 840,
            currentView: 'week',
            firstDayOfWeek: 1,
            maxAppointmentsPerCell: 1,
            dataSource: [
                { startDate: new Date(2019, 2, 6), text: 'a', endDate: new Date(2019, 2, 6, 0, 30) },
                { startDate: new Date(2019, 2, 6), text: 'b', endDate: new Date(2019, 2, 6, 0, 30) }
            ]
        });

        const $collector = scheduler.appointments.compact.getButton(0);
        const collectorWidth = scheduler.appointments.compact.getButtonWidth(0);
        const collectorCoordinates = translator.locate($collector);
        const expectedCoordinates = scheduler.workSpace.getCell(2).position();
        const cellWidth = scheduler.workSpace.getCell(2).outerWidth();

        assert.equal(scheduler.appointments.compact.getButtonCount(), 1, 'Collector was rendered');
        assert.roughEqual(collectorCoordinates.left, expectedCoordinates.left + cellWidth - collectorWidth - WEEK_VIEW_BUTTON_OFFSET, 1.001, 'Left coordinate is OK');
        assert.roughEqual(collectorCoordinates.top, expectedCoordinates.top, 1.001, 'Top coordinate is OK');
    });

    test('Appointment collector should have correct size when intervalCount is set', function(assert) {
        const scheduler = createInstance({
            views: [{ type: 'month', intervalCount: 2 }],
            width: 850,
            maxAppointmentsPerCell: 2,
            currentView: 'month',
            firstDayOfWeek: 1
        });

        scheduler.instance.option('dataSource', [
            { startDate: new Date(2019, 2, 4), text: 'a', endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: 'b', endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: 'c', endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: 'd', endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: 'e', endDate: new Date(2019, 2, 4, 0, 30) },
            { startDate: new Date(2019, 2, 4), text: 'f', endDate: new Date(2019, 2, 4, 0, 30) }
        ]);

        const cellWidth = scheduler.workSpace.getCell(0).outerWidth();

        assert.roughEqual(scheduler.appointments.compact.getButtonWidth(), cellWidth - 60, 1.5, 'Collector width is ok');

        scheduler.instance.option('views', ['month']);

        assert.roughEqual(scheduler.appointments.compact.getButtonWidth(), cellWidth - 36, 1, 'Collector width is ok');
        assert.roughEqual(scheduler.appointments.compact.getButtonHeight(), 20, 1, 'Collector height is ok');
    });

    test('Appointment collector count should be ok when there are multiday appointments', function(assert) {
        const scheduler = createInstance({
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2019, 8, 20),
            width: 470,
            height: 650
        });

        scheduler.instance.option('dataSource', [
            { text: 'a', startDate: new Date(2019, 8, 14), endDate: new Date(2019, 8, 15) },
            { text: 'b', startDate: new Date(2019, 8, 14), endDate: new Date(2019, 8, 15) },
            { text: 'c', startDate: new Date(2019, 8, 12), endDate: new Date(2019, 8, 15) },
            { text: 'd', startDate: new Date(2019, 8, 12), endDate: new Date(2019, 8, 15) },
            { text: 'e', startDate: new Date(2019, 8, 12), endDate: new Date(2019, 8, 15) },
            { text: 'f', startDate: new Date(2019, 8, 12), endDate: new Date(2019, 8, 15) }
        ]);

        assert.equal(scheduler.appointments.compact.getButtonCount(), 3, 'Collectors count is ok');
    });

    test('Many dropDown appts with one multi day task should be grouped correctly', function(assert) {
        const scheduler = createInstance({
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2019, 4, 29),
            width: 800,
            height: 490
        });
        this.clock.tick(300);
        scheduler.instance.focus();

        scheduler.instance.option('dataSource', [
            { text: '1', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '2', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '3', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '4', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '5', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '6', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '7', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: '8', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 29, 1) },
            { text: 'long appt', startDate: new Date(2019, 4, 29), endDate: new Date(2019, 4, 31, 1) }
        ]);

        scheduler.appointments.compact.click(0);
        this.clock.tick(300);
        assert.equal(scheduler.tooltip.getItemCount(), 8, 'There are 8 collapsed appts');
    });

    test('Many collapsed appts should be grouped correctly with one multi day task which started before collector (T525443)', function(assert) {
        const scheduler = createInstance({
            views: ['month'],
            currentView: 'month',
            maxAppointmentsPerCell: 1,
            currentDate: new Date(2019, 5, 25),
            width: 800,
            height: 950
        });
        this.clock.tick(300);
        scheduler.instance.focus();

        scheduler.instance.option('dataSource', [
            { text: 'long appt', startDate: new Date(2019, 5, 8, 9, 0), endDate: new Date(2019, 5, 20, 9, 15) },
            { text: '1', startDate: new Date(2019, 5, 11, 9, 30), endDate: new Date(2019, 5, 11, 11, 30) },
            { text: '2', startDate: new Date(2019, 5, 11, 12, 0), endDate: new Date(2019, 5, 11, 13, 0) },
            { text: '3', startDate: new Date(2019, 5, 11, 12, 0), endDate: new Date(2019, 5, 11, 13, 0) },
            { text: '4', startDate: new Date(2019, 5, 11, 8, 0), endDate: new Date(2019, 5, 11, 23, 59) },
            { text: '5', startDate: new Date(2019, 5, 11, 9, 45), endDate: new Date(2019, 5, 11, 11, 15) },
            { text: '6', startDate: new Date(2019, 5, 11, 11, 0), endDate: new Date(2019, 5, 11, 12, 0) },
            { text: '7', startDate: new Date(2019, 5, 11, 11, 0), endDate: new Date(2019, 5, 11, 13, 30) },
            { text: '8', startDate: new Date(2019, 5, 11, 14, 0), endDate: new Date(2019, 5, 11, 15, 30) },
            { text: '9', startDate: new Date(2019, 5, 11, 14, 0), endDate: new Date(2019, 5, 11, 15, 30) },
            { text: '10', startDate: new Date(2019, 5, 11, 14, 0), endDate: new Date(2019, 5, 11, 15, 30) },
            { text: '11', startDate: new Date(2019, 5, 11, 14, 0), endDate: new Date(2019, 5, 11, 15, 30) },
            { text: '12', startDate: new Date(2019, 5, 11, 14, 0), endDate: new Date(2019, 5, 11, 15, 30) },
            { text: '13', startDate: new Date(2019, 5, 11, 14, 30), endDate: new Date(2019, 5, 11, 16, 0) }
        ]);

        scheduler.appointments.compact.click(0);
        this.clock.tick(300);
        assert.equal(scheduler.tooltip.getItemCount(), 13, 'There are 13 drop down appts');
    });

    test('Appointment collector should have correct coordinates: rtl mode', function(assert) {
        const scheduler = createInstance({
            currentDate: new Date(2019, 2, 4),
            views: ['month'],
            width: 840,
            height: 500,
            currentView: 'month',
            firstDayOfWeek: 1,
            rtlEnabled: true
        });
        const $collector = scheduler.appointments.compact.getButton(0);

        const collectorCoordinates = translator.locate($collector);
        const expectedCoordinates = scheduler.workSpace.getCell(7).position();
        const rtlOffset = scheduler.workSpace.getCell(7).outerWidth() - 36;

        assert.roughEqual(collectorCoordinates.left, expectedCoordinates.left + rtlOffset, 1.001, 'Left coordinate is OK');
        assert.roughEqual(collectorCoordinates.top, expectedCoordinates.top, 1.001, 'Top coordinate is OK');
    });

    test('Collapsed appointment should raise the onAppointmentClick event', function(assert) {
        let tooltipItemElement = null;
        let instance;
        const spy = sinon.spy();
        const appointments = [
            { startDate: new Date(2015, 2, 4), text: 'a', endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: 'b', endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: 'c', endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: 'd', endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: 'e', endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: 'f', endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: 'g', endDate: new Date(2015, 2, 4, 0, 30) }
        ];
        const scheduler = createInstance({
            currentDate: new Date(2015, 2, 4),
            views: ['month'],
            width: 840,
            height: 490,
            currentView: 'month',
            firstDayOfWeek: 1,
            onAppointmentClick(args) {
                assert.equal(args.component, instance, 'dxScheduler is \'component\'');
                assert.equal(args.element, instance.element(), 'dxScheduler element is \'element\'');
                assert.deepEqual(args.appointmentData, appointments[3], 'Appointment data is OK');

                assert.equal($(args.appointmentElement).get(0), tooltipItemElement, 'Appointment element is OK');
                assert.ok(args.event instanceof $.Event, 'Event is OK');

                const haveArgsOwnProperty = Object.prototype.hasOwnProperty.bind(args);
                assert.notOk(haveArgsOwnProperty('itemData'));
                assert.notOk(haveArgsOwnProperty('itemIndex'));
                assert.notOk(haveArgsOwnProperty('itemElement'));
            }
        });

        const showAppointmentPopup = scheduler.instance.showAppointmentPopup;
        scheduler.instance.showAppointmentPopup = spy;
        try {
            instance = scheduler.instance;

            instance.option('dataSource', appointments);
            scheduler.appointments.compact.click();
            tooltipItemElement = scheduler.tooltip.getItemElement(2).get(0);
            scheduler.tooltip.clickOnItem(2);

        } finally {
            scheduler.instance.showAppointmentPopup = showAppointmentPopup;
        }
    });

    test('Collapsed appointments should not be duplicated when items option change (T503748)', function(assert) {
        const scheduler = createInstance({
            views: ['month'],
            currentView: 'month',
            currentDate: new Date(2016, 8, 20),
            dataSource: [
                { text: 'a', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
                { text: 'b', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
                { text: 'c', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
                { text: 'd', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
                { text: 'e', startDate: new Date(2016, 8, 14), endDate: new Date(2016, 8, 15) },
                { text: 'f', startDate: new Date(2016, 8, 12), endDate: new Date(2016, 8, 12, 2) }
            ],
            width: 470,
            height: 650
        });

        scheduler.instance.addAppointment({
            text: 'g',
            startDate: new Date(2016, 8, 12),
            endDate: new Date(2016, 8, 12, 1)
        });

        scheduler.appointments.compact.click();
        assert.equal(scheduler.tooltip.getItemCount(), 2, 'There are 3 drop down appts');
    });

    test('Collapsed appointment should be rendered correctly with expressions on custom template', function(assert) {
        const startDate = new Date(2015, 1, 4, 1);
        const endDate = new Date(2015, 1, 4, 2);
        const appointments = [{
            Start: startDate.getTime(),
            End: endDate.getTime(),
            Text: 'Item 1'
        }, {
            Start: startDate.getTime(),
            End: endDate.getTime(),
            Text: 'Item 2'
        }, {
            Start: startDate.getTime(),
            End: endDate.getTime(),
            Text: 'Item 3'
        }];

        const scheduler = createInstance({
            currentDate: new Date(2015, 1, 4),
            views: ['month'],
            currentView: 'month',
            firstDayOfWeek: 1,
            dataSource: appointments,
            startDateExpr: 'Start',
            endDateExpr: 'End',
            textExpr: 'Text',
            height: 490,
            maxAppointmentsPerCell: 'auto',
            dropDownAppointmentTemplate(data) {
                return `<div class='custom-title'>${data.Text}</div>`;
            }
        });

        scheduler.appointments.compact.click();
        assert.equal(scheduler.tooltip.getItemElement().find('.custom-title').text(), 'Item 2', 'Text is correct on init');
    });


    test('Appointment collector should be rendered correctly when appointmentCollectorTemplate is used', function(assert) {
        const startDate = new Date(2015, 1, 4, 1);
        const endDate = new Date(2015, 1, 4, 2);
        const appointments = [{
            Start: startDate.getTime(),
            End: endDate.getTime(),
            Text: 'Item 1'
        }, {
            Start: startDate.getTime(),
            End: endDate.getTime(),
            Text: 'Item 2'
        }, {
            Start: startDate.getTime(),
            End: endDate.getTime(),
            Text: 'Item 3'
        }];

        const scheduler = createInstance({
            currentDate: new Date(2015, 1, 4),
            views: ['month'],
            currentView: 'month',
            firstDayOfWeek: 1,
            dataSource: appointments,
            startDateExpr: 'Start',
            endDateExpr: 'End',
            textExpr: 'Text',
            height: 490,
            maxAppointmentsPerCell: 'auto',
            appointmentCollectorTemplate(data) {
                return `<div class='button-title'>Appointment count is ${data.appointmentCount}</div>`;
            }
        });

        const $collector = scheduler.appointments.compact.getButton(0);

        assert.equal($collector.find('.button-title').text(), 'Appointment count is 2', 'Template is applied correctly');
    });

    test('dxScheduler should render dropDownAppointment appointment template with render function that returns dom node', function(assert) {
        const startDate = new Date(2015, 1, 4, 1);
        const endDate = new Date(2015, 1, 4, 2);
        const appointments = [{
            Start: startDate.getTime(),
            End: endDate.getTime(),
            Text: 'Item 1'
        }, {
            Start: startDate.getTime(),
            End: endDate.getTime(),
            Text: 'Item 2'
        }, {
            Start: startDate.getTime(),
            End: endDate.getTime(),
            Text: 'Item 3'
        }];

        const scheduler = createInstance({
            currentDate: new Date(2015, 1, 4),
            views: ['month'],
            currentView: 'month',
            firstDayOfWeek: 1,
            dataSource: appointments,
            startDateExpr: 'Start',
            endDateExpr: 'End',
            textExpr: 'Text',
            height: 500,
            maxAppointmentsPerCell: 'auto',
            dropDownAppointmentTemplate: 'dropDownAppointmentTemplate',
            integrationOptions: {
                templates: {
                    'dropDownAppointmentTemplate': {
                        render(args) {
                            const $element = $('<span>')
                                .addClass('dx-template-wrapper')
                                .text('text');

                            return $element.get(0);
                        }
                    }
                }
            }
        });

        scheduler.appointments.compact.click();
        assert.equal(scheduler.tooltip.getItemElement().text(), 'text', 'Text is correct on init');
    });

    test('Appointment collector should have correct width on timeline view', function(assert) {
        const scheduler = createInstance({
            currentDate: new Date(2015, 2, 4),
            views: [{ type: 'timelineDay', name: 'timelineDay' }],
            width: 850,
            maxAppointmentsPerCell: 2,
            currentView: 'timelineDay'
        });

        scheduler.instance.option('dataSource', [
            { startDate: new Date(2015, 2, 4), text: 'a', endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: 'b', endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: 'c', endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: 'd', endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: 'e', endDate: new Date(2015, 2, 4, 0, 30) },
            { startDate: new Date(2015, 2, 4), text: 'f', endDate: new Date(2015, 2, 4, 0, 30) }
        ]);

        const collectorWidth = scheduler.appointments.compact.getButtonWidth(0);
        const cellWidth = scheduler.workSpace.getCell(0).outerWidth();

        assert.roughEqual(collectorWidth, cellWidth - 4, 1.5, 'DropDown button has correct width');
    });

    test('The itemData argument of the drop down appointment template is should be instance of the data source', function(assert) {
        const dataSource = [{
            startDate: new Date(2015, 4, 24, 9),
            endDate: new Date(2015, 4, 24, 11),
            allDay: true,
            text: 'Task 1'
        }, {
            startDate: new Date(2015, 4, 24, 15),
            endDate: new Date(2015, 4, 24, 20),
            allDay: true,
            text: 'Task 2'
        }, {
            startDate: new Date(2015, 4, 24, 45),
            endDate: new Date(2015, 4, 24, 55),
            allDay: true,
            text: 'Task 3'
        }];
        checkItemDataInDropDownTemplate(assert, dataSource, new Date(2015, 4, 24));
    });

    test('The itemData argument of the drop down appointment template is should be instance of the data source for recurrence rule', function(assert) {
        const dataSource = [{
            startDate: new Date(2015, 4, 24, 9),
            endDate: new Date(2015, 4, 24, 11),
            recurrenceRule: 'FREQ=DAILY;COUNT=3',
            allDay: true,
            text: 'Task 1'
        }, {
            startDate: new Date(2015, 4, 24, 19),
            endDate: new Date(2015, 4, 24, 31),
            allDay: true,
            recurrenceRule: 'FREQ=DAILY;COUNT=2',
            text: 'Task 2'
        }, {
            startDate: new Date(2015, 4, 24, 24),
            endDate: new Date(2015, 4, 24, 34),
            allDay: true,
            recurrenceRule: 'FREQ=DAILY;COUNT=4',
            text: 'Task 3'
        }];
        checkItemDataInDropDownTemplate(assert, dataSource, new Date(2015, 4, 24));
    });

    [{
        dataSource: [{
            startDate: new Date(2020, 11, 12),
            endDate: new Date(2020, 11, 15, 3),
            text: '1'
        }, {
            startDate: new Date(2020, 11, 12),
            endDate: new Date(2020, 11, 15, 3),
            text: '2'
        }, {
            startDate: new Date(2020, 11, 12),
            endDate: new Date(2020, 11, 15, 3),
            text: '3'
        }, {
            startDate: new Date(2020, 11, 12),
            endDate: new Date(2020, 11, 20, 3),
            text: '4'
        }, {
            startDate: new Date(2020, 11, 12),
            endDate: new Date(2020, 11, 20, 3),
            text: '5'
        }, {
            startDate: new Date(2020, 11, 12),
            endDate: new Date(2020, 11, 20, 3),
            text: '6'
        }],
        view: 'month',
        expectedNumberOfCollectors: 9,
        expectedText: '5 more',
        collectorIndex: 3,
        description: 'Scheduler should render correct number of collectors and pass correct number of appointments to them in month view (T965267)',
    }, {
        dataSource: [{
            startDate: new Date(2020, 11, 21, 2),
            endDate: new Date(2020, 11, 22, 1),
            text: '1'
        }, {
            startDate: new Date(2020, 11, 21, 2),
            endDate: new Date(2020, 11, 22, 1),
            text: '2'
        }, {
            startDate: new Date(2020, 11, 22, 0),
            endDate: new Date(2020, 11, 22, 0, 30),
            text: '3'
        }],
        view: 'week',
        expectedNumberOfCollectors: 2,
        expectedText: '2',
        collectorIndex: 1,
        description: 'Scheduler should render correct number of collectors and pass correct number of appointments to them in week view (T965267)',
    }, {
        dataSource: [{
            startDate: new Date(2020, 11, 21, 2),
            endDate: new Date(2020, 11, 22, 1),
            text: '1'
        }, {
            startDate: new Date(2020, 11, 21, 2),
            endDate: new Date(2020, 11, 22, 1),
            text: '2'
        }, {
            startDate: new Date(2020, 11, 22, 0),
            endDate: new Date(2020, 11, 22, 0, 30),
            text: '3'
        }, {
            startDate: new Date(2020, 11, 22, 0),
            endDate: new Date(2020, 11, 22, 0, 30),
            text: '4',
            allDay: true,
        }, {
            startDate: new Date(2020, 11, 22, 0),
            endDate: new Date(2020, 11, 22, 0, 30),
            text: '5',
            allDay: true,
        }],
        view: 'week',
        expectedNumberOfCollectors: 3,
        expectedText: '1 more',
        collectorIndex: 0,
        description: 'Scheduler should render correct number of collectors'
            + 'and pass correct number of appointments to them in week view\'s all-day panel (T965267)',
    }].forEach(({
        dataSource,
        view,
        expectedNumberOfCollectors,
        expectedText,
        collectorIndex,
        description,
    }) => {
        test(description, function(assert) {
            const scheduler = createWrapper({
                dataSource,
                views: [{
                    type: view,
                    maxAppointmentsPerCell: 1,
                }],
                currentView: view,
                currentDate: new Date(2020, 11, 25),
                height: 600,
            });

            const collectorsCount = scheduler.appointments.compact.getButtonCount();
            const collectorText = scheduler.appointments.compact.getButtonText(collectorIndex);

            assert.equal(collectorsCount, expectedNumberOfCollectors, 'Correct number of appointment collectors');
            assert.equal(collectorText, expectedText, 'Correct text');
        });
    });
});

module('Integration: Appointments Collector, adaptivityEnabled = true', baseConfig, () => {
    const tasks = [
        { startDate: new Date(2019, 2, 4), text: 'a', endDate: new Date(2019, 2, 4, 0, 30) },
        { startDate: new Date(2019, 2, 4), text: 'b', endDate: new Date(2019, 2, 4, 0, 30) },
        { startDate: new Date(2019, 2, 4), text: 'c', endDate: new Date(2019, 2, 4, 0, 30) },
        { startDate: new Date(2019, 2, 4), text: 'd', endDate: new Date(2019, 2, 4, 0, 30) },
        { startDate: new Date(2019, 2, 4), text: 'e', endDate: new Date(2019, 2, 4, 0, 30) },
        { startDate: new Date(2019, 2, 4), text: 'f', endDate: new Date(2019, 2, 4, 0, 30) }
    ];

    const createInstance = options => {
        return createWrapper({
            ...options,
            height: 800,
            dataSource: tasks,
            adaptivityEnabled: true,
            views: ['month', 'week'],
            width: 840,
            currentView: 'month',
            currentDate: new Date(2019, 2, 4)
        });
    };

    test('There are no ordinary appointments on adaptive month view', function(assert) {
        const scheduler = createInstance();

        assert.equal(scheduler.appointments.compact.getButtonCount(), 1, 'Collector is rendered');
        assert.equal(scheduler.appointments.getAppointmentCount(), 0, 'Appointments are not rendered');

        scheduler.instance.option('dataSource', [{ startDate: new Date(2019, 2, 4), text: 'a', endDate: new Date(2019, 2, 4, 0, 30) }]);

        assert.equal(scheduler.appointments.compact.getButtonCount(), 1, 'Collector is rendered');
        assert.equal(scheduler.appointments.getAppointmentCount(), 0, 'Appointments are not rendered');
    });

    test('There are no ordinary appointments on adaptive week view allDay panel', function(assert) {
        const scheduler = createInstance();

        scheduler.instance.option('dataSource', [{ startDate: new Date(2019, 2, 4), text: 'a', endDate: new Date(2019, 2, 4, 0, 30), allDay: true }]);
        scheduler.instance.option('currentView', 'week');

        assert.equal(scheduler.appointments.compact.getButtonCount(), 1, 'Collector is rendered');
        assert.equal(scheduler.appointments.getAppointmentCount(), 0, 'Appointments are not rendered');
    });

    test('Adaptive collector should have correct coordinates', function(assert) {
        const scheduler = createInstance();

        const $collector = scheduler.appointments.compact.getButton(0);

        const buttonCoordinates = translator.locate($collector);
        const expectedCoordinates = scheduler.workSpace.getCell(8).position();

        assert.roughEqual(buttonCoordinates.left, expectedCoordinates.left + (scheduler.workSpace.getCellWidth() - ADAPTIVE_COLLECTOR_DEFAULT_SIZE) / 2, 1.001, 'Left coordinate is OK');
        assert.roughEqual(buttonCoordinates.top, expectedCoordinates.top + scheduler.workSpace.getCellHeight() - ADAPTIVE_COLLECTOR_BOTTOM_OFFSET, 1.001, 'Top coordinate is OK');
    });

    test('Adaptive collector should have correct sizes', function(assert) {
        const scheduler = createInstance();

        const $collector = scheduler.appointments.compact.getButton(0);

        assert.roughEqual($collector.outerWidth(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, 'Width is OK');
        assert.roughEqual($collector.outerHeight(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, 'Height is OK');
    });

    test('Adaptive collector should have correct size in material theme', function(assert) {
        const origIsMaterial = themes.isMaterial;
        themes.isMaterial = () => true;

        const scheduler = createInstance();
        const $collector = scheduler.appointments.compact.getButton(0);

        assert.roughEqual($collector.outerWidth(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, 'Width is OK');
        assert.roughEqual($collector.outerHeight(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, 'Height is OK');

        themes.isMaterial = origIsMaterial;
    });

    test('Adaptive collector should have correct coordinates on allDay panel', function(assert) {
        const scheduler = createInstance();

        scheduler.instance.option('dataSource', [{ startDate: new Date(2019, 2, 4), text: 'a', endDate: new Date(2019, 2, 4, 0, 30), allDay: true }]);
        scheduler.instance.option('currentView', 'week');

        const $collector = scheduler.appointments.compact.getButton(0);

        const buttonCoordinates = translator.locate($collector);
        const expectedCoordinates = scheduler.workSpace.getAllDayCell(1).position();

        assert.roughEqual(buttonCoordinates.left, expectedCoordinates.left + (scheduler.workSpace.getAllDayCellWidth() - ADAPTIVE_COLLECTOR_DEFAULT_SIZE) / 2, 1.001, 'Left coordinate is OK');
        assert.roughEqual(buttonCoordinates.top, (scheduler.workSpace.getAllDayCellHeight() - ADAPTIVE_COLLECTOR_DEFAULT_SIZE) / 2, 1.001, 'Top coordinate is OK');
    });

    test('Adaptive collector should have correct sizes on allDayPanel', function(assert) {
        const scheduler = createInstance();

        scheduler.instance.option('dataSource', [{ startDate: new Date(2019, 2, 4), text: 'a', endDate: new Date(2019, 2, 4, 0, 30), allDay: true }]);
        scheduler.instance.option('currentView', 'week');

        const $collector = scheduler.appointments.compact.getButton(0);

        assert.roughEqual($collector.outerWidth(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, 'Width is OK');
        assert.roughEqual($collector.outerHeight(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, 'Height is OK');
    });

    test('Ordinary appointment count depends on scheduler width on week view', function(assert) {
        const scheduler = createInstance();

        scheduler.instance.option('width', 600);

        scheduler.instance.option('dataSource', [{ startDate: new Date(2019, 2, 4), text: 'a', endDate: new Date(2019, 2, 4, 0, 30) }, { startDate: new Date(2019, 2, 4), text: 'b', endDate: new Date(2019, 2, 4, 0, 30) }]);
        scheduler.instance.option('currentView', 'week');

        assert.equal(scheduler.appointments.compact.getButtonCount(), 1, 'Collector is rendered');
        assert.equal(scheduler.appointments.getAppointmentCount(), 1, 'Appointment is rendered');

        scheduler.instance.option('width', 200);

        assert.equal(scheduler.appointments.compact.getButtonCount(), 1, 'Collector is rendered');
        assert.equal(scheduler.appointments.getAppointmentCount(), 0, 'Appointment isn\'t rendered');

        scheduler.instance.option('width', 1000);

        assert.equal(scheduler.appointments.compact.getButtonCount(), 0, 'Collector isn\'t rendered');
        assert.equal(scheduler.appointments.getAppointmentCount(), 2, 'Appointments are rendered');
    });

    test('Ordinary appointments should have correct sizes on week view', function(assert) {
        const scheduler = createInstance();

        scheduler.instance.option('width', 700);

        scheduler.instance.option('dataSource', [{ startDate: new Date(2019, 2, 4), text: 'a', endDate: new Date(2019, 2, 4, 0, 30) }, { startDate: new Date(2019, 2, 4), text: 'b', endDate: new Date(2019, 2, 4, 0, 30) }]);
        scheduler.instance.option('currentView', 'week');

        const $appointment = scheduler.appointments.getAppointment(0);

        assert.roughEqual($appointment.outerWidth(), 50, 1.001, 'Width is OK');
        assert.roughEqual($appointment.outerHeight(), 50, 1.001, 'Height is OK');

        scheduler.instance.option('width', 1000);

        const $firstAppointment = scheduler.appointments.getAppointment(0);
        const $secondAppointment = scheduler.appointments.getAppointment(1);

        assert.roughEqual($firstAppointment.outerWidth(), 46.5, 1.001, 'Width is OK');
        assert.roughEqual($firstAppointment.outerHeight(), 50, 1.001, 'Height is OK');

        assert.roughEqual($secondAppointment.outerWidth(), 46.5, 1.001, 'Width is OK');
        assert.roughEqual($secondAppointment.outerHeight(), 50, 1.001, 'Height is OK');
    });

    test('Adaptive collector should have correct coordinates on week view', function(assert) {
        const scheduler = createInstance();

        scheduler.instance.option('width', 700);

        scheduler.instance.option('dataSource', [{ startDate: new Date(2019, 2, 4), text: 'a', endDate: new Date(2019, 2, 4, 0, 30) }, { startDate: new Date(2019, 2, 4), text: 'b', endDate: new Date(2019, 2, 4, 0, 30) }]);
        scheduler.instance.option('currentView', 'week');

        const $collector = scheduler.appointments.compact.getButton(0);

        const collectorCoordinates = translator.locate($collector);
        const expectedCoordinates = scheduler.workSpace.getCell(1).position();

        assert.roughEqual(collectorCoordinates.left, expectedCoordinates.left + scheduler.workSpace.getCellWidth() - ADAPTIVE_COLLECTOR_DEFAULT_SIZE - ADAPTIVE_COLLECTOR_RIGHT_OFFSET, 1.001, 'Left coordinate is OK');
        assert.roughEqual(collectorCoordinates.top, expectedCoordinates.top, 1.001, 'Top coordinate is OK');
    });

    test('Adaptive collector should have correct coordinates coordinates on week view in compact theme', function(assert) {
        try {
            this.themeMock = sinon.stub(themes, 'current').returns('generic.light.compact');
            const scheduler = createInstance();
            scheduler.instance.option('currentView', 'week');

            const $collector = scheduler.appointments.compact.getButton(0);

            const collectorCoordinates = translator.locate($collector);
            const expectedCoordinates = scheduler.workSpace.getCell(1).position();

            assert.roughEqual(collectorCoordinates.left, expectedCoordinates.left + scheduler.workSpace.getCellWidth() - ADAPTIVE_COLLECTOR_DEFAULT_SIZE - COMPACT_THEME_ADAPTIVE_COLLECTOR_RIGHT_OFFSET, 1.001, 'Left coordinate is OK');
            assert.roughEqual(collectorCoordinates.top, expectedCoordinates.top, 1.001, 'Top coordinate is OK');
        } finally {
            this.themeMock.restore();
        }
    });

    test('Adaptive collector should have correct sizes on week view', function(assert) {
        const scheduler = createInstance();

        scheduler.instance.option('width', 700);

        scheduler.instance.option('dataSource', [{ startDate: new Date(2019, 2, 4), text: 'a', endDate: new Date(2019, 2, 4, 0, 30) }, { startDate: new Date(2019, 2, 4), text: 'b', endDate: new Date(2019, 2, 4, 0, 30) }]);
        scheduler.instance.option('currentView', 'week');

        const $collector = scheduler.appointments.compact.getButton(0);

        assert.roughEqual($collector.outerWidth(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, 'Width is OK');
        assert.roughEqual($collector.outerHeight(), ADAPTIVE_COLLECTOR_DEFAULT_SIZE, 1.001, 'Height is OK');
    });
});
