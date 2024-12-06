import { getOuterWidth, getOuterHeight } from 'core/utils/size';
import $ from 'jquery';
import { initTestMarkup, createWrapper } from '../../helpers/scheduler/helpers.js';
import translator from 'common/core/animation/translator';
import Color from 'color';
import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';

import '__internal/scheduler/m_scheduler';
import 'generic_light.css!';

const { testStart } = QUnit;

testStart(() => initTestMarkup());

const mockWorkSpaceRendering = function(schedulerInst, cellSize, bounds) {
    const base = schedulerInst._renderWorkSpace;
    const getMaxAllowedPosition = (groupIndex) => {
        return bounds[groupIndex];
    };

    sinon.stub(schedulerInst, '_renderWorkSpace').callsFake(function(groups) {
        base.call(this, groups);

        sinon.stub(this._workSpace, 'getCellWidth').returns(cellSize);
        sinon.stub(this._workSpace, 'getMaxAllowedPosition').callsFake(getMaxAllowedPosition);
    });
};

QUnit.module('Integration: Multi-Week appointments', {
    beforeEach: function() {
        fx.off = true;
        this.createInstance = function(options = {}) {
            this.scheduler = createWrapper({
                ...options,
                height: 600,
            });
            this.instance = this.scheduler.instance;
        };
    },
    afterEach: function() {
        fx.off = false;
    }
});

QUnit.test('Appointment width should be decreased if it greater than work space width', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 6),
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        dataSource: [{ startDate: new Date(2015, 4, 10), endDate: new Date(2015, 9, 12) }]
    });

    const $appointment = $(this.instance.$element()).find('.dx-scheduler-appointment');
    const $cell = $(this.instance.$element()).find('.dx-scheduler-date-table-cell');

    assert.roughEqual(getOuterWidth($appointment), Math.floor(getOuterWidth($cell)), 1.001, 'Appointment width is OK');
});

QUnit.test('Appointment width should be decreased if it greater than work space width (rtl mode)', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 6),
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        rtlEnabled: true,
        dataSource: [
            { startDate: new Date(2015, 4, 10), endDate: new Date(2015, 4, 12), text: 'hello' },
            { startDate: new Date(2015, 4, 8), endDate: new Date(2015, 4, 9) }
        ]
    });

    const $appointment1 = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);
    const $appointment2 = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(1);
    const $cell = $(this.instance.$element()).find('.dx-scheduler-date-table-cell');

    assert.roughEqual(getOuterWidth($appointment1), Math.floor(getOuterWidth($cell)), 1.001, 'Appointment width is OK');
    assert.roughEqual(getOuterWidth($appointment2), Math.floor(getOuterWidth($cell)), 1.001, 'Appointment width is OK');
});

QUnit.test('Appointment width should be decreased if it greater than work space width (grouped mode)', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 6),
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        dataSource: [{
            startDate: new Date(2015, 4, 10),
            endDate: new Date(2015, 4, 12),
            ownerId: [1, 2]
        }],
        groups: ['ownerId'],
        resources: [
            {
                field: 'ownerId',
                label: 'o',
                allowMultiple: true,
                dataSource: [
                    {
                        text: 'a',
                        id: 1
                    },
                    {
                        text: 'b',
                        id: 2
                    }
                ]
            }
        ]
    });

    let $appointment1 = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);
    let $appointment2 = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(1);
    let $cell = $(this.instance.$element()).find('.dx-scheduler-date-table-cell');

    assert.roughEqual(getOuterWidth($appointment1), Math.floor(getOuterWidth($cell)), 1.001, 'Appointment width is OK');
    assert.roughEqual(getOuterWidth($appointment2), Math.floor(getOuterWidth($cell)), 1.001, 'Appointment width is OK');

    this.instance.option('rtlEnabled', true);
    $appointment1 = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);
    $appointment2 = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(1);
    $cell = $(this.instance.$element()).find('.dx-scheduler-date-table-cell');

    assert.roughEqual(getOuterWidth($appointment1), Math.floor(getOuterWidth($cell)), 1.001, 'Appointment width is OK');
    assert.roughEqual(getOuterWidth($appointment2), Math.floor(getOuterWidth($cell)), 1.001, 'Appointment width is OK');
});

