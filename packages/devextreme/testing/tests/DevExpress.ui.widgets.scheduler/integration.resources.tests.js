import $ from 'jquery';
import devices from '__internal/core/m_devices';

import 'fluent_blue_light.css!';

import fx from 'common/core/animation/fx';
import { DataSource } from 'common/data/data_source/data_source';
import { CustomStore } from 'common/data/custom_store';
import Color from 'color';
import translator from 'common/core/animation/translator';

import '__internal/scheduler/m_scheduler';

import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
import { waitAsync, waitForAsync } from '../../helpers/scheduler/waitForAsync.js';

const getHexColor = ($appointment) => new Color($appointment.css('backgroundColor')).toHex();

QUnit.testStart(() => initTestMarkup());

const moduleConfig = {
    beforeEach() {
        fx.off = true;
    },

    afterEach() {
        fx.off = false;
    }
};

QUnit.module('Integration: Resources', moduleConfig, () => {
    QUnit.test('Grouping by value = 0 in case nested groups shouldn\'t ignore(T821935)', async function(assert) {
        const views = ['timelineDay', 'day'];
        const expectedValues = [
            {
                'appointment1': {
                    top: 30,
                    left: 0
                },
                'appointment2': {
                    top: 202,
                    left: 430
                }
            }, {
                'appointment1': {
                    top: 0,
                    left: 0
                },
                'appointment2': {
                    top: 76,
                    left: 319
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

        const scheduler = await createWrapper({
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
        const viewTest = async(view, index) => {
            scheduler.option('currentView', view);
            await waitAsync(0);

            const expectedValue = expectedValues[index];
            ['appointment1', 'appointment2'].forEach(appointmentName => {
                const expectedPosition = expectedValue[appointmentName];
                const position = translator.locate(scheduler.appointments.find(appointmentName));

                assert.roughEqual(position.top, expectedPosition.top, 2, `top position of ${appointmentName} should be valid in ${view}`);
                assert.roughEqual(position.left, expectedPosition.left, 2, `left position of ${appointmentName} should be valid in ${view}`);
            });
        };

        await viewTest(views[0], 0);
        await viewTest(views[1], 1);
    });

    QUnit.test('Appointments should be repainted if \'groups\' option is changed', async function(assert) {
        const scheduler = await createWrapper({
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
        await waitAsync(0);
        assert.equal(scheduler.instance.$element().find('.dx-scheduler-appointment').length, 2, 'Appointments are OK');
    });

    QUnit.test('Resources should be loaded only once to calculate appts color and aria-description', async function(assert) {
        const loadStub = sinon.stub().returns([
            { text: 'o1', id: 1 },
            { text: 'o2', id: 2 }
        ]);

        await createWrapper({
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
                }, {
                    text: 'c',
                    startDate: new Date(2015, 4, 26, 6),
                    endDate: new Date(2015, 4, 26, 6, 30),
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

    QUnit.test('Paint appts if groups array don\'t contain all resources', async function(assert) {
        const scheduler = await createWrapper({
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

        await waitForAsync(() => getHexColor($appointments.eq(0)) === '#ff0000');
        assert.equal(getHexColor($appointments.eq(0)), '#ff0000', 'Color is OK');
        assert.equal(getHexColor($appointments.eq(1)), '#0000ff', 'Color is OK');
    });

    QUnit.test('Resources should be set correctly is the resources[].dataSource option is changed(T396746)', async function(assert) {
        const resourceData = [{ id: 1, text: 'John', color: 'red' }];

        const { instance } = await createWrapper({
            dataSource: [],
            currentDate: new Date(2015, 4, 26),
            groups: ['ownerId'],
            resources: [{
                fieldExpr: 'ownerId',
                dataSource: []
            }],
        });

        instance.option('resources[0].dataSource', resourceData);
        await waitAsync(0);

        assert.deepEqual(instance.option('resources'), [{
            fieldExpr: 'ownerId',
            dataSource: resourceData
        }], 'Resources were changed correctly');
    });

    QUnit.test('Appointment should have correct color after resources option changing', async function(assert) {
        const scheduler = await createWrapper({
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
        await waitAsync(0);

        const $appointments = scheduler.instance.$element().find('.dx-scheduler-appointment');
        await waitForAsync(() => getHexColor($appointments.eq(0)) === '#ff0000');
        assert.equal(getHexColor($appointments.eq(0)), '#ff0000', 'Color is OK');
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
