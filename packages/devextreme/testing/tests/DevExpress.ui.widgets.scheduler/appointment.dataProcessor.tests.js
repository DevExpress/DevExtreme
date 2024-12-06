import { compileGetter, compileSetter } from 'core/utils/data';
import config from 'core/config';
import { DataSource } from 'common/data/data_source/data_source';
import { AppointmentDataProvider } from '__internal/scheduler/appointments/data_provider/m_appointment_data_provider';
import { getPreparedDataItems } from '__internal/scheduler/r1/utils/index.js';

const {
    module,
    test
} = QUnit;

const defaultDataAccessors = {
    getter: {
        startDate: compileGetter('startDate'),
        endDate: compileGetter('endDate'),
    },
    setter: {
        startDate: compileSetter('startDate'),
        endDate: compileSetter('endDate'),
    },
    expr: {
        startDateExpr: 'startDate',
        endDateExpr: 'endDate'
    },
};

const createAppointmentDataProvider = (options) => {
    return {
        appointmentDataProvider: new AppointmentDataProvider({
            allDayPanelMode: 'all',
            timeZoneCalculator: ({
                createDate: date => date
            }),
            getIsVirtualScrolling: () => false,
            viewOffset: 0,
            ...options
        }),
        prepareDataItems: () => {
            const appointmentDuration = options.appointmentDuration || 30;
            return getPreparedDataItems(
                options.dataSource.items(),
                options.dataAccessors,
                appointmentDuration,
                { createDate: date => date },
                0
            );
        }
    };
};

