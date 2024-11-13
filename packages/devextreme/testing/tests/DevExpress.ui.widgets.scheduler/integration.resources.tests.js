import $ from 'jquery';
import devices from '__internal/core/m_devices';

import 'generic_light.css!';

import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import { getOuterHeight } from 'core/utils/size';
import { CustomStore } from 'common/data/custom_store';
import Color from 'color';
import translator from 'common/core/animation/translator';

import '__internal/scheduler/m_scheduler';

import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';

import { getOrLoadResourceItem } from '__internal/scheduler/resources/m_utils';

QUnit.testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach() {
        fx.off = true;
        this.clock = sinon.useFakeTimers();
    },

    afterEach() {
        fx.off = false;
        this.clock.restore();
    }
};

QUnit.module('Integration: Resources', moduleConfig, () => {
    QUnit.test('Grouping by value = 0 in case nested groups shouldn\'t ignore(T821935)', function(assert) {
        const views = ['timelineDay', 'day'];
        const expectedValues = [
            {
                'appointment1': {
                    top: 26,
                    left: 0
                },
                'appointment2': {
                    top: 190,
                    left: 430
                }
            }, {
                'appointment1': {
                    top: 0,
                    left: 0
                },
                'appointment2': {
                    top: 100,
                    left: 307
                }
            }
        ];

        const banquetResource = [{
            text: 'Hall 1',
            id: 0
        }, {
            text: 'Hall 2',
            id: 2
        }];

        const bookingResource = [{
            id: 1,
            text: 'Confirmed',
            status_code: 'CN',
        }, {
            id: 2,
            text: 'Tentative',
            status_code: 'TN'
        }, {
            id: 3,
            text: 'Waitlisted',
            status_code: 'WL'
        }];

        const data = [{
            text: 'appointment1',
            banquetId: 0,
            status: 1,
            startDate: new Date(2015, 4, 25, 10, 0),
            endDate: new Date(2015, 4, 25, 10, 30)
        }, {
            text: 'appointment2',
            banquetId: 0,
            status: 3,
            startDate: new Date(2015, 4, 25, 11, 0),
            endDate: new Date(2015, 4, 25, 11, 30)
        }];

        const scheduler = createWrapper({
            dataSource: data,
            views: views,
            currentView: views[0],
            currentDate: new Date(2015, 4, 25),
            startDayHour: 10,
            endDayHour: 12,
            height: 600,
            width: 1024,
            groups: ['banquetId', 'status'],
            resources: [{
                fieldExpr: 'banquetId',
                dataSource: banquetResource
            }, {
                fieldExpr: 'status',
                dataSource: bookingResource
            }]
        });

        views.forEach((view, index) => {
            scheduler.option('currentView', view);

            const expectedValue = expectedValues[index];
            ['appointment1', 'appointment2'].forEach(appointmentName => {
                const expectedPosition = expectedValue[appointmentName];
                const position = translator.locate(scheduler.appointments.find(appointmentName));

                assert.roughEqual(position.top, expectedPosition.top, 2, `top position of ${appointmentName} should be valid in ${view}`);
                assert.roughEqual(position.left, expectedPosition.left, 2, `left position of ${appointmentName} should be valid in ${view}`);
            });
        });
    });

    QUnit.test('Resource editors should have valid value after show appointment form', function(assert) {
        const dataSource = [{
            text: 'Task 1',
            ownerId: 1,
            roomId: 1,
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        }];

        const resources = [{
            field: 'ownerId',
            allowMultiple: true,
            dataSource: [{
                text: 'Jack',
                id: 1,
                color: '#606060'
            }, {
                text: 'Mike',
                id: 2,
                color: '#ff0000'
            }]
        }, {
            field: 'roomId',
            allowMultiple: false,
            dataSource: [{
                text: '#1',
                id: 1,
                color: '#606060'
            }, {
                text: '#2',
                id: 2,
                color: '#606066'
            }]
        }];

        let onAppointmentFormOpeningRaised = false;

        const scheduler = createWrapper({
            onAppointmentFormOpening: e => {
                const form = e.form;

                const ownerEditor = form.getEditor('ownerId');
                const roomEditor = form.getEditor('roomId');

                assert.ok(!!ownerEditor, 'ownerEditor should be exist');
                assert.ok(!!roomEditor, 'roomEditor should be exist');

                assert.deepEqual(ownerEditor.option('value'), [1], 'type of value in ownerEditor should be array');
                assert.deepEqual(roomEditor.option('value'), 1, 'type of value in roomEditor should be number');

                onAppointmentFormOpeningRaised = true;
            },
            resources: resources,
            dataSource: dataSource,
            currentDate: new Date(2015, 1, 9)
        }, this.clock);

        scheduler.appointments.click();
        scheduler.tooltip.clickOnItem();

        assert.equal(scheduler.option('dataSource')[0].ownerId, 1, 'ownerId property shouldn\'t change after show appointment form');
        assert.ok(onAppointmentFormOpeningRaised, 'onAppointmentFormOpening event should be raised');
    });

    QUnit.test('Editor for resource should be passed to details view', function(assert) {
        const task1 = {
            text: 'Task 1',
            ownerId: 1,
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        };
        const task2 = {
            text: 'Task 2',
            roomId: 1,
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        };
        const roomResource = [
            {
                text: '#1',
                id: 1,
                color: '#606060'
            }, {
                text: '#2',
                id: 2,
                color: '#606066'
            }
        ];
        const resources = [
            {
                field: 'ownerId',
                allowMultiple: true,
                dataSource: [{
                    text: 'Jack',
                    id: 1,
                    color: '#606060'
                }, {
                    text: 'Mike',
                    id: 2,
                    color: '#ff0000'
                }]
            }, {
                field: 'roomId',
                allowMultiple: false,
                dataSource: new DataSource(roomResource)
            }];

        const scheduler = createWrapper({
            resources: resources,
            dataSource: new DataSource({
                store: [task1, task2]
            }),
            currentDate: new Date(2015, 1, 9)
        });

        this.clock.tick(10);
        scheduler.instance.showAppointmentPopup(task1);

        let taskDetailsView = scheduler.instance.getAppointmentDetailsForm();

        const ownerEditor = taskDetailsView.option('items')[0].items[6];
        ownerEditor.editorOptions.dataSource.load();

        assert.ok(taskDetailsView.getEditor('ownerId'), 'Editor is exist');
        assert.equal(ownerEditor.editorType, 'dxTagBox', 'Editor is dxTagBox');
        assert.deepEqual(ownerEditor.editorOptions.dataSource.items(), resources[0].dataSource, 'Data source is OK');
        assert.deepEqual(taskDetailsView.option('formData').ownerId, [1], 'Value is OK');

        scheduler.instance.hideAppointmentPopup();
        scheduler.instance.showAppointmentPopup(task2);
        taskDetailsView = scheduler.instance.getAppointmentDetailsForm();

        const roomEditor = taskDetailsView.option('items')[0].items[7];

        roomEditor.editorOptions.dataSource.load();

        assert.ok(taskDetailsView.getEditor('roomId'), 'Editor is exist');
        assert.equal(roomEditor.editorType, 'dxSelectBox', 'Editor is dxSelectBox');

        assert.strictEqual(taskDetailsView.option('formData').roomId, 1, 'Value is OK');
        assert.deepEqual(roomEditor.editorOptions.dataSource.items(), roomResource, 'Data source is OK');
    });

    QUnit.test('Editor for resource should be passed to details view for scheduler with groups', function(assert) {
        const task = {
            text: 'Task 1',
            ownerId: 1,
            startDate: new Date(2015, 1, 9, 1, 0),
            endDate: new Date(2015, 1, 9, 2, 0)
        };
        const resources = [{
            field: 'ownerId',
            allowMultiple: true,
            displayExpr: 'name',
            dataSource: [
                {
                    name: 'Jack',
                    id: 1,
                    color: '#606060'
                },
                {
                    name: 'Mike',
                    id: 2,
                    color: '#ff0000'
                }
            ]
        }];

        const scheduler = createWrapper({
            resources: resources,
            groups: ['ownerId'],
            dataSource: new DataSource({
                store: [task]
            }),
            currentDate: new Date(2015, 1, 9)
        });

        this.clock.tick(10);
        scheduler.instance.showAppointmentPopup(task);

        const taskDetailsView = scheduler.instance.getAppointmentDetailsForm();
        const ownerEditor = taskDetailsView.option('items')[0].items[6];


        assert.equal(ownerEditor.editorType, 'dxTagBox', 'Editor is dxTagBox');
        assert.deepEqual(ownerEditor.editorOptions.dataSource, resources[0].dataSource, 'Data source is OK');
        assert.equal(ownerEditor.editorOptions.displayExpr, resources[0].displayExpr, 'displayExpr is OK');
    });

    QUnit.test('Editor for resource with right value should be passed to details view when fieldExpr is used', function(assert) {
        const appointment = {
            'Price': 10,
            'startDate': new Date(2015, 4, 24, 9, 10, 0, 0),
            'endDate': new Date(2015, 4, 24, 11, 1, 0, 0),
            'Movie': {
                'ID': 3
            },
            'TheatreId': 1
        };

        const resources = [{
            fieldExpr: 'Movie.ID',
            useColorAsDefault: true,
            allowMultiple: false,
            dataSource: [{
                'ID': 1,
                'Color': 'blue'
            }, {
                'ID': 3,
                'Color': 'red'
            }],
            valueExpr: 'ID',
            colorExpr: 'Color'
        }, {
            fieldExpr: 'TheatreId',
            dataSource: [{
                id: 1
            }, {
                id: 2
            }]
        }];

        const scheduler = createWrapper({
            resources: resources,
            dataSource: [appointment],
            currentDate: new Date(2015, 4, 24)
        });

        this.clock.tick(10);
        scheduler.instance.showAppointmentPopup(appointment);

        const taskDetailsView = scheduler.instance.getAppointmentDetailsForm();
        const movieEditor = taskDetailsView.option('items')[0].items[6];

        movieEditor.editorOptions.dataSource.load();

        assert.deepEqual(movieEditor.editorOptions.dataSource.items(), resources[0].dataSource, 'Data source is OK');
        assert.strictEqual(taskDetailsView.option('formData').Movie.ID, 3, 'Value is OK');
    });

    QUnit.test('Alias for getOrLoadResourceItem method', function(assert) {
        const { instance } = createWrapper({
            resources: [{
                field: 'ownerId',
                dataSource: [
                    {
                        text: 'Jack',
                        id: 1,
                        color: '#606060'
                    }
                ]
            }]
        });

        const done = assert.async();

        getOrLoadResourceItem(
            instance.option('resources'),
            instance.option('resourceLoaderMap'),
            'ownerId',
            1
        ).done(function(resource) {
            assert.deepEqual(resource, {
                text: 'Jack',
                id: 1,
                color: '#606060'
            }, 'Resource was found');

            done();
        });
    });

    QUnit.test('Appointments should be repainted if \'groups\' option is changed', function(assert) {
        const scheduler = createWrapper({
            dataSource: new DataSource({
                store: [{ text: 'a', startDate: new Date(2015, 4, 26, 5), endDate: new Date(2015, 4, 26, 5, 30), ownerId: [1, 2], roomId: [1, 2] }]
            }),
            currentDate: new Date(2015, 4, 26),
            groups: ['ownerId', 'roomId'],
            resources: [{
                field: 'ownerId',
                allowMultiple: true,
                dataSource: [
                    { text: 'o1', id: 1 },
                    { text: 'o2', id: 2 }
                ]
            }, {
                field: 'roomId',
                allowMultiple: true,
                dataSource: [
                    { text: 'r1', id: 1 },
                    { text: 'r2', id: 2 }
                ]
            }]
        });

        assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment').length, 4, 'Appointments are OK');

        scheduler.instance.option('groups', ['ownerId']);
        assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment').length, 2, 'Appointments are OK');
    });

    QUnit.test('Resources should be loaded only once to calculate appts color', function(assert) {
        const loadStub = sinon.stub().returns([
            { text: 'o1', id: 1 },
            { text: 'o2', id: 2 }
        ]);

        createWrapper({
            dataSource: new DataSource({
                store: [{
                    text: 'a',
                    startDate: new Date(2015, 4, 26, 5),
                    endDate: new Date(2015, 4, 26, 5, 30),
                    ownerId: 1
                }, {
                    text: 'b',
                    startDate: new Date(2015, 4, 26, 5),
                    endDate: new Date(2015, 4, 26, 5, 30),
                    ownerId: 2
                }]
            }),
            currentDate: new Date(2015, 4, 26),
            groups: ['ownerId'],
            resources: [{
                fieldExpr: 'ownerId',
                allowMultiple: true,
                dataSource: new CustomStore({
                    load: loadStub
                })
            }]
        });

        assert.equal(loadStub.callCount, 1, 'Resources are loaded only once');
    });

    QUnit.test('Paint appts if groups array don\'t contain all resources', function(assert) {
        const scheduler = createWrapper({
            dataSource: new DataSource({
                store: [{
                    text: 'a',
                    startDate: new Date(2015, 4, 26, 5),
                    endDate: new Date(2015, 4, 26, 5, 30),
                    ownerId: 1,
                    roomId: [1]
                }, {
                    text: 'b',
                    startDate: new Date(2015, 4, 26, 5),
                    endDate: new Date(2015, 4, 26, 5, 30),
                    ownerId: 2,
                    roomId: 2
                }]
            }),
            currentDate: new Date(2015, 4, 26),
            groups: ['ownerId'],
            resources: [{
                fieldExpr: 'ownerId',
                allowMultiple: true,
                dataSource: [
                    { text: 'o1', id: 1 },
                    { text: 'o2', id: 2 }
                ]
            }, {
                fieldExpr: 'roomId',
                allowMultiple: true,
                useColorAsDefault: true,
                dataSource: [
                    { text: 'o1', id: 1, color: 'red' },
                    { text: 'o2', id: 2, color: 'blue' }
                ]
            }]
        });

        const $appointments = scheduler.instance.$element().find('.dx-scheduler-appointment');

        assert.equal(new Color($appointments.eq(0).css('backgroundColor')).toHex(), '#ff0000', 'Color is OK');
        assert.equal(new Color($appointments.eq(1).css('backgroundColor')).toHex(), '#0000ff', 'Color is OK');
    });

    QUnit.test('Resources should not be reloaded when details popup is opening', function(assert) {
        const loadStub = sinon.stub().returns([
            { text: 'o1', id: 1 },
            { text: 'o2', id: 2 }
        ]);
        const byKeyStub = sinon.stub();
        const data = [{
            text: 'a',
            startDate: new Date(2015, 4, 26, 5),
            endDate: new Date(2015, 4, 26, 5, 30),
            ownerId: 1
        }, {
            text: 'b',
            startDate: new Date(2015, 4, 26, 5),
            endDate: new Date(2015, 4, 26, 5, 30),
            ownerId: 2
        }];
        const scheduler = createWrapper({
            dataSource: new DataSource({
                store: data
            }),
            currentDate: new Date(2015, 4, 26),
            groups: ['ownerId'],
            resources: [{
                fieldExpr: 'ownerId',
                allowMultiple: true,
                dataSource: new CustomStore({
                    load: loadStub,
                    byKey: byKeyStub
                })
            }]
        });

        scheduler.instance.showAppointmentPopup(data[0]);

        assert.equal(loadStub.callCount, 1, 'Resources are loaded only once');
        assert.equal(byKeyStub.callCount, 0, 'Resources are loaded only once');
    });

    [true, false].forEach((renovateRender) => {
        QUnit.test(`Resources should be set correctly is the resources[].dataSource option is changed(T396746) when renovateRender is ${renovateRender}`, function(assert) {
            const resourceData = [{ id: 1, text: 'John', color: 'red' }];

            const { instance } = createWrapper({
                dataSource: [],
                currentDate: new Date(2015, 4, 26),
                groups: ['ownerId'],
                resources: [{
                    fieldExpr: 'ownerId',
                    dataSource: []
                }],
                renovateRender,
            });

            instance.option('resources[0].dataSource', resourceData);

            assert.deepEqual(instance.option('resources'), [{
                fieldExpr: 'ownerId',
                dataSource: resourceData
            }], 'Resources were changed correctly');
        });
    });

    QUnit.test('Appointment should have correct color after resources option changing', function(assert) {
        const scheduler = createWrapper({
            dataSource: new DataSource({
                store: [{
                    text: 'a',
                    startDate: new Date(2015, 4, 26, 5),
                    endDate: new Date(2015, 4, 26, 5, 30),
                    roomId: [1]
                }]
            }),
            startDayHour: 4,
            currentDate: new Date(2015, 4, 26)
        });

        scheduler.instance.option('resources', [
            {
                fieldExpr: 'roomId',
                dataSource: [
                    { text: 'o1', id: 1, color: 'red' },
                    { text: 'o2', id: 2, color: 'blue' }
                ]
            }]);

        const $appointments = scheduler.instance.$element().find('.dx-scheduler-appointment');
        assert.equal(new Color($appointments.eq(0).css('backgroundColor')).toHex(), '#ff0000', 'Color is OK');
    });
});

if(devices.real().deviceType === 'desktop') {
    const desktopModuleConfig = {
        beforeEach: function() {
            $('#qunit-fixture').css({ top: 0, left: 0 });
            $('#qunit-fixture').html(
                `<div style="width: 400px; height: 500px;">
                    <div id="scheduler" style="height: 100%;">
                        <div data-options="dxTemplate: { name: 'template' }">Task Template</div>
                    </div>
                </div>`);
        },
        afterEach: function() {
            $('#qunit-fixture').css({ top: '-10000px', left: '-10000px' });
        }
    };
}
