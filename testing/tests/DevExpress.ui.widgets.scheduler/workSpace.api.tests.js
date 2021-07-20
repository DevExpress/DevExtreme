import 'generic_light.css!';
import $ from 'jquery';

import 'ui/scheduler/workspaces/ui.scheduler.work_space_month';
import 'ui/scheduler/workspaces/ui.scheduler.work_space_week';

const {
    test,
    module,
    testStart
} = QUnit;

testStart(function() {
    $('#qunit-fixture').html('<div class="dx-scheduler"><div id="scheduler-work-space"></div></div>');
});

module('API', () => {
    module('Get cell index by coordinates', {
        beforeEach: function() {
            this.createInstance = function(type, options) {
                const workSpace = 'dxSchedulerWorkSpace' + type;
                this.instance = $('#scheduler-work-space')[workSpace]({
                    ...options,
                })[workSpace]('instance');
            };
        }
    }, () => {
        test('Week view', function(assert) {
            this.createInstance('Week', { width: 800, height: 800 });
            const index = this.instance.getCellIndexByCoordinates({ left: 100, top: 55 });

            assert.equal(index, 7, 'Index is OK');
        });

        test('Week view, fractional value', function(assert) {
            this.createInstance('Week', { width: 800, height: 800 });
            const index = this.instance.getCellIndexByCoordinates({ left: 160.4, top: 55 });

            assert.equal(index, 7, 'Index is OK');
        });

        test('Week view: rtl mode', function(assert) {
            this.createInstance('Week', { width: 800, height: 800, rtlEnabled: true });
            const index = this.instance.getCellIndexByCoordinates({ left: 411, top: 50 });

            assert.equal(index, 9, 'Index is OK');
        });

        test('All day row', function(assert) {
            this.createInstance('Week', { width: 800, height: 800 });
            let index = this.instance.getCellIndexByCoordinates({ left: 398, top: 0 });

            assert.equal(index, 3, 'Index is OK');

            index = this.instance.getCellIndexByCoordinates({ left: 398, top: 45 });
            assert.equal(index, 3, 'Index is OK');

            index = this.instance.getCellIndexByCoordinates({ left: 398, top: 77 });
            assert.equal(index, 10, 'Index is OK');
        });

        test('Horizontal grouped view', function(assert) {
            this.createInstance('Week', {
                width: 800,
                height: 800,
                groups: [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]
            });
            const index = this.instance.getCellIndexByCoordinates({ left: 200, top: 55 });

            assert.equal(index, 16, 'Index is OK');
        });

        test('Vertical grouped view', function(assert) {
            this.createInstance('Week', {
                width: 800,
                height: 800,
                groupOrientation: 'vertical'
            });

            this.instance.option('groups', [{ name: 'a', items: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }] }]);

            const index = this.instance.getCellIndexByCoordinates({ left: 200, top: 55 });

            assert.equal(index, 7, 'Index is OK');
        });

        test('Month view', function(assert) {
            this.createInstance('Month', {
                width: 800,
                height: 500
            });
            const index = this.instance.getCellIndexByCoordinates({ left: 228, top: 91 });

            assert.equal(index, 9, 'Index is OK');
        });
    });
});