module('Server side filtering', () => {
    test('Appointment filterByDate should filter dataSource', function(assert) {
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
        });
        const { appointmentDataProvider } = createAppointmentDataProvider({
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: defaultDataAccessors,
        });

        appointmentDataProvider.filterByDate(new Date(2015, 1, 10, 10), new Date(2015, 1, 10, 13), true);

        dataSource.load();

        assert.deepEqual(dataSource.items(), [data[1]], 'filterByDate work correctly');
    });

    test('Appointment filterByDate should filter dataSource correctly after changing user filter', function(assert) {
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
        const { appointmentDataProvider } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: defaultDataAccessors
        });
        const dateFilter = [
            [
                ['endDate', '>=', new Date(2015, 1, 9, 0)],
                ['startDate', '<', new Date(2015, 1, 11)]
            ],
            'or',
            [
                ['endDate', new Date(2015, 1, 9)],
                ['startDate', new Date(2015, 1, 9)]
            ]
        ];

        appointmentDataProvider.filterByDate(new Date(2015, 1, 9, 0), new Date(2015, 1, 10, 13), true);

        let expectedFilter = [dateFilter, [
            'text',
            '=',
            'Appointment 2'
        ]];
        let actualFilter = dataSource.filter();
        assert.deepEqual(expectedFilter, actualFilter, 'filter is correct');

        const changedDataSource = new DataSource({
            store: data
        });
        appointmentDataProvider.setDataSource(changedDataSource, true);
        appointmentDataProvider.filterByDate(new Date(2015, 1, 9, 0), new Date(2015, 1, 10, 13), true);

        expectedFilter = [dateFilter];
        actualFilter = changedDataSource.filter();
        assert.deepEqual(actualFilter, expectedFilter, 'filter is correct');
    });

    test('Appointment should clear the internal user filter after dataSource has been filtered (T866593)', function(assert) {
        const appointments = [
            { text: 'a', StartDate: new Date(2015, 0, 1, 1), EndDate: new Date(2015, 0, 1, 2), priorityId: 2 },
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6, 0), priorityId: 1 },
            { text: 'c', StartDate: new Date(2015, 0, 1, 8), EndDate: new Date(2015, 0, 1, 9), priorityId: 1 }
        ];

        const dataSource = new DataSource({
            store: appointments
        });

        const { appointmentDataProvider } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            }
        });

        appointmentDataProvider.filterByDate(new Date(2015, 0, 1, 1), new Date(2015, 0, 2));

        dataSource.load().done(() => {
            dataSource.filter('priorityId', '=', 1);

            appointmentDataProvider.filterByDate(new Date(2015, 0, 1, 1), new Date(2015, 0, 2), true);

            assert.equal(dataSource.filter().length, 2);
            assert.deepEqual(dataSource.filter()[1], ['priorityId', '=', 1]);

            dataSource.filter(null);

            appointmentDataProvider.filterByDate(new Date(2015, 0, 1, 1), new Date(2015, 0, 2), true);

            assert.equal(dataSource.filter().length, 1);
        });
    });

    test('Appointment filterByDate should filter dataSource correctly without copying dateFilter', function(assert) {
        const dateFilter = [
            [
                ['endDate', '>=', new Date(2015, 1, 9, 0)],
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

        const { appointmentDataProvider } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: defaultDataAccessors
        });

        appointmentDataProvider.filterByDate(new Date(2015, 1, 9, 0), new Date(2015, 1, 10, 13), true);

        const expectedFilter = [dateFilter, [
            'text',
            '=',
            'Appointment 2'
        ]];

        const actualFilter = dataSource.filter();

        assert.deepEqual(expectedFilter, actualFilter, 'filter is right');
    });

    test('Appointment filterByDate should return filter with dateSerializationFormat and without forceIsoDateParsing', function(assert) {
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
            const { appointmentDataProvider } = createAppointmentDataProvider({
                key: 0,
                dataSource,
                isVirtualScrolling: false,
                dataAccessors: {
                    expr: {
                        startDateExpr: 'startDate',
                        endDateExpr: 'endDate'
                    }
                }
            });

            appointmentDataProvider.filterByDate(new Date(2015, 1, 10, 10), new Date(2015, 1, 10, 13), true, 'yyyy-MM-ddTHH:mm:ss');

            const expectedFilter = [[
                [
                    ['endDate', '>=', new Date(2015, 1, 10)],
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

    test('Appointment filterByDate should return filter with dateSerializationFormat and forceIsoDateParsing', function(assert) {
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
            const { appointmentDataProvider } = createAppointmentDataProvider({
                key: 0,
                dataSource,
                isVirtualScrolling: false,
                dataAccessors: {
                    expr: {
                        startDateExpr: 'startDate',
                        endDateExpr: 'endDate'
                    }
                }
            });

            appointmentDataProvider.filterByDate(new Date(2015, 1, 10, 10), new Date(2015, 1, 10, 13), true, 'yyyy-MM-ddTHH:mm:ss');

            const expectedFilter = [[
                [
                    ['endDate', '>=', '2015-02-10T00:00:00'],
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


    test('Start date of appt lower than first filter date & end appt date higher than second filter date', function(assert) {
        const data = [{
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        },
        {
            text: 'Appointment 2',
            startDate: new Date(2015, 1, 10, 11, 0),
            endDate: new Date(2015, 1, 10, 13, 0)
        }];

        const dataSource = new DataSource({
            store: data,
        });
        const { appointmentDataProvider } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: defaultDataAccessors
        });

        appointmentDataProvider.filterByDate(new Date(2015, 1, 10, 11, 5), new Date(2015, 1, 10, 11, 45), true);
        dataSource.load();

        assert.deepEqual(dataSource.items(), [data[1]], 'filterByDate work correctly');
    });

    test('Appointment should be filtered correctly by custom startDate field', function(assert) {
        const dataSource = new DataSource({
            store: [{
                text: 'Appointment 1',
                Start: new Date(2015, 1, 12, 5),
                End: new Date(2015, 1, 12, 5, 30)
            }]
        });

        const { appointmentDataProvider } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
                getter: {
                    startDate: compileGetter('Start'),
                    endDate: compileGetter('End'),
                },
                setter: {
                    startDate: compileSetter('Start'),
                    endDate: compileSetter('End'),
                },
                expr: {
                    startDateExpr: 'Start',
                    endDateExpr: 'End'
                }
            }
        });

        appointmentDataProvider.filterByDate(new Date(2015, 1, 9), new Date(2015, 1, 20));
        dataSource.load();

        assert.equal(dataSource.items().length, 1, 'filterByDate works correctly with custom dateField');
    });

    test('AllDay appointment should not be filtered by min date in range', function(assert) {
        const tasks = [{
            text: 'Appointment 2',
            startDate: new Date(2015, 1, 10, 11, 0),
            endDate: new Date(2015, 1, 10, 11, 30),
            AllDay: true
        }];

        const dataSource = new DataSource({
            store: tasks
        });

        const { appointmentDataProvider } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
                getter: {
                    startDate: compileGetter('startDate'),
                    endDate: compileGetter('endDate'),
                    allDay: compileGetter('AllDay'),
                },
                setter: {
                    startDate: compileSetter('startDate'),
                    endDate: compileSetter('endDate'),
                    allDay: compileSetter('AllDay'),
                },
                expr: {
                    startDateExpr: 'startDate',
                    endDateExpr: 'endDate',
                    allDayExpr: 'AllDay'
                }
            }
        });

        appointmentDataProvider.filterByDate(new Date(2015, 1, 10, 12), new Date(2015, 1, 11), true);
        dataSource.load();

        assert.deepEqual(dataSource.items(), [tasks[0]], 'filterByDate works correctly');
    });

    test('AllDay appointment should be filtered when its endDate is equal to filter min', function(assert) {
        const tasks = [{
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 10),
            endDate: new Date(2015, 1, 11),
            allDay: true
        }];
        const dataSource = new DataSource({
            store: tasks
        });

        const { appointmentDataProvider } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
                getter: {
                    startDate: compileGetter('startDate'),
                    endDate: compileGetter('endDate'),
                    allDay: compileGetter('AllDay'),
                },
                setter: {
                    startDate: compileSetter('startDate'),
                    endDate: compileSetter('endDate'),
                    allDay: compileSetter('AllDay'),
                },
                expr: {
                    startDateExpr: 'startDate',
                    endDateExpr: 'endDate',
                    allDayExpr: 'AllDay'
                }
            }
        });

        appointmentDataProvider.filterByDate(new Date(2015, 1, 11), new Date(2015, 1, 11, 11), true);
        dataSource.load();

        assert.equal(dataSource.items().length, 1, 'filterByDate works correctly');
    });

    test('Appointment filterByDate should correctly filter items with recurrenceRule, if recurrenceRuleExpr!=null', function(assert) {
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
            }
        ];

        const dataSource = new DataSource({
            store: recurrentAppts
        });
        const { appointmentDataProvider } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
                getter: {
                    startDate: compileGetter('startDate'),
                    endDate: compileGetter('endDate'),
                    allDay: compileGetter('AllDay'),
                    recurrenceRule: compileGetter('_recurrenceRule'),
                },
                setter: {
                    startDate: compileSetter('startDate'),
                    endDate: compileSetter('endDate'),
                    allDay: compileSetter('AllDay'),
                    recurrenceRule: compileSetter('_recurrenceRule'),
                },
                expr: {
                    startDateExpr: 'startDate',
                    endDateExpr: 'endDate',
                    allDayExpr: 'AllDay',
                    recurrenceRuleExpr: '_recurrenceRule'
                }
            }
        });

        appointmentDataProvider.filterByDate(new Date(2015, 1, 10), new Date(2015, 1, 10, 13), true);
        dataSource.load();

        assert.deepEqual(dataSource.items(), recurrentAppts, 'filterByDate works correctly');
    });

    test('Appointment filterByDate should ignore items with recurrenceRule, if recurrenceRuleExpr=null', function(assert) {
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
        const { appointmentDataProvider } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
                getter: {
                    startDate: compileGetter('startDate'),
                    endDate: compileGetter('endDate'),
                    allDay: compileGetter('allDay'),
                },
                setter: {
                    startDate: compileSetter('startDate'),
                    endDate: compileSetter('endDate'),
                    allDay: compileSetter('allDay'),
                },
                expr: {
                    startDateExpr: 'startDate',
                    endDateExpr: 'endDate',
                    allDayExpr: 'allDay',
                    recurrenceRuleExpr: null
                }
            }
        });

        appointmentDataProvider.filterByDate(new Date(2015, 1, 10), new Date(2015, 1, 10, 13), true);
        dataSource.load();

        assert.deepEqual(dataSource.items(), [appts[1]], 'filterByDate works correctly');
        assert.equal(dataSource.filter()[0].length, 3, 'filter is correct');
    });

    test('Appointment filterByDate should ignore items with recurrenceRule, if recurrenceRuleExpr=\'\'', function(assert) {
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
        const { appointmentDataProvider } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
                getter: {
                    startDate: compileGetter('startDate'),
                    endDate: compileGetter('endDate'),
                    allDay: compileGetter('allDay'),
                },
                setter: {
                    startDate: compileSetter('startDate'),
                    endDate: compileSetter('endDate'),
                    allDay: compileSetter('allDay'),
                },
                expr: {
                    startDateExpr: 'startDate',
                    endDateExpr: 'endDate',
                    allDayExpr: 'allDay',
                    recurrenceRuleExpr: ''
                }
            }
        });

        appointmentDataProvider.filterByDate(new Date(2015, 1, 10), new Date(2015, 1, 10, 13), true);
        dataSource.load();

        assert.deepEqual(dataSource.items(), [appts[1]], 'filterByDate works correctly');
        assert.equal(dataSource.filter()[0].length, 3, 'filter is correct');
    });

    test('Appointment should be loaded if date range equals to 24 hours', function(assert) {
        const appts = [{
            text: 'Appointment 1',
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        }];

        const dataSource = new DataSource({
            store: appts
        });
        const { appointmentDataProvider } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
                getter: {
                    startDate: compileGetter('startDate'),
                    endDate: compileGetter('endDate'),
                    allDay: compileGetter('allDay'),
                },
                setter: {
                    startDate: compileSetter('startDate'),
                    endDate: compileSetter('endDate'),
                    allDay: compileSetter('allDay'),
                },
                expr: {
                    startDateExpr: 'startDate',
                    endDateExpr: 'endDate',
                    allDayExpr: 'allDay',
                    recurrenceRuleExpr: ''
                }
            }
        });

        appointmentDataProvider.filterByDate(new Date(2015, 1, 9, 0), new Date(2015, 1, 9, 23, 59));
        dataSource.load();

        assert.deepEqual(dataSource.items(), [appts[0]], 'filterByDate works correctly');
    });

    test('Scheduler filter expression must be saved, after a user override the filter', function(assert) {
        const appointments = [
            { text: 'a', StartDate: new Date(2015, 0, 1, 1), EndDate: new Date(2015, 0, 1, 2), priorityId: 2 },
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6, 0), priorityId: 1 },
            { text: 'c', StartDate: new Date(2015, 0, 1, 8), EndDate: new Date(2015, 0, 1, 9), priorityId: 1 }
        ];

        const dataSource = new DataSource({
            store: appointments
        });

        const {
            appointmentDataProvider,
            prepareDataItems
        } = createAppointmentDataProvider({
            dataSource,
            dataAccessors: {
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
            },
            getIsVirtualScrolling: () => false,
        });

        appointmentDataProvider.filterByDate(new Date(2015, 0, 1, 0), new Date(2015, 0, 3));
        dataSource.load();

        dataSource.filter('priorityId', '=', 1);


        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 1, 0),
            max: new Date(2015, 0, 3),
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6), priorityId: 1 }], 'Appointments are OK');
    });

    test('User filter must be constantly overwritten', function(assert) {
        const appointments = [
            { text: 'a', StartDate: new Date(2014, 11, 29, 1), EndDate: new Date(2014, 11, 29, 2), priorityId: 2 },
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30), EndDate: new Date(2015, 0, 1, 6, 0), priorityId: 1 },
            { text: 'c', StartDate: new Date(2015, 0, 1, 8), EndDate: new Date(2015, 0, 1, 9), priorityId: 1 }
        ];

        const dataSource = new DataSource({
            store: appointments,
            filter: ['priorityId', '=', 1]
        });

        const { appointmentDataProvider } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            }
        });

        appointmentDataProvider.filterByDate(new Date(2015, 0, 1, 0), new Date(2015, 0, 3), true);
        dataSource.load();

        const existingFilter = dataSource.filter();
        const newUserFilter = ['priorityId', '=', 2];

        existingFilter[1] = newUserFilter;
        dataSource.filter(existingFilter);
        appointmentDataProvider.filterByDate(new Date(2014, 11, 29, 0), new Date(2014, 11, 30), true);
        dataSource.load();

        assert.deepEqual(dataSource.items(), [{ text: 'a', StartDate: new Date(2014, 11, 29, 1), EndDate: new Date(2014, 11, 29, 2), priorityId: 2 }], 'Appointments are OK');
    });
}
);

