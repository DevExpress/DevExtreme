const $ = require('jquery');

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

require('fluent_blue_light.css!');
require('ui/drop_down_button');

const noop = require('core/utils/common').noop;
const DataSource = require('common/data/data_source/data_source').DataSource;
const { createWrapper } = require('../../helpers/scheduler/helpers.js');
const { waitAsync } = require('../../helpers/scheduler/waitForAsync.js');

require('__internal/scheduler/m_scheduler');

QUnit.module('Integration: View switcher', () => {
    QUnit.test('dataSource should be filtered if \'currentView\' option is changed', async function(assert) {
        const dataSource = new DataSource({
            store: [{
                startDate: new Date(2015, 3, 1),
                endDate: new Date(2015, 3, 1, 0, 30),
                text: 'Item 1',
                ownerId: 1
            },
            {
                startDate: new Date(2015, 3, 1),
                text: 'Item 2',
                ownerId: 3
            },
            {
                startDate: new Date(2015, 4, 1),
                text: 'Item 3',
                ownerId: 1
            }
            ]
        });

        const { instance } = await createWrapper({
            views: ['day', 'week'],
            currentView: 'week',
            currentDate: new Date(2015, 3, 1),
            dataSource: dataSource,
            groups: ['ownerId'],
            remoteFiltering: true,
            resources: [
                {
                    field: 'ownerId',
                    dataSource: [
                        {
                            text: 'Jack',
                            id: 1,
                            color: 'red'
                        }
                    ]
                }
            ]
        });

        instance.option('currentView', 'day');
        await waitAsync(0);

        assert.deepEqual(dataSource.items(), [{
            startDate: new Date(2015, 3, 1),
            text: 'Item 1',
            ownerId: 1,
            endDate: new Date(2015, 3, 1, 0, 30)
        }], 'Data is filtered');
    });

    QUnit.test('Appointment should be rerendered only once if \'currentView\' option is changed', async function(assert) {
        const options = {
            views: ['month', 'week'],
            currentView: 'week',
            currentDate: new Date(2015, 3, 1),
            dataSource: new DataSource({
                store: [{
                    startDate: new Date(2015, 3, 1),
                    endDate: new Date(2015, 3, 1, 0, 30),
                    text: 'Item 1'
                }]
            }),
            onAppointmentRendered: noop
        };

        const renderedStub = sinon.stub(options, 'onAppointmentRendered');

        const { instance } = await createWrapper(options);

        instance.option('currentView', 'month');
        await waitAsync(0);

        assert.equal(renderedStub.callCount, 2, 'Appointment is rerendered only once');
    });
});
