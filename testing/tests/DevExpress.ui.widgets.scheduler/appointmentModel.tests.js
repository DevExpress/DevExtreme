var dxSchedulerAppointmentModel = require('ui/scheduler/ui.scheduler.appointment_model'),
    dataCoreUtils = require('core/utils/data'),
    compileGetter = dataCoreUtils.compileGetter,
    compileSetter = dataCoreUtils.compileSetter,
    config = require('core/config'),
    DataSource = require('data/data_source/data_source').DataSource;

(function() {

    QUnit.module('Server side filtering');

    var appointments = [
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
        var dataSource = new DataSource({
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
        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
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
        var data = [
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
        var dataSource = new DataSource({
            store: data,
            filter: ['text', '=', 'Appointment 2']
        });
        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'startDate',
                endDateExpr: 'endDate'
            }
        });
        var dateFilter = [
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

        var expectedFilter = [dateFilter, [
            'text',
            '=',
            'Appointment 2'
        ]];
        var actualFilter = dataSource.filter();
        assert.deepEqual(expectedFilter, actualFilter, 'filter is right');

        var changedDataSource = new DataSource({
            store: data
        });
        appointmentModel.setDataSource(changedDataSource, true);
        appointmentModel.filterByDate(new Date(2015, 1, 9, 0), new Date(2015, 1, 10, 13), true);

        expectedFilter = [dateFilter];
        actualFilter = changedDataSource.filter();
        assert.deepEqual(actualFilter, expectedFilter, 'filter is right');
    });

    QUnit.test('Appointment model filterByDate should filter dataSource correctly without copying dateFilter', function(assert) {
        var dateFilter = [
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

        var dataSource = new DataSource({
            store: [],
            filter: [dateFilter, ['text', '=', 'Appointment 2']]
        });

        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
            expr: {
                startDateExpr: 'startDate',
                endDateExpr: 'endDate'
            }
        });

        appointmentModel.filterByDate(new Date(2015, 1, 9, 0), new Date(2015, 1, 10, 13), true);

        var expectedFilter = [dateFilter, [
            'text',
            '=',
            'Appointment 2'
        ]];
        var actualFilter = dataSource.filter();
        assert.deepEqual(expectedFilter, actualFilter, 'filter is right');
    });

    QUnit.test('Appointment model filterByDate should return filter with dateSerializationFormat and without forceIsoDateParsing', function(assert) {
        var defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = false;
        try {
            var dataSource = new DataSource({
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
            var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
                expr: {
                    startDateExpr: 'startDate',
                    endDateExpr: 'endDate'
                }
            });

            appointmentModel.filterByDate(new Date(2015, 1, 10, 10), new Date(2015, 1, 10, 13), true, 'yyyy-MM-ddTHH:mm:ss');

            var expectedFilter = [[
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
            var actualFilter = dataSource.filter();
            assert.deepEqual(actualFilter, expectedFilter, 'filter is right');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });

    QUnit.test('Appointment model filterByDate should return filter with dateSerializationFormat and forceIsoDateParsing', function(assert) {
        var defaultForceIsoDateParsing = config().forceIsoDateParsing;
        config().forceIsoDateParsing = true;
        try {
            var dataSource = new DataSource({
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
            var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
                expr: {
                    startDateExpr: 'startDate',
                    endDateExpr: 'endDate'
                }
            });

            appointmentModel.filterByDate(new Date(2015, 1, 10, 10), new Date(2015, 1, 10, 13), true, 'yyyy-MM-ddTHH:mm:ss');

            var expectedFilter = [[
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
            var actualFilter = dataSource.filter();
            assert.deepEqual(actualFilter, expectedFilter, 'filter is right');
        } finally {
            config().forceIsoDateParsing = defaultForceIsoDateParsing;
        }
    });


    QUnit.test('Start date of appt lower than first filter date & end appt date higher than second filter date', function(assert) {
        var dataSource = new DataSource({
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
        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
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
        var dataSource = new DataSource({
            store: [{
                text: 'Appointment 1',
                Start: new Date(2015, 1, 12, 5),
                End: new Date(2015, 1, 12, 5, 30)
            }]
        });

        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
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
        var tasks = [{
                text: 'Appointment 2',
                startDate: new Date(2015, 1, 10, 11, 0),
                endDate: new Date(2015, 1, 10, 11, 30),
                AllDay: true
            }],

            dataSource = new DataSource({
                store: tasks
            });

        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
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
        var tasks = [{
                text: 'Appointment 1',
                startDate: new Date(2015, 1, 10),
                endDate: new Date(2015, 1, 11),
                allDay: true
            }],
            dataSource = new DataSource({
                store: tasks
            });

        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
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
        var recurrentAppts = [
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

        var dataSource = new DataSource({
            store: recurrentAppts
        });
        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
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
        var appts = [
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

        var dataSource = new DataSource({
            store: appts
        });
        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
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
        var appts = [
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

        var dataSource = new DataSource({
            store: appts
        });
        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
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
        var appts = [{
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        }];

        var dataSource = new DataSource({
            store: appts
        });
        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
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
        var appointments = [
            { text: 'a', StartDate: new Date(2015, 0, 1, 1), EndDate: new Date(2015, 0, 1, 2), priorityId: 2 },
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6, 0), priorityId: 1 },
            { text: 'c', StartDate: new Date(2015, 0, 1, 8), EndDate: new Date(2015, 0, 1, 9), priorityId: 1 }
        ];

        var dataSource = new DataSource({
            store: appointments
        });

        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 1, 0),
            max: new Date(2015, 0, 3)
        });

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6), priorityId: 1 }], 'Appointments are OK');
    });

    QUnit.test('User filter must be constantly overwritten', function(assert) {
        var appointments = [
            { text: 'a', StartDate: new Date(2014, 11, 29, 1), EndDate: new Date(2014, 11, 29, 2), priorityId: 2 },
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6, 0), priorityId: 1 },
            { text: 'c', StartDate: new Date(2015, 0, 1, 8), EndDate: new Date(2015, 0, 1, 9), priorityId: 1 }
        ];

        var dataSource = new DataSource({
            store: appointments,
            filter: ['priorityId', '=', 1]
        });

        var appointmentModel = new dxSchedulerAppointmentModel(dataSource, {
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

        var existingFilter = dataSource.filter(),
            newUserFilter = ['priorityId', '=', 2];

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
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
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
                endDate: compileGetter('EndDate')
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7
        });

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() }], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments on the borders should be filtered by start & end day hours', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
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
                endDate: compileGetter('EndDate')
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7
        });

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 45).toString(), EndDate: new Date(2015, 0, 1, 3, 50).toString() }], 'Appointments are OK. Appointment \'a\' was filtered');
    });

    QUnit.test('Loaded appointments should be filtered by decimal start & end day hours', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
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
                endDate: compileGetter('EndDate')
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3.5,
            endDayHour: 7.5
        });

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 40).toString(), EndDate: new Date(2015, 0, 1, 7, 20).toString() }], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should be filtered by recurrence rule', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
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
                endDate: compileGetter('EndDate')
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 1).toString(),
            max: new Date(2015, 0, 1, 23, 59).toString()
        });

        assert.deepEqual(appts, [
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() },
            { text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=WE' }
        ], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should be filtered by recurrence rule correctly, if appointment startDate.getHours < starDayHour', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
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
                endDate: compileGetter('EndDate')
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 5, 3, 0).toString(),
            max: new Date(2015, 0, 11, 7, 0).toString()
        });

        assert.deepEqual(appts, [
            { text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' },
            { text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' }
        ], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should be filtered by recurrence rule correctly for day interval', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
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
                endDate: compileGetter('EndDate')
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 5, 3, 0).toString(),
            max: new Date(2015, 0, 5, 7, 0).toString()
        });

        assert.deepEqual(appts, [
            { text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' },
            { text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' }
        ], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should not be filtered by recurrence rule, if recurrenceRuleExpr = null', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileGetter('EndDate')
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 1).toString(),
            max: new Date(2015, 0, 1, 23, 59).toString()
        });

        assert.deepEqual(appts, [
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() },
            { text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
            { text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), recurrenceRule: 'FREQ=WEEKLY,BYDAY=TH' }
        ], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should not be filtered by recurrence rule, if recurrenceRuleExpr = \'\'', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
            getter: {
                startDate: compileGetter('StartDate'),
                endDate: compileGetter('EndDate'),
                allDay: compileGetter('AllDay'),
                startDateTimeZone: compileGetter('StartDateTimeZone'),
                endDateTimeZone: compileGetter('EndDateTimeZone')
            },
            setter: {
                startDate: compileSetter('StartDate'),
                endDate: compileGetter('EndDate')
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 1).toString(),
            max: new Date(2015, 0, 1, 23, 59).toString()
        });

        assert.deepEqual(appts, [
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() },
            { text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
            { text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), recurrenceRule: 'FREQ=WEEKLY,BYDAY=TH' }
        ], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should be filtered by resources', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
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

        var appts = appointmentModel.filterLoadedAppointments({
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
        });

        assert.deepEqual(appts, [
            { text: 'b', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2], managerId: 4 },
            { text: 'd', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2, 3] }
        ], 'Appointments are OK');
    });

    QUnit.test('Loaded appointments should be filtered by allDay field', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            allDay: false
        });

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString(), AllDay: false }], 'Appointments are OK');
    });

    QUnit.test('Loaded recurrent allDay appointments should not be filtered by start/endDayHour', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
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
                endDate: compileGetter('EndDate')
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 10,
            min: new Date(2015, 0, 1, 3),
            max: new Date(2015, 0, 1, 9, 59)
        });

        assert.deepEqual(appts, [{ text: 'a', StartDate: new Date(2015, 0, 1).toString(), EndDate: new Date(2015, 0, 2).toString(), AllDay: true, RecurrenceRule: 'FREQ=DAILY' }], 'Appointments are OK');
    });

    QUnit.test('The part of long appointment should be filtered by start/endDayHour, with endDate < startDayHour(T339519)', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 1,
            endDayHour: 10,
            min: new Date(2015, 1, 23, 1, 0),
            max: new Date(2015, 2, 1, 9, 59)
        });

        assert.deepEqual(appts, [], 'Appointments are OK');
    });

    QUnit.test('The part of long appointment should be filtered by start/endDayHour, with startDate < startDayHour(T339519)', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 1,
            endDayHour: 10,
            min: new Date(2015, 2, 2, 1, 0),
            max: new Date(2015, 2, 8, 9, 59)
        });

        assert.deepEqual(appts, [], 'Appointments are OK');
    });

    QUnit.test('Appointment between days should be filtered by start/endDayHour (T339519)', function(assert) {
        var appointmentModel = new dxSchedulerAppointmentModel(new DataSource({ store: [] }), {
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

        var appts = appointmentModel.filterLoadedAppointments({
            startDayHour: 1,
            endDayHour: 10,
            min: new Date(2015, 2, 1, 1, 0),
            max: new Date(2015, 2, 8, 9, 59)
        });

        assert.deepEqual(appts, [], 'Appointments are OK');
    });
})('Client side after filtering');
