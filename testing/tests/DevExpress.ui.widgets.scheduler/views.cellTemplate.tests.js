import $ from 'jquery';
import fx from 'animation/fx';
import { isRenderer } from 'core/utils/type';
import config from 'core/config';
import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';

const {
    module,
    testStart,
    test
} = QUnit;


testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach: function() {
        fx.off = true;
    },
    afterEach: function() {
        fx.off = false;
    }
};


module('CellTemplate tests', moduleConfig, () => {
    const dataCells = [{
        data: {
            startDate: new Date(2020, 7, 23, 0),
            endDate: new Date(2020, 7, 23, 1),
            allDay: undefined,
            groupIndex: undefined,
            groups: undefined,
            text: '',
        },
        index: 0,
    }, {
        data: {
            startDate: new Date(2020, 7, 24, 0),
            endDate: new Date(2020, 7, 24, 1),
            allDay: undefined,
            groupIndex: undefined,
            groups: undefined,
            text: '',
        },
        index: 1,
    }, {
        data: {
            startDate: new Date(2020, 7, 25, 0),
            endDate: new Date(2020, 7, 25, 1),
            allDay: undefined,
            groupIndex: undefined,
            groups: undefined,
            text: '',
        },
        index: 2,
    }, {
        data: {
            startDate: new Date(2020, 7, 26, 0),
            endDate: new Date(2020, 7, 26, 1),
            allDay: undefined,
            groupIndex: undefined,
            groups: undefined,
            text: '',
        },
        index: 3,
    }, {
        data: {
            startDate: new Date(2020, 7, 27, 0),
            endDate: new Date(2020, 7, 27, 1),
            allDay: undefined,
            groupIndex: undefined,
            groups: undefined,
            text: '',
        },
        index: 4,
    }, {
        data: {
            startDate: new Date(2020, 7, 28, 0),
            endDate: new Date(2020, 7, 28, 1),
            allDay: undefined,
            groupIndex: undefined,
            groups: undefined,
            text: '',
        },
        index: 5,
    }, {
        data: {
            startDate: new Date(2020, 7, 29, 0),
            endDate: new Date(2020, 7, 29, 1),
            allDay: undefined,
            groupIndex: undefined,
            groups: undefined,
            text: '',
        },
        index: 6,
    }];

    const firstGroup = {
        groupIndex: 0,
        groups: { ownerId: 1 },
    };
    const secondGroup = {
        groupIndex: 1,
        groups: { ownerId: 2 },
    };
    const groupedCells = [{
        ...firstGroup,
        index: 0,
    }, {
        ...firstGroup,
        index: 1,
    }, {
        ...firstGroup,
        index: 2,
    }, {
        ...firstGroup,
        index: 3,
    }, {
        ...firstGroup,
        index: 4,
    }, {
        ...firstGroup,
        index: 5,
    }, {
        ...firstGroup,
        index: 6,
    }, {
        ...secondGroup,
        index: 0,
    }, {
        ...secondGroup,
        index: 1
    }, {
        ...secondGroup,
        index: 2
    }, {
        ...secondGroup,
        index: 3,
    }, {
        ...secondGroup,
        index: 4,
    }, {
        ...secondGroup,
        index: 5,
    }, {
        ...secondGroup,
        index: 6,
    }];

    const resources = [
        {
            fieldExpr: 'ownerId',
            dataSource: [
                { id: 1, text: 'John' },
                { id: 2, text: 'Mike' }
            ]
        }
    ];

    const checkGroups = (assert, expectedTemplateOptions, templateOptions) => {
        expectedTemplateOptions.forEach((expectedSingleTemplateOptions, templateIndex) => {
            const singleTemplateOptions = templateOptions[templateIndex];
            const { index, groupIndex, groups } = singleTemplateOptions;
            const { index: expectedIndex, groupIndex: expectedGroupIndex, groups: expectedGroups } = expectedSingleTemplateOptions;

            assert.equal(index, expectedIndex, 'Index is correct');
            assert.equal(groupIndex, expectedGroupIndex, 'Group index is correct');
            assert.deepEqual(groups, expectedGroups, 'Groups are correct');
        });
    };

    const viewsBase = [{
        type: 'day',
        dateCellCount: 2,
        intervalCount: 2,
        timeCellCount: 4,
    }, {
        type: 'week',
        dateCellCount: 7,
        intervalCount: 1,
        timeCellCount: 4,
    }, {
        type: 'month',
        dateCellCount: 7,
        intervalCount: 1,
        timeCellCount: 0,
    }, {
        type: 'timelineDay',
        dateCellCount: 2,
        intervalCount: 2,
        timeCellCount: 8,
    }, {
        type: 'timelineWeek',
        dateCellCount: 7,
        intervalCount: 1,
        timeCellCount: 28,
    }, {
        type: 'timelineMonth',
        dateCellCount: 30,
        intervalCount: 1,
        timeCellCount: 0,
    }];

    const totalDateCells = 55;
    const totalTimeCells = 44;

    const checkIfGroupsAreUndefined = (assert) => ({ groups, groupIndex }) => {
        assert.equal(groups, undefined, 'Groups property is undefined');
        assert.equal(groupIndex, undefined, 'GroupIndex property is undefined');
    };

    function getBaseConfig(renovateRender) {
        return {
            currentView: 'day',
            currentDate: new Date(2020, 10, 19),
            resources: [{
                fieldExpr: 'priority',
                allowMultiple: false,
                dataSource: [{
                    text: 'Low Priority',
                    id: 1
                }, {
                    text: 'High Priority',
                    id: 2
                }],
                label: 'Priority',
            }],
            startDayHour: 10,
            endDayHour: 12,
            renovateRender,
        };
    }

    module('Data Cell template', {}, function() {
        const allDayCells = [{
            data: {
                startDate: new Date(2020, 7, 23),
                endDate: new Date(2020, 7, 23),
                allDay: true,
                groupIndex: undefined,
                groups: undefined,
                text: '',
            },
            index: 0,
        }, {
            data: {
                startDate: new Date(2020, 7, 24),
                endDate: new Date(2020, 7, 24),
                allDay: true,
                groupIndex: undefined,
                groups: undefined,
                text: '',
            },
            index: 1,
        }, {
            data: {
                startDate: new Date(2020, 7, 25),
                endDate: new Date(2020, 7, 25),
                allDay: true,
                groupIndex: undefined,
                groups: undefined,
                text: '',
            },
            index: 2,
        }, {
            data: {
                startDate: new Date(2020, 7, 26),
                endDate: new Date(2020, 7, 26),
                allDay: true,
                groupIndex: undefined,
                groups: undefined,
                text: '',
            },
            index: 3,
        }, {
            data: {
                startDate: new Date(2020, 7, 27),
                endDate: new Date(2020, 7, 27),
                allDay: true,
                groupIndex: undefined,
                groups: undefined,
                text: '',
            },
            index: 4,
        }, {
            data: {
                startDate: new Date(2020, 7, 28),
                endDate: new Date(2020, 7, 28),
                allDay: true,
                groupIndex: undefined,
                groups: undefined,
                text: '',
            },
            index: 5,
        }, {
            data: {
                startDate: new Date(2020, 7, 29),
                endDate: new Date(2020, 7, 29),
                allDay: true,
                groupIndex: undefined,
                groups: undefined,
                text: '',
            },
            index: 6,
        }];

        test('Scheduler should have specific dataCellTemplate setting of the view', function(assert) {
            let countCallTemplate1 = 0;
            let countCallTemplate2 = 0;

            createWrapper({
                views: [{
                    type: 'day',
                    dataCellTemplate: function() {
                        countCallTemplate2++;
                    }
                }],
                dataCellTemplate: function() {
                    countCallTemplate1++;
                },
                currentView: 'day'
            });

            assert.equal(countCallTemplate1, 0, 'count call first template');
            assert.notEqual(countCallTemplate2, 0, 'count call second template');
        });

        test('allDayPanel cell with custom dataCellTemplate must open appointment popup when double-clicked (T737506)', function(assert) {
            const scheduler = createWrapper({
                currentDate: new Date(2015, 4, 25),
                views: ['week'],
                currentView: 'week',
                firstDayOfWeek: 1,
                startDayHour: 8,
                endDayHour: 18,
                height: 600,
                dataCellTemplate: function(cellData, index, container) {
                    const wrapper = $('<div>').appendTo(container).addClass('dx-template-wrapper');
                    wrapper.append($('<div>').text(cellData.text).addClass('day-cell'));
                }
            });

            scheduler.instance.option('dataSource', [
                { text: '1', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 26), allDay: true },
                { text: '2', startDate: new Date(2015, 4, 25), endDate: new Date(2015, 4, 26), allDay: true },
            ]);

            const spy = sinon.spy(scheduler.instance, 'showAppointmentPopup');

            const $allDayAppointment = $(scheduler.instance.$element()).find('.dx-scheduler-all-day-appointment').eq(0);
            $allDayAppointment.trigger('dxdblclick');

            assert.ok(spy.calledOnce, 'Method was called');
        });

        test('Data cell should has right content when dataCellTemplate option was change', function(assert) {
            const scheduler = createWrapper({
                currentView: 'week',
                currentDate: new Date(2016, 8, 5),
                firstDayOfWeek: 0,
                dataCellTemplate: function(itemData, index, container) {
                    $(container).addClass('custom-cell-class');
                }
            });

            const $element = scheduler.instance.$element();

            assert.ok($element.find('.custom-cell-class').length > 0, 'class before option changing is ok');

            scheduler.instance.option('dataCellTemplate', function(itemData, index, container) {
                $(container).addClass('new-custom-class');
            });

            assert.ok($element.find('.new-custom-class').length > 0, 'class after option changing is ok');
        });

        [true, false].forEach((renovateRender) => {
            const description = renovateRender
                ? 'Renovated Render'
                : 'Old Render';

            module(description, {}, () => {
                test('dataCellTemplate should have correct options', function(assert) {
                    let templateOptions;

                    createWrapper({
                        currentView: 'week',
                        startDayHour: 5,
                        currentDate: new Date(2016, 8, 5),
                        firstDayOfWeek: 0,
                        groups: ['ownerId'],
                        resources: [
                            {
                                fieldExpr: 'ownerId',
                                dataSource: [
                                    { id: 1, text: 'John' },
                                    { id: 2, text: 'Mike' }
                                ]
                            }
                        ],
                        dataCellTemplate: function(itemData, index, $container) {
                            if(index === 3 && $($container).hasClass('dx-scheduler-date-table-cell') && !templateOptions) {
                                templateOptions = itemData;
                            }
                        },
                        renovateRender,
                    });

                    assert.equal(templateOptions.text, '', 'text options is ok');
                    assert.equal(templateOptions.startDate.getTime(), new Date(2016, 8, 7, 5).getTime(), 'startDate option is ok');
                    assert.equal(templateOptions.endDate.getTime(), new Date(2016, 8, 7, 5, 30).getTime(), 'endDate option is ok');
                    assert.deepEqual(templateOptions.groups, {
                        'ownerId': 1
                    }, 'Resources option is ok');
                });

                test('dataCellTemplate should take cellElement with correct geometry(T453520)', function(assert) {
                    assert.expect(4);
                    createWrapper({
                        currentView: 'week',
                        views: ['week'],
                        height: 700,
                        width: 700,
                        dataSource: [],
                        dataCellTemplate: function(cellData, cellIndex, cellElement) {
                        // all-day table cell size
                            if(cellData.allDay && !cellIndex) {
                                assert.roughEqual($(cellElement).outerWidth(), 85, 1.001, 'Data cell width is OK');
                                assert.roughEqual($(cellElement).outerHeight(), 24, 1.001, 'Data cell height is OK');
                            }

                            // scheduler table cell size
                            if(!cellData.allDay && !cellIndex) {
                                assert.roughEqual($(cellElement).get(0).getBoundingClientRect().width, 85, 1.001, 'Data cell width is OK');
                                assert.equal($(cellElement).get(0).getBoundingClientRect().height, 50, 'Data cell height is OK');
                            }
                        },
                        renovateRender,
                    });
                });
            });
        });

        [{
            viewType: 'day',
            expectedTemplateOptions: [dataCells[0]],
        }, {
            viewType: 'week',
            expectedTemplateOptions: dataCells,
        }, {
            viewType: 'workWeek',
            expectedTemplateOptions: [{
                ...dataCells[1],
                index: 0,
            }, {
                ...dataCells[2],
                index: 1,
            }, {
                ...dataCells[3],
                index: 2,
            }, {
                ...dataCells[4],
                index: 3,
            }, {
                ...dataCells[5],
                index: 4,
            }],
        }].forEach(({ viewType, expectedTemplateOptions }) => {
            test(`dataCellTemplate should have correct options in ${viewType} View in basic case`, function(assert) {
                const templateOptions = [];

                createWrapper({
                    dataSource: [],
                    views: [viewType],
                    currentView: viewType,
                    showAllDayPanel: false,
                    startDayHour: 0,
                    endDayHour: 1,
                    cellDuration: 60,
                    currentDate: new Date(2020, 7, 23),
                    renovateRender: true,
                    dataCellTemplate: (data, index) => {
                        templateOptions.push({ data, index });
                    },
                });

                assert.deepEqual(templateOptions, expectedTemplateOptions, 'Template options are correct');
            });
        });

        [{
            viewType: 'day',
            expectedTemplateOptions: [dataCells[0], allDayCells[0]],
        }, {
            viewType: 'week',
            expectedTemplateOptions: [...dataCells, ...allDayCells],
        }, {
            viewType: 'workWeek',
            expectedTemplateOptions: [{
                ...dataCells[1],
                index: 0,
            }, {
                ...dataCells[2],
                index: 1,
            }, {
                ...dataCells[3],
                index: 2,
            }, {
                ...dataCells[4],
                index: 3,
            }, {
                ...dataCells[5],
                index: 4,
            }, {
                ...allDayCells[1],
                index: 0,
            }, {
                ...allDayCells[2],
                index: 1,
            }, {
                ...allDayCells[3],
                index: 2,
            }, {
                ...allDayCells[4],
                index: 3,
            }, {
                ...allDayCells[5],
                index: 4,
            }],
        }].forEach(({ viewType, expectedTemplateOptions }) => {
            test(`dataCellTemplate should have correct options in ${viewType} when all-day panel is enabled`, function(assert) {
                const templateOptions = [];

                createWrapper({
                    dataSource: [],
                    views: [viewType],
                    currentView: viewType,
                    showAllDayPanel: true,
                    startDayHour: 0,
                    endDayHour: 1,
                    cellDuration: 60,
                    currentDate: new Date(2020, 7, 23),
                    renovateRender: true,
                    dataCellTemplate: (data, index) => {
                        templateOptions.push({ data, index });
                    },
                });

                assert.deepEqual(templateOptions, expectedTemplateOptions, 'Template options are correct');
            });
        });

        [{
            viewType: 'day',
            expectedTemplateOptions: [groupedCells[0], groupedCells[0], groupedCells[7], groupedCells[7]],
        }, {
            viewType: 'week',
            expectedTemplateOptions: [
                ...groupedCells.slice(0, 7), ...groupedCells.slice(0, 7),
                ...groupedCells.slice(7, 14), ...groupedCells.slice(7, 14),
            ],
        }, {
            viewType: 'workWeek',
            expectedTemplateOptions: [
                ...groupedCells.slice(1, 6), ...groupedCells.slice(1, 6),
                ...groupedCells.slice(8, 13), ...groupedCells.slice(8, 13),
            ].map(({ index, ...restProps }) => ({
                ...restProps,
                index: index - 1,
            })),
        }].forEach(({ viewType, expectedTemplateOptions }) => {
            test(`dataCellTemplate should have correct options in ${viewType} view when group orientation is vertical`, function(assert) {
                const templateOptions = [];

                createWrapper({
                    dataSource: [],
                    views: [{
                        type: viewType,
                        groupOrientation: 'vertical',
                    }],
                    currentView: viewType,
                    startDayHour: 0,
                    endDayHour: 1,
                    cellDuration: 60,
                    currentDate: new Date(2020, 7, 23),
                    renovateRender: true,
                    dataCellTemplate: (data, index) => {
                        templateOptions.push({ ...data, index });
                    },
                    groups: ['ownerId'],
                    resources,
                });

                checkGroups(assert, expectedTemplateOptions, templateOptions);
            });
        });

        [{
            viewType: 'day',
            expectedTemplateOptions: [groupedCells[0], groupedCells[7], groupedCells[0], groupedCells[7]],
        }, {
            viewType: 'week',
            expectedTemplateOptions: [
                ...groupedCells.slice(0, 7), ...groupedCells.slice(7, 14),
                ...groupedCells.slice(0, 7), ...groupedCells.slice(7, 14),
            ],
        }, {
            viewType: 'workWeek',
            expectedTemplateOptions: [
                ...groupedCells.slice(1, 6), ...groupedCells.slice(8, 13),
                ...groupedCells.slice(1, 6), ...groupedCells.slice(8, 13),
            ].map(({ index, ...restProps }) => ({
                ...restProps,
                index: index - 1,
            })),
        }].forEach(({ viewType, expectedTemplateOptions }) => {
            test(`dataCellTemplate should have correct options in ${viewType} view when group orientation is horizontal`, function(assert) {
                const templateOptions = [];

                createWrapper({
                    dataSource: [],
                    views: [{
                        type: viewType,
                        groupOrientation: 'horizontal',
                    }],
                    currentView: viewType,
                    startDayHour: 0,
                    endDayHour: 1,
                    cellDuration: 60,
                    currentDate: new Date(2020, 7, 23),
                    renovateRender: true,
                    dataCellTemplate: (data, index) => {
                        templateOptions.push({ ...data, index });
                    },
                    groups: ['ownerId'],
                    resources,
                });

                checkGroups(assert, expectedTemplateOptions, templateOptions);
            });
        });

        const groupedByDateWeek = [
            groupedCells[0], groupedCells[7],
            groupedCells[1], groupedCells[8],
            groupedCells[2], groupedCells[9],
            groupedCells[3], groupedCells[10],
            groupedCells[4], groupedCells[11],
            groupedCells[5], groupedCells[12],
            groupedCells[6], groupedCells[13],
        ];
        [{
            viewType: 'day',
            expectedTemplateOptions: [groupedCells[0], groupedCells[7], groupedCells[0], groupedCells[7]],
        }, {
            viewType: 'week',
            expectedTemplateOptions: [...groupedByDateWeek, ...groupedByDateWeek],
        }, {
            viewType: 'workWeek',
            expectedTemplateOptions: [
                ...groupedByDateWeek.slice(2, 12), ...groupedByDateWeek.slice(2, 12),
            ].map(({ index, ...restProps }) => ({
                ...restProps,
                index: index - 1,
            })),
        }].forEach(({ viewType, expectedTemplateOptions }) => {
            test(`dataCellTemplate should have correct options in ${viewType} view when appointments are grouped by date`, function(assert) {
                const templateOptions = [];

                createWrapper({
                    dataSource: [],
                    views: [{
                        type: viewType,
                        groupOrientation: 'horizontal',
                        groupByDate: true,
                    }],
                    currentView: viewType,
                    startDayHour: 0,
                    endDayHour: 1,
                    cellDuration: 60,
                    currentDate: new Date(2020, 7, 23),
                    renovateRender: true,
                    dataCellTemplate: (data, index) => {
                        templateOptions.push({ ...data, index });
                    },
                    groups: ['ownerId'],
                    resources,
                });

                checkGroups(assert, expectedTemplateOptions, templateOptions);
            });
        });

        [{
            view: 'month',
            firstCell: {
                startDate: new Date(2020, 10, 29),
                endDate: new Date(2020, 10, 30),
                groups: undefined,
                groupIndex: undefined,
                allDay: undefined,
                index: 0,
                text: '29',
            },
            secondCell: {
                startDate: new Date(2020, 11, 19),
                endDate: new Date(2020, 11, 20),
                groups: undefined,
                groupIndex: undefined,
                allDay: undefined,
                index: 20,
                text: '19',
            },
            firstCellIndex: 0,
            secondCellIndex: 20,
            templatesNumber: 42,
        }, {
            view: 'timelineDay',
            firstCell: {
                startDate: new Date(2020, 11, 1, 0, 0),
                endDate: new Date(2020, 11, 1, 0, 30),
                groups: undefined,
                groupIndex: undefined,
                allDay: undefined,
                index: 0,
                text: '',
            },
            secondCell: {
                startDate: new Date(2020, 11, 1, 23, 30),
                endDate: new Date(2020, 11, 2, 0, 0),
                groups: undefined,
                groupIndex: undefined,
                allDay: undefined,
                index: 47,
                text: '',
            },
            firstCellIndex: 0,
            secondCellIndex: 47,
            templatesNumber: 48,
        }, {
            view: 'timelineWeek',
            firstCell: {
                startDate: new Date(2020, 10, 29, 0, 0),
                endDate: new Date(2020, 10, 29, 0, 30),
                groups: undefined,
                groupIndex: undefined,
                allDay: undefined,
                index: 0,
                text: '',
            },
            secondCell: {
                startDate: new Date(2020, 11, 5, 23, 30),
                endDate: new Date(2020, 11, 6, 0, 0),
                groups: undefined,
                groupIndex: undefined,
                allDay: undefined,
                index: 335,
                text: '',
            },
            firstCellIndex: 0,
            secondCellIndex: 335,
            templatesNumber: 336,
        }, {
            view: 'timelineMonth',
            firstCell: {
                startDate: new Date(2020, 11, 1),
                endDate: new Date(2020, 11, 2),
                groups: undefined,
                groupIndex: undefined,
                allDay: undefined,
                index: 0,
                text: '',
            },
            secondCell: {
                startDate: new Date(2020, 11, 31),
                endDate: new Date(2021, 0, 1),
                groups: undefined,
                groupIndex: undefined,
                allDay: undefined,
                index: 30,
                text: '',
            },
            firstCellIndex: 0,
            secondCellIndex: 30,
            templatesNumber: 31,
        }].forEach(({
            view,
            firstCell: firstExpectedCell,
            secondCell: secondExpectedCell,
            firstCellIndex,
            secondCellIndex,
            templatesNumber,
        }) => {
            test(`dataCellTemplate should have correct options in ${view} view`, function(assert) {
                const templateOptions = [];

                createWrapper({
                    dataSource: [],
                    views: [view],
                    currentView: view,
                    currentDate: new Date(2020, 11, 1),
                    renovateRender: true,
                    dataCellTemplate: (data, index) => {
                        templateOptions.push({ ...data, index });
                    },
                });

                const firstCell = templateOptions[firstCellIndex];
                const secondCell = templateOptions[secondCellIndex];

                assert.equal(templateOptions.length, templatesNumber, 'Correct number of templates');
                assert.deepEqual(firstCell, firstExpectedCell, 'Correct options in the first cell');
                assert.deepEqual(secondCell, secondExpectedCell, 'Correct options in the second cell');
            });
        });

        [{
            viewType: 'day',
            expectedTemplateOptions: [groupedCells[0], groupedCells[7]],
        }, {
            viewType: 'week',
            expectedTemplateOptions: [
                ...groupedCells.slice(0, 7),
                ...groupedCells.slice(7, 14),
            ],
        }, {
            viewType: 'workWeek',
            expectedTemplateOptions: [
                ...groupedCells.slice(1, 6),
                ...groupedCells.slice(8, 13),
            ].map(({ index, ...restProps }) => ({
                ...restProps,
                index: index - 1,
            })),
        }].forEach(({ viewType, expectedTemplateOptions }) => {
            test(`dataCellTemplate should have correct options in ${viewType} with grouping and virtual scrolling`, function(assert) {
                const templateOptions = [];

                createWrapper({
                    dataSource: [],
                    views: [{
                        type: viewType,
                        groupOrientation: 'vertical',
                    }],
                    currentView: viewType,
                    startDayHour: 0,
                    endDayHour: 1,
                    cellDuration: 60,
                    height: 1000,
                    showAllDayPanel: false,
                    currentDate: new Date(2020, 7, 23),
                    scrolling: { mode: 'virtual' },
                    dataCellTemplate: (data, index) => {
                        templateOptions.push({ ...data, index });
                    },
                    groups: ['ownerId'],
                    resources,
                });

                checkGroups(assert, expectedTemplateOptions, templateOptions);
            });
        });
    });

    module('Date Cell template', {}, function() {
        test('dateCellTemplate should take cellElement with correct geometry (T453520)', function(assert) {
            createWrapper({
                currentView: 'agenda',
                views: ['agenda'],
                height: 700,
                width: 700,
                currentDate: new Date(2016, 10, 28),
                dataSource: [{
                    startDate: new Date(2016, 10, 28, 1),
                    endDate: new Date(2016, 10, 28, 2)
                }],
                dateCellTemplate: function(cellData, cellIndex, cellElement) {
                    assert.equal($(cellElement).outerWidth(), 70, 'Date cell width is OK');
                    assert.equal($(cellElement).outerHeight(), 80, 'Date cell height is OK');
                }
            });
        });

        const data = [{
            startDate: new Date(2020, 10, 24, 10),
            endDate: new Date(2020, 10, 24, 11),
            priorityId: 1,
        }, {
            startDate: new Date(2020, 10, 25, 10),
            endDate: new Date(2020, 10, 25, 11),
            priorityId: 1,
        }, {
            startDate: new Date(2020, 10, 24, 10),
            endDate: new Date(2020, 10, 24, 11),
            priorityId: 2,
        }, {
            startDate: new Date(2020, 10, 25, 10),
            endDate: new Date(2020, 10, 25, 11),
            priorityId: 2,
        }];

        const basicOptions = {
            dataSource: data,
            views: ['agenda'],
            currentView: 'agenda',
            currentDate: new Date(2020, 10, 24),
            resources: [{
                fieldExpr: 'priorityId',
                allowMultiple: false,
                dataSource: [{
                    text: 'Low Priority',
                    id: 1
                }, {
                    text: 'High Priority',
                    id: 2
                }],
                label: 'Priority',
            }],
        };

        test('Date cell template should have correct data without grouping', function(assert) {
            let currentTemplateIndex = 0;
            const rowsCount = 2;
            const expectedData = [{
                date: new Date(2020, 10, 24),
                groups: {},
                groupIndex: undefined,
                text: '24 Tue',
            }, {
                date: new Date(2020, 10, 25),
                groups: {},
                groupIndex: undefined,
                text: '25 Wed',
            }];

            createWrapper({
                ...basicOptions,
                dateCellTemplate: (data) => {
                    assert.deepEqual(data, expectedData[currentTemplateIndex % rowsCount], 'Correct template data');
                    currentTemplateIndex += 1;
                },
            });
        });

        test('Date cell template should have correct data with grouping', function(assert) {
            let currentTemplateIndex = 0;
            const rowsCount = 4;
            const expectedData = [{
                date: new Date(2020, 10, 24),
                groups: { priorityId: 1 },
                groupIndex: 0,
                text: '24 Tue',
            }, {
                date: new Date(2020, 10, 25),
                groups: { priorityId: 1 },
                groupIndex: 0,
                text: '25 Wed',
            }, {
                date: new Date(2020, 10, 24),
                groups: { priorityId: 2 },
                groupIndex: 1,
                text: '24 Tue',
            }, {
                date: new Date(2020, 10, 25),
                groups: { priorityId: 2 },
                groupIndex: 1,
                text: '25 Wed',
            }];

            createWrapper({
                ...basicOptions,
                dateCellTemplate: (data) => {
                    assert.deepEqual(data, expectedData[currentTemplateIndex % rowsCount], 'Correct template data');
                    currentTemplateIndex += 1;
                },
                groups: ['priorityId'],
            });
        });

        [true, false].forEach((renovateRender) => {
            const description = renovateRender
                ? 'Renovated Render'
                : 'Old Render';

            const baseConfig = getBaseConfig(renovateRender);

            module(description, {
                beforeEach: function() {
                    this.createInstance = (options = {}) => {
                        this.scheduler = createWrapper({
                            renovateRender,
                            ...options,
                        });
                        this.instance = this.scheduler.instance;
                    };
                },
            }, () => {
                test('Scheduler should have specific dateCellTemplate setting of the view', function(assert) {
                    let countCallTemplate1 = 0;
                    let countCallTemplate2 = 0;

                    this.createInstance({
                        dataSource: [],
                        views: [{
                            type: 'week',
                            dateCellTemplate: function(item, index, container) {
                                assert.equal(isRenderer(container), !!config().useJQuery, 'element is correct');
                                countCallTemplate2++;
                            }
                        }],
                        dateCellTemplate: function() {
                            countCallTemplate1++;
                        },
                        currentView: 'week'
                    });

                    assert.equal(countCallTemplate1, 0, 'count call first template');
                    assert.notEqual(countCallTemplate2, 0, 'count call second template');
                });

                test('dateCellTemplate should take cellElement with correct geometry(T453520)', function(assert) {
                    assert.expect(3);
                    this.createInstance({
                        currentView: 'week',
                        views: ['week'],
                        height: 700,
                        width: 700,
                        dataSource: [],
                        dateCellTemplate: function(cellData, cellIndex, cellElement) {
                            if(!cellIndex) {
                                assert.equal(isRenderer(cellElement), !!config().useJQuery, 'element is correct');
                                assert.roughEqual($(cellElement).outerWidth(), 85, 1.001, 'Date cell width is OK');
                                assert.equal($(cellElement).outerHeight(), 40, 'Date cell height is OK');
                            }
                        }
                    });
                });

                test('dateCellTemplate should work correctly', function(assert) {
                    this.createInstance({
                        views: ['month'],
                        currentView: 'month',
                        currentDate: new Date(2016, 8, 5),
                        dataSource: [],
                        firstDayOfWeek: 0,
                        groups: ['ownerId'],
                        resources: [
                            {
                                fieldExpr: 'ownerId',
                                dataSource: [
                                    { id: 1, text: 'John' },
                                    { id: 2, text: 'Mike' }
                                ]
                            }
                        ],
                        dateCellTemplate: function(itemData, index, container) {
                            if(index === 0) {
                                $(container).addClass('custom-group-cell-class');
                            }
                        }
                    });

                    const $cell1 = this.instance.$element().find('.dx-scheduler-header-panel-cell').eq(0);
                    const $cell2 = this.instance.$element().find('.dx-scheduler-header-panel-cell').eq(1);

                    assert.ok($cell1.hasClass('custom-group-cell-class'), 'first cell has right class');
                    assert.notOk($cell2.hasClass('custom-group-cell-class'), 'second cell has no class');
                });

                test('dateCellTemplate should have unique date in data (T732376)', function(assert) {
                    this.createInstance({
                        views: ['timelineWorkWeek'],
                        currentView: 'timelineWorkWeek',
                        currentDate: new Date(2016, 8, 5),
                        dataSource: [],
                        firstDayOfWeek: 0,
                        startDayHour: 10,
                        endDayHour: 11,
                        cellDuration: 60,
                        groups: ['ownerId'],
                        resources: [
                            {
                                fieldExpr: 'ownerId',
                                dataSource: [
                                    { id: 1, text: 'John' },
                                    { id: 2, text: 'Mike' }
                                ]
                            }
                        ],
                        dateCellTemplate: function(data, index, element) {
                            const d = data;
                            $('<div>').appendTo(element).dxButton({
                                text: 'Test',
                                onClick: function(e) {
                                    const expectedDate = new Date(2016, 8, 7, 10, 0);

                                    assert.equal(d.date.getTime(), expectedDate.getTime());
                                }
                            });

                            return element;
                        }
                    });

                    const $button = this.instance.$element().find('.dx-scheduler-header-panel-cell .dx-button').eq(2);

                    $($button).trigger('dxclick');
                });

                test('dateCellTemplate should work correctly in workWeek view', function(assert) {
                    const dayOfWeekNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

                    this.createInstance({
                        views: ['workWeek'],
                        currentView: 'workWeek',
                        currentDate: new Date(2016, 8, 5),
                        dataSource: [],
                        startDayHour: 7,
                        endDayHour: 23,
                        dateCellTemplate: function(cellData, index, container) {
                            $(container).append(
                                $('<div />')
                                    .addClass('name')
                                    .text(dayOfWeekNames[cellData.date.getDay()]),
                                $('<div />')
                                    .addClass('number')
                                    .text(cellData.date.getDate())
                            );
                        },
                    });

                    const $headerPanel = this.instance.$element().find('.dx-scheduler-header-panel');

                    assert.ok($headerPanel.text(), 'Mon5Tue6Wed7Thu8Fri9');
                });

                test('dateCellTemplate should work correctly in agenda view', function(assert) {
                    this.createInstance({
                        views: ['agenda'],
                        currentView: 'agenda',
                        currentDate: new Date(2016, 8, 5),
                        dataSource: [{
                            text: 'a',
                            ownerId: 1,
                            startDate: new Date(2016, 8, 5, 7),
                            endDate: new Date(2016, 8, 5, 8),
                        },
                        {
                            text: 'b',
                            ownerId: 2,
                            startDate: new Date(2016, 8, 5, 10),
                            endDate: new Date(2016, 8, 5, 11),
                        }],
                        firstDayOfWeek: 0,
                        groups: ['ownerId'],
                        resources: [
                            {
                                fieldExpr: 'ownerId',
                                dataSource: [
                                    { id: 1, text: 'John' },
                                    { id: 2, text: 'Mike' }
                                ]
                            }
                        ],
                        dateCellTemplate: function(itemData, index, container) {
                            if(index === 0) {
                                $(container).addClass('custom-group-cell-class');
                            }
                        }
                    });

                    const $cell1 = this.instance.$element().find('.dx-scheduler-time-panel-cell').eq(0);
                    const $cell2 = this.instance.$element().find('.dx-scheduler-time-panel-cell').eq(1);

                    assert.ok($cell1.hasClass('custom-group-cell-class'), 'first cell has right class');
                    assert.notOk($cell2.hasClass('custom-group-cell-class'), 'second cell has no class');
                });

                test('dateCellTemplate should have correct options', function(assert) {
                    let templateOptions;

                    this.createInstance({
                        currentView: 'month',
                        currentDate: new Date(2016, 8, 5),
                        dateCellTemplate: function(itemData, index, $container) {
                            if(index === 0) {
                                templateOptions = itemData;
                            }
                        }
                    });

                    assert.equal(templateOptions.text, 'Sun', 'text option is ok');
                    assert.deepEqual(templateOptions.date.getTime(), new Date(2016, 7, 28).getTime(), 'date option is ok');
                });

                test('dateCellTemplate should have correct options in agenda view', function(assert) {
                    let templateOptions;

                    this.createInstance({
                        views: ['agenda'],
                        currentView: 'agenda',
                        currentDate: new Date(2016, 8, 5),
                        dataSource: [{
                            text: 'a',
                            ownerId: 1,
                            startDate: new Date(2016, 8, 5, 7),
                            endDate: new Date(2016, 8, 5, 8),
                        },
                        {
                            text: 'b',
                            ownerId: 2,
                            startDate: new Date(2016, 8, 5, 10),
                            endDate: new Date(2016, 8, 5, 11),
                        }],
                        firstDayOfWeek: 0,
                        groups: ['ownerId'],
                        resources: [
                            {
                                fieldExpr: 'ownerId',
                                dataSource: [
                                    { id: 1, text: 'John' },
                                    { id: 2, text: 'Mike' }
                                ]
                            }
                        ],
                        dateCellTemplate: function(itemData, index, $container) {
                            if(index === 0) {
                                templateOptions = itemData;
                            }
                        }
                    });

                    assert.equal(templateOptions.text, '5 Mon', 'text option is ok');
                    assert.equal(templateOptions.date.getTime(), new Date(2016, 8, 5).getTime(), 'date option is ok');
                    assert.deepEqual(templateOptions.groups, { 'ownerId': 1 }, 'groups option is ok');

                });

                test('WorkSpace recalculation works fine after render dateCellTemplate if workspace has allDay appointment', function(assert) {
                    this.createInstance({
                        currentView: 'week',
                        currentDate: new Date(2016, 8, 5),
                        dataSource: [{
                            text: 'a',
                            ownerId: 1,
                            startDate: new Date(2016, 8, 5, 7),
                            endDate: new Date(2016, 8, 5, 8),
                            allDay: true
                        }],
                        crossScrollingEnabled: true,
                        dateCellTemplate: function(itemData, index, $container) {
                            return $('<div>').css({ height: '150px' });
                        }
                    });

                    const schedulerHeaderHeight = parseInt(this.instance.$element().find('.dx-scheduler-header').outerHeight(true), 10);
                    const schedulerHeaderPanelHeight = parseInt(this.instance.$element().find('.dx-scheduler-header-panel').outerHeight(true), 10);
                    const $allDayTitle = this.instance.$element().find('.dx-scheduler-all-day-title');
                    const $dateTableScrollable = this.instance.$element().find('.dx-scheduler-date-table-scrollable');
                    const allDayPanelHeight = this.instance._workSpace._$allDayTable.outerHeight();

                    assert.equal(parseInt($allDayTitle.css('top'), 10), schedulerHeaderHeight + schedulerHeaderPanelHeight, 'All day title element top value');
                    assert.roughEqual(parseInt($dateTableScrollable.css('paddingBottom'), 10), schedulerHeaderPanelHeight + allDayPanelHeight, 1, 'dateTableScrollable element padding bottom');
                    assert.roughEqual(parseInt($dateTableScrollable.css('marginBottom'), 10), -1 * (schedulerHeaderPanelHeight + allDayPanelHeight), 1, 'dateTableScrollable element margin bottom');
                });

                test('\'"groups" and "groupIndex" shoud be correct in dateCelltTemplate', function(assert) {
                    assert.expect(totalDateCells * 2);

                    const scheduler = createWrapper({
                        ...baseConfig,
                        views: viewsBase,
                        dateCellTemplate: checkIfGroupsAreUndefined(assert),
                    });

                    viewsBase.forEach(({ type }) => {
                        scheduler.instance.option('currentView', type);
                    });
                });

                test('\'"groups" and "groupIndex" shoud be correct in dateCelltTemplate when vertical grouping is used', function(assert) {
                    assert.expect(totalDateCells * 2);
                    const views = viewsBase.map(({ type, intervalCount }) => ({
                        type,
                        intervalCount,
                        groupOrientation: 'vertical',
                    }));

                    const scheduler = createWrapper({
                        ...baseConfig,
                        views,
                        dateCellTemplate: checkIfGroupsAreUndefined(assert),
                        groups: ['priority'],
                    });

                    viewsBase.forEach(({ type }) => {
                        scheduler.instance.option('currentView', type);
                    });
                });

                test('\'"groups" and "groupIndex" shoud be correct in dateCelltTemplate when grouping by date is used', function(assert) {
                    assert.expect(totalDateCells * 2);
                    const views = viewsBase.map(({ type, intervalCount }) => ({
                        type,
                        intervalCount,
                        groupOrientation: 'horizontal',
                        groupByDate: true,
                    }));

                    const scheduler = createWrapper({
                        ...baseConfig,
                        views,
                        dateCellTemplate: checkIfGroupsAreUndefined(assert),
                        groups: ['priority'],
                    });

                    viewsBase.forEach(({ type }) => {
                        scheduler.instance.option('currentView', type);
                    });
                });

                test('\'"groups" and "groupIndex" shoud be correct in dateCelltTemplate when horizontal grouping is used', function(assert) {
                    assert.expect(totalDateCells * 4);
                    const views = viewsBase.map(({ type, intervalCount }) => ({
                        type,
                        intervalCount,
                        groupOrientation: 'horizontal',
                    }));
                    let cellCountPerGroup = 2;
                    let currentCellIndex = 0;

                    const scheduler = createWrapper({
                        ...baseConfig,
                        views,
                        dateCellTemplate: ({ groups, groupIndex }) => {
                            const currentGroupIndex = Math.floor(currentCellIndex / cellCountPerGroup);

                            assert.deepEqual(groups, { priority: currentGroupIndex + 1 }, 'Groups property is correct');
                            assert.equal(groupIndex, currentGroupIndex, 'GroupIndex property is correct');

                            currentCellIndex += 1;
                        },
                        groups: ['priority'],
                    });

                    viewsBase.forEach(({ type, dateCellCount }) => {
                        cellCountPerGroup = dateCellCount;
                        currentCellIndex = 0;

                        scheduler.instance.option('currentView', type);
                    });
                });
            });
        });
    });

    module('Time Cell template', {}, function() {
        const timeCells = [{
            data: {
                date: dataCells[0].data.startDate,
                groupIndex: undefined,
                groups: undefined,
                text: '12:00 AM',
            },
            index: 0
        }];


        test('Scheduler should have specific timeCellTemplate setting of the view', function(assert) {
            let countCallTemplate1 = 0;
            let countCallTemplate2 = 0;

            createWrapper({
                dataSource: [],
                views: [{
                    type: 'week',
                    timeCellTemplate: function() {
                        countCallTemplate2++;
                    }
                }],
                timeCellTemplate: function() {
                    countCallTemplate1++;
                },
                currentView: 'week'
            });

            assert.equal(countCallTemplate1, 0, 'count call first template');
            assert.notEqual(countCallTemplate2, 0, 'count call second template');
        });

        test('timeCellTemplate should take cellElement with correct geometry(T453520)', function(assert) {
            assert.expect(3);

            createWrapper({
                currentView: 'week',
                views: ['week'],
                height: 700,
                width: 700,
                dataSource: [],
                timeCellTemplate: function(cellData, cellIndex, cellElement) {
                    if(!cellIndex) {
                        assert.equal(isRenderer(cellElement), !!config().useJQuery, 'element is correct');
                        assert.equal($(cellElement).get(0).getBoundingClientRect().height, 50, 'Time cell height is OK');
                        assert.equal($(cellElement).outerWidth(), 100, 'Time cell width is OK');
                    }
                }
            });
        });

        test('timeCellTemplate should have correct options', function(assert) {
            let templateOptions;

            createWrapper({
                currentView: 'week',
                currentDate: new Date(2016, 8, 5),
                firstDayOfWeek: 0,
                timeCellTemplate: function(itemData, index, $container) {
                    if(index === 6) {
                        templateOptions = itemData;
                    }
                }
            });

            assert.equal(templateOptions.text, '3:00 AM', 'text options is ok');
        });

        test('timeCellTemplate should contains the date field of data parameter in the Day view', function(assert) {
            const resultDates = [];
            createWrapper({
                currentView: 'day',
                views: ['day'],
                currentDate: new Date(2016, 8, 5),
                startDayHour: 0,
                endDayHour: 4,
                cellDuration: 60,
                timeCellTemplate: function(itemData) {
                    resultDates.push(itemData.date);
                }
            });

            assert.equal(resultDates.length, 4);
            assert.deepEqual(resultDates[0], new Date(2016, 8, 5), 'date parameter for the first time cell');
            assert.deepEqual(resultDates[1], new Date(2016, 8, 5, 1), 'date parameter for the second time cell');
            assert.deepEqual(resultDates[2], new Date(2016, 8, 5, 2), 'date parameter for the third time cell');
            assert.deepEqual(resultDates[3], new Date(2016, 8, 5, 3), 'date parameter for the fourth time cell');
        });

        test('timeCellTemplate should contains the date field of data parameter in Week view', function(assert) {
            const resultDates = [];
            createWrapper({
                currentView: 'week',
                views: ['week'],
                currentDate: new Date(2016, 8, 5),
                firstDayOfWeek: 0,
                startDayHour: 0,
                endDayHour: 4,
                cellDuration: 60,
                timeCellTemplate: function(itemData) {
                    resultDates.push(itemData.date);
                }
            });

            assert.equal(resultDates.length, 4);
            assert.deepEqual(resultDates[0], new Date(2016, 8, 4), 'date parameter for the first time cell');
            assert.deepEqual(resultDates[1], new Date(2016, 8, 4, 1), 'date parameter for the second time cell');
            assert.deepEqual(resultDates[2], new Date(2016, 8, 4, 2), 'date parameter for the third time cell');
            assert.deepEqual(resultDates[3], new Date(2016, 8, 4, 3), 'date parameter for the fourth time cell');
        });

        test('timeCellTemplate should contains the date field of data parameter in workWeek view', function(assert) {
            const resultDates = [];
            createWrapper({
                currentView: 'workWeek',
                views: ['workWeek'],
                currentDate: new Date(2016, 8, 5),
                firstDayOfWeek: 0,
                startDayHour: 0,
                endDayHour: 4,
                cellDuration: 60,
                timeCellTemplate: function(itemData) {
                    resultDates.push(itemData.date);
                }
            });

            assert.equal(resultDates.length, 4);
            assert.deepEqual(resultDates[0], new Date(2016, 8, 5), 'date parameter for the first time cell');
            assert.deepEqual(resultDates[1], new Date(2016, 8, 5, 1), 'date parameter for the second time cell');
            assert.deepEqual(resultDates[2], new Date(2016, 8, 5, 2), 'date parameter for the third time cell');
            assert.deepEqual(resultDates[3], new Date(2016, 8, 5, 3), 'date parameter for the fourth time cell');
        });

        [
            {
                viewType: 'day',
                expectedTemplateOptions: timeCells,
                showAllDayPanel: false,
            },
            {
                viewType: 'day',
                expectedTemplateOptions: timeCells,
                showAllDayPanel: true,
            }
        ].forEach(({ viewType, expectedTemplateOptions, showAllDayPanel }) => {
            test(`timeCellTemplate should have correct options in ${viewType} view when all day panel is ${showAllDayPanel}`, function(assert) {
                const templateOptions = [];

                createWrapper({
                    dataSource: [],
                    views: [viewType],
                    currentView: viewType,
                    showAllDayPanel,
                    startDayHour: 0,
                    endDayHour: 1,
                    cellDuration: 60,
                    currentDate: new Date(2020, 7, 23),
                    renovateRender: true,
                    timeCellTemplate: (data, index) => {
                        templateOptions.push({ data, index });
                    },
                });

                assert.deepEqual(templateOptions, expectedTemplateOptions, 'Template options are correct');
            });
        });

        [{
            viewType: 'day',
            expectedTemplateOptions: [groupedCells[0], groupedCells[7]],
        }].forEach(({ viewType, expectedTemplateOptions }) => {
            test(`timeCellTemplate should have correct options in ${viewType} view when group orientation is vertical`, function(assert) {
                const templateOptions = [];

                createWrapper({
                    dataSource: [],
                    views: [{
                        type: viewType,
                        groupOrientation: 'vertical',
                    }],
                    currentView: viewType,
                    startDayHour: 0,
                    endDayHour: 1,
                    cellDuration: 60,
                    currentDate: new Date(2020, 7, 23),
                    renovateRender: true,
                    timeCellTemplate: (data, index) => {
                        templateOptions.push({ ...data, index });
                    },
                    groups: ['ownerId'],
                    resources,
                });

                checkGroups(assert, expectedTemplateOptions, templateOptions);
            });
        });

        [{
            viewType: 'day',
            expectedTemplateOptions: [{
                index: 0,
                groupIndex: undefined,
                groups: undefined,
            }],
        }].forEach(({ viewType, expectedTemplateOptions }) => {
            test(`timeCellTemplate should have correct options in ${viewType} view when group orientation is horizontal`, function(assert) {
                const templateOptions = [];

                createWrapper({
                    dataSource: [],
                    views: [{
                        type: viewType,
                        groupOrientation: 'horizontal',
                    }],
                    currentView: viewType,
                    startDayHour: 0,
                    endDayHour: 1,
                    cellDuration: 60,
                    currentDate: new Date(2020, 7, 23),
                    renovateRender: true,
                    timeCellTemplate: (data, index) => {
                        templateOptions.push({ ...data, index });
                    },
                    groups: ['ownerId'],
                    resources,
                });

                checkGroups(assert, expectedTemplateOptions, templateOptions);
            });
        });

        [{
            viewType: 'day',
            expectedTemplateOptions: [groupedCells[0], groupedCells[7]],
        }].forEach(({ viewType, expectedTemplateOptions }) => {
            test(`timeCellTemplate should have correct options in ${viewType} view with grouping and virtual scrolling`, function(assert) {
                const templateOptions = [];

                createWrapper({
                    dataSource: [],
                    views: [{
                        type: viewType,
                        groupOrientation: 'vertical',
                    }],
                    currentView: viewType,
                    startDayHour: 0,
                    endDayHour: 1,
                    cellDuration: 60,
                    height: 1000,
                    showAllDayPanel: false,
                    currentDate: new Date(2020, 7, 23),
                    scrolling: { mode: 'virtual' },
                    timeCellTemplate: (data, index) => {
                        templateOptions.push({ ...data, index });
                    },
                    groups: ['ownerId'],
                    resources,
                });

                checkGroups(assert, expectedTemplateOptions, templateOptions);
            });
        });

        [true, false].forEach((renovateRender) => {
            const description = renovateRender
                ? 'Renovated Render'
                : 'Old Render';

            const baseConfig = getBaseConfig(renovateRender);

            module(description, {}, () => {
                test('"groups" and "groupIndex" shoud be correct in timeCelltTemplate', function(assert) {
                    assert.expect(totalTimeCells * 2);

                    const scheduler = createWrapper({
                        ...baseConfig,
                        views: viewsBase,
                        timeCellTemplate: checkIfGroupsAreUndefined(assert),
                    });

                    viewsBase.forEach(({ type }) => {
                        scheduler.instance.option('currentView', type);
                    });
                });

                test('"groups" and "groupIndex" shoud be correct in timeCelltTemplate '
                + 'when vertical grouping is used in simple views', function(assert) {
                    assert.expect(32);
                    const views = viewsBase.map(({ type, intervalCount }) => ({
                        type,
                        intervalCount,
                        groupOrientation: 'vertical',
                    }));
                    let cellCountPerGroup = 4;
                    let currentCellIndex = 0;

                    const scheduler = createWrapper({
                        ...baseConfig,
                        views,
                        timeCellTemplate: ({ groups, groupIndex }) => {
                            const currentGroupIndex = Math.floor(currentCellIndex / cellCountPerGroup);

                            assert.deepEqual(groups, { priority: currentGroupIndex + 1 }, 'Groups property is correct');
                            assert.equal(groupIndex, currentGroupIndex, 'GroupIndex property is correct');

                            currentCellIndex += 1;
                        },
                        groups: ['priority'],
                    });

                    viewsBase.slice(0, 3).forEach(({ type, timeCellCount }) => {
                        cellCountPerGroup = timeCellCount;
                        currentCellIndex = 0;

                        scheduler.instance.option('currentView', type);
                    });
                });

                test('"groups" and "groupIndex" shoud be correct in timeCelltTemplate '
                + 'when vertical grouping is used in timleine views', function(assert) {
                    assert.expect(72);
                    const views = viewsBase.map(({ type, intervalCount }) => ({
                        type,
                        intervalCount,
                        groupOrientation: 'vertical',
                    }));

                    const scheduler = createWrapper({
                        ...baseConfig,
                        views,
                        timeCellTemplate: checkIfGroupsAreUndefined(assert),
                        groups: ['priority'],
                        currentView: 'timelineDay',
                    });

                    viewsBase.slice(3, 6).forEach(({ type }) => {
                        scheduler.instance.option('currentView', type);
                    });
                });

                test('"groups" and "groupIndex" shoud be correct in timeCelltTemplate'
                + ' when grouping by date is used', function(assert) {
                    assert.expect(totalTimeCells * 2);
                    const views = viewsBase.map(({ type, intervalCount }) => ({
                        type,
                        intervalCount,
                        groupOrientation: 'horizontal',
                        groupByDate: true,
                    }));

                    const scheduler = createWrapper({
                        ...baseConfig,
                        views,
                        timeCellTemplate: checkIfGroupsAreUndefined(assert),
                        groups: ['priority'],
                    });

                    viewsBase.forEach(({ type }) => {
                        scheduler.instance.option('currentView', type);
                    });
                });

                test('"groups" and "groupIndex" shoud be correct in timeCelltTemplate'
                + ' when horizontal grouping is used in simple views', function(assert) {
                    assert.expect(16);
                    const views = viewsBase.map(({ type, intervalCount }) => ({
                        type,
                        intervalCount,
                        groupOrientation: 'horizontal',
                    }));

                    const scheduler = createWrapper({
                        ...baseConfig,
                        views,
                        timeCellTemplate: checkIfGroupsAreUndefined(assert),
                        groups: ['priority'],
                    });

                    viewsBase.slice(0, 3).forEach(({ type }) => {
                        scheduler.instance.option('currentView', type);
                    });
                });

                test('"groups" and "groupIndex" shoud be correct in timeCelltTemplate'
                + ' when horizontal grouping is used in timeline views', function(assert) {
                    assert.expect((totalTimeCells - 8) * 4);
                    const views = viewsBase.map(({ type, intervalCount }) => ({
                        type,
                        intervalCount,
                        groupOrientation: 'horizontal',
                    }));
                    let cellCountPerGroup = 8;
                    let currentCellIndex = 0;

                    const scheduler = createWrapper({
                        ...baseConfig,
                        views,
                        currentView: 'timelineDay',
                        timeCellTemplate: ({ groups, groupIndex }) => {
                            const currentGroupIndex = Math.floor(currentCellIndex / cellCountPerGroup);

                            assert.deepEqual(groups, { priority: currentGroupIndex + 1 }, 'Groups property is correct');
                            assert.equal(groupIndex, currentGroupIndex, 'GroupIndex property is correct');

                            currentCellIndex += 1;
                        },
                        groups: ['priority'],
                    });

                    viewsBase.slice(3, 6).forEach(({ type, timeCellCount }) => {
                        cellCountPerGroup = timeCellCount;
                        currentCellIndex = 0;
                        scheduler.instance.option('currentView', type);
                    });
                });
            });
        });
    });
});