module('Client side after filtering', () => {
    test('Loaded appointments should be filtered by start & end day hours', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            }
        });

        appointmentDataProvider.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 2).toString() });
        appointmentDataProvider.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6, 0).toString() });
        appointmentDataProvider.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            min: new Date(2015, 0, 1),
            max: new Date(2015, 0, 1),
            startDayHour: 3,
            endDayHour: 7,
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() }], 'Appointments are OK');
    });

    test('Loaded appointments on the borders should be filtered by start & end day hours', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            }
        });

        appointmentDataProvider.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 3).toString() });
        appointmentDataProvider.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 45).toString(), EndDate: new Date(2015, 0, 1, 3, 50).toString() });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            min: new Date(2015, 0, 1),
            max: new Date(2015, 0, 1),
            startDayHour: 3,
            endDayHour: 7,
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 45).toString(), EndDate: new Date(2015, 0, 1, 3, 50).toString() }], 'Appointments are OK. Appointment \'a\' was filtered');
    });

    test('Loaded appointments should be filtered by decimal start & end day hours', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            }
        });

        appointmentDataProvider.add({ text: 'a', StartDate: new Date(2015, 0, 1, 3).toString(), EndDate: new Date(2015, 0, 1, 3, 10).toString() });
        appointmentDataProvider.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 40).toString(), EndDate: new Date(2015, 0, 1, 7, 20).toString() });
        appointmentDataProvider.add({ text: 'c', StartDate: new Date(2015, 0, 1, 7, 35).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            min: new Date(2015, 0, 1),
            max: new Date(2015, 0, 1),
            startDayHour: 3.5,
            endDayHour: 7.5,
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 40).toString(), EndDate: new Date(2015, 0, 1, 7, 20).toString() }], 'Appointments are OK');
    });

    test('Loaded appointments should be filtered by recurrence rule', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            },
            timeZoneCalculator: {
                getOriginStartDateOffsetInMs: () => 0,
            },
        });

        appointmentDataProvider.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 2).toString() });
        appointmentDataProvider.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() });
        appointmentDataProvider.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });
        appointmentDataProvider.add({ text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=WE' });
        appointmentDataProvider.add({ text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), RecRule: 'FREQ=WEEKLY,BYDAY=TH' });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2014, 11, 31).toString(),
            max: new Date(2015, 0, 1, 23, 59).toString(),
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() },
            { text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=WE' }
        ], 'Appointments are OK');
    });

    test('Loaded appointments should be filtered by recurrence rule correctly, if appointment startDate.getHours < starDayHour', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            },
            timeZoneCalculator: {
                getOriginStartDateOffsetInMs: () => 0,
            },
        });

        appointmentDataProvider.add({ text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' });
        appointmentDataProvider.add({ text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 5, 3, 0).toString(),
            max: new Date(2015, 0, 11, 7, 0).toString(),
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [
            { text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' },
            { text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' }
        ], 'Appointments are OK');
    });

    test('Loaded appointments should be filtered by recurrence rule correctly for day interval', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            },
            timeZoneCalculator: {
                getOriginStartDateOffsetInMs: () => 0,
            },
        });

        appointmentDataProvider.add({ text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' });
        appointmentDataProvider.add({ text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 5, 3, 0).toString(),
            max: new Date(2015, 0, 5, 7, 0).toString(),
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [
            { text: 'a', StartDate: new Date(2015, 0, 5, 2, 0).toString(), EndDate: new Date(2015, 0, 5, 4, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' },
            { text: 'b', StartDate: new Date(2015, 0, 5, 6, 0).toString(), EndDate: new Date(2015, 0, 5, 8, 0).toString(), RecRule: 'FREQ=WEEKLY;BYDAY=MO' }
        ], 'Appointments are OK');
    });

    test('Loaded appointments should not be filtered by recurrence rule, if recurrenceRuleExpr = null', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            }
        });

        appointmentDataProvider.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 2).toString() });
        appointmentDataProvider.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() });
        appointmentDataProvider.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });
        appointmentDataProvider.add({ text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' });
        appointmentDataProvider.add({ text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), recurrenceRule: 'FREQ=WEEKLY,BYDAY=TH' });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 1),
            max: new Date(2015, 11, 27),
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() },
            { text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
            { text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), recurrenceRule: 'FREQ=WEEKLY,BYDAY=TH' }
        ], 'Appointments are OK');
    });

    test('Loaded appointments should not be filtered by recurrence rule, if recurrenceRuleExpr = ""', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            }
        });

        appointmentDataProvider.add({ text: 'a', StartDate: new Date(2015, 0, 1, 1).toString(), EndDate: new Date(2015, 0, 1, 2).toString() });
        appointmentDataProvider.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() });
        appointmentDataProvider.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });
        appointmentDataProvider.add({ text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' });
        appointmentDataProvider.add({ text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), recurrenceRule: 'FREQ=WEEKLY,BYDAY=TH' });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            min: new Date(2015, 0, 1),
            max: new Date(2015, 11, 27),
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [
            { text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString() },
            { text: 'd', StartDate: new Date(2014, 11, 31).toString(), EndDate: new Date(2015, 11, 31, 4).toString(), recurrenceRule: 'FREQ=WEEKLY;BYDAY=WE' },
            { text: 'e', StartDate: new Date(2015, 11, 27).toString(), EndDate: new Date(2015, 11, 27, 4).toString(), recurrenceRule: 'FREQ=WEEKLY,BYDAY=TH' }
        ], 'Appointments are OK');
    });

    test('Loaded appointments should be filtered by resources', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
                getter: {
                    startDate: compileGetter('StartDate'),
                    endDate: compileGetter('EndDate'),
                    recurrenceRule: compileGetter('RecRule'),
                    recurrenceException: compileGetter('RecException'),
                    allDay: compileGetter('AllDay'),
                    startDateTimeZone: compileGetter('StartDateTimeZone'),
                    endDateTimeZone: compileGetter('EndDateTimeZone'),
                },
                expr: {
                    startDateExpr: 'StartDate',
                    endDateExpr: 'EndDate',
                    allDayExpr: 'AllDay',
                    recurrenceRuleExpr: 'RecRule',
                    recurrenceExceptionExpr: 'RecException'
                },
                resources: {
                    getter: {
                        ownerId: compileGetter('ownerId'),
                        roomId: compileGetter('roomId')
                    }
                }
            }
        });

        appointmentDataProvider.add({ text: 'a', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: [1, 2] });
        appointmentDataProvider.add({ text: 'b', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2], managerId: 4 });
        appointmentDataProvider.add({ text: 'c', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 3, roomId: [1, 2] });
        appointmentDataProvider.add({ text: 'd', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2, 3] });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 2,
            endDayHour: 5,
            min: new Date(2015, 2, 16),
            max: new Date(2015, 2, 17),
            viewOffset: 0,
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
        }, prepareDataItems());

        assert.deepEqual(appts, [
            { text: 'b', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2], managerId: 4 },
            { text: 'd', StartDate: new Date(2015, 2, 16, 2), EndDate: new Date(2015, 2, 16, 2, 30), ownerId: 1, roomId: [1, 2, 3] }
        ], 'Appointments are OK');
    });

    test('Loaded appointments should be filtered by allDay field', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            }
        });

        appointmentDataProvider.add({ text: 'a', StartDate: new Date(2015, 0, 1, 4).toString(), EndDate: new Date(2015, 0, 1, 6).toString(), AllDay: true });
        appointmentDataProvider.add({ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString(), AllDay: false });
        appointmentDataProvider.add({ text: 'c', StartDate: new Date(2015, 0, 1, 8).toString(), EndDate: new Date(2015, 0, 1, 9).toString() });
        appointmentDataProvider.add({ text: 'd', StartDate: new Date(2015, 0, 1, 4).toString(), EndDate: new Date(2015, 0, 3, 6).toString() });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 7,
            allDay: false,
            min: new Date(2015, 0, 1, 3),
            max: new Date(2015, 0, 1, 8),
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [{ text: 'b', StartDate: new Date(2015, 0, 1, 3, 30).toString(), EndDate: new Date(2015, 0, 1, 6).toString(), AllDay: false }], 'Appointments are OK');
    });

    test('Loaded recurrent allDay appointments should not be filtered by start/endDayHour', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            },
            timeZoneCalculator: {
                getOriginStartDateOffsetInMs: () => 0,
            },
        });

        appointmentDataProvider.add({ text: 'a', StartDate: new Date(2015, 0, 1).toString(), EndDate: new Date(2015, 0, 2).toString(), AllDay: true, RecurrenceRule: 'FREQ=DAILY' });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 3,
            endDayHour: 10,
            min: new Date(2015, 0, 1, 3),
            max: new Date(2015, 0, 1, 9, 59),
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [{ text: 'a', StartDate: new Date(2015, 0, 1).toString(), EndDate: new Date(2015, 0, 2).toString(), AllDay: true, RecurrenceRule: 'FREQ=DAILY' }], 'Appointments are OK');
    });

    [
        { visible: true, expectedVisibility: true },
        { visible: false, expectedVisibility: false },
        { visible: null, expectedVisibility: true },
        { visible: undefined, expectedVisibility: true },
    ].forEach(({ visible, expectedVisibility }) => {
        test(`Appointment should be correctly filtered by visible state if visible=${visible}`, function(assert) {
            const dataSource = new DataSource({ store: [] });
            const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
                dataSource,
                isVirtualScrolling: false,
                dataAccessors: {
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
                },
                timeZoneCalculator: {
                    getOriginStartDateOffsetInMs: () => 0,
                },
            });

            appointmentDataProvider.add({
                text: 'a',
                StartDate: new Date(2015, 0, 1).toString(),
                EndDate: new Date(2015, 0, 2).toString(),
                AllDay: true,
                RecurrenceRule: 'FREQ=DAILY',
                visible
            });

            const appts = appointmentDataProvider.filterLoadedAppointments({
                startDayHour: 3,
                endDayHour: 10,
                min: new Date(2015, 0, 1, 3),
                max: new Date(2015, 0, 1, 9, 59),
                viewOffset: 0,
            }, prepareDataItems());

            assert.equal(!!appts.length, expectedVisibility, 'Filtered correctly');
        });
    });

    test('Appointment should be filtered if startDate, endDate are at the edge of the trimmed end view date', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: defaultDataAccessors
        });

        appointmentDataProvider.add({
            text: 'a',
            startDate: new Date(2020, 6, 16, 0),
            endDate: new Date(2020, 6, 16, 1),
        });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 0,
            endDayHour: 24,
            min: new Date(2020, 6, 15),
            max: new Date(2020, 6, 15, 23, 59),
            viewOffset: 0,
        }, prepareDataItems());

        assert.ok(!appts.length, 'Filtered');
    });

    test('The part of long appointment should be filtered by start/endDayHour, with endDate < startDayHour(T339519)', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            }
        });

        appointmentDataProvider.add({
            text: 'a',
            StartDate: new Date(2015, 2, 1, 10, 30),
            EndDate: new Date(2015, 2, 2, 5, 0)
        });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 1,
            viewStartDayHour: 1,
            endDayHour: 10,
            viewEndDayHour: 10,
            min: new Date(2015, 1, 23, 1, 0),
            max: new Date(2015, 2, 1, 9, 59),
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [], 'Appointments are OK');
    });

    test('The part of long appointment should be filtered by start/endDayHour, with startDate < startDayHour(T339519)', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            }
        });

        appointmentDataProvider.add({
            text: 'a',
            StartDate: new Date(2015, 2, 1, 7, 0),
            EndDate: new Date(2015, 2, 2, 0, 30)
        });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 1,
            endDayHour: 10,
            min: new Date(2015, 2, 2, 1, 0),
            max: new Date(2015, 2, 8, 9, 59),
            viewOffset: 0,
            supportMultiDayAppointments: true
        }, prepareDataItems());

        assert.deepEqual(appts, [], 'Appointments are OK');
    });

    test('Appointment between days should be filtered by start/endDayHour (T339519)', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            }
        });

        appointmentDataProvider.add({
            text: 'a',
            StartDate: new Date(2015, 2, 1, 11, 0),
            EndDate: new Date(2015, 2, 2, 1, 0)
        });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 1,
            endDayHour: 10,
            min: new Date(2015, 2, 1, 1, 0),
            max: new Date(2015, 2, 8, 9, 59),
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts, [], 'Appointments are OK');
    });

    test('Wrong endDate of appointment should be replaced before filtering', function(assert) {
        const dataSource = new DataSource({ store: [] });
        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            },
            appointmentDuration: 60
        });

        appointmentDataProvider.add({
            text: 'a',
            StartDate: new Date(2015, 2, 1, 11, 0),
            EndDate: new Date(2015, 2, 1, 1, 0)
        });

        const appts = appointmentDataProvider.filterLoadedAppointments({
            startDayHour: 0,
            endDayHour: 24,
            min: new Date(2015, 2, 1),
            max: new Date(2015, 2, 8),
            viewOffset: 0,
        }, prepareDataItems());

        assert.deepEqual(appts[0].EndDate, new Date(2015, 2, 1, 12, 0), 'EndDate of appointment should be replaced by correct value');
    });
});

