import { createWrapper, initTestMarkup } from '../../helpers/scheduler/helpers.js';
import fx from 'common/core/animation/fx';
import { CustomStore } from 'common/data/custom_store';

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

QUnit.testStart(() => initTestMarkup());

QUnit.module('Integration: Resources data source', moduleConfig, function() {
    QUnit.test('DataSource should not lose sort option when used in resources', function(assert) {
        let resultSortLoadOption;
        const expectedSortLoadOption = ['TestSortParam'];

        const testCustomStore = new CustomStore({
            key: 'SomeKey',
            load(loadOptions) {
                resultSortLoadOption = (loadOptions || { sort: undefined }).sort;
            }
        });
        createWrapper({
            dataSource: [],
            currentView: 'week',
            currentDate: new Date('2022-01-01T00:00:00.000Z'),
            groups: ['Priority'],
            resources: [{
                fieldExpr: 'Priority',
                allowMultiple: false,
                label: 'Priority',
                dataSource: {
                    store: testCustomStore,
                    sort: expectedSortLoadOption
                }
            }],
        });

        assert.equal(resultSortLoadOption, expectedSortLoadOption);
    });
});
