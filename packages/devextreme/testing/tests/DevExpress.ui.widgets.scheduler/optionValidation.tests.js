import $ from 'jquery';
import consoleUtils from 'core/utils/console';

import '__internal/scheduler/m_scheduler';

const {
    test,
    module,
    testStart
} = QUnit;

const SELECTORS = {
    fixture: '#qunit-fixture',
    scheduler: '#dx-scheduler',
};

const createScheduler = (options) => $(SELECTORS.scheduler).dxScheduler({
    dateSource: [],
    ...options,
}).dxScheduler('instance');

const setupConsoleSpy = () => {
    const errors = [];
    const stub = sinon.stub(consoleUtils.logger, 'error').callsFake((error) => {
        errors.push(error);
    });

    return [stub, errors];
};

const assertConsoleErrors = (assert, consoleErrors, expectedErrors) => {
    try {
        assert.equal(consoleErrors.length, expectedErrors.length);

        expectedErrors.forEach((expectedErrorCode, idx) => {
            const errorExists = consoleErrors[idx].startsWith(expectedErrorCode);
            assert.ok(errorExists);
        });
    } catch(error) {}
};

testStart(function() {
    $(SELECTORS.fixture).html(`<div id="${SELECTORS.scheduler.slice(1)}"></div>`);
});

const GENERAL_TEST_CASES = [
    // startDayHour & endDayHour
    {
        options: { startDayHour: 9, endDayHour: 10 },
        expectedErrors: [],
    },
    {
        options: { startDayHour: 0, endDayHour: 1 },
        expectedErrors: [],
    },
    {
        options: { startDayHour: 23, endDayHour: 24 },
        expectedErrors: [],
    },
    {
        options: { },
        expectedErrors: [],
    },
    {
        options: { startDayHour: 10, endDayHour: 9 },
        expectedErrors: ['E1058', 'E1062'],
    },
    {
        options: { startDayHour: 1.5 },
        expectedErrors: ['E1058'],
    },
    {
        options: { endDayHour: 1.5 },
        expectedErrors: ['E1058'],
    },
    {
        options: { startDayHour: 1.5, endDayHour: 2.5 },
        expectedErrors: ['E1058'],
    },
    {
        options: { startDayHour: -1 },
        expectedErrors: ['E1058'],
    },
    {
        options: { endDayHour: -1 },
        expectedErrors: ['E1058', 'E1062'],
    },
    {
        options: { startDayHour: -10, endDayHour: -5 },
        expectedErrors: ['E1058'],
    },
    {
        options: { startDayHour: 25 },
        expectedErrors: ['E1058', 'E1062'],
    },
    {
        options: { endDayHour: 25 },
        expectedErrors: ['E1058'],
    },
    {
        options: { startDayHour: 0, endDayHour: 0 },
        expectedErrors: ['E1058', 'E1062'],
    },
    {
        options: { startDayHour: 10, endDayHour: 10 },
        expectedErrors: ['E1058', 'E1062'],
    },
    // offset
    {
        options: { offset: 0 },
        expectedErrors: [],
    },
    {
        options: { offset: 120 },
        expectedErrors: [],
    },
    {
        options: { offset: -120 },
        expectedErrors: [],
    },
    {
        options: { offset: 1440 },
        expectedErrors: [],
    },
    {
        options: { offset: -1440 },
        expectedErrors: [],
    },
    {
        options: { offset: 33 },
        expectedErrors: ['E1061'],
    },
    {
        options: { offset: -33 },
        expectedErrors: ['E1061'],
    },
    {
        options: { offset: 1470 },
        expectedErrors: ['E1061'],
    },
    {
        options: { offset: -1470 },
        expectedErrors: ['E1061'],
    },
    // cellDuration
    {
        options: { cellDuration: 30 },
        expectedErrors: [],
    },
    {
        options: { cellDuration: 60 },
        expectedErrors: [],
    },
    {
        options: { startDayHour: 21, endDayHour: 23, cellDuration: 3 },
        expectedErrors: [],
    },
    {
        options: { startDayHour: 0, endDayHour: 1, cellDuration: 10 },
        expectedErrors: [],
    },
    {
        options: { startDayHour: 0, endDayHour: 2, cellDuration: 40 },
        expectedErrors: [],
    },
    {
        options: { startDayHour: 10, endDayHour: 15, cellDuration: 25 },
        expectedErrors: [],
    },
    {
        options: { cellDuration: -10 },
        expectedErrors: ['E1062'],
    },
    {
        options: { cellDuration: 59 },
        expectedErrors: ['E1062'],
    },
    {
        options: { startDayHour: 1, endDayHour: 2, cellDuration: 120 },
        expectedErrors: ['E1062'],
    },
    {
        options: { startDayHour: 1, endDayHour: 3, cellDuration: 25 },
        expectedErrors: ['E1062'],
    },
    {
        options: { startDayHour: 10, endDayHour: 18, cellDuration: 44 },
        expectedErrors: ['E1062'],
    },
];