QUnit.test('Max allowed position of appointment should be calculated correctly (grouped mode)', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 25),
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        dataSource: [{
            text: 'Website Re-Design Plan',
            ownerId: [2],
            priorityId: [2],
            startDate: new Date(2015, 4, 25, 9, 0),
            endDate: new Date(2015, 4, 25, 11, 30)
        }],
        groups: ['ownerId', 'priorityId'],
        resources: [
            {
                field: 'ownerId',
                allowMultiple: true,
                dataSource: [
                    {
                        text: 'A',
                        id: 1
                    },
                    {
                        text: 'B',
                        id: 2
                    }
                ]
            }, {
                field: 'priorityId',
                allowMultiple: true,
                dataSource: [
                    {
                        text: 'Low',
                        id: 1,
                        color: 'blue'
                    }, {
                        text: 'High',
                        id: 2,
                        color: '#ff9747'
                    }
                ]
            }
        ]
    });
    const $cell = $(this.instance.$element()).find('.dx-scheduler-date-table-cell');
    const $appointment = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(0);

    assert.roughEqual(getOuterWidth($appointment), Math.floor(getOuterWidth($cell)), 1.001, 'Appointment width is OK');
});

QUnit.test('Appointment should have a special icon and class if it greater than work space width', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 6),
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        dataSource: [{ startDate: new Date(2015, 4, 10), endDate: new Date(2015, 5, 7) }]
    });

    const $appointment = $(this.instance.$element()).find('.dx-scheduler-appointment');

    assert.equal($appointment.find('.dx-scheduler-appointment-reduced-icon').length, 5, 'Appointment has an arrow icon');
    assert.ok($appointment.hasClass('dx-scheduler-appointment-reduced'), 'Appointment has right class');
});

QUnit.test('Each cloned appointment should have a special icon if it greater than work space width', function(assert) {
    this.createInstance({
        currentDate: new Date(2015, 4, 6),
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        dataSource: [{
            startDate: new Date(2015, 4, 10),
            endDate: new Date(2015, 4, 12),
            ownerId: [1, 2]
        }],
        groups: ['ownerId'],
        resources: [
            {
                field: 'ownerId',
                label: 'o',
                allowMultiple: true,
                dataSource: [
                    {
                        text: 'a',
                        id: 1
                    },
                    {
                        text: 'b',
                        id: 2
                    }
                ]
            }
        ]
    });

    const $clonedAppointment = $(this.instance.$element()).find('.dx-scheduler-appointment').eq(1);

    assert.equal($clonedAppointment.find('.dx-scheduler-appointment-reduced-icon').length, 1, 'Cloned appointment has an arrow icon');
});

