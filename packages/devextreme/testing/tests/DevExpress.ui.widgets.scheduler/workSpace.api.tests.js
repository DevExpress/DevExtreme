import 'fluent_blue_light.css!';
import $ from 'jquery';

import '__internal/scheduler/workspaces/work_space_month';
import '__internal/scheduler/workspaces/work_space_week';

import {
    applyWorkspaceGroups,
    getEmptyResourceManager,
    getWorkspaceResourceConfig
} from '../../helpers/scheduler/mockResourceManager.js';

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
                    getResourceManager: getEmptyResourceManager,
                    ...options,
                })[workSpace]('instance');
            };
        }
    }, () => {
        test('Week view', async function(assert) {
            this.createInstance('Week', { width: 800, height: 800 });
            const index = this.instance.getCellIndexByCoordinates({ left: 0, top: 55 });

            assert.equal(index, 7, 'Index is OK');
        });

        test('Week view, fractional value', async function(assert) {
            this.createInstance('Week', { width: 800, height: 800 });
            const index = this.instance.getCellIndexByCoordinates({ left: 60.4, top: 55 });

            assert.equal(index, 7, 'Index is OK');
        });

        test('Week view: rtl mode', async function(assert) {
            this.createInstance('Week', { width: 800, height: 800, rtlEnabled: true });
            const index = this.instance.getCellIndexByCoordinates({ left: 411, top: 50 });

            assert.equal(index, 10, 'Index is OK');
        });

        test('All day row', async function(assert) {
            this.createInstance('Week', { width: 800, height: 800 });
            let index = this.instance.getCellIndexByCoordinates({ left: 350, top: 0 });

            assert.equal(index, 3, 'Index is OK');

            index = this.instance.getCellIndexByCoordinates({ left: 350, top: 25 });
            assert.equal(index, 3, 'Index is OK');

            index = this.instance.getCellIndexByCoordinates({ left: 350, top: 45 });
            assert.equal(index, 10, 'Index is OK');
        });

        test('Horizontal grouped view', async function(assert) {
            const resourceConfig = await getWorkspaceResourceConfig([{
                label: 'a',
                fieldExpr: 'a',
                dataSource: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }],
            }]);
            this.createInstance('Week', {
                width: 800,
                height: 800,
                ...resourceConfig,
            });
            const index = this.instance.getCellIndexByCoordinates({ left: 100, top: 55 });

            assert.equal(index, 15, 'Index is OK');
        });

        test('Vertical grouped view', async function(assert) {
            this.createInstance('Week', {
                width: 800,
                height: 800,
                groupOrientation: 'vertical'
            });

            await applyWorkspaceGroups(this.instance, [{
                label: 'a',
                fieldExpr: 'a',
                dataSource: [{ id: 1, text: 'a.1' }, { id: 2, text: 'a.2' }]
            }]);

            const index = this.instance.getCellIndexByCoordinates({ left: 0, top: 55 });

            assert.equal(index, 7, 'Index is OK');
        });

        test('Month view', async function(assert) {
            this.createInstance('Month', {
                width: 800,
                height: 500
            });
            const index = this.instance.getCellIndexByCoordinates({ left: 320, top: 100 });

            assert.equal(index, 9, 'Index is OK');
        });
    });
});