const COMPLEX_CASES = [
    {
        options: { startDayHour: 25, endDayHour: 26 },
        expectedErrors: ['E1058'],
    },
    {
        options: { startDayHour: -2, endDayHour: -1, offset: 1, cellDuration: 7 },
        expectedErrors: ['E1058', 'E1061', 'E1062'],
    },
    {
        options: { startDayHour: 0.5, endDayHour: 1.5, offset: 1, },
        expectedErrors: ['E1058', 'E1061'],
    },
    {
        options: { startDayHour: -1, endDayHour: 2, offset: -1, },
        expectedErrors: ['E1058', 'E1061'],
    },
];

module('Initialization', () => {
    GENERAL_TEST_CASES
        .concat(COMPLEX_CASES)
        .forEach(({ options, expectedErrors }) => {
            test(`Should log option validation errors (options: ${JSON.stringify(options)}, errors: ${JSON.stringify(expectedErrors)}).`, function(assert) {
                const [stub, consoleErrors] = setupConsoleSpy();

                try {
                    createScheduler(options);
                } catch(error) {
                    consoleErrors.push(error.message);
                }

                assertConsoleErrors(assert, consoleErrors, expectedErrors);
                stub.restore();
            });
        });
});

module('Change options', () => {
    GENERAL_TEST_CASES.forEach(({ options, expectedErrors }) => {
        test(`Should log option validation errors (options: ${JSON.stringify(options)}, errors: ${JSON.stringify(expectedErrors)}).`, function(assert) {
            const [stub, consoleErrors] = setupConsoleSpy();
            const scheduler = createScheduler();

            try {
                Object.entries(options).forEach(([name, value]) => {
                    scheduler.option(name, value);
                });
            } catch(error) {
                consoleErrors.push(error.message);
            }

            assertConsoleErrors(assert, consoleErrors, expectedErrors);
            stub.restore();
        });
    });
});

module('Runtime', () => {
    test('Should validate only current view options', function(assert) {
        const expectedErrors = ['E1061', 'E1058', 'E1062'];
        const [stub, consoleErrors] = setupConsoleSpy();
        const scheduler = createScheduler({
            views: [
                'week',
                {
                    name: 'myView',
                    type: 'week',
                    startDayHour: 10,
                    endDayHour: 9,
                    offset: -1,
                    cellDuration: 99,
                },
            ],
            currentView: 'week',
            startDayHour: 9,
            endDayHour: 10,
            cellDuration: 30,
            offset: 120,
        });

        assert.notOk(consoleErrors.length);

        try {
            scheduler.option('currentView', 'myView');
        } catch(error) {
            consoleErrors.push(error.message);
        }

        assertConsoleErrors(assert, consoleErrors, expectedErrors);
        stub.restore();
    });

    test('Should validate views nested options if this view is current', function(assert) {
        const expectedErrors = ['E1061'];
        const [stub, consoleErrors] = setupConsoleSpy();


        try {
            createScheduler({
                views: [
                    'week',
                    {
                        name: 'myView',
                        type: 'week',
                        offset: 1,
                    },
                ],
                currentView: 'myView',
                startDayHour: 9,
                endDayHour: 10,
                cellDuration: 30,
                offset: 120,
            });
        } catch(error) {
            consoleErrors.push(error.message);
        }

        assertConsoleErrors(assert, consoleErrors, expectedErrors);
        stub.restore();
    });
});