QUnit.test('Multi-week appointments should be split by several parts', function(assert) {
    this.createInstance({ width: 700 });

    this.instance.option({
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 1, 9),
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 2, 4)
        }]
    });

    const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');
    const rowHeight = getOuterHeight(
        this.instance.getWorkSpace().getWorkArea().find('.dx-scheduler-date-table tr').eq(0)
    );
    const appointmentHeight = getOuterHeight($appointments);
    const appointmentTopOffsetInsideCell = (rowHeight - appointmentHeight) / 2;

    const firstAppointmentTop = translator.locate($appointments.eq(0)).top;
    const secondAppointmentTop = translator.locate($appointments.eq(1)).top;
    const thirdAppointmentTop = translator.locate($appointments.eq(2)).top;
    const fourthAppointmentTop = translator.locate($appointments.eq(3)).top;

    assert.equal($appointments.length, 4, 'Appointment is split by 3 parts');
    assert.roughEqual(getOuterWidth($appointments.eq(0)), 600, 2.001, 'Appointment width is OK');
    assert.roughEqual(getOuterWidth($appointments.eq(1)), 699, 2.001, 'Appointment width is OK');
    assert.roughEqual(getOuterWidth($appointments.eq(2)), 699, 2.001, 'Appointment width is OK');
    assert.roughEqual(getOuterWidth($appointments.eq(3)), 200, 2.001, 'Appointment width is OK');

    assert.roughEqual(firstAppointmentTop, rowHeight * 2 + appointmentTopOffsetInsideCell + 1, 3.51, 'The first appointment height is OK');
    assert.roughEqual(secondAppointmentTop, rowHeight * 3 + appointmentTopOffsetInsideCell + 1, 3.51, 'The second appointment height is OK');
    assert.roughEqual(thirdAppointmentTop, rowHeight * 4 + appointmentTopOffsetInsideCell + 1, 3.51, 'The third appointment height is OK');
    assert.roughEqual(fourthAppointmentTop, rowHeight * 5 + appointmentTopOffsetInsideCell + 1, 3.51, 'The fourth appointment height is OK');
});

QUnit.test('Multi-week appointments should have a correct left coordinate', function(assert) {
    this.createInstance({
        width: 700,
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 1, 9),
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 25)
        }] });

    const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

    assert.roughEqual(translator.locate($appointments.eq(0)).left, 100, 1.001, 'Left coordinate is OK');
    assert.roughEqual(translator.locate($appointments.eq(1)).left, 1, 1.001, 'Left coordinate is OK');
    assert.roughEqual(translator.locate($appointments.eq(2)).left, 1, 1.001, 'Left coordinate is OK');
});

QUnit.test('Multi-week appointments should have a correct left coordinate, rtl mode', function(assert) {
    this.createInstance({
        width: 700,
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        rtlEnabled: true,
        currentDate: new Date(2015, 1, 9),
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 25)
        }]
    });

    const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

    assert.roughEqual(translator.locate($appointments.eq(0)).left, 0, 1.001, 'Left coordinate is OK');
    assert.roughEqual(translator.locate($appointments.eq(1)).left, 0, 1.001, 'Left coordinate is OK');
    assert.roughEqual(translator.locate($appointments.eq(2)).left, 500, 2.001, 'Left coordinate is OK');
});

QUnit.test('Multi-week appointments with resources should have a correct left coordinate on timeline view', function(assert) {
    const data = [{
        text: 'Task',
        roomId: [1, 2],
        ownerId: [1, 2],
        startDate: new Date(2015, 2, 4, 1),
        endDate: new Date(2015, 2, 4, 3)
    }];
    const resources = [
        {
            field: 'roomId',
            allowMultiple: true,
            dataSource: [
                {
                    text: 'Room1',
                    id: 1
                },
                {
                    text: 'Room2',
                    id: 2
                }
            ]
        },
        {
            field: 'ownerId',
            allowMultiple: true,
            dataSource: [
                {
                    text: 'John',
                    id: 1
                },
                {
                    text: 'Bob',
                    id: 2
                }
            ]
        }
    ];

    this.createInstance({
        height: 300,
        views: ['timelineDay'],
        currentView: 'timelineDay',
        dataSource: data,
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 2, 4),
        groups: ['roomId', 'ownerId'],
        resources: resources
    });

    mockWorkSpaceRendering.call(this, this.instance, 100, [700]);

    const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

    assert.roughEqual(translator.locate($appointments.eq(0)).left, 400, 1.001, 'Left coordinate is OK');
    assert.roughEqual(translator.locate($appointments.eq(1)).left, 400, 1.001, 'Left coordinate is OK');
    assert.roughEqual(translator.locate($appointments.eq(2)).left, 400, 1.001, 'Left coordinate is OK');
    assert.roughEqual(translator.locate($appointments.eq(3)).left, 400, 1.001, 'Left coordinate is OK');
});