module('API', () => {
    [
        {
            item: {
                text: 'all day appointment',
                StartDate: new Date(2015, 2, 1, 11, 0),
                AllDay123: true
            },
            expected: true
        },
        {
            item: {
                text: 'not all day appointment',
                StartDate: new Date(2015, 2, 1, 11, 0),
            },
            expected: false
        },
        {
            item: {
                text: 'not all day appointment',
                StartDate: new Date(2015, 2, 1, 11, 0),
                allDay: true
            },
            expected: false
        }
    ].forEach(({ item, expected }) => {
        test(`hasAllDayAppointments() should return correct result if all day is ${expected}`, function(assert) {
            const dataSource = new DataSource({ store: [] });
            const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
                key: 0,
                dataSource,
                isVirtualScrolling: false,
                dataAccessors: {
                    getter: {
                        startDate: compileGetter('StartDate'),
                        endDate: compileGetter('EndDate'),
                        allDay: compileGetter('AllDay123'),
                    },
                    setter: {
                        startDate: compileSetter('StartDate'),
                        endDate: compileSetter('EndDate')
                    },
                    expr: {
                        startDateExpr: 'StartDate',
                        endDateExpr: 'EndDate',
                        allDayExpr: 'AllDay123',
                    }
                },
                appointmentDuration: 60
            });

            appointmentDataProvider.add(item);

            const result = appointmentDataProvider.hasAllDayAppointments([item], prepareDataItems());

            assert.equal(result, expected, 'Result is corrects');
        });
    });
});

