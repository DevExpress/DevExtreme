const dxSchedulerAppointmentModel = require('ui/scheduler/ui.scheduler.appointment_model');
const dataCoreUtils = require('core/utils/data');
const compileGetter = dataCoreUtils.compileGetter;
const compileSetter = dataCoreUtils.compileSetter;
const config = require('core/config');
const DataSource = require('data/data_source/data_source').DataSource;
const timeZoneCalculator = {
    createDate: (date) => {
        return date;
    }
};


(function() {

    QUnit.module('Server side filtering');

    const appointments = [
        {
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0),
            recurrenceRule: 'FREQ=DAILY'
        },
        {
            text: 'Appointment 2',
            startDate: new Date(2015, 1, 10, 11, 0),
            endDate: new Date(2015, 1, 10, 13, 0)
        }
    ];

    QUnit.test('Appointment model filterByDate should filter dataSource', function(assert) {
        const dataSource = new DataSource({
            store: [
                {
                    text: 'Appointment 1',
                    startDate: new Date(2015, 1, 9, 1, 0),
                    endDate: new Date(2015, 1, 9, 2, 0)
                },
                {
                    text: 'Appointment 2',
                    startDate: new Date(2015, 1, 10, 11, 0),
                    endDate: new Date(2015, 1, 10, 13, 0)
                }
            ]
        });
        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'startDate',
                endDateExpr: 'endDate'
            }
        });

        appointmentModel.filterByDate(new Date(2015, 1, 10, 10), new Date(2015, 1, 10, 13), true);

        dataSource.load();

        assert.deepEqual(dataSource.items(), [appointments[1]], 'filterByDate work correctly');
    });

    QUnit.test('Appointment model filterByDate should filter dataSource correctly after changing user filter', function(assert) {
        const data = [
            {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: 'Appointment 2',
                startDate: new Date(2015, 1, 10, 11, 0),
                endDate: new Date(2015, 1, 10, 13, 0)
            }
        ];
        const dataSource = new DataSource({
            store: data,
            filter: ['text', '=', 'Appointment 2']
        });
        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'startDate',
                endDateExpr: 'endDate'
            }
        });
        const dateFilter = [
            [
                ['endDate', '>', new Date(2015, 1, 9, 0)],
                ['startDate', '<', new Date(2015, 1, 11)]
            ],
            'or',
            [
                ['endDate', new Date(2015, 1, 9)],
                ['startDate', new Date(2015, 1, 9)]
            ]
        ];
        appointmentModel.filterByDate(new Date(2015, 1, 9, 0), new Date(2015, 1, 10, 13), true);

        let expectedFilter = [dateFilter, [
            'text',
            '=',
            'Appointment 2'
        ]];
        let actualFilter = dataSource.filter();
        assert.deepEqual(expectedFilter, actualFilter, 'filter is right');

        const changedDataSource = new DataSource({
            store: data
        });
        appointmentModel.setDataSource(changedDataSource, true);
        appointmentModel.filterByDate(new Date(2015, 1, 9, 0), new Date(2015, 1, 10, 13), true);

        expectedFilter = [dateFilter];
        actualFilter = changedDataSource.filter();
        assert.deepEqual(actualFilter, expectedFilter, 'filter is right');
    });

    QUnit.test('Appointment model should clear the internal user filter after dataSource has been filtered (T866593)', function(assert) {
        const appointments = [
            { text: 'a', StartDate: new Date(2015, 0, 1, 1), EndDate: new Date(2015, 0, 1, 2), priorityId: 2 },
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6, 0), priorityId: 1 },
            { text: 'c', StartDate: new Date(2015, 0, 1, 8), EndDate: new Date(2015, 0, 1, 9), priorityId: 1 }
        ];

        const dataSource = new DataSource({
            store: appointments
        });

        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecurrenceRule'),
                recurrenceException: compileGetter('Exception'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileSetter('EndDate'),
                recurrenceRule: compileSetter('RecurrenceRule'),
                recurrenceException: compileSetter('Exception'),
                allDay: compileSetter('AllDay')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecurrenceRule',
                recurrenceExceptionExpr: 'Exception'
            }
        });

        appointmentModel.filterByDate(new Date(2015, 0, 1, 1), new Date(2015, 0, 2));

        dataSource.load().done(() => {
            dataSource.filter('priorityId', '=', 1);

            appointmentModel.filterByDate(new Date(2015, 0, 1, 1), new Date(2015, 0, 2));

            appointmentModel.filterLoadedAppointments({
                startDayHour: 3,
                endDayHour: 4
            }, timeZoneCalculator);

            assert.equal(appointmentModel._filterMaker._filterRegistry.user, undefined, 'Empty user filter');
        });
    });

    QUnit.test('Appointment model filterByDate should filter dataSource correctly without copying dateFilter', function(assert) {
        const dateFilter = [
            [
                ['endDate', '>', new Date(2015, 1, 9, 0)],
                ['startDate', '<', new Date(2015, 1, 11)]
            ],
            'or',
            [
                ['endDate', new Date(2015, 1, 9)],
                ['startDate', new Date(2015, 1, 9)]
            ]
        ];

        const dataSource = new DataSource({
            store: [],
            filter: [dateFilter, ['text', '=', 'Appointment 2']]
        });

        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'startDate',
                endDateExpr: 'endDate'
            }
        });

        appointmentModel.filterByDate(new Date(2015, 1, 9, 0), new Date(2015, 1, 10, 13), true);

        const expectedFilter = [dateFilter, [
            'text',
            '=',
            'Appointment 2'
        ]];
        const actualFilter = dataSource.filter();
        assert.deepEqual(expectedFilter, actualFilter, 'filter is right');
    });

    QUnit.test('Appointment model filterByDate should return filter with dateSerializationFormat and without forceIsoDateParsing', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = false;
        try {
            const dataSource = new DataSource({
                store: [
                    {
                        text: 'Appointment 1',
                        startDate: new Date(2015, 1, 9, 1, 0),
                        endDate: new Date(2015, 1, 9, 2, 0)
                    },
                    {
                        text: 'Appointment 2',
                        startDate: new Date(2015, 1, 10, 11, 0),
                        endDate: new Date(2015, 1, 10, 13, 0)
                    }
                ]
            });
            const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
                expr: {
                    startDateExpr: 'startDate',
                    endDateExpr: 'endDate'
                }
            });

            appointmentModel.filterByDate(new Date(2015, 1, 10, 10), new Date(2015, 1, 10, 13), true, 'yyyy-MM-ddTHH:mm:ss');

            const expectedFilter = [[
                [
                    ['endDate', '>', new Date(2015, 1, 10)],
                    ['startDate', '<', new Date(2015, 1, 11)]
                ],
                'or',
                [
                    ['endDate', new Date(2015, 1, 10)],
                    ['startDate', new Date(2015, 1, 10)]
                ]
            ]];
            const actualFilter = dataSource.filter();
            assert.deepEqual(actualFilter, expectedFilter, 'filter is right');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test('Appointment model filterByDate should return filter with dateSerializationFormat and forceIsoDateParsing', function(assert) {
        const defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
        try {
            const dataSource = new DataSource({
                store: [
                    {
                        text: 'Appointment 1',
                        startDate: new Date(2015, 1, 9, 1, 0),
                        endDate: new Date(2015, 1, 9, 2, 0)
                    },
                    {
                        text: 'Appointment 2',
                        startDate: new Date(2015, 1, 10, 11, 0),
                        endDate: new Date(2015, 1, 10, 13, 0)
                    }
                ]
            });
            const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
                expr: {
                    startDateExpr: 'startDate',
                    endDateExpr: 'endDate'
                }
            });

            appointmentModel.filterByDate(new Date(2015, 1, 10, 10), new Date(2015, 1, 10, 13), true, 'yyyy-MM-ddTHH:mm:ss');

            const expectedFilter = [[
                [
                    ['endDate', '>', '2015-02-10T00:00:00'],
                    ['startDate', '<', '2015-02-11T00:00:00']
                ],
                'or',
                [
                    ['endDate', '2015-02-10T00:00:00'],
                    ['startDate', '2015-02-10T00:00:00']
                ]
            ]];
            const actualFilter = dataSource.filter();
            assert.deepEqual(actualFilter, expectedFilter, 'filter is right');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });


    QUnit.test('Start date of appt lower than first filter date & end appt date higher than second filter date', function(assert) {
        const dataSource = new DataSource({
            store: [{
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0)
            },
            {
                text: 'Appointment 2',
                startDate: new Date(2015, 1, 10, 11, 0),
                endDate: new Date(2015, 1, 10, 13, 0)
            }]
        });
        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'startDate',
                endDateExpr: 'endDate'
            }
        });

        appointmentModel.filterByDate(new Date(2015, 1, 10, 11, 5), new Date(2015, 1, 10, 11, 45), true);
        dataSource.load();

        assert.deepEqual(dataSource.items(), [appointments[1]], 'filterByDate work correctly');
    });

    QUnit.test('Appointment model should be filtered correctly by custom startDate field', function(assert) {
        const dataSource = new DataSource({
            store: [{
                text: 'Appointment 1',
                Start: new Date(2015, 1, 12, 5),
                End: new Date(2015, 1, 12, 5, 30)
            }]
        });

        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'Start',
                endDateExpr: 'End'
            }
        });

        appointmentModel.filterByDate(new Date(2015, 1, 9), new Date(2015, 1, 20));
        dataSource.load();

        assert.equal(dataSource.items().length, 1, 'filterByDate works correctly with custom dateField');
    });

    QUnit.test('AllDay appointment should not be filtered by min date in range', function(assert) {
        const tasks = [{
            text: 'Appointment 2',
            startDate: new Date(2015, 1, 10, 11, 0),
            endDate: new Date(2015, 1, 10, 11, 30),
            AllDay: true
        }];

        const dataSource = new DataSource({
            store: tasks
        });

        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'startDate',
                endDateExpr: 'endDate',
                allDayExpr: 'AllDay'
            }
        });

        appointmentModel.filterByDate(new Date(2015, 1, 10, 12), new Date(2015, 1, 11), true);
        dataSource.load();

        assert.deepEqual(dataSource.items(), [tasks[0]], 'filterByDate works correctly');
    });

    QUnit.test('AllDay appointment should be filtered when its endDate is equal to filter min', function(assert) {
        const tasks = [{
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 11),
            allDay: true
        }];
        const dataSource = new DataSource({
            store: tasks
        });

        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'startDate',
                endDateExpr: 'endDate',
                allDayExpr: 'AllDay'
            }
        });

        appointmentModel.filterByDate(new Date(2015, 1, 11), new Date(2015, 1, 11, 11), true);
        dataSource.load();

        assert.equal(dataSource.items().length, 0, 'filterByDate works correctly');
    });

    QUnit.test('Appointment model filterByDate should correctly filter items with recurrenceRule, if recurrenceRuleExpr!=null', function(assert) {
        const recurrentAppts = [
            {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                _recurrenceRule: 'FREQ=DAILY'
            },
            {
                text: 'Appointment 2',
                startDate: new Date(2015, 1, 10, 11, 0),
                endDate: new Date(2015, 1, 10, 13, 0)
            }];

        const dataSource = new DataSource({
            store: recurrentAppts
        });
        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'startDate',
                endDateExpr: 'endDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: '_recurrenceRule'
            }
        });

        appointmentModel.filterByDate(new Date(2015, 1, 10), new Date(2015, 1, 10, 13), true);
        dataSource.load();

        assert.deepEqual(dataSource.items(), recurrentAppts, 'filterByDate works correctly');
    });

    QUnit.test('Appointment model filterByDate should ignore items with recurrenceRule, if recurrenceRuleExpr=null', function(assert) {
        const appts = [
            {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                recurrenceRule: 'FREQ=DAILY'
            },
            {
                text: 'Appointment 2',
                startDate: new Date(2015, 1, 10, 11, 0),
                endDate: new Date(2015, 1, 10, 13, 0)
            }];

        const dataSource = new DataSource({
            store: appts
        });
        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'startDate',
                endDateExpr: 'endDate',
                allDayExpr: 'allDay',
                recurrenceRuleExpr: null
            }
        });

        appointmentModel.filterByDate(new Date(2015, 1, 10), new Date(2015, 1, 10, 13), true);
        dataSource.load();

        assert.deepEqual(dataSource.items(), [appts[1]], 'filterByDate works correctly');
        assert.equal(dataSource.filter()[0].length, 3, 'filter is correct');
    });

    QUnit.test('Appointment model filterByDate should ignore items with recurrenceRule, if recurrenceRuleExpr=\'\'', function(assert) {
        const appts = [
            {
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 9, 1, 0),
                endDate: new Date(2015, 1, 9, 2, 0),
                _recurrenceRule: 'FREQ=DAILY'
            },
            {
                text: 'Appointment 2',
                startDate: new Date(2015, 1, 10, 11, 0),
                endDate: new Date(2015, 1, 10, 13, 0)
            }];

        const dataSource = new DataSource({
            store: appts
        });
        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'startDate',
                endDateExpr: 'endDate',
                allDayExpr: 'allDay',
                recurrenceRuleExpr: ''
            }
        });

        appointmentModel.filterByDate(new Date(2015, 1, 10), new Date(2015, 1, 10, 13), true);
        dataSource.load();

        assert.deepEqual(dataSource.items(), [appts[1]], 'filterByDate works correctly');
        assert.equal(dataSource.filter()[0].length, 3, 'filter is correct');
    });

    QUnit.test('Appointment should be loaded if date range equals to 24 hours', function(assert) {
        const appts = [{
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        }];

        const dataSource = new DataSource({
            store: appts
        });
        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'startDate',
                endDateExpr: 'endDate',
                allDayExpr: 'allDay'
            }
        });

        appointmentModel.filterByDate(new Date(2015, 1, 9, 0), new Date(2015, 1, 9, 23, 59));
        dataSource.load();

        assert.deepEqual(dataSource.items(), [appts[0]], 'filterByDate works correctly');
    });

    QUnit.test('Scheduler filter expression must be saved, after a user override the filter', function(assert) {
        const appointments = [
            { text: 'a', StartDate: new Date(2015, 0, 1, 1), EndDate: new Date(2015, 0, 1, 2), priorityId: 2 },
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6, 0), priorityId: 1 },
            { text: 'c', StartDate: new Date(2015, 0, 1, 8), EndDate: new Date(2015, 0, 1, 9), priorityId: 1 }
        ];

        const dataSource = new DataSource({
            store: appointments
        });

        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecurrenceRule'),
                recurrenceException: compileGetter('Exception'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileSetter('EndDate'),
                recurrenceRule: compileSetter('RecurrenceRule'),
                recurrenceException: compileSetter('Exception'),
                allDay: compileSetter('AllDay')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecurrenceRule',
                recurrenceExceptionExpr: 'Exception'
            }
        });

        appointmentModel.filterByDate(new Date(2015, 0, 1, 0), new Date(2015, 0, 3));
        dataSource.load();

        dataSource.filter('priorityId', '=', 1);

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 1, 0),
            max: new Date(2015, 0, 3)
        }, timeZoneCalculator);

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6), priorityId: 1 }], 'Appointments are OK');
    });

    QUnit.test('User filter must be constantly overwritten', function(assert) {
        const appointments = [
            { text: 'a', StartDate: new Date(2014, 11, 29, 1), EndDate: new Date(2014, 11, 29, 2), priorityId: 2 },
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6, 0), priorityId: 1 },
            { text: 'c', StartDate: new Date(2015, 0, 1, 8), EndDate: new Date(2015, 0, 1, 9), priorityId: 1 }
        ];

        const dataSource = new DataSource({
            store: appointments,
            filter: ['priorityId', '=', 1]
        });

        const appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecurrenceRule'),
                recurrenceException: compileGetter('Exception'),
                allDay: compileGetter('AllDay')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecurrenceRule',
                recurrenceExceptionExpr: 'Exception'
            }
        });

        appointmentModel.filterByDate(new Date(2015, 0, 1, 0), new Date(2015, 0, 3), true);
        dataSource.load();

        const existingFilter = dataSource.filter();
        const newUserFilter = ['priorityId', '=', 2];

        existingFilter[1] = newUserFilter;
        dataSource.filter(existingFilter);
        appointmentModel.filterByDate(new Date(2014, 11, 29, 0), new Date(2014, 11, 30), true);
        dataSource.load();


        assert.deepEqual(dataSource.items(), [{ text: 'a', StartDate: new Date(2014, 11, 29, 1), EndDate: new Date(2014, 11, 29, 2), priorityId: 2 }], 'Appointments are OK');
    });

})('Server side filtering');