QUnit.test('Multi-week appointments with resources should have a correct left coordinate on timeline view, rtl mode', function(assert) {
    const clock = sinon.useFakeTimers();
    const data = [{
        text: 'Task',
        roomId: [1, 2],
        ownerId: [1, 2],
        startDate: new Date(2015, 2, 4, 1),
        endDate: new Date(2015, 2, 4, 3)
    }];
    const resources = [
        {
            field: 'roomId',
            allowMultiple: true,
            dataSource: [
                {
                    text: 'Room1',
                    id: 1
                },
                {
                    text: 'Room2',
                    id: 2
                }
            ]
        },
        {
            field: 'ownerId',
            allowMultiple: true,
            dataSource: [
                {
                    text: 'John',
                    id: 1
                },
                {
                    text: 'Bob',
                    id: 2
                }
            ]
        }
    ];

    try {
        this.createInstance({
            rtlEnabled: true,
            views: ['timelineDay'],
            currentView: 'timelineDay',
            dataSource: data,
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 2, 4),
            groups: ['roomId', 'ownerId'],
            resources: resources
        });

        mockWorkSpaceRendering.call(this, this.instance, 100, [700]);

        const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');
        const $dateTable = $(this.instance.$element()).find('.dx-scheduler-date-table');
        const expectedLeft = getOuterWidth($dateTable) - getOuterWidth($appointments.eq(0)) - 400;

        assert.roughEqual(translator.locate($appointments.eq(0)).left, expectedLeft, 1.001, 'Left coordinate is OK');
        assert.roughEqual(translator.locate($appointments.eq(1)).left, expectedLeft, 1.001, 'Left coordinate is OK');
        assert.roughEqual(translator.locate($appointments.eq(2)).left, expectedLeft, 1.001, 'Left coordinate is OK');
        assert.roughEqual(translator.locate($appointments.eq(3)).left, expectedLeft, 1.001, 'Left coordinate is OK');
    } finally {
        clock.restore();
    }
});

QUnit.test('Multi-week appointments should have correct resizable handles', function(assert) {
    this.createInstance({ width: 700, editing: true });

    mockWorkSpaceRendering.call(this, this.instance, 100, [700]);

    this.instance.option({
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 1, 9),
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 25)
        }]
    });

    const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

    assert.equal($appointments.eq(0).dxResizable('instance').option('handles'), 'left', 'Appointment head has a right resizable handles');
    assert.strictEqual($appointments.eq(1).dxResizable('instance').option('handles'), '', 'Appointment body isn\'t resizable');
    assert.equal($appointments.eq(2).dxResizable('instance').option('handles'), 'right', 'Appointment tail has a right resizable handles');
});

QUnit.test('Multi-week appointments should have correct resizable handles in rtl mode', function(assert) {
    this.createInstance({ width: 700, editing: true });

    this.instance.option({
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 1, 9),
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 25)
        }],
        rtlEnabled: true
    });

    const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

    assert.equal($appointments.eq(0).dxResizable('instance').option('handles'), 'right', 'Appointment head has a right resizable handles');
    assert.strictEqual($appointments.eq(1).dxResizable('instance').option('handles'), '', 'Appointment body isn\'t resizable');
    assert.equal($appointments.eq(2).dxResizable('instance').option('handles'), 'left', 'Appointment tail has a right resizable handles');
});

QUnit.test('Multi-week appointments should have correct CSS classes', function(assert) {
    this.createInstance({ width: 700 });

    mockWorkSpaceRendering.call(this, this.instance, 100, [700]);

    this.instance.option({
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 1, 9),
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 25)
        }]
    });

    const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

    assert.ok($appointments.eq(0).hasClass('dx-scheduler-appointment-head'), 'Appointment head has a right CSS class');
    assert.ok($appointments.eq(1).hasClass('dx-scheduler-appointment-body'), 'Appointment body has a right CSS class');
    assert.ok($appointments.eq(2).hasClass('dx-scheduler-appointment-tail'), 'Appointment tail has a right CSS class');
});