module('Virtual Scrolling', () => {
    test('Appointment model should take into account startDayHour, endDayHour of the current view', function(assert) {
        const appointments = [
            {
                text: 'a',
                StartDate: new Date(2021, 8, 6, 9, 30),
                EndDate: new Date(2021, 8, 6, 11, 30)
            }
        ];

        const dataSource = new DataSource({
            store: appointments
        });

        const { appointmentDataProvider, prepareDataItems } = createAppointmentDataProvider({
            key: 0,
            dataSource,
            isVirtualScrolling: false,
            dataAccessors: {
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
            }
        });

        appointmentDataProvider.filterByDate(new Date(2021, 8, 6, 9), new Date(2021, 8, 6, 12));

        dataSource.load().done(() => {
            dataSource.filter('priorityId', '=', 1);

            appointmentDataProvider.filterByDate(new Date(2021, 8, 6, 9), new Date(2021, 8, 6, 12));

            const result = appointmentDataProvider.filterLoadedAppointments({
                startDayHour: 9,
                endDayHour: 11,
                viewStartDayHour: 9,
                viewEndDayHour: 18,
                min: new Date(2021, 8, 6, 9),
                max: new Date(2021, 8, 6, 18),
                viewOffset: 0,
                allDay: false
            }, prepareDataItems());

            assert.deepEqual(result, appointments, 'Items feltered correcly');
        });
    });
});