(function() {

    QUnit.module('Client side after filtering');

    QUnit.test('Loaded appointments should be filtered by start & end day hours', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecurrenceRule'),
                recurrenceException: compileGetter('Exception'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileSetter('EndDate')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecurrenceRule',
                recurrenceExceptionExpr: 'Exception'
            }
        });

        appointmentModel.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 2).toString() });
        appointmentModel.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6, 0).toString() });
        appointmentModel.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7
        }, timeZoneCalculator);

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() }], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments on the borders should be filtered by start & end day hours', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecurrenceRule'),
                recurrenceException: compileGetter('Exception'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileSetter('EndDate')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecurrenceRule',
                recurrenceExceptionExpr: 'Exception'
            }
        });

        appointmentModel.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 3).toString() });
        appointmentModel.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 45).toString(), EndDate: new Date(2015, 0, 1, 3, 50).toString() });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7
        }, timeZoneCalculator);

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 45).toString(), EndDate: new Date(2015, 0, 1, 3, 50).toString() }], 'Appointments are OK. Appointment \'a\' was filtered');
    });

    QUnit.test('Loaded appointments should be filtered by decimal start & end day hours', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecurrenceRule'),
                recurrenceException: compileGetter('Exception'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileSetter('EndDate')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecurrenceRule',
                recurrenceExceptionExpr: 'Exception'
            }
        });

        appointmentModel.add({ text: 'a', StartDate: new Date(2015, 0, 1, 3).toString(), EndDate: new Date(2015, 0, 1, 3, 10).toString() });
        appointmentModel.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 40).toString(), EndDate: new Date(2015, 0, 1, 7, 20).toString() });
        appointmentModel.add({ text: 'c', StartDate: new Date(2015, 0, 1, 7, 35).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3.5,
            endDayHour: 7.5
        }, timeZoneCalculator);

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 40).toString(), EndDate: new Date(2015, 0, 1, 7, 20).toString() }], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should be filtered by recurrence rule', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecRule'),
                recurrenceException: compileGetter('RecException'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileSetter('EndDate')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecRule',
                recurrenceExceptionExpr: 'RecException'
            }
        });

        appointmentModel.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 2).toString() });
        appointmentModel.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() });
        appointmentModel.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });
        appointmentModel.add({ text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=WE' });
        appointmentModel.add({ text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), RecRule: 'FREQ=WEEKLY,BYDAY=TH' });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2014, 11, 31).toString(),
            max: new Date(2015, 0, 1, 23, 59).toString()
        }, timeZoneCalculator);

        assert.deepEqual(appts, [
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() },
            { text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=WE' }
        ], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should be filtered by recurrence rule correctly, if appointment startDate.getHours < starDayHour', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecRule'),
                recurrenceException: compileGetter('RecException'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileSetter('EndDate')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecRule',
                recurrenceExceptionExpr: 'RecException'
            }
        });

        appointmentModel.add({ text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' });
        appointmentModel.add({ text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 5, 3, 0).toString(),
            max: new Date(2015, 0, 11, 7, 0).toString()
        }, timeZoneCalculator);

        assert.deepEqual(appts, [
            { text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' },
            { text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' }
        ], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should be filtered by recurrence rule correctly for day interval', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecRule'),
                recurrenceException: compileGetter('RecException'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileSetter('EndDate')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecRule',
                recurrenceExceptionExpr: 'RecException'
            }
        });

        appointmentModel.add({ text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' });
        appointmentModel.add({ text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 5, 3, 0).toString(),
            max: new Date(2015, 0, 5, 7, 0).toString()
        }, timeZoneCalculator);

        assert.deepEqual(appts, [
            { text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' },
            { text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' }
        ], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should not be filtered by recurrence rule, if recurrenceRuleExpr = null', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileSetter('EndDate')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: null
            }
        });

        appointmentModel.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 2).toString() });
        appointmentModel.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() });
        appointmentModel.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });
        appointmentModel.add({ text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' });
        appointmentModel.add({ text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), recurrenceRule: 'FREQ=WEEKLY,BYDAY=TH' });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 1).toString(),
            max: new Date(2015, 0, 1, 23, 59).toString()
        }, timeZoneCalculator);

        assert.deepEqual(appts, [
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() },
            { text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
            { text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), recurrenceRule: 'FREQ=WEEKLY,BYDAY=TH' }
        ], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should not be filtered by recurrence rule, if recurrenceRuleExpr = \'\'', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileSetter('EndDate')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: ''
            }
        });

        appointmentModel.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 2).toString() });
        appointmentModel.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() });
        appointmentModel.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });
        appointmentModel.add({ text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' });
        appointmentModel.add({ text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), recurrenceRule: 'FREQ=WEEKLY,BYDAY=TH' });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 1).toString(),
            max: new Date(2015, 0, 1, 23, 59).toString()
        }, timeZoneCalculator);

        assert.deepEqual(appts, [
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() },
            { text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
            { text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), recurrenceRule: 'FREQ=WEEKLY,BYDAY=TH' }
        ], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should be filtered by resources', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecRule'),
                recurrenceException: compileGetter('RecException'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone'),
                resources: {
                    ownerId: compileGetter('ownerId'),
                    roomId: compileGetter('roomId')
                }
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecRule',
                recurrenceExceptionExpr: 'RecException'
            }
        });

        appointmentModel.add({ text: 'a', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: [1, 2] });
        appointmentModel.add({ text: 'b', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2], managerId: 4 });
        appointmentModel.add({ text: 'c', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 3, roomId: [1, 2] });
        appointmentModel.add({ text: 'd', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2, 3] });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 2,
            endDayHour: 5,
            min: new Date(2015, 2, 16),
            max: new Date(2015, 2, 17),
            resources: [
                {
                    name: 'ownerId',
                    items: [{ 'id': 1, 'text': 'a' }, { 'id': 2, 'text': 'b' }]
                },
                {
                    name: 'roomId',
                    items: [{ 'id': 1, 'text': 'a' }, { 'id': 2, 'text': 'b' }]
                }
            ]
        }, timeZoneCalculator);

        assert.deepEqual(appts, [
            { text: 'b', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2], managerId: 4 },
            { text: 'd', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2, 3] }
        ], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should be filtered by allDay field', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecurrenceRule'),
                recurrenceException: compileGetter('Exception'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecurrenceRule',
                recurrenceExceptionExpr: 'Exception'
            }
        });

        appointmentModel.add({ text: 'a', StartDate: new Date(2015, 0, 1, 4).toString(), EndDate: new Date(2015, 0, 1, 6).toString(), AllDay: true });
        appointmentModel.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString(), AllDay: false });
        appointmentModel.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });
        appointmentModel.add({ text: 'd', StartDate: new Date(2015, 0, 1, 4).toString(), EndDate: new Date(2015, 0, 3, 6).toString() });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            allDay: false
        }, timeZoneCalculator);

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString(), AllDay: false }], 'Appointments are OK');
    });

    QUnit.test('Loaded recurrent allDay appointments should not be filtered by start/endDayHour', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecurrenceRule'),
                recurrenceException: compileGetter('Exception'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileSetter('EndDate')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecurrenceRule',
                recurrenceExceptionExpr: 'Exception'
            }
        });

        appointmentModel.add({ text: 'a', StartDate: new Date(2015, 0, 1).toString(), EndDate: new Date(2015, 0, 2).toString(), AllDay: true, RecurrenceRule: 'FREQ=DAILY' });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 10,
            min: new Date(2015, 0, 1, 3),
            max: new Date(2015, 0, 1, 9, 59)
        }, timeZoneCalculator);

        assert.deepEqual(appts, [{ text: 'a', StartDate: new Date(2015, 0, 1).toString(), EndDate: new Date(2015, 0, 2).toString(), AllDay: true, RecurrenceRule: 'FREQ=DAILY' }], 'Appointments are OK');
    });

    QUnit.test('The part of long appointment should be filtered by start/endDayHour, with endDate < startDayHour(T339519)', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecurrenceRule'),
                recurrenceException: compileGetter('Exception'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecurrenceRule',
                recurrenceExceptionExpr: 'Exception'
            }
        });

        appointmentModel.add({
            text: 'a',
            StartDate: new Date(2015, 2, 1, 10, 30),
            EndDate: new Date(2015, 2, 2, 5, 0)
        });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 1,
            endDayHour: 10,
            min: new Date(2015, 1, 23, 1, 0),
            max: new Date(2015, 2, 1, 9, 59)
        }, timeZoneCalculator);

        assert.deepEqual(appts, [], 'Appointments are OK');
    });

    QUnit.test('The part of long appointment should be filtered by start/endDayHour, with startDate < startDayHour(T339519)', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecurrenceRule'),
                recurrenceException: compileGetter('Exception'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecurrenceRule',
                recurrenceExceptionExpr: 'Exception'
            }
        });

        appointmentModel.add({
            text: 'a',
            StartDate: new Date(2015, 2, 1, 7, 0),
            EndDate: new Date(2015, 2, 2, 0, 30)
        });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 1,
            endDayHour: 10,
            min: new Date(2015, 2, 2, 1, 0),
            max: new Date(2015, 2, 8, 9, 59)
        }, timeZoneCalculator);

        assert.deepEqual(appts, [], 'Appointments are OK');
    });

    QUnit.test('Appointment between days should be filtered by start/endDayHour (T339519)', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecurrenceRule'),
                recurrenceException: compileGetter('Exception'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecurrenceRule',
                recurrenceExceptionExpr: 'Exception'
            }
        });

        appointmentModel.add({
            text: 'a',
            StartDate: new Date(2015, 2, 1, 11, 0),
            EndDate: new Date(2015, 2, 2, 1, 0)
        });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 1,
            endDayHour: 10,
            min: new Date(2015, 2, 1, 1, 0),
            max: new Date(2015, 2, 8, 9, 59)
        }, timeZoneCalculator);

        assert.deepEqual(appts, [], 'Appointments are OK');
    });

    QUnit.test('Wrong endDate of appointment should be replaced before filtering', function(assert) {
        const appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                recurrenceRule: compileGetter('RecurrenceRule'),
                recurrenceException: compileGetter('Exception'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileSetter('EndDate')
            },
            expr: {
                startDateExpr: 'StartDate',
                endDateExpr: 'EndDate',
                allDayExpr: 'AllDay',
                recurrenceRuleExpr: 'RecurrenceRule',
                recurrenceExceptionExpr: 'Exception'
            }
        }, 60);

        appointmentModel.add({
            text: 'a',
            StartDate: new Date(2015, 2, 1, 11, 0),
            EndDate: new Date(2015, 2, 1, 1, 0)
        });

        const appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 0,
            endDayHour: 24,
            min: new Date(2015, 2, 1),
            max: new Date(2015, 2, 8)
        }, timeZoneCalculator);

        assert.deepEqual(appts[0].EndDate, new Date(2015, 2, 1, 12, 0), 'EndDate of appointment should be replaced by correct value');
    });
})('Client side after filtering');