QUnit.test('Multi-week appointments should be duplicated depend on resource count', function(assert) {
    this.createInstance({
        width: 800,
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 1, 9),
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 25),
            roomId: [1, 2]
        }],
        resources: [
            {
                field: 'roomId',
                dataSource: [
                    { id: 1, text: 'One' },
                    { id: 2, text: 'Two' }
                ]
            }
        ],
        groups: ['roomId']
    });

    const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');
    assert.equal($appointments.length, 6, 'Appointment count is OK');
});

QUnit.test('Grouped multi-week appointments should have a correct left offset', function(assert) {
    this.createInstance({
        width: 700,
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 1, 9),
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 25),
            roomId: [1, 2]
        }],
        resources: [
            {
                field: 'roomId',
                dataSource: [
                    { id: 1, text: 'One' },
                    { id: 2, text: 'Two' }
                ]
            }
        ],
        groups: ['roomId']
    });

    const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

    assert.roughEqual(translator.locate($appointments.eq(0)).left, 50, 2.001);
    assert.roughEqual(translator.locate($appointments.eq(1)).left, 0, 1.001);
    assert.roughEqual(translator.locate($appointments.eq(2)).left, 0, 1.001);

    assert.roughEqual(translator.locate($appointments.eq(3)).left, 399, 1.001);
    assert.roughEqual(translator.locate($appointments.eq(4)).left, 349, 1.001);
    assert.roughEqual(translator.locate($appointments.eq(5)).left, 349, 1.001);

});

[true, false].forEach((renovateRender) => {
    QUnit.test(`Grouped multi-week appointments should have a correct left offset in rtl mode when renovateRender is ${renovateRender}`, function(assert) {

        this.createInstance({ width: 1052 });

        const cellWidth = 50;

        mockWorkSpaceRendering.call(this, this.instance, cellWidth, [700, 350, 0]);

        this.instance.option({
            views: ['month'],
            currentView: 'month',
            firstDayOfWeek: 1,
            currentDate: new Date(2015, 1, 9),
            rtlEnabled: true,
            dataSource: [],
            resources: [
                {
                    field: 'roomId',
                    dataSource: [
                        { id: 1, text: 'One' },
                        { id: 2, text: 'Two' },
                        { id: 3, text: 'Three' }
                    ]
                }
            ],
            groups: ['roomId'],
            renovateRender,
        });

        this.instance.option('dataSource', [{
            text: 'a',
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 25),
            roomId: [1, 2]
        }]);

        const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

        assert.roughEqual(translator.locate($appointments.eq(0)).left, cellWidth * 14, 2.001, 'The first head is OK');
        assert.roughEqual(translator.locate($appointments.eq(1)).left, cellWidth * 14, 1.001, 'The first body is OK');
        assert.roughEqual(translator.locate($appointments.eq(2)).left, cellWidth * 19, 2.001, 'The first tail is OK');

        assert.roughEqual(translator.locate($appointments.eq(3)).left, cellWidth * 7, 1.001, 'The second head is OK');
        assert.roughEqual(translator.locate($appointments.eq(4)).left, cellWidth * 7, 1.001, 'The second body is OK');
        assert.roughEqual(translator.locate($appointments.eq(5)).left, cellWidth * 12, 2.001, 'The second tail is OK');

    });
});

