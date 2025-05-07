const $ = require('jquery');

QUnit.testStart(function() {
    $('#qunit-fixture').html(
        '<div id="scheduler">\
            <div data-options="dxTemplate: { name: \'template\' }">Task Template</div>\
            </div>');
});

require('generic_light.css!');
require('ui/drop_down_button');

const noop = require('core/utils/common').noop;
const DataSource = require('common/data/data_source/data_source').DataSource;

require('__internal/scheduler/m_scheduler');

QUnit.module('Integration: View switcher', {
    beforeEach: function() {
        this.createInstance = function(options) {
            this.instance = $('#scheduler').dxScheduler(options).dxScheduler('instance');
        };
    }
});

QUnit.test('dataSource should be filtered if \'currentView\' option is changed', function(assert) {
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

    this.createInstance({
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

    this.instance.option('currentView', 'day');

    assert.deepEqual(dataSource.items(), [{
        startDate: new Date(2015, 3, 1),
        text: 'Item 1',
        ownerId: 1,
        endDate: new Date(2015, 3, 1, 0, 30)
    }], 'Data is filtered');
});

QUnit.test('Appointment should be rerendered only once if \'currentView\' option is changed', function(assert) {
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

    this.createInstance(options);

    this.instance.option('currentView', 'month');

    assert.equal(renderedStub.callCount, 2, 'Appointment is rerendered only once');
});