QUnit.test('Multi-week grouped appointments should be painted correctly', function(assert) {
    this.createInstance({
        width: 700,
        views: ['month'],
        currentView: 'month',
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 1, 9),
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 25),
            roomId: [1, 2, 3]
        }],
        resources: [
            {
                field: 'roomId',
                dataSource: [
                    { id: 1, text: 'One', color: '#8bb6ff' },
                    { id: 2, text: 'Two', color: '#ff8b8b' },
                    { id: 3, text: 'Three', color: '#8bffa6' }
                ]
            }
        ],
        groups: ['roomId']
    });

    const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

    assert.equal(new Color($appointments.eq(0).css('backgroundColor')).toHex(), '#8bb6ff', 'Color is OK');
    assert.equal(new Color($appointments.eq(1).css('backgroundColor')).toHex(), '#8bb6ff', 'Color is OK');
    assert.equal(new Color($appointments.eq(2).css('backgroundColor')).toHex(), '#8bb6ff', 'Color is OK');

    assert.equal(new Color($appointments.eq(3).css('backgroundColor')).toHex(), '#ff8b8b', 'Color is OK');
    assert.equal(new Color($appointments.eq(4).css('backgroundColor')).toHex(), '#ff8b8b', 'Color is OK');
    assert.equal(new Color($appointments.eq(5).css('backgroundColor')).toHex(), '#ff8b8b', 'Color is OK');

    assert.equal(new Color($appointments.eq(6).css('backgroundColor')).toHex(), '#8bffa6', 'Color is OK');
    assert.equal(new Color($appointments.eq(7).css('backgroundColor')).toHex(), '#8bffa6', 'Color is OK');
    assert.equal(new Color($appointments.eq(8).css('backgroundColor')).toHex(), '#8bffa6', 'Color is OK');
});

QUnit.test('Multi-week appointments should have a correct left offset on day view, rtl mode', function(assert) {
    this.createInstance({
        width: 700,
        views: ['day'],
        currentView: 'day',
        firstDayOfWeek: 1,
        currentDate: new Date(2015, 2, 4),
        dataSource: [{
            text: 'a',
            startDate: new Date(2015, 2, 4),
            endDate: new Date(2015, 2, 17)
        }],
        rtlEnabled: true
    });

    const $appointments = $(this.instance.$element()).find('.dx-scheduler-appointment');

    assert.roughEqual(translator.locate($appointments.eq(0)).left, 0, 2.001);
});

QUnit.test('Multi week task dragging on month view', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 2, 3, 22),
                endDate: new Date(2015, 2, 17, 10, 30)
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        dataSource: data,
        currentView: 'month',
        firstDayOfWeek: 1,
        editing: true,
        startDayHour: 3,
        endDayHour: 10,
        _draggingMode: 'default'
    });

    const updatedItem = {
        text: 'Task 1',
        startDate: new Date(2015, 1, 23, 22),
        endDate: new Date(2015, 2, 9, 10, 30),
        allDay: true,
        recurrenceRule: ''
    };

    this.scheduler.appointmentList[0].drag.toCell(0);

    const updatedMultiWeekItem = this.instance.option('dataSource').items()[0];

    assert.deepEqual(updatedMultiWeekItem.startDate, updatedItem.startDate, 'New data is correct');
    assert.deepEqual(updatedMultiWeekItem.endDate, updatedItem.endDate, 'New data is correct');
});

QUnit.test('Multi week allDay task dragging on month view', function(assert) {
    const data = new DataSource({
        store: [
            {
                text: 'Task 1',
                startDate: new Date(2015, 2, 3),
                endDate: new Date(2015, 2, 17),
                allDay: true
            }
        ]
    });

    this.createInstance({
        currentDate: new Date(2015, 2, 4),
        dataSource: data,
        currentView: 'month',
        firstDayOfWeek: 1,
        editing: true,
        startDayHour: 3,
        endDayHour: 10,
        _draggingMode: 'default'
    });

    const updatedItem = {
        text: 'Task 1',
        startDate: new Date(2015, 1, 23, 0),
        endDate: new Date(2015, 2, 9, 0),
        allDay: true,
        recurrenceRule: ''
    };

    this.scheduler.appointmentList[0].drag.toCell(0);

    const updatedMultiWeekItem = this.instance.option('dataSource').items()[0];

    assert.deepEqual(updatedMultiWeekItem.startDate, updatedItem.startDate, 'New data is correct');
    assert.deepEqual(updatedMultiWeekItem.endDate, updatedItem.endDate, 'New data is correct');
});
